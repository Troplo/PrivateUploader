import { Service } from "typedi"
import { Announcement } from "@app/models/announcement.model"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload.model"
import { Op } from "sequelize"
import { Pulse } from "@app/models/pulse.model"
import { HoursOfDay } from "@app/services/pulse.service"
import { Invite } from "@app/models/invite.model"
import { Experiment } from "@app/models/experiment.model"
import { Note } from "@app/models/note.model"
import { Workspace } from "@app/models/workspace.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import axios from "axios"
import maxmind, { CityResponse, Reader } from "maxmind"
import Errors from "@app/lib/errors"
import { Message } from "@app/models/message.model"
import { Chat } from "@app/models/chat.model"
import { ReportValidate } from "@app/validators/report"
import { Report } from "@app/models/report.model"
import { WeatherResponse } from "@app/interfaces/weather"
import { State, Stats } from "@app/types/v4/core"
import { ExperimentType } from "@app/classes/graphql/core/experiments"
import { isNumeric } from "@app/lib/isNumeric"
import {
  Experiments,
  getExperiments,
  ExperimentsLegacy
} from "@app/lib/experiments"

let city: Reader<CityResponse> | undefined

maxmind
  .open<CityResponse>(process.cwd() + "/app/lib/GeoLite2-City.mmdb")
  .then((reader) => {
    city = reader
  })

@Service()
export class CoreService {
  async report(
    tpuLink: string,
    content: string,
    email: string,
    ip: string,
    userId?: number
  ) {
    ReportValidate.parse({
      tpuLink,
      content,
      email
    })
    try {
      const tpuLinkParts = tpuLink.split("/")
      const attachment = tpuLinkParts[tpuLinkParts.length - 1]
      const upload = await Upload.findOne({
        where: {
          attachment
        }
      })
      if (!upload) {
        throw Errors.ATTACHMENT_NOT_FOUND
      }
      if (await redis.get(`report:${ip}:${upload.id}`)) {
        // return fake success to prevent spam
        return true
      }
      await Report.create({
        message: content,
        email,
        reportedByUserId: userId,
        reportedUserId: upload.userId,
        uploadId: upload.id
      })
      await redis.set(`report:${ip}:${upload.id}`, "true")
      return true
    } catch (e) {
      console.log(e)
      throw Errors.INVALID_TPU_LINK
    }
  }

