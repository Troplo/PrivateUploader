import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription
} from "type-graphql"
import { Service } from "typedi"
import { Message } from "@app/models/message.model"
import { ChatService } from "@app/services/chat.service"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import {
  DeleteMessageInput,
  EditMessageInput,
  SendMessageInput
} from "@app/classes/graphql/chat/sendMessage"
import { Context } from "@app/types/graphql/context"
import RateLimit from "@app/lib/graphql/RateLimit"
import {
  InfiniteMessagesInput,
  MessageType,
  PagedMessagesInput,
  ScrollPosition,
  SubscriptionMessageInput
} from "@app/classes/graphql/chat/message"
import { Op, WhereOptions } from "sequelize"
import { Chat } from "@app/models/chat.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { PagerResponse } from "@app/classes/graphql/gallery/galleryResponse"
import paginate from "jw-paginate"
import { ChatEmoji } from "@app/models/chatEmoji.model"
import { GraphQLError } from "graphql/error"
import { MessageSubscription } from "@app/classes/graphql/chat/messageSubscription"
import { EditMessageEvent, EmbedDataV2 } from "@app/classes/graphql/chat/embeds"
import { embedTranslator } from "@app/lib/embedParser"
import { ReadReceipt } from "@app/classes/graphql/chat/readReceiptSubscription"
import { User } from "@app/models/user.model"
import { DeleteMessage } from "@app/classes/graphql/chat/deleteMessage"
import { GqlError } from "@app/lib/gqlErrors"

export const PaginatedMessagesResponse = PagerResponse(Message)
export type PaginatedMessagesResponse = InstanceType<
  typeof PaginatedMessagesResponse
>

@Resolver(Message)
@Service()
export class MessageResolver {
  constructor(private readonly chatService: ChatService) {}

  @RateLimit({
    window: 8,
    max: 8
  })
  @Authorization({
    scopes: ["chats.send"]
  })
  @Mutation(() => Message)
  async sendMessage(
    @Arg("input") input: SendMessageInput,
    @Ctx() ctx: Context
  ): Promise<Message> {
    if (input.embeds?.length && !ctx.user?.bot)
      throw new GraphQLError("You need to be a bot to use embeds.")
    return await this.chatService.sendMessage(
      input.content,
      ctx.user!!.id,
      input.associationId,
      input.replyId,
      "message",
      input.attachments,
      input.embeds
    )
  }

  @RateLimit({
    window: 8,
    max: 8
  })
  @Authorization({
    scopes: ["chats.send"]
  })
  @Mutation(() => Message, {
    nullable: true
  })
  async editMessage(
    @Arg("input") input: EditMessageInput,
    @Ctx() ctx: Context
  ): Promise<Message | null> {
    if (input.embeds?.length && !ctx.user?.bot)
      throw new GraphQLError("You need to be a bot to use embeds.")
    await this.chatService.editMessage(
      input.messageId,
      ctx.user!!.id,
      input.content,
      input.associationId,
      input.pinned,
      input.embeds,
      input.attachments
    )
    return await Message.findByPk(input.messageId)
  }

  @RateLimit({
    window: 8,
    max: 8
  })
  @Authorization({
    scopes: ["chats.send"]
  })
  @Mutation(() => Boolean)
  async deleteMessage(
    @Arg("input") input: DeleteMessageInput,
    @Ctx() ctx: Context
  ): Promise<Boolean> {
    await this.chatService.deleteMessage(
      input.messageId,
      ctx.user!!.id,
      input.associationId
    )
    return true
  }

  @FieldResolver(() => EmbedDataV2)
  embeds(@Root() message: Message) {
    if (!message.embeds) return []
    const translated = message.embeds.map((embed) => embedTranslator(embed))
    return translated.filter((embed) => embed !== null)
  }

  @Authorization({
    scopes: ["chats.view"]
  })
  @Query(() => [Message])
  async messages(
    @Arg("input") input: InfiniteMessagesInput,
    @Ctx() ctx: Context
  ): Promise<Message[]> {
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id,
      true
    )
    let where = {} as WhereOptions<Message>
    if (!ctx.meta.paged) {
      where = input.offset
        ? input.position === ScrollPosition.TOP
          ? { id: { [Op.lt]: input.offset } }
          : { id: { [Op.gt]: input.offset } }
        : {}
    }

    if (input.search?.pins) {
      where = {
        ...where,
        pinned: true
      }
    }

