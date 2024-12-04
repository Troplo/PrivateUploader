import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription
} from "type-graphql"
import { Container, Service } from "typedi"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { ChatPermission } from "@app/models/chatPermission.model"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { AddRank } from "@app/classes/graphql/chat/ranks/addRank"
import { ChatService } from "@app/services/chat.service"
import { Context } from "@app/types/graphql/context"
import { GraphQLError } from "graphql/error"
import { ChatPermissions } from "@app/classes/graphql/chat/ranks/permissions"
import { ChatRankAssociation } from "@app/models/chatRankAssociation.model"
import { Success } from "@app/classes/graphql/generic/success"
import { AddChatUser, ToggleUser } from "@app/classes/graphql/chat/addUser"
import { LeaveChatInput } from "@app/classes/graphql/chat/deleteChat"
import { GqlError } from "@app/lib/gqlErrors"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { ChatInvite } from "@app/models/chatInvite.model"
import RateLimit from "@app/lib/graphql/RateLimit"
import { Chat } from "@app/models/chat.model"
import { JoinChatFromInviteInput } from "@app/classes/graphql/chat/invites/joinInvite"
import { Op } from "sequelize"
import { ChatRank } from "@app/models/chatRank.model"
import { UserUtilsService } from "@app/services/userUtils.service"
import { User } from "@app/models/user.model"
import { AddBotToChatInput } from "@app/classes/graphql/developers/addBotToChat"
import { OauthService } from "@app/services/oauth.service"
import { OauthUser } from "@app/models/oauthUser.model"
import { ChatPermissionAssociation } from "@app/models/chatPermissionAssociation.model"
import {
  Command,
  LookupPrefix,
  LookupPrefixInput,
  Prefix
} from "@app/classes/graphql/developers/prefix/prefix"
import { ChatAuditLog } from "@app/models/chatAuditLog.model"
import {
  AuditLogActionType,
  AuditLogCategory
} from "@app/classes/graphql/chat/auditLog/categories"
import { EXPECTED_OPTIONS_KEY } from "dataloader-sequelize"
import { ReadChatInput } from "@app/classes/graphql/chat/readChat"
import redisClient from "@app/redis"

@Resolver(ChatAssociation)
@Service()
export class ChatAssociationResolver {
  constructor(
    private chatService: ChatService,
    private oauthService: OauthService
  ) {}

  @FieldResolver(() => PartialUserBase, {
    nullable: true
  })
  user(
    @Root() chatAssociation: ChatAssociation
  ): Promise<PartialUserBase | null> {
    return chatAssociation.$get("user", {
      attributes: partialUserBase
    })
  }

  @FieldResolver(() => [ChatPermission])
  ranks(@Root() chatAssociation: ChatAssociation, @Ctx() ctx: Context) {
    return chatAssociation.$get("ranks", {
      [EXPECTED_OPTIONS_KEY]: ctx.dataloader
    })
  }

  @FieldResolver(() => [String])
  async ranksMap(
    @Root() chatAssociation: ChatAssociation,
    @Ctx() ctx: Context
  ) {
    const ranks = await chatAssociation.$get("ranks", {
      order: [["index", "DESC"]],
      [EXPECTED_OPTIONS_KEY]: ctx.dataloader
    })
    return ranks.map((rank) => rank.id)
  }

