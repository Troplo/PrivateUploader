import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Length,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { Chat } from "@app/models/chat.model"
import { Field, Int, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { MessageType } from "@app/classes/graphql/chat/message"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { ChatEmoji } from "@app/models/chatEmoji.model"
import { EmbedDataV2 } from "@app/classes/graphql/chat/embeds"
import { ReadReceipt } from "@app/classes/graphql/chat/readReceiptSubscription"

@ObjectType()
@Table
export class Message extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field(() => Int)
  @Column
  chatId: number

  @Field(() => Int, {
    nullable: true
  })
  @Column
  userId: number

  @Field(() => String, {
    nullable: true
  })
  @Length({
    min: 0,
    max: 4000,
    msg: "Your message must be below 4000 characters and contain content."
  })
  @Column({
    type: DataType.TEXT
  })
  content: string

  @Field(() => MessageType)
  @Column({
    type: DataType.ENUM(
      "message",
      "leave",
      "join",
      "pin",
      "administrator",
      "rename",
      "system"
    )
  })
  type: MessageType

  @Field(() => [EmbedDataV2])
  @Column({
    type: DataType.JSON,
    defaultValue: []
  })
  embeds: EmbedDataV2[]

  @Field()
  @Column
  edited: boolean

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  editedAt: Date

  @Field(() => Int, {
    nullable: true
  })
  @Column
  replyId: number

  @Field()
  @Column({
    defaultValue: false
  })
  pinned: boolean

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => Message, {
    nullable: true
  })
  @BelongsTo(() => Message, "replyId")
  reply: Message

  @Field()
  @Column({
    type: DataType.VIRTUAL,
    get(this: Message) {
      return false
    }
  })
  pending: boolean

  @Field()
  @Column({
    type: DataType.VIRTUAL,
    get(this: Message) {
      return false
    }
  })
  error: boolean

  @Field(() => [ReadReceipt])
  @HasMany(() => ChatAssociation, "lastRead")
  readReceipts: ChatAssociation[]

  @Field(() => Chat)
  @BelongsTo(() => Chat, "chatId")
  chat: Chat

  @Field(() => [ChatEmoji], {
    nullable: true
  })
  emoji: ChatEmoji[]
}
