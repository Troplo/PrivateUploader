// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { Workspace } from "@/models/workspace";
import { Note } from "@/models/note";
import { useRoute } from "vue-router";
import { NoteQuery } from "@/graphql/workspaces/note.graphql";
import { isNumeric } from "@/plugins/isNumeric";
import {
  SaveNoteBlockMutation,
  SaveNoteMutation
} from "@/graphql/workspaces/saveNote.graphql";
import {
  SaveNoteInput,
  UpdateNoteEvent,
  UpdateNoteEventInput,
  UpdateNoteEventType,
  WorkspaceNote
} from "@/gql/graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { WorkspacesQuery } from "@/graphql/workspaces/workspaces.graphql";
import { BlockAPI } from "@flowinity/editorjs";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client/core";

export interface WorkspacesState {
  items: Workspace[];
  workspace: Workspace | null;
  recent: Workspace[];
  versionHistory: boolean;
  share: {
    dialog: boolean;
    loading: boolean;
  };
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: () =>
    ({
      items: [],
      workspace: null,
      recent: [],
      versionHistory: false,
      share: {
        dialog: false,
        loading: false
      }
    } as WorkspacesState),
  actions: {
    async getNote(id: string | number) {
      const {
        data: { note }
      } = await useApolloClient().client.query({
        query: NoteQuery,
        variables: {
          input: {
            id: isNumeric(id)
              ? typeof id === "number"
                ? id
                : parseInt(id)
              : undefined,
            shareLink: !isNumeric(id) ? id : undefined
          }
        },
        fetchPolicy: "no-cache"
      });
      return note;
    },
    async getRecent() {
      const { data } = await axios().get("/notes/recent");
      this.recent = data;
      return data;
    },
    async getWorkspaces() {
      const {
        data: { workspaces }
      } = await useApolloClient().client.query({
        query: WorkspacesQuery,
        fetchPolicy: "network-only"
      });
      this.items = workspaces;
    },
    selectWorkspace(id: number) {
      const workspace = this.items.find((w) => w.id === id);
      if (!workspace) return;
      this.workspace = workspace;
      localStorage.setItem(
        "selectedWorkspace",
        JSON.stringify({
          id: workspace.id,
          name: workspace.name
        })
      );
    },
    async refreshWorkspace() {
      await this.selectWorkspace(<number>this.workspace?.id);
    },
    async init() {
      await this.getWorkspaces();
      const selectedWorkspace = localStorage.getItem("selectedWorkspace");
      if (selectedWorkspace) {
        this.selectWorkspace(JSON.parse(selectedWorkspace).id);
      }
    },
    async saveNote(data: WorkspaceNote, manualSave = false) {
      await useApolloClient().client.mutate({
        mutation: SaveNoteMutation,
        variables: {
          input: {
            id: parseInt(this.$app.$route.params.id),
            data,
            manualSave
          } as SaveNoteInput
        }
      });
    },
    async saveBlock(data: BlockAPI, type: UpdateNoteEventType) {
      if (!data && type !== UpdateNoteEventType.Delete) {
        return;
      }
      await useApolloClient().client.mutate({
        mutation: SaveNoteBlockMutation,
        variables: {
          input: {
            blockId: data?.id,
            id: parseInt(this.$app.$route.params.id),
            data: data,
            type: type
          } as UpdateNoteEventInput
        }
      });
    }
  },
  getters: {
    isWorkspaces() {
      return (
        this.$router.currentRoute.value.path.startsWith("/workspaces") ||
        this.$router.currentRoute.value.path.startsWith("/notes")
      );
    },
    recentOverall() {
      const notes: Note[] = this.recent
        .map((workspace) => workspace.folders.map((folder) => folder.notes))
        .flat(2)
        .sort((a, b) => {
          if (a.updatedAt > b.updatedAt) return -1;
          if (a.updatedAt < b.updatedAt) return 1;
          return 0;
        });
      return notes.slice(0, 12);
    }
  }
});
