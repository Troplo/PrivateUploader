import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  DefaultScope,
  HasMany,
  HasOne,
  IsEmail,
  Length,
  Model,
  Table,
  Unique
} from "sequelize-typescript"
import { Plan } from "@app/models/plan.model"
import { Theme } from "@app/models/theme.model"
import { Domain } from "@app/models/domain.model"
import { Subscription } from "@app/models/subscription.model"
import { Experiment } from "@app/models/experiment.model"
import { Badge } from "@app/models/badge.model"
import { BadgeAssociation } from "@app/models/badgeAssociation.model"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { FriendNickname } from "@app/models/friendNickname"
import { AlternatePassword as AlternatePasswordType } from "@app/types/auth"
import { DefaultProfileLayout } from "@app/classes/UserV3ProfileLayout"
import { Integration } from "@app/models/integration.model"
import { Field, Float, Int, ObjectType } from "type-graphql"
import { ThemeEngine } from "@app/classes/graphql/user/themeEngine"
import { AlternatePassword } from "@app/classes/graphql/user/alternatePassword"
import { Notification } from "@app/models/notification.model"
import { ProfileLayout } from "@app/classes/graphql/user/profileLayout"
import { DateType } from "@app/classes/graphql/serializers/date"
import { Session } from "@app/models/session.model"
import { UserInsights } from "@app/classes/graphql/user/insights"
import { Stats } from "@app/classes/graphql/core/core"
import { UserStatus, UserStoredStatus } from "@app/classes/graphql/user/status"
import { BlockedUser } from "@app/models/blockedUser.model"
import { GraphQLJSON } from "graphql-scalars"
import {
  FriendRequestPrivacy,
  GroupPrivacy
} from "@app/classes/graphql/user/privacy"
import { HomeWidgets } from "@app/classes/graphql/home/homeWidgets"
import { BanReason } from "@app/classes/graphql/user/ban"

