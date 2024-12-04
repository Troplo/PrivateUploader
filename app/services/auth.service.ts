import { Container, Service } from "typedi"
import { Op } from "sequelize"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import argon2 from "argon2"
import utils from "@app/lib/utils"
import speakeasy from "@levminer/speakeasy"
import { CacheService } from "@app/services/cache.service"
import { Login } from "@app/types/auth"
import { Session } from "@app/models/session.model"
import { GraphQLError } from "graphql/error"
import {
  AuthValidationRequirements,
  AuthValidationResponse
} from "@app/classes/graphql/auth/requirements"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import {
  BanResponse,
  LoginResponse,
  LoginUser
} from "@app/classes/graphql/auth/login"
import { GqlError } from "@app/lib/gqlErrors"
import { AdminService } from "@app/services/admin.service"
import uaParser from "ua-parser-js"
import sanitizeHtml from "sanitize-html"
import { BanReason } from "@app/classes/graphql/user/ban"
import { Invite } from "@app/models/invite.model"
import { CoreService } from "@app/services/core.service"
import { OfficialInstJolt707 } from "@app/services/officialInst.jolt707"
import { Experiments } from "@app/lib/experiments"

@Service()
export class AuthService {
  constructor(private readonly adminService: AdminService) {}

  async passwordResetConfirm(code: string, password: string) {
    if (password?.length < 8) {
      throw Errors.PASSWORD_TOO_SHORT
    }
    const user = await User.findOne({
      where: {
        passwordResetCode: code,
        passwordResetExpiry: {
          [Op.gt]: new Date()
        }
      }
    })

    if (!user) {
      throw Errors.INVALID_PASSWORD_RESET_CODE
    }

    await user.update({
      password: await argon2.hash(password),
      passwordResetCode: null,
      passwordResetExpiry: null,
      flowinityId: null
    })

    return {
      username: user.username
    }
  }

  async passwordReset(
    email: string
  ): Promise<{ code: string; username: string; email: string }> {
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (!user) {
      throw Errors.INVALID_EMAIL
    }
    const code = await utils.generateAPIKey("email")
    await user.update({
      passwordResetCode: code,
      passwordResetExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
    })
    return {
      code,
      username: user.username,
      email: user.email
    }
  }

