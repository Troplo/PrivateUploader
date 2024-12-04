import { ExperimentType } from "@app/classes/graphql/core/experiments"
import { Resolver, FieldResolver, Root } from "type-graphql"
import { Service } from "typedi"

@Resolver(ExperimentType)
@Service()
export class ExperimentsResolver {
  @FieldResolver(() => Boolean)
  override(@Root() experiment: ExperimentType): boolean {
    return experiment.override ?? false
  }

  @FieldResolver(() => Boolean)
  force(@Root() experiment: ExperimentType): boolean {
    return experiment.force ?? false
  }
}
