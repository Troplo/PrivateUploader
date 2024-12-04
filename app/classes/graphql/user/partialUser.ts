import { Field, Float, Int, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { Badge } from "@app/models/badge.model"
import { Friend } from "@app/models/friend.model"
import { Plan } from "@app/models/plan.model"
import { Platform } from "@app/classes/graphql/user/platforms"
import { ProfileLayout } from "@app/classes/graphql/user/profileLayout"
import { Stats } from "@app/classes/graphql/core/core"
import { ThemeEngine } from "@app/classes/graphql/user/themeEngine"
import { UserInsights } from "@app/classes/graphql/user/insights"
import { FriendStatus } from "@app/classes/graphql/user/friends"
import { UserStatus, UserStoredStatus } from "@app/classes/graphql/user/status"
import { FriendNickname } from "@app/models/friendNickname"
import { Collection } from "@app/models/collection.model"
import { GraphQLJSON } from "graphql-scalars"

@ObjectType()
export class PartialUserBase {
  @Field()
  username: string
  @Field(() => Int)
  id: number
  @Field(() => DateType)
  createdAt: Date
  @Field()
  administrator: boolean
  @Field()
  moderator: boolean
  @Field({
    nullable: true
  })
  avatar?: string
  @Field()
  bot: boolean
  @Field(() => Boolean, {
    defaultValue: false,
    deprecationReason:
      "This field is no longer used after migration from Colubrina to Flowinity."
  })
  legacy?: boolean = false
}

export const partialUserBase = [
  "username",
  "id",
  "createdAt",
  "administrator",
  "moderator",
  "avatar",
  "bot"
]

@ObjectType()
export class PartialUserPublic {
  @Field()
  bot: boolean
  @Field()
  username: string
  @Field(() => Int)
  id: number
  @Field(() => DateType)
  createdAt: Date
  @Field()
  administrator: boolean
  @Field()
  moderator: boolean
  @Field({
    nullable: true
  })
  avatar?: string
  @Field(() => [Badge])
  badges: Badge[]
  @Field()
  banned: boolean
  @Field({
    nullable: true
  })
  banner: string
  @Field({
    nullable: true
  })
  description: string
  @Field(() => FriendStatus, {
    nullable: true
  })
  friend: FriendStatus
  @Field(() => [Friend], {
    nullable: true
  })
  friends: Friend[]
  @Field(() => UserInsights)
  insights: "everyone" | "friends" | "none"
  @Field(() => Plan)
  plan: Plan
  @Field(() => [Platform], {
    nullable: true
  })
  platforms: Platform[]
  @Field(() => ProfileLayout, {
    nullable: true
  })
  profileLayout: ProfileLayout
  @Field()
  publicProfile: boolean
  @Field(() => Float)
  quota: bigint
  @Field(() => Stats, {
    nullable: true
  })
  stats: Stats
  @Field(() => GraphQLJSON, {
    nullable: true
  })
  themeEngine: ThemeEngine
  @Field({
    nullable: true
  })
  xp: number
  @Field(() => [Collection])
  mutualCollections: Collection[]
}

export const partialUserPublic = [
  "username",
  "id",
  "createdAt",
  "administrator",
  "moderator",
  "avatar",
  "banned",
  "banner",
  "description",
  "insights",
  "plan",
  "profileLayout",
  "publicProfile",
  "quota",
  "themeEngine",
  "xp",
  "bot"
]

@ObjectType()
export class PartialUserFriend extends PartialUserBase {
  @Field(() => UserStatus)
  status: UserStatus
  @Field(() => String, {
    description: "The user's name color in Communications (v3).",
    nullable: true,
    deprecationReason: "Replaced by ranks"
  })
  nameColor: string | null
  @Field(() => FriendNickname, {
    nullable: true
  })
  nickname: FriendNickname | null
  @Field(() => Boolean, {
    nullable: true
  })
  blocked?: boolean
  @Field()
  bot: boolean
  @Field(() => [Platform], {
    nullable: true
  })
  platforms: Platform[] | null | undefined
}

@ObjectType()
export class PartialUserAuth extends PartialUserBase {
  @Field(() => Int)
  itemsPerPage: number
  @Field(() => UserStatus)
  status: UserStatus
  @Field(() => UserStoredStatus)
  storedStatus: UserStoredStatus
  @Field(() => Boolean)
  emailVerified: boolean
  @Field(() => Boolean)
  pulse: boolean
  @Field(() => Boolean)
  bot: boolean
  @Field(() => Boolean)
  banned: boolean
  @Field(() => DateType, {
    nullable: true
  })
  dateOfBirth: Date | null
  @Field(() => Int)
  planId: number
}

export const partialUserFriend = [...partialUserBase, "status", "nameColor"]