    if (input.search) {
      const { query, userId, before, after } = input.search

      where = {
        ...where,
        ...(query && { content: { [Op.like]: `%${query}%` } }),
        ...(userId && { userId: userId }),
        ...(before && { createdAt: { [Op.lt]: before } }),
        ...(after && { createdAt: { [Op.gt]: after } })
      }
    }
    let messages = await Message.findAll({
      where: {
        chatId: chat.id,
        ...where
      },
      order: [["id", input.position === ScrollPosition.TOP ? "DESC" : "ASC"]],
      limit: input.limit,
      offset: ctx.meta.paged ? input.offset : undefined
    })
    if (input.position === ScrollPosition.BOTTOM) messages.reverse()
    if (ctx.meta.paged) {
      ctx.meta.query = {
        where: {
          chatId: chat.id,
          ...where
        },
        order: [["id", input.position === ScrollPosition.TOP ? "DESC" : "ASC"]],
        limit: input.limit
      }
    }
    return messages
  }

  @Authorization({
    scopes: ["chats.view"]
  })
  @Query(() => PaginatedMessagesResponse)
  async messagesPaged(
    @Arg("input") input: PagedMessagesInput,
    @Ctx() ctx: Context
  ): Promise<PaginatedMessagesResponse> {
    ctx.meta.paged = true
    const offset = (input.page - 1) * input.limit
    const messages = await this.messages(
      {
        ...input,
        offset
      } as InfiniteMessagesInput,
      ctx
    )
    const count = await Message.count({
      where: ctx.meta.query.where
    })
    const pager = paginate(count || messages.length, input.page, input.limit)
    return {
      pager,
      items: messages
    }
  }

  @FieldResolver(() => [ReadReceipt])
  async readReceipts(
    @Ctx() ctx: Context,
    @Root() message: Message
  ): Promise<ReadReceipt[]> {
    const receipts = await message.$get("readReceipts", {
      attributes: {
        exclude: ["updatedAt"]
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        }
      ]
    })
    return receipts.map((receipt) => ({
      chatId: message.chatId,
      associationId: receipt.id,
      messageId: message.id,
      user: receipt.user?.toJSON()
    }))
  }

  @FieldResolver(() => Chat)
  async chat(@Root() message: Message) {
    return await message.$get("chat")
  }

  @FieldResolver(() => PartialUserBase)
  async user(@Root() message: Message) {
    return await message.$get("user")
  }

  @FieldResolver(() => Message)
  async reply(@Root() message: Message) {
    return await message.$get("reply")
  }

  @FieldResolver(() => [ChatEmoji])
  async emoji(@Root() message: Message) {
    const matches = message.content.match(/:([\w~-]+)(?::([\w~-]+))?:/g)
    return await ChatEmoji.findAll({
      where: {
        id: matches?.map((match) => match.split(":")[2]) || []
      }
    })
  }

  @FieldResolver(() => MessageType)
  type(@Root() message: Message) {
    return message.type || MessageType.MESSAGE
  }

  @Authorization({
    scopes: "chats.view"
  })
  @Subscription(() => MessageSubscription, {
    topics: ({ context }) => {
      return `MESSAGES:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      console.log(payload, args)
      return args.input?.associationId !== undefined
        ? args.input.associationId === payload.associationId
        : true
    }
  })
  onMessage(
    @Root() payload: MessageSubscription,
    @Ctx() ctx: Context,
    @Arg("input", {
      nullable: true
    })
    input: SubscriptionMessageInput
  ): MessageSubscription {
    return payload
  }

  @Authorization({
    scopes: "chats.view"
  })
  @Subscription(() => EditMessageEvent, {
    topics: ({ context }) => {
      return `EDIT_MESSAGE:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      return args.input?.associationId !== undefined
        ? args.input.associationId === payload.associationId
        : true
    }
  })
  onEditMessage(
    @Root() payload: EditMessageEvent,
    @Ctx() ctx: Context,
    @Arg("input", {
      nullable: true
    })
    input: SubscriptionMessageInput
  ): EditMessageEvent {
    return payload
  }

  @Authorization({
    scopes: "chats.view"
  })
  @Subscription(() => ReadReceipt, {
    topics: ({ context }) => {
      return `READ_RECEIPTS:${context.user!!.id}`
    }
  })
  onReadReceipt(
    @Root() payload: ReadReceipt,
    @Ctx() ctx: Context
  ): ReadReceipt {
    return payload
  }

  @Authorization({
    scopes: "chats.view"
  })
  @Subscription(() => DeleteMessage, {
    topics: ({ context }) => {
      return `MESSAGE_DELETE:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      return args.input?.associationId !== undefined
        ? args.input.associationId === payload.associationId
        : true
    }
  })
  onDeleteMessage(
    @Root() payload: DeleteMessage,
    @Ctx() ctx: Context,
    @Arg("input", {
      nullable: true
    })
    input: SubscriptionMessageInput
  ): DeleteMessage {
    return payload
  }
}
