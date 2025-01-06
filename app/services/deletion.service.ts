import { Service } from "typedi"
import axios from "axios"
import { Subscription } from "@app/models/subscription.model"
import { User } from "@app/models/user.model"
import { AdminService } from "@app/services/admin.service"
import { Upload } from "@app/models/upload.model"
import fs from "fs"
import { Message } from "@app/models/message.model"
import { Note } from "@app/models/note.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { Workspace } from "@app/models/workspace.model"
import { Collection } from "@app/models/collection.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { CollectionUser } from "@app/models/collectionUser.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Pulse } from "@app/models/pulse.model"
import { Session } from "@app/models/session.model"
import { ChatAuditLog } from "@app/models/chatAuditLog.model"
import { BlockedUser } from "@app/models/blockedUser.model"
import { Friend } from "@app/models/friend.model"
import { FCMDevice } from "@app/models/fcmDevices.model"
import { Insight } from "@app/models/insight.model"
import { Slideshow } from "@app/models/slideshow.model"
import { Experiment } from "@app/models/experiment.model"
import { Integration } from "@app/models/integration.model"
import { OauthApp } from "@app/models/oauthApp.model"
import { OauthSave } from "@app/models/oauthSave.model"
import { ChatRankAssociation } from "@app/models/chatRankAssociation.model"
import { Chat } from "@app/models/chat.model"
import redisClient from "@app/redis"
import cron from "node-cron"
import { EmailNotificationService } from "@app/services/emailNotification.service"
import { ChatRank } from "@app/models/chatRank.model"
import { Star } from "@app/models/star.model"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { CacheService } from "@app/services/cache.service"
import { OauthUser } from "@app/models/oauthUser.model"
import { ChatEmoji } from "@app/models/chatEmoji.model"
import { ChatInvite } from "@app/models/chatInvite.model"
import { Invite } from "@app/models/invite.model"
import { AwsService } from "@app/services/aws.service"
import { Op } from "sequelize"

@Service()
export class DeletionService {
  constructor(
    private readonly emailService: EmailNotificationService,
    private readonly cacheService: CacheService,
    private readonly awsService: AwsService
  ) {}

  async deleteGallery(user: User) {
    const uploads = await Upload.findAll({
      where: {
        userId: user.id
      },
      attributes: ["id", "attachment", "location"]
    })

    for (const upload of uploads) {
      try {
        if (!upload.attachment) continue
        try {
          if (upload.location === "local") {
            if (!upload.attachment) return
            await fs.unlinkSync(global.storageRoot + upload.attachment)
          } else {
            const location = upload.location.split("/")[1].split(":")[0]
            if (!location) return
            await this.awsService.deleteFile(
              location,
              upload.location.split("/")[0]
            )
          }
        } catch (e) {
          console.log(e)
        }
      } catch (e) {
        console.log(e)
      }
    }

    await Upload.destroy({
      where: {
        userId: user.id,
        deletable: true
      }
    })
  }