  async getWeather(ip: string | undefined): Promise<WeatherResponse> {
    if (!ip) throw Errors.WEATHER_NOT_RESPONDING
    try {
      const cityResponse = await city?.get(
        config.release === "dev" ? "124.169.200.0" : ip
      )
      const location = cityResponse?.city?.names?.en
      if (!location) {
        throw Errors.WEATHER_NOT_RESPONDING
      }
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${config.weatherApiKey}&units=metric`
      )
      return {
        ...data.main,
        ...data.weather[0],
        wind_speed: data.wind.speed,
        wind_deg: data.wind.deg,
        wind_gust: data.wind.gust,
        rain_1h: data.rain?.["1h"],
        rain_3h: data.rain?.["3h"],
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        location: data.name,
        _redis: new Date().toISOString()
      }
    } catch {
      return {
        error: true,
        errors: [Errors.WEATHER_NOT_RESPONDING]
      }
    }
  }

  async getState(): Promise<Partial<State>> {
    return {
      name: config.siteName,
      release: config.release,
      hostname: config.hostname,
      hostnameWithProtocol: config.hostnameWithProtocol,
      announcements: config.finishedSetup
        ? await this.getAnnouncements()
        : undefined,
      stats: config.finishedSetup ? await this.getStats() : undefined,
      maintenance: config.maintenance,
      registrations: config.registrations,
      officialInstance: config.officialInstance,
      providers: {
        anilist: !!config.providers.anilist.key,
        lastfm: !!config.providers.lastfm.key,
        mal: !!config.providers.mal.key
      },
      termsNoteId: config.termsNoteId,
      privacyNoteId: config.privacyNoteId,
      features: config.features,
      inviteAFriend: config.inviteAFriend,
      preTrustedDomains: config.preTrustedDomains,
      hostnames: config.hostnames
    }
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await Announcement.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: [
            "id",
            "username",
            "avatar",
            "moderator",
            "administrator",
            "createdAt"
          ]
        }
      ]
    })
  }

  async convertToGraph(data: any[], type?: "pulse") {
    let result = {} as Record<string, number>
    for (let i = 7; i >= 0; i--) {
      let day = dayjs().subtract(i, "days").format("YYYY-MM-DD")
      result[day] = 0
    }
    let graphInterim = data.reduce(function (res, upload) {
      let day = dayjs(upload.createdAt).format("YYYY-MM-DD")
      if (isNaN(result[day]) || result[day] === undefined) {
        return result
      }
      if (type !== "pulse") {
        result[day]++
      } else {
        result[day] += upload.timeSpent / 1000 / 60 / 60
      }
      return result
    }, {})
    if (!data.length) {
      graphInterim = result
    }
    // if pulse graph, round to 2 decimals
    if (type === "pulse") {
      for (let key in graphInterim) {
        graphInterim[key] = Math.round(graphInterim[key] * 100) / 100
      }
    }
    return {
      data: Object.values(graphInterim),
      labels: Object.keys(graphInterim)
    }
  }

  async getStats(user?: User): Promise<Partial<Stats>> {
    const where = user ? { userId: user.id } : {}
    const uploadStats = await Upload.findAll({
      where: {
        ...where,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)
        }
      }
    })

    const messageStats = await Message.findAll({
      where: {
        ...where,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)
        }
      }
    })

    let pulseStats = await Pulse.findAll({
      where: {
        ...where,
        other: {
          type: "session"
        },
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)
        }
      }
    })

    if (!user) {
      const invites = await Invite.count({
        where: {
          registerUserId: {
            [Op.ne]: null
          }
        }
      })

      return {
        users: await User.count(),
        announcements: await Announcement.count(),
        usage: await User.sum("quota"),
        usagePercentage: (await User.sum("quota")) / 1000000000000,
        collections: await Collection.count(),
        collectionItems: await CollectionItem.count(),
        uploadGraph: await this.convertToGraph(uploadStats),
        messageGraph: await this.convertToGraph(messageStats),
        pulseGraph: await this.convertToGraph(pulseStats, "pulse"),
        uploads: await Upload.count(),
        invites,
        inviteMilestone: Math.ceil(invites / 20) * 20,
        pulse: Math.round(
          (await Pulse.sum("timeSpent", {
            where: {
              other: {
                type: "session"
              }
            }
          })) /
            1000 /
            60 /
            60
        ),
        pulses: await Pulse.count(),
        docs: await Note.count(),
        messages: await Message.count(),
        chats: await Chat.count()
      }
    } else {
      const pulses = await Pulse.findAll({
        where: {
          userId: user.id,
          other: {
            type: "session"
          }
        }
      })
      let hours = new HoursOfDay().hours
      const uploads = await Upload.findAll({
        where: {
          userId: user.id
        }
      })
      for (const upload of uploads) {
        const hour = dayjs(upload.createdAt).format("h A")
        hours[hour] = (hours[hour] || 0) + 1
      }
      return {
        uploads: await Upload.count({
          where
        }),
        uploadGraph: await this.convertToGraph(uploadStats),
        messageGraph: await this.convertToGraph(messageStats),
        pulseGraph: await this.convertToGraph(pulseStats, "pulse"),
        pulse: Math.round(
          pulses.reduce((acc, pulse) => acc + pulse.timeSpent, 0) / 3600000
        ),
        pulses: await Pulse.count({ where: { userId: user.id } }),
        usage: Number(user.quota),
        hours,
        collections: await Collection.count({ where }),
        collectionItems: await CollectionItem.count({ where }),
        messages: await Message.count({ where }),
        docs: await Note.count({
          distinct: true,
          include: [
            {
              model: WorkspaceFolder,
              as: "folder",
              required: true,
              include: [
                {
                  model: Workspace,
                  where: {
                    userId: user.id
                  },
                  required: true
                }
              ]
            }
          ]
        })
      }
    }
  }

  async getUserExperiments(
    userId: number,
    dev: boolean = false,
    gold: boolean = false,
    majorVersion: number | undefined = undefined
  ) {
    const overrides = await Experiment.findAll({
      where: {
        userId
      }
    })
    const experiments = await this.getExperiments(dev, gold, majorVersion)
    const overrideObject = overrides.reduce((acc: any, override) => {
      acc[override.dataValues.key] = JSON.parse(override.value)
      return acc
    }, {})
    for (const key in overrideObject) {
      if (experiments.meta[key]?.force) {
        delete overrideObject[key]
      }
    }
    return {
      ...experiments,
      ...overrideObject
    } as Record<Experiments, boolean | number>
  }

  async getUserExperimentsV4(
    userId: number,
    dev: boolean = false,
    gold: boolean = false,
    majorVersion: number = 4,
    wantedExperiments: string[] | undefined = undefined
  ): Promise<ExperimentType[]> {
    const overrides = await Experiment.findAll({
      where: {
        userId
      }
    })
    const experiments = await this.getExperimentsV4(
      dev,
      gold,
      majorVersion,
      wantedExperiments
    )
    return [
      ...experiments.map((experiment) => {
        if (experiment.force) {
          return experiment
        }
        const override = overrides.find(
          (override) => override.key === experiment.id
        )
        return {
          ...experiment,
          value:
            override?.dataValues?.value === "true"
              ? true
              : override?.dataValues?.value === "false"
              ? false
              : isNumeric(override?.dataValues?.value)
              ? parseInt(override?.dataValues?.value)
              : experiment.value
        }
      })
    ]
  }

  async getExperiments(
    dev: boolean = false,
    gold: boolean = false,
    majorVersion: number | undefined = undefined,
    wantedExperiments: string[] | undefined = undefined
  ): Promise<Record<ExperimentsLegacy, any>> {
    const experiments = getExperiments()

    experiments.COMMUNICATIONS = config?.features?.communications ?? true
    experiments.INTERACTIVE_NOTES = config?.features?.workspaces ?? true
    experiments.OFFICIAL_INSTANCE = config?.officialInstance
    experiments.FLOWINITY = config?.officialInstance ?? false

    if (dev || config.release === "dev") {
      experiments.NEW_BRANDING = true
      experiments.CHAT_CACHING = 10
      experiments.PROGRESSIVE_UI = true
      experiments.CHAT_GUIDED_WIZARD = true
      experiments.NOTE_COLLAB = true
      //experiments.FORCE_DEV_MODE = false
      //experiments.FORCE_STABLE_MODE = false
      //experiments.USER_V3_EDITOR = true
      experiments.DEBUG_FAVICON = true
      // experiments.FLOWINITY = true
      experiments.ACCOUNT_DEV_ELIGIBLE = true
      experiments.SURVEYS = true
      experiments.WEBMAIL = true
      experiments.EARLY_ACCESS = true
      experiments.CAN_ENABLE_PROGRESSIVE_UI = true
    } else if (gold) {
      experiments.EARLY_ACCESS = true
      experiments.CAN_ENABLE_PROGRESSIVE_UI = true
    }

    // only return experiments that are available for the major version
    if (majorVersion && !wantedExperiments) {
      for (const key in experiments) {
        if (key === "meta") continue
        if (
          experiments.meta[
            key as keyof typeof experiments.meta
          ]?.versions?.includes(majorVersion)
        ) {
          continue
        }
        delete experiments[key as keyof typeof experiments]
        delete experiments.meta[key as keyof typeof experiments.meta]
      }
    }

    if (wantedExperiments) {
      for (const key in experiments) {
        if (key === "meta") continue
        if (!wantedExperiments.includes(key)) {
          delete experiments[key as keyof typeof experiments]
          delete experiments.meta[key as keyof typeof experiments.meta]
        }
      }
    }

    if (config.finishedSetup) {
      const global:
        | {
            id: keyof typeof experiments
            value: never
            force: boolean
            userId: number
          }[]
        | null = await redis.json.get("experimentOverridesGlobal")
      if (global) {
        for (const override of global) {
          if (experiments[override.id] !== undefined) {
            experiments[override.id] = override.value
            experiments.meta[override.id].force = override.force
            experiments.meta[override.id].override = true
          }
        }
      }
    }
    return experiments
  }

  async getExperimentsV4(
    dev: boolean = false,
    gold: boolean = false,
    majorVersion: number = 4,
    wantedExperiments: string[] | undefined = undefined
  ): Promise<ExperimentType[]> {
    console.log(wantedExperiments)
    const experiments = await this.getExperiments(
      dev,
      gold,
      majorVersion,
      wantedExperiments
    )
    // remove meta from object.entries
    return Object.entries(experiments)
      .filter((experiment) => {
        return experiment[0] !== "meta"
      })
      .map(([key, value]) => ({
        id: key,
        value,
        ...experiments.meta[key]
      }))
  }

  async checkExperiment(
    userId: number,
    experiment: Experiments,
    dev: boolean = false,
    gold: boolean = false
  ) {
    const experiments = await this.getUserExperiments(userId, dev, gold)
    return experiments[experiment]
  }

  async setExperiment(
    userId: number,
    key: Experiments,
    value: boolean | number
  ) {
    const experiment = await Experiment.findOne({
      where: {
        userId,
        key
      }
    })
    if (experiment) {
      await experiment.update({
        value
      })
      return experiment
    } else {
      return await Experiment.create({
        userId,
        key,
        value
      })
    }
  }
}
