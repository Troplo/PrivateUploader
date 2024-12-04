import { Container, Service } from "typedi"
import axios from "axios"
import { Subscription } from "@app/models/subscription.model"
import { User } from "@app/models/user.model"
import { AdminService } from "@app/services/admin.service"
import { Op } from "sequelize"
import { Plan } from "@app/models/plan.model"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { CoreService } from "@app/services/core.service"

type Jitsi = {
  id: string
  createdAt: string
  updatedAt: string
  active: boolean
  jid: string
  occupants: JitsiOccupant[]
  polls: object[]
  raw: object
  speakerStats: JitsiSpeakers[]
}

type JitsiOccupant = {
  active: boolean
  id: string
  email: string
  nick: string
  sourceInfo: string
  statsId: string
  codecType: string
}

type JitsiSpeakers = {
  id: string
  username: string
  isSilent: boolean
  isDominantSpeaker: boolean
  dominantSpeakerStart: number
  totalDominantSpeakerTime: number
}

type JitsiUser = {
  id: number
  names: string[]
  giveGold?: boolean
}

const USERS: JitsiUser[] = [
  {
    id: 1,
    names: ["Troplo"]
  },
  {
    id: 6,
    names: [
      "Jolt",
      "Dhease",
      "Dhease Nheeights",
      "Jolt707",
      "Jensen",
      "Nesy",
      "JJS707"
    ],
    giveGold: true
  },
  {
    id: 7,
    names: ["ElectricS01", "Tropolo", "Electric"]
  }
]

@Service()
export class OfficialInstJolt707 {
  constructor(private readonly adminService: AdminService) {}

