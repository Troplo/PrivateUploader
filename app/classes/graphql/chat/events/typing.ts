import { Field, Float, ObjectType } from "type-graphql"
import { PartialUserFriend } from "@app/classes/graphql/user/partialUser"

@ObjectType()
export class ChatTypingEvent {
  @Field()
  userId: number
  @Field()
  chatId: number
  @Field(() => PartialUserFriend)
  user: PartialUserFriend
  @Field(() => Float, {
    nullable: true
  })
  expires: number
}
