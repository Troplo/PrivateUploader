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
import { UserUtilsService } from "@app/services/userUtils.service"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import { GraphQLScalarType } from "graphql/type"
import { Upload } from "@app/models/upload.model"
import {
  Filter,
  GalleryInput,
  Type
} from "@app/classes/graphql/gallery/galleryInput"
import { Collection } from "@app/models/collection.model"
import { GalleryService } from "@app/services/gallery.service"
import { PaginatedGalleryResponse } from "@app/classes/graphql/gallery/galleryResponse"
import { CollectionItem } from "@app/models/collectionItem.model"
import { GraphQLError } from "graphql/error"
import { CollectionService } from "@app/services/collection.service"
import { Authorization } from "@app/lib/graphql/AuthChecker"
//@ts-ignore
import { CollectionUser } from "@app/models/collectionUser.model"
import { Op } from "sequelize"
import { checkScope } from "@app/lib/auth"
import { GqlError } from "@app/lib/gqlErrors"
import { DeleteUploadInput } from "@app/classes/graphql/gallery/deleteUploadInput"
import { Success } from "@app/classes/graphql/generic/success"
import { UpdateUploadInput } from "@app/classes/graphql/gallery/updateUploadInput"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { Star } from "@app/models/star.model"
import {
  StarUploadInput,
  StarUploadResponse
} from "@app/classes/graphql/gallery/star"
import { pubSub } from "@app/lib/graphql/pubsub"
import { CreateUploadEvent } from "@app/classes/graphql/autoCollects/subscriptions/createUploadEvent"
import RateLimit from "@app/lib/graphql/RateLimit"

@Resolver(Upload)
@Service()
export class GalleryResolver {
  constructor(
    private galleryService: GalleryService,
    private userService: UserUtilsService,
    private collectionService: CollectionService
  ) {}

  @RateLimit({
    window: 10,
    max: 20
  })
  @Authorization({
    scopes: ["uploads.view", "collections.view", "starred.view"],
    userOptional: true
  })
  @Query(() => PaginatedGalleryResponse)
  async gallery(
    @Ctx() ctx: Context,
    @Arg("input")
    input: GalleryInput
  ) {
    if (input.type === Type.COLLECTION) {
      if (!input.collectionId && !input.shareLink)
        throw new GraphQLError(
          "Collection ID or ShareLink is required for collection gallery"
        )
      if (input.collectionId && !checkScope("collections.view", ctx.scopes)) {
        throw new GqlError("INVALID_SCOPE")
      }
      const collection = await this.collectionService.getCollectionOrShare(
        input.collectionId || input.shareLink!!,
        ctx.user?.id
      )
      if (!collection)
        throw new GraphQLError(
          "You don't have permission to view this collection"
        )
      input.collectionId = collection.id
    } else if (input.type === Type.AUTO_COLLECT) {
      if (!checkScope("collections.view", ctx.scopes)) {
        throw new GqlError("INVALID_SCOPE")
      }
      if (!input.collectionId)
        throw new GraphQLError(
          "You must specify `collectionId` for AutoCollects."
        )
      const collection = await this.collectionService.getCollectionOrShare(
        input.collectionId,
        ctx.user?.id
      )
      if (!collection)
        throw new GraphQLError(
          "You don't have permission to view this collection"
        )
    } else if (input.type === Type.MQUEUE) {
      if (!ctx.user?.moderator) {
        throw new GqlError("NOT_ADMIN")
      }
    } else if (!ctx.user) {
      throw new GraphQLError("You must be logged in to view the gallery")
    }
    if (
      input.type === Type.PERSONAL &&
      !checkScope("uploads.view", ctx.scopes)
    ) {
      throw new GqlError("INVALID_SCOPE")
    } else if (
      input.type === Type.STARRED &&
      !checkScope("starred.view", ctx.scopes)
    ) {
      throw new GqlError("INVALID_SCOPE")
    }
    // If the filter includes ADMIN_FLAGGED and it is not MQUEUE, throw an error
    if (
      input.filters?.includes(Filter.ADMIN_FLAGGED) &&
      input.type !== Type.MQUEUE
    ) {
      throw new GqlError("NOT_ADMIN")
    }
    return await this.galleryService.getGalleryV4(
      ctx.user?.id,
      input,
      input.limit || ctx.user?.itemsPerPage || 12,
      ctx.user?.id
        ? await this.userService.getAttribute(
            ctx.user.id,
            "excludedCollections"
          )
        : null
    )
  }

