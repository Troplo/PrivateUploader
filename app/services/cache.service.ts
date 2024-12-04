import { CollectionService } from "@app/services/collection.service"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Op } from "sequelize"
import { CollectionUser } from "@app/models/collectionUser.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload.model"
import { Container, Service } from "typedi"
import { CoreService } from "@app/services/core.service"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { PulseService } from "@app/services/pulse.service"
import { ChatService } from "@app/services/chat.service"
import cron from "node-cron"
import { generateClientSatisfies } from "@app/lib/clientSatisfies"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"

@Service()
export class CacheService {
  async generateChatsCache(userId?: number) {
    try {
      console.info("[REDIS] Generating chats cache...")
      let start = new Date().getTime()
      let users = []
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })]
      }
      const chatService = Container.get(ChatService)
      for (const user of users) {
        if (!user) continue
        const chats = await chatService.getUserChats(
          user.id,
          generateClientSatisfies("", "")
        )
        redis.json.set(`chats:${user.id}`, "$", chats)
      }
      let end = new Date().getTime()
      console.info(`[REDIS] Chats cache generated in ${end - start}ms`)
    } catch (e) {
      console.error(e)
    }
  }

  async generateUserStatsCache(userId?: number) {
    try {
      console.info("[REDIS] Generating user stats cache...")
      let start = new Date().getTime()
      const coreService = Container.get(CoreService)
      let users
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })] as User[]
      }
      for (const user of users) {
        const result = await coreService.getStats(user)
        redis.json.set(`userStats:${user.id}`, "$", result)
      }
      let end = new Date().getTime()
      console.info(`[REDIS] User stats cache generated in ${end - start}ms`)
    } catch {}
  }

  async generateInsightsCache(userId?: number) {
    try {
      const pulseService = Container.get(PulseService)
      console.info("[REDIS] Generating insights cache...")
      // Insights
      const start = new Date().getTime()
      let users
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })] as User[]
      }
      for (const user of users) {
        const dynamic = {
          data: await pulseService.generateInsights(user.id, "dynamic"),
          startDate: user.createdAt.toISOString(),
          _redis: new Date().toISOString(),
          endDate: new Date().toISOString()
        }
        redis.json.set(`insightsV2:${user.id}`, "$", dynamic)
      }
      if (!userId) {
        const years = ["2021", "2022", "2023", "latest"]
        // Leaderboard
        const leaderboard = await pulseService.getLeaderboard()
        redis.json.set(`insights:leaderboard`, "$", leaderboard)
        let result = {} as Record<string, number>
        for (const year of years) {
          result[year] = {
            ...(await pulseService.getInsights(null, year, true)),
            _redis: new Date().toISOString()
          }
        }
        redis.json.set(`insights:global`, "$", result)
      }
      const end = new Date().getTime()
      console.info(`[REDIS] Insights cache generated in ${end - start}ms`)
    } catch {}
  }

  async purgeInvite(inviteKey: string) {
    console.info("[REDIS] Purging invite from cache...")
    redis.json.del(`invites:${inviteKey}`)
  }

  async refreshState() {
    try {
      const start = new Date().getTime()
      console.info("[REDIS] Generating state cache...")
      const core = Container.get(CoreService)
      const state = await core.getState()
      redis.json.set("core:state", "$", {
        ...state,
        _redis: new Date().toISOString()
      })
      const end = new Date().getTime()
      console.info(`[REDIS] State cache generated in ${end - start}ms`)
      return state
    } catch {
      return null
    }
  }

  async getCachedCollections(userId: number) {
    const collectionService = Container.get(CollectionService)
    if (await redis.json.get(`collections:${userId}`)) {
      return await redis.json.get(`collections:${userId}`)
    } else {
      this.generateCollectionCache().then(() => {})
      return await collectionService.getCollections(userId)
    }
  }

  async generateAutoCollectCache(userId?: number) {
    try {
      console.info("[REDIS] Generating User AutoCollection cache...")
      let start = new Date().getTime()
      let users
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })] as User[]
      }
      for (const user of users) {
        let result = []
        let autoCollects = await AutoCollectApproval.findAll({
          where: {
            userId: user.id
          },
          include: [
            {
              model: Upload,
              as: "attachment",
              required: true
            }
          ]
        })
        const collectionIds = [
          ...new Set(autoCollects.map((a) => a.collectionId))
        ]
        for (const id of collectionIds) {
          result.push({
            ...(await this.getCachedCollection(user.id, id)),
            autoCollectApprovals: autoCollects.filter(
              (a) => a.collectionId === id
            )
          })
        }
        redis.json.set(`autoCollects:${user.id}`, "$", result)
      }
      let end = new Date().getTime()
      console.info(
        `[REDIS] User AutoCollection cache generated in ${end - start}ms`
      )
    } catch {}
  }

  async patchAutoCollectCache(
    userId: number,
    collectionId: number,
    approvalId: number
  ) {
    console.log("[REDIS] Patching AutoCollect cache for user...")
    const autoCollects = await redis.json.get(`autoCollects:${userId}`)
    const collection = autoCollects.find(
      (c: Collection) => c.id === collectionId
    )
    console.log(collection)
    if (collection) {
      collection.autoCollectApprovals = collection.autoCollectApprovals.filter(
        (a: AutoCollectApproval) => a.id !== approvalId
      )
      console.log(collection.autoCollectApprovals, approvalId)
      if (!collection.autoCollectApprovals.length) {
        autoCollects.splice(autoCollects.indexOf(collection), 1)
      }
      redis.json.set(`autoCollects:${userId}`, "$", autoCollects)
    }
  }

  async getCachedCollection(userId: number, collectionId: number) {
    const collectionService = Container.get(CollectionService)
    if (await redis.json.get(`collections:${userId}`)) {
      const collections = await redis.json.get(`collections:${userId}`)
      return collections?.find((c: Collection) => c.id === collectionId) || null
    } else {
      this.generateCollectionCache().then(() => {})
      return await collectionService.getCollection(collectionId)
    }
  }

  async generateShareLinkCache() {
    console.info("[REDIS] Generating collections ShareLink cache...")
    // delete all shareLinks
    const keys = await redis.keys("shareLinks:*")
    for (const key of keys) {
      redis.del(key)
    }
    const start = new Date().getTime()
    const collections = await Collection.findAll({
      where: {
        shareLink: {
          [Op.ne]: null
        }
      },
      include: [
        {
          model: CollectionUser,
          as: "users",
          include: [
            {
              model: User,
              as: "user",
              attributes: partialUserBase
            }
          ]
        },
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        },
        {
          model: CollectionItem,
          as: "preview",
          include: [
            {
              model: Upload,
              as: "attachment",
              where: {
                type: "image"
              }
            }
          ]
        }
      ]
    })
    for (const collection of collections) {
      redis.json.set(`shareLinks:${collection.shareLink}`, "$", {
        ...collection.toJSON(),
        permissionsMetadata: {
          configure: false,
          write: false,
          read: true
        },
        _redis: new Date().toISOString()
      })
    }
    const end = new Date().getTime()
    console.info(
      `[REDIS] Collections ShareLink cache generated in ${end - start}ms`
    )
  }

  async patchShareLinkCache(shareLink: string, collectionId: number) {
    console.info("[REDIS] Patching ShareLink cache...")
    const start = new Date().getTime()
    const collection = await Collection.findOne({
      where: {
        id: collectionId
      },
      include: [
        {
          model: CollectionUser,
          as: "users",
          include: [
            {
              model: User,
              as: "user",
              attributes: partialUserBase
            }
          ]
        },
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        },
        {
          model: CollectionItem,
          as: "preview",
          include: [
            {
              model: Upload,
              as: "attachment",
              where: {
                type: "image"
              }
            }
          ]
        }
      ]
    })
    if (!collection) return
    await redis.json.set(`shareLinks:${shareLink}`, "$", {
      ...collection.toJSON(),
      permissionsMetadata: {
        configure: false,
        write: false,
        read: true
      },
      _redis: new Date().toISOString()
    })
    const end = new Date().getTime()
    console.info(`[REDIS] ShareLink cache patched in ${end - start}ms`)
  }

  async generateCollectionCache(userId?: number) {
    try {
      const collectionService = Container.get(CollectionService)
      console.info("[REDIS] Generating collections cache...")
      let start = new Date().getTime()
      let users
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })] as User[]
      }
      for (const user of users) {
        const collections = await collectionService.getCollections(user.id)
        redis.json.set(`collections:${user.id}`, "$", collections)
      }
      let end = new Date().getTime()
      console.info(`[REDIS] Collections cache generated in ${end - start}ms`)
      this.generateAutoCollectCache().then(() => {})
    } catch (e) {
      console.error(e)
    }
  }

  async generateCollectionCacheForUser(id: number) {
    const collectionService = Container.get(CollectionService)
    console.info("[REDIS] Generating collections cache for user...")
    let start = new Date().getTime()
    const collections = await collectionService.getCollections(id)
    redis.json.set(`collections:${id}`, "$", collections)
    let end = new Date().getTime()
    console.info(`[REDIS] User collections cache generated in ${end - start}ms`)
  }

  async resetCollectionCache(id: number, deletionUserId?: number) {
    try {
      const collectionService = Container.get(CollectionService)
      console.info(
        "[REDIS] Generating collections cache for individual collection..."
      )
      let start = new Date().getTime()
      const collection = await collectionService.getCollection(id)

      if (deletionUserId) {
        let collections = await redis.json.get(`collections:${deletionUserId}`)
        const index: number = collections.findIndex(
          (c: Collection) => c.id === collection.id
        )
        collections.splice(index, 1)
        redis.json.set(`collections:${deletionUserId}`, "$", collections)
      }

      const updateCache = async (user: CollectionUser) => {
        const id = user.recipientId

        console.info("[REDIS] Patching cache for user", id)
        const collections = await redis.json.get(`collections:${id}`)
        const index: number = collections.findIndex(
          (c: Collection) => c.id === collection.id
        )
        if (index === -1) {
          collections.push({
            ...collection.toJSON(),
            permissionsMetadata: {
              write: user.write,
              read: user.accepted !== false,
              configure: user.configure,
              recipient: user?.id ? user : null
            }
          })
        } else {
          collections[index] = {
            ...collection.toJSON(),
            permissionsMetadata: {
              write: user.write,
              read: user.accepted !== false,
              configure: user.configure
            },
            recipient: user?.id ? user : null
          }
        }
        redis.json.set(`collections:${id}`, "$", collections)
      }

      for (const user of collection.users) {
        await updateCache(user)
      }

      await updateCache({
        recipientId: collection.userId,
        write: true,
        read: true,
        configure: true
      } as CollectionUser)

      let end = new Date().getTime()
      console.info(
        `[REDIS] Individual collection cache generated in ${end - start}ms`
      )
    } catch {}
  }

  async generateUserCache(id?: number) {
    async function generate(id: number) {
      console.log("[REDIS] Generating user cache for user", id)
      const user = await User.findOne({
        where: {
          id
        },
        attributes: [
          ...partialUserBase,
          "itemsPerPage",
          "status",
          "storedStatus",
          "emailVerified",
          "pulse",
          "banned",
          "dateOfBirth",
          "planId"
        ]
      })

      redis.json.set(`user:${id}`, "$", user?.toJSON())
    }
    if (id) {
      return await generate(id)
    } else {
      const users = await User.findAll({
        attributes: ["id"]
      })
      for (const user of users) {
        await generate(user.id)
      }
    }
  }

  cacheInit() {
    if (config.disableStats) {
      return console.warn(
        "[REDIS] Stats are disabled, skipping cache initialization. Ensure you know what you're doing. You can re-enable stats by setting `disableStats` to `false` in your tpu.json and restarting the server."
      )
    }
    if (!config.finishedSetup) return
    try {
      // 10 minutes
      // TEMP: 1 hour
      setInterval(this.refreshState, 3600000)
      // 30 minutes
      // TEMP: 12 hours
      setInterval(this.generateUserStatsCache, 43200000)
      // 1 hour
      setInterval(this.generateCollectionCache, 3600000)
      setInterval(this.generateShareLinkCache, 3600000)

      cron.schedule("0 5 * * *", () => {
        this.generateInsightsCache()
      })

      this.refreshState().then(() => {})

      return true
    } catch {
      return false
    }
  }
}
