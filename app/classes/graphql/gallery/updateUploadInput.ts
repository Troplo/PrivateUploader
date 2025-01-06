import { Field, InputType, Int } from "type-graphql"
import { MaxLength, MinLength } from "class-validator"

@InputType()
export class UpdateUploadInput {
  @Field(() => Int)
  uploadId: number
  @Field(() => String)
  @MinLength(3)
  @MaxLength(400)
  name: string
}

@InputType()
export class UpdateAdminUploadInput {
  @Field(() => Int)
  uploadId: number
  @Field(() => Boolean)
  approved: boolean
  @Field(() => Boolean)
  flagged: boolean
}
