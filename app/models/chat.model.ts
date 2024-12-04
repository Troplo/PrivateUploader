import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { ChatRank } from "@app/models/chatRank.model"
import { Message } from "@app/models/message.model"
import { ChatInvite } from "@app/models/chatInvite.model"
import { ChatEmoji } from "@app/models/chatEmoji.model"
import { ChatTypingEvent } from "@app/classes/graphql/chat/events/typing"

@ObjectType()
@Table
export class Chat extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column({
    type: DataType.ENUM("direct", "group", "channel")
  })
  type: "direct" | "group" | "channel"

  @Field()
  @Column
  name: string

  @Field({
    nullable: true,
    description:
      "Null if the chat is owned by a Colubrina legacy user, or the account was deleted."
  })
  @Column
  userId: number

  @Field({
    nullable: true
  })
  @Column
  icon: string

  @Field()
  @Column
  createdAt: Date

  @Field()
  @Column
  updatedAt: Date

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  intent: null | string

  @Field(() => PartialUserBase, {
    nullable: true,
    description:
      "Null if the chat is owned by a Colubrina legacy user, or the account was deleted."
  })
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => ChatAssociation, {
    nullable: true
  })
  @HasOne(() => ChatAssociation, "chatId")
  association: ChatAssociation

  @Field(() => [ChatAssociation])
  @HasMany(() => ChatAssociation, "chatId")
  users: ChatAssociation[]

  @Field(() => String, {
    nullable: true
  })
  @Column({
    type: DataType.TEXT
  })
  description: string | null

  @Field(() => String, {
    nullable: true
  })
  @Column({
    type: DataType.STRING
  })
  background: string | null

  recipient: any
  @Field(() => Int, {
    nullable: true
  })
  unread: number | undefined

  @Field(() => String, {
    nullable: true,
    deprecationReason: "Use `sortDate` instead."
  })
  _redisSortDate: string | undefined

  @Field(() => String, {
    nullable: true
  })
  sortDate: string | undefined

  @Field(() => [ChatRank])
  @HasMany(() => ChatRank, "chatId")
  ranks: ChatRank[]

  @Field(() => [Message])
  @HasMany(() => Message, "chatId")
  messages: Message[]

  @Field(() => [ChatInvite], {
    description:
      "Array is empty if you don't have the `OVERVIEW` permission in the chat."
  })
  @HasMany(() => ChatInvite, "chatId")
  invites: ChatInvite[]

  @Field(() => [ChatEmoji], {
    nullable: true
  })
  @HasMany(() => ChatEmoji, "chatId")
  emoji: ChatEmoji

  @Field(() => Int)
  usersCount: number

  @Field(() => Int)
  onlineCount: number

  @Field(() => [ChatTypingEvent])
  typing: ChatTypingEvent[]
}
