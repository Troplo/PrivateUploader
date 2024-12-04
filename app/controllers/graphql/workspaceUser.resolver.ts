import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { GraphQLError } from "graphql/error"
import { Workspace } from "@app/models/workspace.model"
import { NoteService } from "@app/services/note.service"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { WorkspaceUser } from "@app/models/workspaceUser.model"
import {
  CreateWorkspaceFolderInput,
  DeleteWorkspaceItemInput,
  WorkspaceItemType
} from "@app/classes/graphql/workspaces/noteInput"
import { WorkspaceUserInput } from "@app/classes/graphql/workspaces/user"
import { Experiments } from "@app/lib/experiments"

@Resolver(WorkspaceUser)
@Service()
export class WorkspaceUserResolver {
  constructor(private workspaceService: NoteService) {}

  @FieldResolver(() => PartialUserBase)
  async user(@Root() workspaceUser: WorkspaceUser) {
    return await workspaceUser.$get("user")
  }

  @Authorization({
    scopes: ["workspaces.modify"],
    requiredExperiments: [Experiments.NOTE_COLLAB]
  })
  @Mutation(() => WorkspaceUser, {
    description:
      "Currently in beta and only available to people with experiment opt-in."
  })
  addWorkspaceUser(
    @Arg("input") input: WorkspaceUserInput,
    @Ctx() ctx: Context
  ) {
    return this.workspaceService.addUserToWorkspace(
      input.workspaceId,
      ctx.user!!.id,
      input.userId,
      input.write,
      input.configure,
      true
    )
  }
}