  @FieldResolver(() => [String])
  async permissions(
    @Root() chatAssociation: ChatAssociation,
    @Ctx() ctx: Context
  ) {
    const cache = await redisClient.json.get(
      `chatPermissions:${chatAssociation.userId}:${chatAssociation.id}`
    )
    if (cache) return cache
    const ranks = await chatAssociation.$get("ranks", {
      order: [["index", "DESC"]],
      include: [
        {
          model: ChatPermission,
          as: "permissions"
        }
      ],
      [EXPECTED_OPTIONS_KEY]: ctx.dataloader
    })
    return [
      ...new Set(
        ranks.flatMap((rank) =>
          rank.permissions.map((permission) => permission.id)
        )
      )
    ]
  }

  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => Success)
  async addChatUsers(
    @Ctx() ctx: Context,
    @Arg("input") input: AddChatUser,
    force: boolean = false
  ) {
    let permissions: ChatPermissions[] = []
    if (input.action === ToggleUser.ADD && !force) {
      permissions = await this.chatService.checkPermissions(
        ctx.user!!.id,
        input.chatAssociationId,
        ChatPermissions.ADD_USERS
      )
    } else if (input.action === ToggleUser.REMOVE) {
      permissions = await this.chatService.checkPermissions(
        ctx.user!!.id,
        input.chatAssociationId,
        ChatPermissions.REMOVE_USERS
      )
    }

    if (input.action === ToggleUser.ADD) {
      await this.chatService.addUsersToChat(
        input.chatAssociationId,
        input.users,
        ctx.user!!.id,
        force
      )
      return { success: true }
    } else if (input.action === ToggleUser.REMOVE) {
      await this.chatService.removeUserFromChat(
        input.chatAssociationId,
        input.users,
        ctx.user!!.id,
        false,
        permissions
      )
      return { success: true }
    } else {
      return { success: false }
    }
  }

  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => Success)
  async toggleUserRank(@Ctx() ctx: Context, @Arg("input") input: AddRank) {
    const chat = await this.chatService.getChatFromAssociation(
      input.chatAssociationId,
      ctx.user!!.id
    )
    if (!chat) throw new GraphQLError("Chat not found.")
    const user = await ChatAssociation.findOne({
      where: {
        id: input.updatingChatAssociationId,
        chatId: chat.id
      },
      include: [
        {
          model: User,
          as: "user"
        }
      ]
    })
    if (!user) throw new GraphQLError("User not found.")
    const permissions = await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.chatAssociationId,
      ChatPermissions.MANAGE_RANKS
    )

    const highestIndex = await this.chatService.getHighestIndex(
      input.chatAssociationId
    )

    const rank = await ChatRank.findOne({
      where: { id: input.rankId, chatId: chat.id }
    })

    if (!rank) throw new GqlError("RANK_NOT_FOUND")

    if (
      (rank.index >= highestIndex &&
        !permissions.includes(ChatPermissions.TRUSTED) &&
        !permissions.includes(ChatPermissions.OWNER)) ||
      (!permissions.includes(ChatPermissions.OWNER) &&
        permissions.includes(ChatPermissions.TRUSTED) &&
        rank.index > highestIndex) ||
      rank.managed
    ) {
      throw new GqlError("RANK_TOO_HIGH")
    }

    const rankAssoc = await ChatRankAssociation.findOne({
      where: {
        chatAssociationId: input.updatingChatAssociationId,
        rankId: input.rankId
      }
    })

    if (rankAssoc) {
      await ChatAuditLog.create({
        chatId: chat.id,
        userId: ctx.user!!.id,
        category: AuditLogCategory.USER,
        actionType: AuditLogActionType.MODIFY,
        message: `<@${ctx.user!!.id}> removed the rank **${
          rank.name
        }** from <@${user.user.id}>`
      })
      await rankAssoc.destroy()
      this.chatService.emitForAll(
        input.chatAssociationId,
        ctx.user!!.id,
        "rankRemoved",
        {
          chatId: chat.id,
          updatingChatAssociationId: input.updatingChatAssociationId,
          rankId: input.rankId
        }
      )
      const id = chat.users.find(
        (assoc) => assoc.id === input.updatingChatAssociationId
      )?.userId
      if (id) {
        this.chatService.syncPermissions(id, input.updatingChatAssociationId)
      }
      return {
        success: true
      }
    } else {
      await ChatAuditLog.create({
        chatId: chat.id,
        userId: ctx.user!!.id,
        category: AuditLogCategory.USER,
        actionType: AuditLogActionType.MODIFY,
        message: `<@${ctx.user!!.id}> added the rank **${rank.name}** to <@${
          user.user.id
        }>`
      })
      await ChatRankAssociation.create({
        chatAssociationId: input.updatingChatAssociationId,
        rankId: input.rankId
      })
      this.chatService.emitForAll(
        input.chatAssociationId,
        ctx.user!!.id,
        "rankAdded",
        {
          ...input,
          chatId: chat.id
        }
      )
      const id = chat.users.find(
        (assoc) => assoc.id === input.updatingChatAssociationId
      )?.userId
      if (id) {
        this.chatService.syncPermissions(id, input.updatingChatAssociationId)
      }
      return {
        success: true
      }
    }
  }

  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => Success)
  async leaveChat(
    @Ctx() ctx: Context,
    @Arg("input") input: LeaveChatInput
  ): Promise<Success> {
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )
    if (chat.userId === ctx.user!!.id && chat.type !== "direct") {
      throw new GqlError("GROUP_OWNER_CANNOT_LEAVE")
    }
    const association = await ChatAssociation.findOne({
      where: {
        id: input.associationId,
        userId: ctx.user!!.id
      }
    })
    if (!association) throw new GqlError("UNKNOWN")
    switch (chat.type) {
      case "group": {
        await this.chatService.removeUserFromChat(
          input.associationId,
          [ctx.user!!.id],
          ctx.user!!.id,
          true,
          []
        )
        return { success: true }
      }
      case "direct": {
        await association.update({
          hidden: true
        })
        socket.of(SocketNamespaces.CHAT).to(ctx.user!!.id).emit("removeChat", {
          id: chat.id
        })
        return { success: true }
      }
      default: {
        throw new GqlError("UNSUPPORTED_OPERATION")
      }
    }
  }

  @FieldResolver(() => ChatInvite)
  async invite(@Root() assoc: ChatAssociation) {
    return await assoc.$get("invite")
  }

  @RateLimit({
    window: 10,
    max: 10
  })
  @Authorization({
    scopes: ["chats.edit"],
    emailOptional: true
  })
  @Mutation(() => ChatAssociation)
  async joinChatFromInvite(
    @Ctx() ctx: Context,
    @Arg("input") input: JoinChatFromInviteInput
  ) {
    if (ctx.user?.bot) throw new GqlError("INVITE_BOT")
    let id = input.inviteId
    if (id.startsWith(config.hostnameWithProtocol)) {
      try {
        const url = new URL(id)
        id = url.pathname.split("/").pop() || id
      } catch {}
    }
    const invite = await ChatInvite.findOne({
      where: {
        id,
        invalidated: false,
        expiredAt: {
          [Op.or]: [
            {
              [Op.gt]: new Date()
            },
            {
              [Op.is]: null
            }
          ]
        }
      },
      include: [
        {
          model: ChatRank,
          as: "rank"
        },
        {
          model: Chat,
          as: "chat"
        }
      ]
    })
    if (!invite) throw new GqlError("INVALID_INVITE")
    const existing = await ChatAssociation.findOne({
      where: {
        userId: ctx.user!!.id,
        chatId: invite.chat.id
      }
    })
    if (existing) {
      return existing
    }
    const rank = invite.rank
      ? invite.rank
      : await ChatRank.findOne({
          where: {
            chatId: invite.chat.id,
            managed: true
          }
        })

    if (!rank) throw new GqlError("COLUBRINA_CHAT")

    const association = await ChatAssociation.create({
      userId: ctx.user!!.id,
      chatId: invite.chat.id,
      rank: "member",
      identifier: invite.chat.id + "-" + ctx.user!!.id,
      inviteUsed: id
    })
    await ChatRankAssociation.create({
      rankId: rank.id,
      chatAssociationId: association.id
    })
    this.chatService.sendMessage(
      `<@${ctx.user!!.id}> joined the chat via an invite!`,
      ctx.user!!.id,
      association.id,
      undefined,
      "join"
    )
    const associations = await ChatAssociation.findAll({
      where: {
        chatId: invite.chat.id
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        }
      ]
    })
    for (const association of associations) {
      Container.get(UserUtilsService).trackedUserIds(association.userId, true)
    }
    const emitUser = await ChatAssociation.findOne({
      where: {
        id: association.id
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        },
        {
          model: ChatRank,
          as: "ranks"
        }
      ]
    })
    if (!emitUser) throw new GqlError("USER_NOT_FOUND")
    emitUser.dataValues.ranksMap = emitUser.dataValues.ranks.map(
      (rank: ChatRank) => rank.id
    )
    this.chatService.emitForAll(association.id, ctx.user!!.id, "addChatUsers", {
      chatId: invite.chat.id,
      users: [emitUser]
    })
    socket
      .of(SocketNamespaces.CHAT)
      .to(emitUser.userId)
      .emit(
        "chatCreated",
        await this.chatService.getChat(invite.chat.id, association.userId)
      )
    return emitUser
  }

  @RateLimit({
    window: 10,
    max: 10
  })
  @Authorization({
    scopes: ["chats.edit"]
  })
  @Mutation(() => ChatAssociation)
  async addBotToChat(
    @Ctx() ctx: Context,
    @Arg("input") input: AddBotToChatInput
  ) {
    const app = await this.oauthService.getApp(input.botAppId, ctx.user!!.id)
    if (!app || !app.botId) throw new GqlError("APP_NOT_FOUND")
    const bot = await User.findOne({
      where: {
        id: app.botId
      }
    })
    if (!bot) throw new GqlError("APP_NOT_FOUND")
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )

    const chatPermissions = await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.associationId,
      ChatPermissions.MANAGE_INTEGRATIONS
    )

    if (app.private && app.userId !== ctx.user!!.id) {
      const access = await OauthUser.findOne({
        where: {
          oauthAppId: input.botAppId,
          userId: ctx.user!!.id,
          active: true
        }
      })
      if (!access) throw new GqlError("PRIVATE_APP")
    }

    await this.addChatUsers(
      ctx,
      {
        chatAssociationId: input.associationId,
        users: [app.botId],
        action: ToggleUser.ADD
      },
      true
    )
    const assoc = await ChatAssociation.findOne({
      where: {
        userId: app.botId,
        chatId: chat.id
      }
    })
    if (!assoc) throw new GqlError("UNKNOWN")
    const rank = await ChatRank.create({
      chatId: chat.id,
      userId: ctx.user!!.id,
      name: bot.username,
      index: 0
    })
    this.chatService.normalizeIndexes(chat.id)
    await ChatRankAssociation.create({
      chatAssociationId: assoc.id,
      rankId: rank.id
    })
    const check = await ChatPermission.findAll({
      where: {
        id: input.permissions
      }
    })
    for (const permission of check) {
      try {
        if (!chatPermissions.includes(<ChatPermissions>permission.id))
          throw Error("No permission. Continue.")
        await ChatPermissionAssociation.create({
          rankId: rank.id,
          permissionId: permission.id
        })
      } catch (e) {
        // Doesn't have permission. Will not grant.
        console.log(e)
      }
    }
    const permissions = await ChatPermissionAssociation.findAll({
      where: {
        rankId: rank.id
      }
    })
    await this.chatService.emitForAll(
      input.associationId,
      ctx.user!!.id,
      "rankUpdated",
      {
        permissionsMap: permissions.map((perm) => perm.permissionId),
        name: rank.name,
        color: rank.color,
        id: rank.id,
        userId: rank.userId,
        createdAt: rank.createdAt,
        chatId: rank.chatId,
        updatedAt: rank.updatedAt,
        managed: rank.managed,
        index: rank.index
      }
    )
    this.chatService.emitForAll(
      input.associationId,
      ctx.user!!.id,
      "rankAdded",
      {
        chatId: chat.id,
        chatAssociationId: input.associationId,
        updatingChatAssociationId: assoc.id,
        rankId: rank.id
      }
    )
    return assoc
  }

  @Authorization({
    scopes: ["chats.view"]
  })
  @Query(() => Prefix)
  async lookupBotPrefix(
    @Ctx() ctx: Context,
    @Arg("input") input: LookupPrefixInput
  ): Promise<Prefix> {
    const chat = await this.chatService.getChatFromAssociation(
      input.chatAssociationId,
      ctx.user!!.id
    )
    const bots = chat.users.filter((user) => user?.user?.bot)
    if (!bots.length)
      return {
        prefix: input.prefix,
        commands: []
      }
    const commands: LookupPrefix[] = []
    for (const bot of bots) {
      const prefix = await redis.json.get(`prefix:${bot.userId}`)
      if (prefix !== input.prefix) continue
      commands.push(
        ...((await redis.json.get(`commands:${bot.userId}`)).map(
          (command: Command) => {
            return {
              ...command,
              botId: bot.userId
            }
          }
        ) || [])
      )
    }
    return {
      prefix: input.prefix,
      commands
    }
  }

  @Authorization({
    scopes: ["chats.view"]
  })
  @RateLimit({
    window: 10,
    max: 30
  })
  @Mutation(() => Success)
  async readChat(@Ctx() ctx: Context, @Arg("input") input: ReadChatInput) {
    await this.chatService.readChat(input.associationId, ctx.user!!.id)
    return { success: true }
  }

  @Subscription(() => Int, {
    topics: ({ context }) => {
      return `READ_CHAT:${context.user?.id}`
    },
    description: "Returns the chat ID"
  })
  async onReadChat(@Root() chatId: number) {
    return chatId
  }
}