  async createSubscription(id: number) {
    const subscription = await Subscription.create({
      planId: 6,
      userId: id,
      price: 0,
      cancelled: false,
      paymentId: 0,
      expiredAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14)
    })
    await User.update(
      {
        subscriptionId: subscription.id
      },
      {
        where: {
          id: id
        }
      }
    )
    return subscription
  }

  async checkJitsiGold() {
    console.log("[BILLING] Checking Gold")
    axios
      .get("https://mgmt.meet.troplo.com/api/v1/jitsi", {
        headers: {
          Authorization: config.jitsiToken
        }
      })
      .then(async (res) => {
        // get Jitsi's created in the last 14d
        for (const user of USERS) {
          let valid = false
          const filtered = res.data.filter((jitsi: Jitsi) => {
            return (
              new Date(jitsi.createdAt).getTime() >
                new Date().getTime() - 1000 * 60 * 60 * 24 * 14 &&
              jitsi.jid === "objective@muc.meet.jitsi" && // jitsi.speakerStats must contain Troplo with a dominant speaker time of 1h
              jitsi.speakerStats.some(
                (speaker: JitsiSpeakers) =>
                  speaker.username === "Troplo" &&
                  speaker.totalDominantSpeakerTime > 1000 * 60 * 20
              ) &&
              jitsi.speakerStats.some((speaker: JitsiSpeakers) =>
                user.names.includes(speaker.username)
              )
            )
          })
          console.log(
            "[BILLING] " +
              filtered.length +
              " Jitsi rooms created in the last 14d"
          )
          let nesyLength = 0
          for (const jitsi of filtered) {
            for (const speaker of jitsi.speakerStats) {
              if (user.names.includes(speaker.username)) {
                nesyLength += speaker.totalDominantSpeakerTime
              }
            }
          }
          // from ms to hours
          nesyLength = nesyLength / 1000 / 60 / 60
          console.log(
            "[BILLING] " +
              nesyLength +
              `h of dominant speaker time in the last 14d (${user.id})`
          )
          const subscription = await Subscription.findOne({
            where: {
              userId: user.id
            }
          })
          console.log(user.id)
          if (!subscription) {
            console.log(`[BILLING] Creating subscription for ${user.id}`)
            await this.createSubscription(user.id)
          }
          if (nesyLength < 8) {
            if (!subscription) return
            // @ts-ignore
            const meta = subscription.metadata?.active
            const hasExpired =
              new Date(subscription.expiredAt).getTime() <
                new Date().getTime() && subscription.expiredAt
            if (!hasExpired) {
              await Subscription.update(
                {
                  cancelled: true,
                  // expire in 24h
                  cancelledAt: new Date(),
                  expiredAt: new Date(
                    new Date().getTime() + 1000 * 60 * 60 * 24
                  )
                },
                {
                  where: {
                    userId: user.id,
                    cancelled: false
                  }
                }
              )
              valid = false
            }
            await Subscription.update(
              {
                metadata: {
                  message: `You don't have 14 hours of Speaker Stats in the past 14 days, your TPU Gold will expire in 1 day. You only have ${Math.round(
                    nesyLength
                  )} hours.`,
                  hours: nesyLength,
                  active: !hasExpired
                }
              },
              {
                where: {
                  userId: user.id
                }
              }
            )
            valid = true
            if (!subscription) return
            if (hasExpired) {
              const dbUser = await User.findOne({
                where: {
                  id: user.id
                },
                attributes: ["username", "email", "id"]
              })
              console.log("[BILLING] Jolt707's subscription expired")
              valid = false
              // @ts-ignore
              if (meta && dbUser) {
                this.adminService.sendEmail(
                  {
                    body: {
                      intro: `Your ${config.siteName} Gold has expired!`,
                      title: `Hello ${dbUser.username}.`,
                      action: [
                        {
                          instructions: `Your ${
                            config.siteName
                          } Gold has expired. You only have ${Math.round(
                            nesyLength
                          )} hours of Speaker Stats in the past 14 days. You need 8 hours to keep your ${
                            config.siteName
                          } Gold.`,
                          button: {
                            color: "#0190ea", // Optional action button color
                            text: "Go to TPU",
                            link: config.hostnameWithProtocol + "/"
                          }
                        }
                      ]
                    }
                  },
                  dbUser.email,
                  `Your ${config.siteName} Gold has expired!`
                )
              }
              await Subscription.update(
                {
                  cancelled: user.giveGold ? subscription.cancelled : true,
                  metadata: {
                    active: false,
                    hours: nesyLength,
                    message: `You don't have 14 hours of Speaker Stats in the past 14 days, your TPU Gold will expire in 1 day. You only have ${Math.round(
                      nesyLength
                    )} hours.`
                  }
                },
                {
                  where: {
                    userId: user.id
                  }
                }
              )

              if (user.giveGold)
                await User.update(
                  {
                    planId: 1
                  },
                  {
                    where: {
                      id: user.id
                    }
                  }
                )
            }
          } else if (user.giveGold) {
            const subscription = await Subscription.findOne({
              where: {
                userId: user.id
              }
            })
            if (!subscription) {
              console.log("[BILLING] Creating subscription for Jolt707")
              await this.createSubscription(user.id)
            }
            await User.update(
              {
                planId: 6
              },
              {
                where: {
                  id: user.id
                }
              }
            )
            valid = true
            await Subscription.update(
              {
                cancelled: false,
                cancelledAt: null,
                expiredAt: new Date(
                  new Date().getTime() + 1000 * 60 * 60 * 24 * 14
                ),
                metadata: {
                  hours: nesyLength,
                  active: true
                }
              },
              {
                where: {
                  userId: user.id
                }
              }
            )
            console.log("[BILLING] Jolt707's subscription is valid")
          }

          await Subscription.update(
            {
              metadata: {
                hours: nesyLength,
                active: valid
              }
            },
            {
              where: {
                userId: user.id
              }
            }
          )
        }
      })
      .catch(() => {})
    return true
  }

  async checkBilling() {
    console.log("[BILLING] Checking Billing")
    const users = await User.findAll({
      where: {
        planId: 6
      },
      include: [
        {
          model: Subscription,
          as: "subscription"
        }
      ]
    })

    for (const user of users) {
      if (!user.subscription || USERS.some((u) => u.id === user.id)) continue
      if (
        dayjs(user.subscription.expiredAt).isBefore(dayjs().subtract(3, "day"))
      ) {
        await User.update(
          {
            planId: config.defaultPlanId
          },
          {
            where: {
              id: user.id
            }
          }
        )
        await Subscription.destroy({
          where: {
            userId: user.id
          }
        })
        this.emitEvent(user.id, config.defaultPlanId!, false)
      }
    }
  }

  async emitEvent(userId: number, planId: number, free: boolean) {
    socket
      .of(SocketNamespaces.USER)
      .to(userId)
      .emit("userSettingsUpdate", {
        planId: planId,
        plan: await Plan.findByPk(planId),
        _meta: {
          freePromo: free
        }
      })
  }

  async handleSubscription(
    userId: number,
    planId: number,
    expiredAt?: Date | string,
    days?: number,
    append?: boolean,
    cancelled?: boolean
  ) {
    const user = await User.findByPk(userId)
    if (!user) return
    let subscription = await Subscription.findOne({
      where: {
        userId: userId
      }
    })
    if (planId === config.defaultPlanId || planId === 1) {
      await Subscription.destroy({
        where: {
          userId: userId
        }
      })
      await User.update(
        {
          planId,
          subscriptionId: null
        },
        {
          where: {
            id: userId
          }
        }
      )
      return
    }
    const plan = await Plan.findByPk(planId)
    if (!subscription) {
      subscription = await Subscription.create({
        planId: planId,
        userId: userId,
        price: plan?.price || 0,
        cancelled,
        paymentId: 0,
        expiredAt:
          expiredAt ||
          dayjs()
            .add(days || 30, "day")
            .toDate(),
        cancelledAt: cancelled ? new Date() : undefined
      })
    } else {
      await Subscription.update(
        {
          planId: planId,
          expiredAt:
            expiredAt || append
              ? dayjs(subscription.expiredAt)
                  .add(days || 30, "day")
                  .toDate()
              : dayjs()
                  .add(days || 30, "day")
                  .toDate(),
          cancelled,
          cancelledAt: cancelled ? new Date() : undefined
        },
        {
          where: {
            userId: userId
          }
        }
      )
    }

    await User.update(
      {
        planId: planId,
        subscriptionId: subscription.id
      },
      {
        where: {
          id: userId
        }
      }
    )
    return subscription
  }

  async grantMonth(userId: number) {
    await this.handleSubscription(userId, 6, undefined, 30, true, true)
    this.emitEvent(userId, 6, true)
  }

  async checkGitHub() {
    const users = await User.findAll({
      where: {
        planId: {
          [Op.not]: 6
        }
      },
      include: [
        {
          model: Subscription,
          as: "subscription"
        }
      ]
    })
  }

  async billingInit() {
    if (!config.jitsiToken || !config.officialInstance) return
    try {
      // 30 minutes
      setInterval(this.checkJitsiGold, 1000 * 60 * 30)
      setInterval(this.checkBilling, 1000 * 60 * 60 * 24)

      this.checkBilling().then(() => {})
      this.checkJitsiGold().then(() => {})
      return true
    } catch {
      return false
    }
  }
}
