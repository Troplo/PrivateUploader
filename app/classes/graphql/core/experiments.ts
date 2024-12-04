import { Field, InputType, Int, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { Experiments } from "@app/lib/experiments"

@ObjectType()
export class ExperimentType {
  @Field(() => Experiments)
  id: Experiments
  @Field(() => Int)
  value: boolean | number
  @Field({
    nullable: true
  })
  description: string
  @Field(() => DateType, {
    nullable: true
  })
  createdAt: Date
  @Field({
    nullable: true
  })
  refresh?: boolean
  @Field(() => [Int])
  versions: number[]
  @Field({
    defaultValue: false
  })
  override: boolean
  @Field({
    defaultValue: false
  })
  force: boolean
}

@InputType("ExperimentOverrideInput")
@ObjectType()
export class ExperimentOverride {
  @Field()
  id: string
  @Field(() => Int)
  value: number
  @Field({
    defaultValue: false
  })
  force: boolean
  @Field(() => Int, {
    nullable: true
  })
  userId: number | null
}