@DefaultScope(() => ({
  attributes: {
    exclude: [
      "password",
      "totpSecret",
      "passwordResetEnabled",
      "passwordResetCode",
      "passwordResetExpiry",
      "alternatePasswords",
      "mailToken",
      "fcmNotificationKey",
      "dateOfBirth"
    ]
  }
}))
@ObjectType()
@Table
export class User extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT
  })
  id: number

  @Field(() => DateType)
  @Column({
    type: DataType.DATE
  })
  createdAt: Date

  @Field(() => DateType)
  @Column({
    type: DataType.DATE
  })
  updatedAt: Date

  @Field()
  @AllowNull(false)
  @Unique({
    msg: "Username is already taken.",
    name: "USERNAME_TAKEN"
  })
  @Length({
    msg: "Length of your username must be between 2-32 characters.",
    min: 2,
    max: 32
  })
  @Column
  username: string

  @Field()
  @AllowNull(false)
  @Unique
  @IsEmail
  @Column
  email: string

  @Column
  password: string

  @AllowNull(false)
  @Default(false)
  @Column
  passwordResetEnabled: boolean

  @Column
  passwordResetCode: string

  @Column({
    type: DataType.DATE
  })
  passwordResetExpiry: Date

  @Field({
    nullable: true
  })
  @Length({
    msg: "Length of your description must be between 0-255 characters.",
    min: 0,
    max: 255
  })
  @Column
  description?: string

  @Field()
  @Default(false)
  @Column
  administrator: boolean

  @Field()
  @Default(true)
  @Column
  darkTheme: boolean

  @Field()
  @Default(false)
  @Column
  emailVerified: boolean

  @Field()
  @Default(false)
  @Column
  banned: boolean

  @Field({
    nullable: true
  })
  @Column
  inviteId?: number

  @Default({
    enabled: false,
    color: "#0190ea",
    siteName: "TroploPrivateUploader",
    siteURL: "https://images.flowinity.com",
    author: "",
    authorURL: null,
    title: "[attachment.name]",
    description: "Uploaded by [user.username]",
    customFields: []
  })
  @Column({
    type: DataType.JSON
  })
  openGraph: OpenGraph

  @Field()
  @Default(false)
  @Column
  discordPrecache: boolean

  @Field({
    nullable: true
  })
  @AllowNull
  @Column
  avatar?: string

  @Field({
    nullable: true,
    deprecationReason: "Subdomains are no longer available as of TPUv2/NEXT."
  })
  @Column
  subdomainId?: number

  @Field()
  @Default(1)
  @Column
  domainId: number

  @Field()
  @Default(false)
  @Column
  totpEnable: boolean

  @AllowNull
  @Column
  totpSecret?: string

  @Field(() => Float, {
    description: "How much the user has uploaded in bytes."
  })
  @Default(0)
  @Column
  quota: bigint

  @Field({
    deprecationReason:
      "Hidden upload usernames are no longer available as of TPUv2/NEXT."
  })
  @Default(false)
  @Column
  uploadNameHidden: boolean

  @Field({
    deprecationReason:
      "Invisible URLs are no longer available as of TPUv2/NEXT."
  })
  @Default(false)
  @Column
  invisibleURLs: boolean

  @Field()
  @Default(false)
  @Column
  moderator: boolean

  @Field({
    description:
      "Subscriptions are no longer used as they were in TPUv1, and are now used to store metadata for permanent Gold subscriptions.",
    nullable: true
  })
  @Default(1)
  @Column
  subscriptionId: number

  @Field({
    deprecationReason: "Fake paths are no longer available as of TPUv2/NEXT.",
    nullable: true
  })
  @AllowNull
  @Column
  fakePath?: string

  @Field({
    deprecationReason:
      "Replaced with `themeEngine`, used in legacy clients such as legacy.privateuploader.com."
  })
  @Default(1)
  @Column
  themeId: number

  @Field()
  @Default(12)
  @Column({
    validate: {
      min: 12,
      max: 72
    }
  })
  itemsPerPage: number

  @Field({
    description: "UserV2 banner.",
    nullable: true
  })
  @Column
  banner?: string

  @Field(() => [AlternatePassword], {
    description:
      "Ability to login with more then 1 password with different scopes.",
    nullable: true
  })
  @Column({
    type: DataType.JSON,
    defaultValue: []
  })
  alternatePasswords: AlternatePasswordType[]

  @Field(() => UserStatus, {
    description: "User status/presence shown to other users."
  })
  @Column({
    type: DataType.ENUM("online", "idle", "offline", "busy")
  })
  status: "online" | "idle" | "offline" | "busy" | "unknown" | UserStatus

  @Field(() => UserStoredStatus, {
    description:
      "User status/presence that has `invisible` and is shown to the current user."
  })
  @Column({
    type: DataType.ENUM("online", "idle", "busy", "invisible")
  })
  storedStatus: "online" | "idle" | "busy" | "invisible" | UserStoredStatus

  @Field()
  @Column({
    type: DataType.ENUM("celsius", "fahrenheit", "kelvin"),
    defaultValue: "celsius"
  })
  weatherUnit: "celsius" | "fahrenheit" | "kelvin"

  @Column
  emailToken?: string

  @Column
  mailToken?: string

  @Field(() => GraphQLJSON, {
    nullable: true
  })
  @Column({
    type: DataType.JSON
  })
  themeEngine: ThemeEngine | null

  @Field(() => UserInsights)
  @Column({
    type: DataType.ENUM("everyone", "friends", "nobody"),
    defaultValue: "nobody"
  })
  insights: "everyone" | "friends" | "nobody"

  @Field(() => GraphQLJSON, {
    nullable: true
  })
  @Column({
    type: DataType.JSON,
    defaultValue: new DefaultProfileLayout()
  })
  profileLayout: ProfileLayout

  @Field(() => [Number], {
    description:
      "Collections that are excluded from the Collections filter in Gallery.",
    nullable: true
  })
  @Column({
    type: DataType.JSON,
    defaultValue: []
  })
  excludedCollections: number[] | null

  @Field()
  @Column({
    type: DataType.STRING,
    defaultValue: "en"
  })
  language: string

  @Field()
  @Column
  publicProfile: boolean

  @Field(() => Float, {
    description:
      "How much the user has donated to PrivateUploader. (Likely unused in unofficial instances.)"
  })
  @Column({
    type: DataType.BIGINT
  })
  xp: bigint

  @Column({
    type: DataType.TEXT
  })
  fcmNotificationKey: string

  @Field(() => Boolean, {
    nullable: true
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  privacyPolicyAccepted: boolean

  @Field(() => String, {
    description: "The user's name color in Communications (v3).",
    nullable: true,
    deprecationReason: "Replaced by ranks"
  })
  @Column
  nameColor: string

  @Field({
    description: "Whether the user has TPU Pulse Telemetry enabled."
  })
  @Column
  pulse: boolean

  @Field(() => GroupPrivacy, {
    description: "Whether the user can be added directly into groups."
  })
  @Column({
    type: DataType.ENUM("FRIENDS", "NOBODY")
  })
  groupPrivacy: GroupPrivacy

  @Field(() => FriendRequestPrivacy, {
    description: "Whether the user can be sent a friend request."
  })
  @Column({
    type: DataType.ENUM("EVERYONE", "NOBODY")
  })
  friendRequests: FriendRequestPrivacy

  @Field({
    description: "Whether the user is a bot user."
  })
  @Column
  bot: boolean

  @Field(() => HomeWidgets, {
    nullable: true
  })
  @Column({
    type: DataType.JSON,
    defaultValue: null
  })
  homeWidgets: HomeWidgets | null

  @Field(() => DateType, {
    nullable: true
  })
  @Column({
    type: DataType.DATE
  })
  dateOfBirth: Date | null

  @Field(() => DateType, {
    nullable: true
  })
  @Column({
    type: DataType.DATE
  })
  pendingDeletionDate: Date | null

  @Field(() => BanReason, {
    nullable: true
  })
  @Column({
    type: DataType.ENUM(
      "OTHER",
      "PENDING_MANUAL_ACCOUNT_DELETION",
      "ILLEGAL_CONTENT",
      "SPAM",
      "HARASSMENT",
      "UNDER_AGE"
    )
  })
  banReasonType: BanReason | null

  @Field(() => String, {
    nullable: true
  })
  @Column({
    type: DataType.TEXT
  })
  banReason: string | null

  @Field(() => Plan, {
    nullable: true
  })
  @BelongsTo(() => Plan, "planId")
  plan: Plan

  @Field(() => Int, {
    nullable: true
  })
  planId: number

  @BelongsTo(() => Theme, "themeId")
  theme: Theme

  @Field(() => Domain, {
    nullable: true
  })
  @BelongsTo(() => Domain, "domainId")
  domain: Domain

  @Field(() => Subscription, {
    nullable: true
  })
  @HasOne(() => Subscription, "userId")
  subscription: Subscription

  @Field(() => [Experiment], {
    nullable: true
  })
  @HasMany(() => Experiment, "userId")
  experiments: Experiment[]

  @Field(() => [Badge])
  @BelongsToMany(() => Badge, () => BadgeAssociation, "userId", "badgeId")
  badges: Badge[]

  @Field(() => [AutoCollectRule])
  @HasMany(() => AutoCollectRule, "userId")
  autoCollectRules: AutoCollectRule[]

  @Field(() => String, {
    nullable: true,
    description:
      "The user's scopes assigned to the API key used. In format like `user.view,user.modify` which belong to `Scope`."
  })
  scopes: string

  @Field(() => Stats, {
    nullable: true
  })
  stats: Stats

  @Field({
    nullable: true
  })
  oauthAppId?: string

  @Field(() => [FriendNickname], {
    nullable: true
  })
  @HasOne(() => FriendNickname, "friendId")
  nickname: FriendNickname

  @Field(() => [Integration])
  @HasMany(() => Integration, "userId")
  integrations: Integration[]

  @Field(() => [Notification])
  @HasMany(() => Notification, "userId")
  notifications: Notification[]

  @Field(() => [Session])
  @HasMany(() => Session, "userId")
  sessions: Session[]

  @Field({
    nullable: true,
    description:
      "How many AutoCollect approvals the user needs to approve/reject."
  })
  pendingAutoCollects: number

  @HasOne(() => BlockedUser, "userId")
  blocked?: BlockedUser

  @Field(() => Boolean, {
    defaultValue: false
  })
  legacy?: boolean = false

  @Field(() => Boolean, {
    defaultValue: false
  })
  forceAgeVerification: boolean = false

  @Field(() => Boolean, {
    defaultValue: false
  })
  canAccessRestrictedContent: boolean = false
}