  async deleteAccount(user: User) {
    if (!user || !user.id) return

    await Star.destroy({
      where: {
        userId: user.id
      }
    })

    await this.deleteGallery(user)

    await BlockedUser.destroy({
      where: {
        [Op.or]: [
          {
            userId: user.id
          },
          {
            blockedUserId: user.id
          }
        ]
      }
    })
    await Message.update(
      {
        userId: null
      },
      {
        where: {
          userId: user.id
        }
      }
    )

    await Subscription.destroy({
      where: {
        userId: user.id
      }
    })

    // WORKSPACES
    const workspaces = await Workspace.findAll({
      where: {
        userId: user.id
      },
      attributes: ["id"]
    })

    for (const workspace of workspaces) {
      const workspaceFolders = await WorkspaceFolder.findAll({
        where: {
          workspaceId: workspace.id
        },
        attributes: ["id"]
      })

      for (const folder of workspaceFolders) {
        await Note.destroy({
          where: {
            workspaceFolderId: folder.id
          }
        })
      }

      await WorkspaceFolder.destroy({
        where: {
          workspaceId: workspace.id
        }
      })
    }

    const collections = await Collection.findAll({
      where: {
        userId: user.id
      },
      attributes: ["id"],
      include: [
        {
          model: CollectionUser,
          as: "users",
          attributes: ["id", "recipientId"]
        }
      ]
    })

    for (const collection of collections) {
      await AutoCollectRule.destroy({
        where: {
          collectionId: collection.id
        }
      })

      await AutoCollectApproval.destroy({
        where: {
          collectionId: collection.id
        }
      })

      await CollectionUser.destroy({
        where: {
          collectionId: collection.id
        }
      })

      for (const user of collection.users) {
        await this.cacheService.resetCollectionCache(
          collection.id,
          user.recipientId
        )
      }

      if (collection.shareLink)
        await redisClient.json.del(`shareLinks:${collection.shareLink}`)
    }

    await redisClient.json.del(`collections:${user.id}`)

    const modelsToDestroy: any = [
      Workspace,
      Collection,
      AutoCollectApproval,
      AutoCollectRule,
      Pulse,
      Session,
      ChatAuditLog,
      BlockedUser,
      FCMDevice,
      Insight,
      Slideshow,
      Experiment,
      Integration,
      OauthSave,
      OauthUser
    ]

    for (const model of modelsToDestroy) {
      await model.destroy({
        where: {
          userId: user.id
        }
      })
    }

    await CollectionUser.destroy({
      where: {
        recipientId: user.id
      }
    })

    await Friend.destroy({
      where: {
        userId: user.id
      }
    })

    await Friend.destroy({
      where: {
        friendId: user.id
      }
    })

    const oauthApps = await OauthApp.findAll({
      where: {
        userId: user.id
      }
    })

    const botAccounts = oauthApps.filter((app) => app.botId)

    for (const app of botAccounts) {
      const user = await User.findByPk(app.botId)
      if (user) await this.deleteAccount(user)
    }

    for (const app of oauthApps) {
      await OauthSave.destroy({
        where: {
          oauthAppId: app.id
        }
      })

      await Session.destroy({
        where: {
          oauthAppId: app.id
        }
      })

      await OauthUser.destroy({
        where: {
          oauthAppId: app.id
        }
      })
    }

    const chatAssociations = await ChatAssociation.findAll({
      where: {
        userId: user.id
      }
    })

    await ChatRank.update(
      {
        userId: null
      },
      {
        where: {
          userId: user.id
        }
      }
    )

    for (const chatAssociation of chatAssociations) {
      await ChatRankAssociation.destroy({
        where: {
          chatAssociationId: chatAssociation.id
        }
      })
    }

    await ChatAssociation.destroy({
      where: {
        userId: user.id
      }
    })

    await OauthApp.destroy({
      where: {
        userId: user.id
      }
    })

    await ChatEmoji.update(
      {
        userId: null
      },
      {
        where: {
          userId: user.id
        }
      }
    )

    await ChatInvite.update(
      {
        userId: null
      },
      {
        where: {
          userId: user.id
        }
      }
    )

    await Invite.destroy({
      where: {
        userId: user.id
      }
    })

    await Invite.destroy({
      where: {
        registerUserId: user.id
      }
    })

    await User.destroy({
      where: {
        id: user.id
      }
    })

    await redisClient.json.del(`user:${user.id}`)

    return true
  }

  async checkUsers() {
    const users = await User.findAll({
      where: {
        banned: true
      },
      attributes: ["id", "username", "email", "banned", "pendingDeletionDate"]
    })

    for (const user of users) {
      if (!user.pendingDeletionDate) continue
      console.info(`Checking user ${user.id}`)
      const deletionRequired =
        dayjs(user.pendingDeletionDate).diff(dayjs(), "hours") <= 0
      if (
        dayjs(user.pendingDeletionDate).diff(dayjs(), "hours") < 48 &&
        !deletionRequired
      ) {
        const warned = await redisClient.get(`user:${user.id}:deletionWarned`)
        if (warned) continue
        console.info(`Warning user ${user.id}`)
        this.emailService.warnDeleteAccountNotification(user.id)
        await redisClient.set(`user:${user.id}:deletionWarned`, "true", {
          EX: 60 * 60 * 48
        })
      } else if (deletionRequired) {
        console.info(`Deleting user ${user.id}`)
        await this.deleteAccount(user)
      }
    }
  }

  deletionInit() {
    try {
      this.checkUsers()
      cron.schedule("0 0 * * *", () => {
        this.checkUsers().then(() => {})
      })

      return true
    } catch {
      return false
    }
  }
}
