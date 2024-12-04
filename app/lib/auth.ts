import { NextFunction, Response } from "express"
import { Session } from "@app/models/session.model"
import { User } from "@app/models/user.model"
import { Plan } from "@app/models/plan.model"
import { Theme } from "@app/models/theme.model"
import { Domain } from "@app/models/domain.model"
import { Op } from "sequelize"
import maxmind, { AsnResponse, CityResponse, Reader } from "maxmind"
import { Subscription } from "@app/models/subscription.model"
import { Experiment } from "@app/models/experiment.model"
import Errors from "@app/lib/errors"
import { Integration } from "@app/models/integration.model"
import { createParamDecorator } from "routing-controllers"
import { RequestAuthSystem } from "@app/types/express"
import { Badge } from "@app/models/badge.model"
import { AccessedFrom } from "@app/classes/graphql/user/session"
import { CacheSession } from "@app/lib/graphql/AuthChecker"
import { PartialUserAuth } from "@app/classes/graphql/user/partialUser"
import { Container } from "typedi"
import { UserResolver } from "@app/controllers/graphql/user.resolver"

let asn: Reader<AsnResponse>
let city: Reader<CityResponse>
maxmind
  .open<AsnResponse>(process.cwd() + "/app/lib/GeoLite2-ASN.mmdb")
  .then((reader) => {
    asn = reader
  })

maxmind
  .open<CityResponse>(process.cwd() + "/app/lib/GeoLite2-City.mmdb")
  .then((reader) => {
    city = reader
  })

export type Scope =
  | "uploads.create"
  | "uploads.modify"
  | "uploads.view"
  | "user.view"
  | "user.modify"
  | "collections.modify"
  | "collections.create"
  | "collections.view"
  | "workspaces.view"
  | "workspaces.create"
  | "workspaces.modify"
  | "chats.view"
  | "chats.create"
  | "chats.send"
  | "chats.edit"
  | "insights.view"
  | "starred.view"
  | "starred.modify"
  | "admin.ci"
  | "user"
  | "collections"
  | "workspaces"
  | "chats"
  | "insights"
  | "starred"
  | "admin"
  | "*"
  | "mail.view"
  | "mail.create"
  | "mail"
  | "oauth"
  | "oauth.user.email"
  | "oauth.user.id"
  | "oauth.user.username"
  | "oauth.user.avatar"
  | "oauth.save"
  | "oauth.user"
  | "oauth.authorize"
  | "none"
  | "dev.view"
  | "dev.modify"
  | ""

async function getSession(token: string) {
  return await Session.findOne({
    where: {
      token: token,
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
        model: User,
        as: "user",
        required: true,
        include: [
          {
            model: Experiment,
            as: "experiments"
          },
          {
            model: Subscription,
            as: "subscription"
          },
          {
            model: Domain,
            as: "domain"
          },
          {
            model: Plan,
            as: "plan"
          },
          {
            model: Theme,
            as: "theme"
          },
          {
            model: Integration,
            as: "integrations",
            attributes: [
              "id",
              "type",
              "providerUserId",
              "providerUsername",
              "providerUserCache",
              "error",
              "createdAt",
              "updatedAt"
            ]
          },
          {
            model: Badge,
            as: "badges"
          }
        ],
        order: [
          [{ model: Badge, as: "badges" }, "priority", "DESC"],
          [{ model: Badge, as: "badges" }, "id", "ASC"]
        ]
      }
    ]
  })
}