  @FieldResolver(() => [Collection])
  async collections(@Root() upload: Upload, @Ctx() ctx: Context) {
    if (!ctx.user) return []
    return await upload.$get("collections", {
      where: {
        [Op.or]: [
          {
            userId: ctx.user!!.id
          },
          {
            "$recipient.recipientId$": ctx.user.id
          }
        ]
      },
      include: [
        {
          model: CollectionUser,
          as: "recipient",
          attributes: ["recipientId"],
          required: false,
          where: {
            recipientId: ctx.user.id
          }
        }
      ]
    })
  }

  @RateLimit({
    window: 10,
    max: 5
  })
  @Authorization({
    scopes: "uploads.modify"
  })
  @Mutation(() => Success)
  async deleteUploads(
    @Ctx() ctx: Context,
    @Arg("input") input: DeleteUploadInput
  ): Promise<Success> {
    for (const id of input.items) {
      await this.galleryService.deleteUpload(id, ctx.user!!.id)
    }
    return { success: true }
  }

  @Authorization({
    scopes: "uploads.modify"
  })
  @Subscription(() => Int, {
    topics: ({ context }) => {
      return `DELETE_UPLOAD:${context.user!!.id}`
    }
  })
  onDeleteUpload(@Root() id: number) {
    return id
  }

  @RateLimit({
    window: 10,
    max: 5
  })
  @Authorization({
    scopes: "uploads.modify"
  })
  @Mutation(() => Upload)
  async updateUpload(
    @Ctx() ctx: Context,
    @Arg("input", () => UpdateUploadInput) input: UpdateUploadInput
  ) {
    const upload = await Upload.findOne({
      where: {
        id: input.uploadId,
        userId: ctx.user!!.id
      },
      include: [
        {
          model: Collection,
          as: "collections"
        }
      ]
    })
    if (!upload) throw new GqlError("ATTACHMENT_NOT_FOUND")
    await upload.update({
      name: input.name
    })
    pubSub.publish(`UPDATE_UPLOADS:${ctx.user!!.id}`, [upload.toJSON()])
    socket
      .of(SocketNamespaces.GALLERY)
      .to(ctx.user!!.id)
      .emit("update", [upload.toJSON()])
    return upload
  }

  @Authorization({
    scopes: "uploads.modify"
  })
  @Subscription(() => [Upload], {
    topics: ({ context }) => {
      return `UPDATE_UPLOADS:${context.user!!.id}`
    }
  })
  onUpdateUploads(@Root() uploads: Upload[]) {
    return uploads
  }

  @Authorization({
    scopes: "starred.modify"
  })
  @Mutation(() => StarUploadResponse)
  async starUpload(@Ctx() ctx: Context, @Arg("input") input: StarUploadInput) {
    return await this.galleryService.starUpload(input.attachment, ctx.user!!.id)
  }

  @FieldResolver(() => Star)
  async starred(@Root() upload: Upload, @Ctx() ctx: Context) {
    if (!ctx.user?.id) return null
    return await upload.$get("starred", {
      where: {
        userId: ctx.user?.id
      }
    })
  }

  @Authorization({
    scopes: "uploads.view"
  })
  @Subscription(() => CreateUploadEvent, {
    topics: ({ context }) => {
      return `CREATE_UPLOAD:${context.user!!.id}`
    },
    filter: ({ payload, context, args }) => {
      if (!args.input) return true
      if (
        args.input.collectionId &&
        !payload.upload.collections?.find(
          (c: Collection) => c.id === args.input.collectionId
        )
      )
        return false
      return args.input.type !== Type.STARRED
    }
  })
  onCreateUpload(
    @Root() uploads: CreateUploadEvent,
    @Arg("input", {
      nullable: true
    })
    input: GalleryInput
  ) {
    return uploads
  }

  @FieldResolver(() => User)
  async user(@Root() upload: Upload) {
    return await upload.$get("user")
  }

  @FieldResolver(() => CollectionItem)
  async items(@Root() upload: Upload) {
    return await upload.$get("items")
  }

  @FieldResolver(() => Boolean)
  async flagged(@Root() upload: Upload, @Ctx() ctx: Context) {
    if (!ctx.user?.moderator) return false
    return upload.flagged
  }
}
