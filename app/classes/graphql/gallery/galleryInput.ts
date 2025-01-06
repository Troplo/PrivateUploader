import { Field, InputType, Int, registerEnumType } from "type-graphql"
import { IsEnum, IsNumber, Max, Min } from "class-validator"

export enum Filter {
  ALL = "all",
  OWNED = "owned",
  SHARED = "shared",
  NO_COLLECTION = "notCollectivized",
  IMAGES = "image",
  VIDEOS = "video",
  GIFS = "gif",
  AUDIO = "audio",
  TEXT = "text",
  OTHER = "binary",
  PASTE = "paste",
  INCLUDE_METADATA = "metadata",
  INCLUDE_UNDELETABLE = "includeUndeletable",
  ONLY_UNDELETABLE = "undeletable",
  ADMIN_FLAGGED = "flagged"
}

export enum Sort {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  ADDED_AT = "addedAt",
  NAME = "name",
  SIZE = "fileSize"
}

export enum SearchMode {
  AFTER = "after",
  DURING = "during",
  USER = "user",
  SIZE = "fileSize",
  NAME = "name",
  META = "textMetadata",
  TYPE = "type",
  COLLECTION = "collection",
  BEFORE = "before",
  ORDER = "order"
}

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
  RANDOM = "RANDOM"
}

export enum Type {
  PERSONAL,
  STARRED,
  COLLECTION,
  AUTO_COLLECT,
  MQUEUE
}

registerEnumType(Filter, {
  name: "GalleryFilter",
  description: "The filter to apply to the gallery request"
})

registerEnumType(Sort, {
  name: "GallerySort",
  description: "The sort to apply to the gallery request"
})

registerEnumType(Order, {
  name: "GalleryOrder",
  description: "The order to apply to the gallery request"
})

registerEnumType(Type, {
  name: "GalleryType",
  description:
    "The type of gallery request, for example if it's the personal gallery page, or a Collection"
})

registerEnumType(SearchMode, {
  name: "GallerySearchMode",
  description: "The advanced search mode."
})

@InputType()
export class SearchModeInput {
  @Field(() => SearchMode)
  mode: SearchMode
  @Field(() => String, {
    nullable: true
  })
  value: string
}

@InputType()
export class GalleryInput {
  @Field({
    nullable: true,
    defaultValue: ""
  })
  search: string
  @Field(() => Int, {
    nullable: true,
    defaultValue: 1
  })
  page: number
  @IsNumber()
  @Min(1)
  @Max(100)
  @Field(() => Int, {
    nullable: true
  })
  limit: number
  @IsEnum(Filter, {
    each: true
  })
  @Field(() => [Filter], {
    nullable: true,
    defaultValue: [Filter.ALL]
  })
  filters?: Filter[]
  @IsEnum(Sort)
  @Field(() => Sort, {
    nullable: true,
    defaultValue: Sort.CREATED_AT
  })
  sort?: Sort
  @IsEnum(Order)
  @Field(() => Order, {
    nullable: true,
    defaultValue: Order.DESC
  })
  order?: Order
  @IsEnum(Type)
  @Field(() => Type, {
    nullable: true,
    defaultValue: Type.PERSONAL
  })
  type?: Type
  @IsNumber()
  @Field(() => Int, {
    nullable: true,
    description: "Requires Type to be COLLECTION"
  })
  collectionId?: number
  @Field({
    nullable: true,
    description: "Requires Type to be COLLECTION"
  })
  shareLink?: string
  @Field(() => [SearchModeInput], {
    nullable: true
  })
  advanced?: SearchModeInput[]
}