export function checkScope(requiredScope: Scope | Scope[], scope: string) {
  if (
    requiredScope === "none" ||
    requiredScope?.length === 0 ||
    (typeof requiredScope === "object" && requiredScope?.includes("none")) ||
    (typeof requiredScope === "object" && requiredScope?.includes(""))
  )
    return true
  if (scope === undefined) return true
  if (scope === "") {
    return false
  }
  if (scope === "*") {
    return true
  }
  // scope is the current session scope, and requiredScope is the scope required for the route, formatted like user.read or user.write
  const scopes = scope.split(",")
  for (const scope of scopes) {
    if (typeof requiredScope === "string") {
      if (scope === requiredScope) {
        return true
      } else if (scope?.split(".")[0] === requiredScope) {
        return true
      }
    } else {
      if (requiredScope.includes(<Scope>scope)) {
        return true
      } else if (requiredScope.includes(<Scope>scope.split(".")[0])) {
        return true
      }
    }
  }
  return false
}

export async function updateSession(
  session: Session | CacheSession,
  ip: string | undefined
) {
  // Ensure that it's the Session overload, not the bot one
  if (!session || !("info" in session)) return
  if (
    !ip ||
    !session ||
    (new Date(session.updatedAt).getTime() + 5 * 60 * 1000 >
      new Date().getTime() &&
      session.info?.accessedFrom?.length)
  )
    return
  let accessedFrom = session.info?.accessedFrom || []
  if (!accessedFrom.find((aF: AccessedFrom) => aF.ip === ip)) {
    const asnResponse = await asn?.get(ip)
    const cityResponse = await city?.get(ip)
    accessedFrom.push({
      isp: asnResponse?.autonomous_system_organization,
      location: cityResponse?.city?.names?.en,
      ip: ip,
      date: new Date().toISOString(),
      asn: asnResponse?.autonomous_system_number
    })
  }
  await Session.update(
    {
      info: {
        ...session.info,
        accessedFrom: accessedFrom
      },
      expiredAt:
        session.type === "session"
          ? new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
          : session.expiredAt
    },
    {
      where: {
        id: session.id
      }
    }
  )
}

export async function simpleAuth(req: RequestAuthSystem) {
  const token = req.header("Authorization")

  if (!token) return { id: undefined }

  const session = await getSession(<string>token)

  if (!session?.user) return { id: undefined }

  return session?.user
}

