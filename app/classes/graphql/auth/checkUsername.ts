import { MaxLength, MinLength, Matches } from "class-validator"
import { Field, InputType } from "type-graphql"

@InputType()
export class CheckUsernameInput {
  @MaxLength(32)
  @MinLength(2)
  @Matches(/^[A-Za-z0-9.\-_]+$/, {
    message: "Username can only contain alphanumeric characters including .-_"
  })
  @Field()
  username: string
}
