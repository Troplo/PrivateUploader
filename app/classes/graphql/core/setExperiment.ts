import { Field, InputType, Int } from "type-graphql"
import { Experiments } from "@app/lib/experiments"

@InputType()
export class SetExperimentInput {
  @Field(() => Experiments)
  key: Experiments
  @Field(() => Int)
  value: number
  @Field(() => Int, {
    nullable: true,
    description: "Admin only."
  })
  userId: number
}
