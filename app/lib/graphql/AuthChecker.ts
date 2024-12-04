import { AuthChecker, Authorized, ResolverData } from "type-graphql"
import { Context } from "@app/types/graphql/context"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { checkScope, Scope, updateSession } from "@app/lib/auth"
import { GraphQLError } from "graphql/error"
import { Container } from "typedi"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
import { Session } from "@app/models/session.model"
import { PartialUserAuth } from "@app/classes/graphql/user/partialUser"
import { CoreService } from "@app/services/core.service"
import { Experiments } from "@app/lib/experiments"
import { GqlError } from "@app/lib/gqlErrors"

export interface AuthCheckerOptions {
  scopes: Scope[] | Scope
  userOptional?: boolean
  accessLevel?: AccessLevel
  emailOptional?: boolean
  neverUseCache?: boolean
  /**
   * Only supports truthy experiments, it will pass if it's true, or 1 or more for example.
   */
  requiredExperiments?: Experiments[]
  allowMaintenance?: boolean
}

export const Authorization = (options: AuthCheckerOptions) =>
  Authorized(options)

export type CacheSession =
  | {
      expiredAt: null
      oauthAppId: string
      fake: boolean
      scopes: string
      type: string
      userId: number
      user: PartialUserAuth
      token: string | null
    }
  | (Session & { user: PartialUserAuth })
  | null

export const authChecker: AuthChecker<Context> = async (
  { context }: ResolverData<Context>,
  options: any[]
) => {
  if (config.maintenance.enabled && !options[0]?.allowMaintenance)
    throw new GraphQLError(
      `${config.maintenance.message}\n\nFor more information visit ${config.maintenance.statusPage}`,
      {
        extensions: {
          code: "MAINTENANCE"
        }
      }
    )

  const start = new Date()
  const token = context.token
  let cache
  if (config.finishedSetup && !options[0]?.neverUseCache) {
    cache = await redis.json.get(`session:${token}`)
  }
  let user: PartialUserAuth | null = null
  let session: CacheSession = null
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
  const opts = options[0] as AuthCheckerOptions
  context.user = user
  if (!user && !opts.userOptional) {
    throw new GraphQLError(
      `You need to be logged in to do this (Authorization header is empty or invalid).`,
      {
        extensions: {
          code: "UNAUTHORIZED"
        }
      }
    )
  }

  if (session && !("fake" in session))
    updateSession(session, context.ip).then(() => {})
  const scopeNormalized =
    typeof opts.scopes === "string" ? [opts.scopes] : opts.scopes

  if (
    !opts.emailOptional &&
    user &&
    !user.emailVerified &&
    !scopeNormalized?.some(
      (item) =>
        item.includes("user.view") ||
        item.includes("chats.view") ||
        item.includes("workspaces.view") ||
        item.includes("collections.view") ||
        item.includes("")
    ) &&
    config.email.enabled
  ) {
    throw new GraphQLError("Please verify your email address first!", {
      extensions: {
        code: "UNVERIFIED_EMAIL"
      }
    })
  }

  if (
    (opts.accessLevel === AccessLevel.ADMIN && !user?.administrator) ||
    (opts.accessLevel === AccessLevel.MODERATOR &&
      !user?.administrator &&
      !user?.moderator)
  )
    throw new GraphQLError(
      "You need to be a TPU Instance Administrator to perform this action.",
      {
        extensions: {
          code: "NOT_ADMIN"
        }
      }
    )

  const scopes = context.scopes
  if (!opts.scopes)
    throw new GraphQLError(
      "Please check code! Auth checker options object is not valid!"
    )
  if (!checkScope(opts.scopes, scopes)) {
    if (!opts.userOptional) {
      throw new GraphQLError(
        `Invalid scopes for API key (scope required: ${opts.scopes}, scopes granted: ${scopes}).`,
        {
          extensions: {
            code: "SCOPE_REQUIRED"
          }
        }
      )
    }
    context.user = null
    return true
  }

  if (opts.requiredExperiments?.length) {
    const core = Container.get(CoreService)
    let experiments
    if (user) {
      const dev = user ? user.administrator || user.moderator : false
      experiments = await core.getUserExperiments(user!!.id, dev, false, 0)
    } else {
      experiments = await core.getExperiments(false, false, 0)
    }
    for (const experiment of opts.requiredExperiments) {
      if (!experiments[experiment]) {
        throw new GraphQLError(
          `You need to be part of the ${experiment} experiment to do this.`,
          {
            extensions: {
              code: "EXPERIMENT_NOT_ALLOWED"
            }
          }
        )
      }
    }
  }
  const total = new Date().getTime() - start.getTime()
  if (total >= 10) {
    console.log(`AuthChecker took ${total}ms`)
  }
  return true
}
