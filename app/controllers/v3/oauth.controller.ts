import {
  Body,
  Delete,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post
} from "routing-controllers"
import { Service } from "typedi"
import { Auth, checkScope } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { OauthService } from "@app/services/oauth.service"
import { OauthSave } from "@app/models/oauthSave.model"
import { OauthUser } from "@app/models/oauthUser.model"
import { OauthApp } from "@app/models/oauthApp.model"

@Service()
@JsonController("/oauth")
export class OauthControllerV3 {
  constructor(private readonly oauthService: OauthService) {}

  @Get("")
  async getOauthApps(@Auth("*") user: User) {
    return await this.oauthService.getApps(user.id)
  }

  @Get("/scopeDefinitions")
  async getScopeDefinitions() {
    return [
      {
        id: "oauth.user.email",
        name: "Access your email address"
      },
      {
        id: "oauth.user.id",
        name: "Access your user ID"
      },
      {
        id: "oauth.user.username",
        name: "Access your username"
      },
      {
        id: "oauth.user.avatar",
        name: "Access your avatar"
      },
      {
        id: "oauth.save",
        name: "Cloud Save & Sync",
        description:
          "The app can save and sync application-specific data to your Flowinity account for cross-device access."
      }
    ]
  }

  @Get("/saves")
  async getSaves(
    @HeaderParam("x-tpu-app-id") verifyAppId?: string,
    @HeaderParam("x-tpu-app-secret") verifyAppSecret?: string
  ) {
    const app = await OauthApp.findOne({
      where: {
        id: verifyAppId,
        secret: verifyAppSecret
      }
    })
    if (!app || !verifyAppSecret || !verifyAppId)
      throw Errors.SECURITY_APP_ID_ERROR
    const saves = await OauthSave.findAll({
      where: {
        oauthAppId: app.id
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        }
      ]
    })
    return saves.map((save) => {
      return {
        id: save.id,
        appId: save.oauthAppId,
        data: save.data,
        history: save.history,
        user: save.user
      }
    })
  }

  @Get("/user")
  async getOauthUser(
    @Auth("oauth") userCtx: User,
    @HeaderParam("x-tpu-app-id") verifyAppId?: string
  ) {
    const user = await User.findByPk(userCtx.id, {
      attributes: ["id", "username", "email", "avatar"]
    })
    if (!user) throw Errors.USER_NOT_FOUND
    if (verifyAppId && verifyAppId !== userCtx.oauthAppId)
      throw Errors.SECURITY_APP_ID_ERROR
    const scopes = userCtx.scopes.split(",")
    const data: { [key: string]: any } = {}
    if (scopes.includes("oauth.user.email")) data.email = user.email
    if (scopes.includes("oauth.user.id")) data.id = user.id
    if (scopes.includes("oauth.user.username")) data.username = user.username
    if (scopes.includes("oauth.user.avatar"))
      data.avatar = config.hostnameWithProtocol + "/i/" + user.avatar
    if (scopes.includes("oauth.save") && userCtx.oauthAppId) {
      const save = await OauthSave.findOne({
        where: {
          userId: user.id,
          oauthAppId: userCtx.oauthAppId
        }
      })
      if (save) data.save = save.data
    }
    data.oauthAppId = userCtx.oauthAppId
    return data
  }

  @Post("/save")
  async saveOauthObject(
    @Auth("oauth") user: User,
    @Body() body: { data: any }
  ) {
    if (!user.oauthAppId) throw Errors.UNAUTHORIZED

    const app = await OauthApp.findByPk(user.oauthAppId)

    if (!checkScope("oauth.save", app!.scopes)) throw Errors.SCOPE_REQUIRED

    const save = await OauthSave.findOne({
      where: {
        userId: user.id,
        oauthAppId: user.oauthAppId
      }
    })
    if (save) {
      await save.update({
        data: body.data,
        history: [
          {
            data: save.data,
            createdAt: new Date().toISOString()
          },
          ...(save.history || []).slice(0, 11)
        ]
      })
    } else {
      await OauthSave.create({
        userId: user.id,
        oauthAppId: user.oauthAppId,
        data: body.data,
        history: [
          {
            data: body.data,
            createdAt: new Date().toISOString()
          }
        ]
      })
    }
    return
  }

  @Get("/:oauthAppId")
  async getOauthAppConfig(
    @Auth("oauth.authorize", false) user: User,
    @Param("oauthAppId") oauthAppId: string
  ) {
    const app = await this.oauthService.getApp(oauthAppId, user?.id)
    if (!app) throw Errors.NOT_FOUND
    return {
      ...app.toJSON(),
      secret: undefined
    }
  }

  @Post("/:oauthAppId/authorize")
  async authorize(
    @Auth("oauth.authorize") user: User,
    @Param("oauthAppId") oauthAppId: string,
    @Body() body: { scopes: string }
  ) {
    const app = await this.oauthService.getApp(oauthAppId, user.id)
    if (!app) throw Errors.NOT_FOUND

    if (body.scopes !== app.scopes) throw Errors.SECURITY_SCOPE_ERROR

    if (app.private && app.userId !== user.id) {
      const access = await OauthUser.findOne({
        where: {
          oauthAppId,
          userId: user.id,
          active: true
        }
      })
      if (!access) throw Errors.PRIVATE_APP
    }

    return {
      token: await this.oauthService.getOrCreateOauthToken(
        app.id,
        user.id,
        true,
        body.scopes
      )
    }
  }

  @Delete("/:oauthAppId/authorize")
  async deauthorize(
    @Auth("*") user: User,
    @Param("oauthAppId") oauthAppId: string
  ) {
    const app = await this.oauthService.getApp(oauthAppId, user.id)
    if (!app) throw Errors.NOT_FOUND

    await this.oauthService.deauthorize(app.id, user.id)
  }
}
