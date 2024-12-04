// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { useRoute } from "vue-router";
import { isNumeric } from "@/plugins/isNumeric";
import {
  CreateNoteDocument,
  NoteDocument,
  SaveNoteBlockDocument,
  SaveNoteDocument,
  SaveNoteInput,
  UpdateNoteEventInput,
  UpdateNoteEventType,
  WorkspaceNote,
  WorkspacesDocument,
  WorkspacesQuery,
  Workspace,
  Note
} from "@/gql/graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { BlockAPI } from "@flowinity/editorjs";
import { computed, ref } from "vue";

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

export const useWorkspacesStore = defineStore("workspaces", () => {
  const items = ref<WorkspacesQuery["workspaces"]>([]);
  const recent = ref<Workspace[]>([]);
  const versionHistory = ref(false);
  const share = ref({
    dialog: false,
    loading: false
  });
  const selectedWorkspaceId = ref<number | null>(null);

  const workspace = computed(() => {
    return items.value.find((w) => w.id === selectedWorkspaceId.value) || null;
  });

  async function getNote(id: string | number) {
    const {
      data: { note }
    } = await useApolloClient().client.query({
      query: NoteDocument,
      variables: {
        input: {
          id: isNumeric(id)
            ? typeof id === "number"
              ? id
              : parseInt(id)
            : undefined,
          shareLink: !isNumeric(id) ? <string>id : undefined
        }
      },
      fetchPolicy: "no-cache"
    });
    return note;
  }

  async function getRecent() {
    const { data } = await axios().get("/notes/recent");
    recent.value = data;
    return data;
  }

  async function getWorkspaces() {
    const {
      data: { workspaces }
    } = await useApolloClient().client.query({
      query: WorkspacesDocument
    });
    items.value = workspaces;
  }

  function selectWorkspace(id: number) {
    selectedWorkspaceId.value = id;
    localStorage.setItem(
      "selectedWorkspace",
      JSON.stringify({
        id: id,
        name: workspace.value?.name
      })
    );
  }

  /**
   * May be used for updating LocalStorage cached name.
   * @deprecated Refreshing workspace is no longer required.
   */
  async function refreshWorkspace() {
    await selectWorkspace(<number>selectedWorkspaceId.value);
  }

  async function init() {
    await getWorkspaces();
    const selectedWorkspace = localStorage.getItem("selectedWorkspace");
    if (selectedWorkspace) {
      selectWorkspace(JSON.parse(selectedWorkspace).id);
    }
  }

  const route = useRoute();
  async function saveNote(data: WorkspaceNote, manualSave = false) {
    await useApolloClient().client.mutate({
      mutation: SaveNoteDocument,
      variables: {
        input: {
          id: parseInt(<string>route.params.id),
          data,
          manualSave
        } as SaveNoteInput
      }
    });
  }

  async function saveBlock(data: BlockAPI, type: UpdateNoteEventType) {
    if (!data && type !== UpdateNoteEventType.Delete) {
      return;
    }
    await useApolloClient().client.mutate({
      mutation: SaveNoteBlockDocument,
      variables: {
        input: {
          blockId: data?.id,
          id: parseInt(<string>route.params.id),
          data: data,
          type: type
        } as UpdateNoteEventInput
      }
    });
  }

  const isWorkspaces = computed(() => {
    return (
      route.path.startsWith("/workspaces") || route.path.startsWith("/notes")
    );
  });
  const recentOverall = computed(() => {
    const notes: Note[] = recent.value
      .map((workspace) => workspace.folders.map((folder) => folder.children))
      .flat(2)
      .sort((a, b) => {
        if (a.updatedAt > b.updatedAt) return -1;
        if (a.updatedAt < b.updatedAt) return 1;
        return 0;
      });
    return notes.slice(0, 12);
  });

  // Methods for acting on Workspaces/Notes
  async function createNote(name: string, folderId: number) {
    const apolloClient = useApolloClient();
    const {
      data: { createNote }
    } = await apolloClient.client.mutate({
      mutation: CreateNoteDocument,
      variables: {
        input: {
          name,
          workspaceFolderId: folderId
        }
      }
    });
    const cache = apolloClient.client.cache;
    // add it to WorkspaceFolder
    cache.modify({
      id: `WorkspaceFolder:${folderId}`,
      fields: {
        children(existingRefs = []) {
          return [...existingRefs, createNote];
        }
      }
    });
    await getWorkspaces();
    return createNote;
  }

  return {
    items,
    workspace,
    recent,
    versionHistory,
    share,
    selectedWorkspaceId,
    getNote,
    getRecent,
    getWorkspaces,
    selectWorkspace,
    refreshWorkspace,
    init,
    saveNote,
    saveBlock,
    isWorkspaces,
    recentOverall,
    createNote
  };
});