  async validateAuthMethod(
    requirements: AuthValidationRequirements,
    gql: boolean = true
  ): Promise<AuthValidationResponse> {
    if (!requirements.credentials.password && requirements.password) {
      throw gql
        ? new GqlError("INVALID_CREDENTIALS")
        : Errors.INVALID_CREDENTIALS
    }
    if (!requirements.password && !requirements.totp) {
      throw new GraphQLError("No requirements specified.")
    }
    const user = await User.findOne({
      where: {
        [Op.or]: requirements.userId
          ? [
              {
                id: requirements.userId
              }
            ]
          : [
              {
                username: requirements.username || ""
              },
              {
                email: requirements.username || ""
              }
            ]
      },
      attributes: [
        ...partialUserBase,
        "totpSecret",
        "totpEnable",
        "password",
        "alternatePasswords",
        "email",
        "banned"
      ]
    })
    if (!user) {
      throw gql
        ? new GqlError("INVALID_CREDENTIALS")
        : Errors.INVALID_CREDENTIALS
    }
    if (user.password === "sso-enforced" && requirements.password) {
      throw gql ? new GqlError("SSO_ENFORCED") : Errors.SSO_ENFORCED
    }
    let alternatePassword = null
    if (
      requirements.password &&
      !(await argon2.verify(
        user.password,
        <string>requirements.credentials.password
      ))
    ) {
      if (!user.alternatePasswords || !requirements.alternatePassword) {
        throw gql
          ? new GqlError("INVALID_CREDENTIALS")
          : Errors.INVALID_CREDENTIALS
      }
      for (const pw of user.alternatePasswords) {
        if (
          await argon2.verify(
            pw.password,
            <string>requirements.credentials.password
          )
        ) {
          alternatePassword = pw
          break
        }
      }
      if (!alternatePassword?.scopes) {
        throw gql
          ? new GqlError("INVALID_CREDENTIALS")
          : Errors.INVALID_CREDENTIALS
      }
    }
    if (
      user.totpEnable &&
      user.totpSecret &&
      !alternatePassword &&
      requirements.totp
    ) {
      try {
        let tokenValidation = speakeasy.totp.verify({
          secret: user.totpSecret,
          token: requirements.credentials.totp?.replaceAll(" ", "") || "",
          encoding: "base32"
        })
        if (!tokenValidation) {
          throw gql ? new GqlError("INVALID_TOTP") : Errors.INVALID_TOTP
        }
      } catch (e) {
        console.log(e)
        throw gql ? new GqlError("INVALID_TOTP") : Errors.INVALID_TOTP
      }
    }
    if (user.banned && !requirements.allowBanned) {
      throw gql ? new GqlError("USER_BANNED") : Errors.BANNED
    }
    return {
      alternatePassword,
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        banned: user.banned
      }
    }
  }

  async login(
    username: string,
    password: string,
    totp: string | undefined,
    platform: string | undefined,
    version: string | undefined,
    ip: string,
    userAgent: string,
    gql: boolean = false
  ): Promise<LoginResponse> {
    const validation = await this.validateAuthMethod(
      {
        credentials: {
          password,
          totp
        },
        username,
        password: true,
        alternatePassword: true,
        totp: true,
        allowBanned: true
      },
      gql
    )

    let session = await utils.createSession(
      validation.user.id,
      validation.alternatePassword?.scopes
        ? validation.alternatePassword.scopes
        : "*",
      "session"
    )

    this.sendSecurityEmail(
      validation.user,
      platform,
      version,
      ip,
      userAgent,
      validation.alternatePassword?.name
    )

    let ban: BanResponse | null = null

    if (validation.user.banned) {
      const userBanInformation = await User.findOne({
        where: {
          id: validation.user.id
        },
        attributes: ["banReason", "banReasonType", "pendingDeletionDate"]
      })
      if (userBanInformation) {
        ban = {
          message: userBanInformation.banReason,
          type: userBanInformation.banReasonType!,
          pendingDeletionDate: userBanInformation.pendingDeletionDate
        }
      }
    }

    return {
      user: validation.user,
      token: session,
      ban
    }
  }

  async register(
    username: string,
    password: string,
    email: string,
    invite: Invite | null,
    gql: boolean = false
  ): Promise<Login> {
    try {
      if (password.length < 8) {
        throw gql
          ? new GraphQLError("Password is too short!")
          : Errors.PASSWORD_TOO_SHORT
      }
      const user = await User.create({
        username,
        password: await argon2.hash(password),
        email,
        inviteId: invite?.id || null,
        planId: config.defaultPlanId || 1,
        emailVerified:
          !config.email.enabled ||
          invite?.email === email ||
          process.env.NODE_ENV === "test"
      })
      if (invite) {
        await Invite.update(
          { registerUserId: user.id },
          { where: { id: invite.id } }
        )

        const coreService = Container.get(CoreService)
        const experiment = await coreService.checkExperiment(
          invite.userId,
          Experiments.IAF_NAG,
          false,
          false
        )
        const eligible = experiment !== 4 && experiment !== 0
        if (eligible) {
          const billingService = Container.get(OfficialInstJolt707)
          await coreService.setExperiment(invite.userId, Experiments.IAF_NAG, 4)
          await billingService.grantMonth(invite.userId)
          await billingService.grantMonth(user.id)
        }
      }
      const session = await utils.createSession(user.id, "*", "session")
      const cacheService = Container.get(CacheService)
      //await cacheService.generateChatsCache(user.id)
      cacheService.generateAutoCollectCache(user.id)
      cacheService.generateUserStatsCache(user.id)
      cacheService.generateInsightsCache(user.id)
      await cacheService.generateCollectionCache(user.id)
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token: session
      }
    } catch (e) {
      console.log(e)
      if (!(e instanceof GraphQLError)) {
        throw gql
          ? new GraphQLError("Username is taken!")
          : Errors.USERNAME_TAKEN
      }
      throw e
    }
  }

  async logout(token: string) {
    const session = await Session.findOne({
      where: {
        token
      }
    })
    if (!session) {
      throw new GraphQLError("Invalid token")
    }
    await session.destroy()
    await redis.json.del(`session:${token}`)
    return true
  }

  async sendSecurityEmail(
    user: LoginUser,
    platform: string | undefined,
    version: string | undefined,
    ip: string,
    userAgent: string,
    scopedPasswordName?: string
  ) {
    let friendlyPlatform: string
    switch (platform) {
      case "TPUvNEXT":
        friendlyPlatform = "Flowinity Web"
        break
      case "android_kotlin":
        friendlyPlatform = "Flowinity Android"
        break
      case "TPUvFLUTTER":
        friendlyPlatform = "Flowinity"
        break
      case "TPUMac":
        friendlyPlatform = "Flowinity Mac"
        break
      case "TPUiOS":
        friendlyPlatform = "Flowinity iOS"
        break
      case "FlowinityElectron":
        friendlyPlatform = "Flowinity Desktop"
        break
      default:
        friendlyPlatform = "Flowinity Web"
        break
    }

    friendlyPlatform = `${friendlyPlatform}${version ? ` v${version}` : ""}`

    let browserAndOS = ""

    if (uaParser(userAgent).browser.name) {
      browserAndOS = `${uaParser(userAgent).browser.name} ${
        uaParser(userAgent).browser.version
      } on ${uaParser(userAgent).os.name} ${uaParser(userAgent).os.version}`
    } else {
      browserAndOS = "Unknown"
    }
    await this.adminService.sendEmail(
      {
        body: {
          name: user.username,
          intro: `A new login was detected on your account from <strong>${sanitizeHtml(
            friendlyPlatform,
            {
              allowedTags: [],
              allowedAttributes: {}
            }
          )}</strong><br>${
            scopedPasswordName
              ? ` with scoped password <strong>${sanitizeHtml(
                  scopedPasswordName,
                  {
                    allowedTags: [],
                    allowedAttributes: {}
                  }
                )}</strong>`
              : ""
          }<br><strong>IP address: ${ip}</strong><br><strong>Browser & Platform: ${sanitizeHtml(
            browserAndOS,
            {
              allowedTags: [],
              allowedAttributes: {}
            }
          )}</strong>`,
          action: [
            {
              instructions: `Not you? Click the button below to start account recovery.`,
              button: {
                color: "#0190ea", // Optional action button color
                text: "Reset password",
                link: config.hostnameWithProtocol + "/login"
              }
            }
          ],
          outro:
            "If you did not perform this action, please reset your password immediately and contact us at <a href='mailto:help@flowinity.com'>help@flowinity.com</a>.<br>If you did perform this action, you can ignore this email."
        }
      },
      user.email,
      `New ${config.siteName} login on ${friendlyPlatform} ${
        scopedPasswordName ? `with scoped password ${scopedPasswordName}` : ""
      }`
    )
  }

  async reactivateAccount(
    userId: number,
    gql: boolean = true
  ): Promise<Boolean> {
    const user = await User.findByPk(userId, {
      attributes: ["banned", "banReason", "banReasonType"]
    })

    if (!user)
      throw gql ? new GqlError("USER_NOT_FOUND") : Errors.USER_NOT_FOUND

    if (
      !user.banned ||
      user.banReasonType !== BanReason.PENDING_MANUAL_ACCOUNT_DELETION
    ) {
      throw gql
        ? new GraphQLError("You are not eligible to reactivate your account.")
        : Errors.INVALID_REACTIVATION
    }

    await User.update(
      {
        banned: false,
        banReason: null,
        banReasonType: null,
        pendingDeletionDate: null
      },
      {
        where: {
          id: userId
        }
      }
    )

    return true
  }
}