export async function authSystem(
  scope: Scope | Scope[],
  passthrough: boolean = false,
  req: RequestAuthSystem,
  res: Response,
  next: NextFunction
): Promise<{
  user: PartialUserAuth | null
  session: CacheSession
}> {
  const token = req.header("Authorization")
  if (!scope) scope = "*"
  let cache
  if (config.finishedSetup) {
    cache = await redis.json.get(`session:${token}`)
  }
  let user: PartialUserAuth | null = null
  let session: CacheSession = null
  if (!token) {
    if (passthrough) {
      req.user = null
      next()
      return {
        user: null,
        session: null
      }
    }
    res.status(401)
    res.json({
      errors: [
        {
          ...Errors.INVALID_TOKEN,
          name: "INVALID_TOKEN"
        }
      ]
    })
    return {
      user: null,
      session: null
    }
  }
  if (!cache) {
    if (global.config.finishedSetup) {
      const userResolver = Container.get(UserResolver)
      session = await userResolver.findByToken(token)
      user = !session?.user?.banned ? session?.user || null : null
      if (session) {
        redis.json.set(
          `session:${token}`,
          "$",
          {
            ...("toJSON" in session ? session.toJSON() : session),
            user: undefined
          },
          {
            ttl: session?.expiredAt
              ? dayjs(session.expiredAt).diff(dayjs(), "second")
              : 60 * 60 * 24 * 7
          }
        )
        redis.json.set(`user:${session?.userId}`, "$", session?.user)
      }
    } else {
      user = null
    }
  } else if (config.finishedSetup) {
    session = cache
    const userCache = await redis.json.get(`user:${session!.userId}`)
    if (userCache) {
      if (!userCache.banned) user = userCache
    } else {
      const userResolver = Container.get(UserResolver)
      session = await userResolver.findByToken(token)
      user = !session?.user?.banned ? session?.user || null : null
      redis.json.set(`user:${session?.userId}`, "$", user)
    }
  }

  if (session) {
    if (!checkScope(scope, session.scopes)) {
      if (passthrough) {
        req.user = null
        next()
        return {
          user: null,
          session
        }
      }
      res.status(401)
      res.json({
        errors: [
          {
            name: "SCOPE_REQUIRED",
            message:
              "You do not have permission to access this resource due to your current API key scopes.",
            requiredScope: scope,
            currentScopes: session.scopes,
            status: 401
          }
        ]
      })
      updateSession(session, req.ip).then(() => {})
      return {
        user: null,
        session
      }
    }
    if (session.user?.banned) {
      if (passthrough) {
        req.user = null
        return {
          user: null,
          session
        }
      }
      res.status(401)
      res.json({
        errors: [Errors.BANNED]
      })
      updateSession(session, req.ip).then(() => {})
      return {
        user: null,
        session
      }
    } else {
      //@ts-ignore
      if (user) {
        if (!user.emailVerified) {
          //@ts-ignore
          if (user?.dataValues)
            //@ts-ignore
            user.dataValues.scopes = "user.view,user.modify"
          //@ts-ignore
          user.scopes = "user.view,user.modify"
        } else {
          //@ts-ignore
          if (user?.dataValues)
            //@ts-ignore
            user.dataValues.scopes = session.scopes
          //@ts-ignore
          if (user) user.scopes = session.scopes
        }

        if (session.oauthAppId) {
          //@ts-ignore
          if (user?.dataValues) user.dataValues.oauthAppId = session.oauthAppId
          //@ts-ignore
          user.oauthAppId = session.oauthAppId
        }
      }
      if (!scope.includes("user") && !user?.emailVerified) {
        if (passthrough) {
          req.user = null
          next()
          return {
            user: null,
            session
          }
        }
        res.status(401)
        res.json({
          errors: [Errors.EMAIL_NOT_VERIFIED]
        })
        updateSession(session, req.ip).then(() => {})
        return {
          user: null,
          session
        }
      }
      //@ts-ignore
      req.user = user
      next()
      updateSession(session, req.ip).then(() => {})
      return {
        user: user,
        session: session
      }
    }
  } else {
    if (passthrough) {
      req.user = null
      next()
      return {
        user: null,
        session: null
      }
    }
    res.status(401)
    res.json({
      errors: [
        {
          name: "INVALID_TOKEN",
          message:
            "The authorization token you provided is invalid or has expired.",
          status: 401
        }
      ]
    })
  }
  return {
    user: null,
    session: null
  }
}

const auth = (scope: Scope | Scope[], passthrough: boolean = false) => {
  return async function (req: any, res: Response, next: NextFunction) {
    try {
      return await authSystem(scope, passthrough, req, res, next)
    } catch (err) {
      console.log(err)
      if (passthrough) {
        req.user = null
        return next()
      }
      res.status(401)
      res.json({
        errors: [
          {
            name: "INVALID_TOKEN",
            message: "Your authorization token is invalid or has expired.",
            status: 401
          }
        ]
      })
    }
  }
}

export function Auth(
  scope: Scope | Scope[],
  required: boolean = true,
  allowMaintenance: boolean = false
) {
  return createParamDecorator({
    required,
    value: async (action) => {
      if (config.maintenance.enabled && !allowMaintenance)
        throw {
          name: "MAINTENANCE",
          message: `${config.maintenance.message}\n\nFor more information visit ${config.maintenance.statusPage}`,
          status: 400
        }

      if (!config.finishedSetup && !required) return null
      if (!config.finishedSetup) throw Errors.NOT_SETUP
      if (!scope) scope = "*"
      const auth = await authSystem(
        scope,
        !required,
        action.request,
        {
          //@ts-ignore
          status: (_: number) => {
            return
          },
          json: (data: any) => {
            throw {
              ...data.errors[0]
            }
          }
        },
        () => {}
      )
      return auth.user
    }
  })
}

export default auth
