import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription
} from "type-graphql"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { GraphQLError } from "graphql/error"
import { NoteService } from "@app/services/note.service"
import { Note } from "@app/models/note.model"
import { NoteVersion } from "@app/models/noteVersion.model"
import {
  CreateNoteInput,
  NoteInput,
  SaveNoteInput
} from "@app/classes/graphql/workspaces/noteInput"
import {
  CollabEventType,
  NoteCollabPosition,
  NoteCollabPositionInput,
  UpdateNoteEvent,
  UpdateNoteEventInput
} from "@app/classes/graphql/workspaces/note"
import { Experiments } from "@app/lib/experiments"

@Resolver(Note)
@Service()
export class NoteResolver {
  constructor(private workspaceService: NoteService) {}

  @FieldResolver(() => [NoteVersion])
  async versions(@Root() note: Note, @Ctx() ctx: Context) {
    if (ctx.meta.shareLink) return []
    return note.$get("versions")
  }

  @Authorization({
    scopes: ["workspaces.view"],
    userOptional: true
  })
  @Query(() => Note, {
    nullable: true
  })
  async note(
    @Arg("input", () => NoteInput) input: NoteInput,
    @Ctx() ctx: Context
  ): Promise<Note | null> {
    if (!input.id && !input.shareLink)
      throw new GraphQLError("No id or shareLink provided")
    try {
      if (input.shareLink) ctx.meta.shareLink = true
      return await this.workspaceService.getNote(
        input.id || input.shareLink || 0,
        ctx.user?.id
      )
    } catch {
      return null
    }
  }

  @Authorization({
    scopes: ["workspaces.modify"]
  })
  @Mutation(() => Note, {
    deprecationReason:
      "Use `saveNoteBlock` instead to support collaborative editing."
  })
  async saveNote(
    @Arg("input", () => SaveNoteInput) input: SaveNoteInput,
    @Ctx() ctx: Context
  ): Promise<Note> {
    try {
      return await this.workspaceService.saveNote(
        input.id,
        input.data,
        ctx.user!!.id,
        input.manualSave,
        input.name
      )
    } catch {
      throw new GraphQLError(
        "Failed to save note. Perhaps you don't have access?"
      )
    }
  }

  @Authorization({
    scopes: ["workspaces.create"]
  })
  @Mutation(() => Note)
  async createNote(
    @Arg("input", () => CreateNoteInput) input: CreateNoteInput,
    @Ctx() ctx: Context
  ) {
    try {
      return await this.workspaceService.createNote(
        input.name,
        input.workspaceFolderId,
        ctx.user!!.id
      )
    } catch {
      throw new GraphQLError(
        "Failed to create note. Perhaps you don't have access to the Workspace?"
      )
    }
  }

  @Authorization({
    scopes: ["workspaces.modify"]
  })
  @Mutation(() => Note, {
    description: "Toggle the ShareLink for a Note."
  })
  async toggleNoteShare(
    @Arg("input", () => Int, {
      description: "ID of Note"
    })
    input: number,
    @Ctx() ctx: Context
  ) {
    await this.workspaceService.toggleShareLink(input, ctx.user!!.id)
    return await this.note(
      {
        id: input
      },
      ctx
    )
  }

  @Authorization({
    scopes: ["workspaces.view"]
  })
  @Subscription(() => UpdateNoteEvent, {
    description: "Subscribe to Note updates.",
    topics: ({ context }) => {
      return `NOTE_UPDATE:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      return payload.id === args.id || payload.shareLink === args.shareLink
    }
  })
  onUpdateNote(
    @Root() data: UpdateNoteEvent,
    @Arg("id", () => Int, { nullable: true }) id: number,
    @Arg("shareLink", { nullable: true }) shareLink: string
  ) {
    return data
  }

  @Authorization({
    scopes: ["workspaces.modify"],
    requiredExperiments: [Experiments.NOTE_COLLAB]
  })
  @Mutation(() => Boolean)
  async saveNoteBlock(
    @Arg("input", () => UpdateNoteEventInput) input: UpdateNoteEventInput,
    @Ctx() ctx: Context
  ) {
    try {
      await this.workspaceService.saveNoteBlock({
        ...input,
        userId: ctx.user!!.id,
        shareLink: null
      })
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  @Authorization({
    scopes: ["workspaces.modify"],
    requiredExperiments: [Experiments.NOTE_COLLAB]
  })
  @Mutation(() => Boolean)
  async saveNoteCollabPosition(
    @Arg("input", () => NoteCollabPositionInput) input: NoteCollabPositionInput,
    @Ctx() ctx: Context
  ) {
    try {
      await this.workspaceService.saveNoteCollabPosition({
        ...input,
        userId: ctx.user!!.id,
        shareLink: null,
        type: CollabEventType.JOIN
      })
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  @Authorization({
    scopes: ["workspaces.view"]
  })
  @Subscription(() => NoteCollabPosition, {
    description: "Subscribe to Note collaborative user positions.",
    topics: ({ context }) => {
      return `NOTE_POSITION_UPDATE:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      return (
        payload.noteId === args.noteId || payload.shareLink === args.shareLink
      )
    }
  })
  onNoteCollabPosition(
    @Root() data: NoteCollabPosition,
    @Arg("noteId", () => Int, { nullable: true }) noteId: number,
    @Arg("shareLink", { nullable: true }) shareLink: string
  ) {
    return data
  }
}
