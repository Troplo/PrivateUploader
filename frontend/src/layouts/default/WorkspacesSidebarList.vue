<template>
  <div>
    <CoreDialog v-model="importDoc.dialog" max-width="600px">
      <template #title>{{ $t("workspaces.import.title") }}</template>
      <v-container>
        <v-text-field
          v-model="importDoc.name"
          :label="$t('workspaces.import.name')"
          required
          :autofocus="true"
        />
        <v-file-input
          ref="importDocFile"
          v-model="importDoc.file"
          :label="$t('workspaces.import.file')"
          required
          :autofocus="true"
          accept=".tpudoc,.html"
        />
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="importDoc.loading"
          @click="doImportDoc"
        >
          {{ $t("workspaces.import.import") }}
        </v-btn>
      </v-card-actions>
    </CoreDialog>
    <ShareWorkspace
      v-model="shareWorkspace.dialog"
      :workspace="contextMenu.item"
    />
    <CoreDialog v-model="download.dialog" max-width="600px">
      <template v-if="!download.workspaceFolderId" #title>
        {{ $t("workspaces.download.title") }}
      </template>
      <template v-else #title>
        {{ $t("workspaces.download.titleZIP") }}
      </template>
      <v-container>
        <v-select
          v-model="download.type"
          label="Type"
          required
          :autofocus="true"
          :items="download.types"
          item-title="text"
          item-value="value"
          :hint="
            download.type !== 'tpudoc'
              ? $t('workspaces.download.conversionHint')
              : undefined
          "
          :persistent-hint="true"
        />
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          @click="
            download.dialog = false;
            download.workspaceFolderId = undefined;
            download.id = undefined;
          "
        >
          {{ $t("generic.cancel") }}
        </v-btn>
        <v-btn
          color="primary"
          :loading="download.loading"
          @click="downloadItem"
        >
          {{ $t("workspaces.download.title") }}
        </v-btn>
      </v-card-actions>
    </CoreDialog>
    <WorkspaceDeleteDialog
      v-model="deleteNote.dialog"
      title="Delete note"
      :loading="deleteNote.loading"
      @submit="doDeleteNote"
    />
    <WorkspaceDeleteDialog
      v-model="deleteWorkspace.dialog"
      title="Delete workspace"
      :loading="deleteWorkspace.loading"
      @submit="doDeleteWorkspace"
    />
    <WorkspaceDeleteDialog
      v-model="deleteFolder.dialog"
      title="Delete folder"
      :loading="deleteFolder.loading"
      @submit="doDeleteFolder"
    />
    <WorkspaceDialog
      v-model="createNote.dialog"
      title="Create note"
      :loading="createNote.loading"
      @submit="doCreateNote"
    />
    <WorkspaceDialog
      v-model="createWorkspace.dialog"
      title="Create workspace"
      :loading="createWorkspace.loading"
      @submit="doCreateWorkspace"
    />
    <WorkspaceDialog
      v-model="createFolder.dialog"
      title="Create folder"
      :loading="createFolder.loading"
      @submit="doCreateFolder"
    />
    <WorkspaceDialog
      v-model="renameNote.dialog"
      title="Rename note"
      btn-text="Rename"
      :loading="renameNote.loading"
      @submit="doRenameNote"
    />
    <WorkspaceDialog
      v-model="renameWorkspace.dialog"
      title="Rename workspace"
      btn-text="Rename"
      :loading="renameWorkspace.loading"
      @submit="doRenameWorkspace"
    />
    <WorkspaceDialog
      v-model="renameFolder.dialog"
      title="Rename folder"
      btn-text="Rename"
      :loading="renameFolder.loading"
      @submit="doRenameFolder"
    />
    <v-menu
      :key="contextMenu.id"
      v-model="contextMenu.dialog"
      :style="menuStyle"
    >
      <v-list v-if="!contextMenu.item?.children && !contextMenu.item?.folders">
        <v-list-item @click="renameNote.dialog = true">
          <v-list-item-title>Rename note</v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="
            download.dialog = true;
            download.id = contextMenu.item?.id;
          "
        >
          <v-list-item-title>Download...</v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteNote.dialog = true">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list v-else-if="!contextMenu.item?.folders">
        <v-list-item @click="importDoc.dialog = true">
          <v-list-item-title>Import TPUDOC/HTML</v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="
            download.dialog = true;
            download.workspaceFolderId = contextMenu.item?.id;
          "
        >
          <v-list-item-title>Download folder...</v-list-item-title>
        </v-list-item>
        <v-list-item @click="renameFolder.dialog = true">
          <v-list-item-title>Rename folder</v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteFolder.dialog = true">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item
          @click="shareWorkspace.dialog = true"
          v-if="$experiments.experiments.NOTE_COLLAB"
        >
          <v-list-item-title>
            {{ $t("workspaces.sidebar.share") }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="renameWorkspace.dialog = true">
          <v-list-item-title>
            {{ $t("workspaces.sidebar.rename") }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteWorkspace.dialog = true">
          <v-list-item-title>
            {{ $t("workspaces.sidebar.delete") }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-card-text
      v-if="
        !$workspaces.versionHistory &&
        !$app.rail &&
        !$experiments.experiments.PROGRESSIVE_UI
      "
      style="
        color: rgb(var(--v-theme-primary));
        cursor: pointer;
        font-size: 12px;
      "
      class="unselectable"
      :class="{ 'my-n4': $experiments.experiments.PROGRESSIVE_UI }"
      @click="$app.workspaceDrawer = false"
    >
      <v-icon size="20">mdi-close</v-icon>
      Close Workspaces
    </v-card-text>
    <v-card-text
      v-else-if="
        (!$app.rail || $experiments.experiments.PROGRESSIVE_UI) &&
        $workspaces.versionHistory
      "
      style="color: #0190ea; cursor: pointer; font-size: 12px"
      class="my-n4 unselectable"
      @click="
        $workspaces.versionHistory = false;
        $router.push(`/workspaces/notes/${$route.params.id}`);
      "
    >
      <v-icon>arrow-left-s-line</v-icon>
      Leave version history
    </v-card-text>
    <v-card-text
      v-if="$experiments.experiments.ACCOUNT_DEV_ELIGIBLE"
      style="color: rgb(var(--v-theme-error)); cursor: pointer; font-size: 12px"
      class="my-n4 unselectable"
      @click="
        $experiments.setExperiment(
          'NOTE_COLLAB',
          $experiments.experiments.NOTE_COLLAB ? 0 : 1
        )
      "
    >
      Toggle Experimental Collab ({{ $experiments.experiments.NOTE_COLLAB }})
    </v-card-text>

    <v-list
      v-if="!$workspaces.versionHistory"
      density="comfortable"
      nav
      :class="{
        'mt-2': !$experiments.experiments.PROGRESSIVE_UI
      }"
    >
      <v-list-item
        id="workspace-select"
        class="px-2 unselectable"
        style="cursor: pointer"
        @contextmenu.prevent="
          context($event, 'workspace-select', $workspaces.workspace)
        "
      >
        {{ $workspaces.workspace?.name || "None selected" }}
        <template #append>
          <v-chip
            v-if="
              $workspaces.workspace &&
              $workspaces.workspace?.userId !== $user.user?.id
            "
            color="primary"
            class="mr-2"
          >
            <v-icon>mdi-swap-horizontal</v-icon>
          </v-chip>
          <v-list-item-action
            v-if="$workspaces.workspace"
            @click.stop="createFolder.dialog = true"
          >
            <v-icon>add-line</v-icon>
          </v-list-item-action>
          <v-list-item-action>
            <v-icon>arrow-down-s-line</v-icon>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-menu activator="#workspace-select">
        <v-list>
          <v-list-item
            v-for="item in $workspaces.items"
            :key="item.id"
            :value="item.id"
            class="unselectable"
            @click="$workspaces.selectWorkspace(item.id)"
          >
            <template #append>
              <v-chip v-if="item.userId !== $user.user?.id" color="primary">
                <v-icon class="mr-1">mdi-swap-horizontal</v-icon>
                Shared
              </v-chip>
            </template>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="createWorkspace.dialog = true">
            <v-list-item-title>
              <strong>Create workspace</strong>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <template v-if="$workspaces.workspace">
        <v-list-group
          v-for="item in $workspaces.workspace.folders"
          :id="`folder-${item.id}`"
          :key="`folder-${item.id}`"
          :value="`folder-${item.id}`"
          :title="item.name"
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              class="unselectable"
              @contextmenu.prevent="context($event, `folder-${item.id}`, item)"
            >
              <v-list-item-title>{{ props.title }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="note in item.children"
            :id="`note-${note.id}`"
            :key="`note-${note.id}`"
            :to="'/workspaces/notes/' + note.id"
            :value="`note-${note.id}`"
            :active="$route.path === `/workspaces/notes/${note.id}`"
            @contextmenu.prevent="context($event, `note-${note.id}`, note)"
          >
            <v-list-item-title
              style="text-overflow: ellipsis"
              class="unselectable"
            >
              {{ note.name }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="
              createNote.folderId = item.id;
              createNote.dialog = true;
            "
          >
            <v-list-item-title>
              <strong>Create a new note</strong>
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>
    <template v-else>
      <v-card-title>Version history</v-card-title>
      <v-btn
        block
        variant="outlined"
        color="green"
        @click="restoreVersion()"
        v-if="$route.params.version"
      >
        Restore Version
      </v-btn>
      <v-list>
        <v-list-item
          v-for="version in versions"
          :key="version.id"
          :to="'/workspaces/notes/' + $route.params.id + '/' + version.id"
        >
          <v-list-item-title>
            {{ $date(version.createdAt).format("hh:mm:ss A DD/MM/YYYY") }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkspaceDialog from "@/components/Workspaces/Dialogs/Dialog.vue";
import WorkspaceDeleteDialog from "@/components/Workspaces/Dialogs/Delete.vue";
import { NoteDataV2, NoteVersion } from "@/models/noteVersion";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import ShareWorkspace from "@/components/Workspaces/Dialogs/ShareWorkspace.vue";
import {
  CreateNoteDocument,
  CreateWorkspaceDocument,
  NoteDocument
} from "@/gql/graphql";

export default defineComponent({
  name: "WorkspacesSidebarList",
  components: {
    ShareWorkspace,
    CoreDialog,
    WorkspaceDeleteDialog,
    WorkspaceDialog
  },
  data() {
    return {
      versions: [] as NoteVersion[],
      importDoc: {
        dialog: false,
        loading: false,
        file: undefined as File[] | undefined,
        name: ""
      },
      contextMenu: {
        dialog: false,
        item: undefined as any,
        id: undefined as string | undefined,
        x: 0,
        y: 0
      },
      createNote: {
        dialog: false,
        folderId: undefined as number | undefined,
        loading: false
      },
      renameNote: {
        dialog: false,
        noteId: undefined as number | undefined,
        loading: false
      },
      createFolder: {
        dialog: false,
        loading: false
      },
      renameFolder: {
        dialog: false,
        folderId: undefined as number | undefined,
        loading: false
      },
      createWorkspace: {
        dialog: false,
        loading: false
      },
      renameWorkspace: {
        dialog: false,
        workspaceId: undefined as number | undefined,
        loading: false
      },
      shareWorkspace: {
        dialog: false,
        loading: false
      },
      deleteNote: {
        dialog: false,
        noteId: undefined as number | undefined,
        loading: false
      },
      deleteFolder: {
        dialog: false,
        folderId: undefined as number | undefined,
        loading: false
      },
      deleteWorkspace: {
        dialog: false,
        workspaceId: undefined as number | undefined,
        loading: false
      },
      download: {
        dialog: false,
        loading: false,
        workspaceFolderId: undefined as number | undefined,
        id: undefined as number | undefined,
        type: "docx" as "docx" | "tpudoc" | "html" | "odt",
        types: [
          {
            text: this.$t("workspaces.download.types.tpudoc"),
            value: "tpudoc"
          },
          { text: this.$t("workspaces.download.types.html"), value: "html" },
          { text: this.$t("workspaces.download.types.docx"), value: "docx" }
        ]
      }
    };
  },
  computed: {
    menuStyle() {
      return `
        position: absolute;
        top: ${this.contextMenu.y}px;
        left: ${this.contextMenu.x}px;`;
    }
  },
  watch: {
    "$workspaces.versionHistory"(val) {
      if (val && this.$route.name === "Workspace Item") {
        this.getVersions();
      }
    }
  },
  mounted() {
    if (this.$route.params.version) {
      this.$workspaces.versionHistory = true;
      this.getVersions();
    }
  },
  methods: {
    async restoreVersion() {
      await this.axios.patch(
        `/notes/${this.$route.params.id}/restore/${this.$route.params.version}`
      );
      this.$router.push(`/workspaces/notes/${this.$route.params.id}`);
      this.$workspaces.versionHistory = false;
    },
    async doImportDoc() {
      try {
        this.importDoc.loading = true;
        const fileReader = new FileReader();
        //@ts-ignore
        fileReader.readAsText(this.$refs.importDocFile.files[0]);
        fileReader.onload = async () => {
          const text = fileReader.result as string;
          let json;
          try {
            json = JSON.parse(text);
          } catch {
            json = text;
          }
          const data = await this.doCreateNote(this.importDoc.name, true);
          await this.$workspaces.saveNote(json, true);
          this.$router.push(`/workspaces/notes/${data.id}`);
          this.importDoc.dialog = false;
          this.importDoc.loading = false;
          this.importDoc.file = undefined;
          this.importDoc.name = "";
        };
      } catch (e) {
        console.error(e);
        this.$toast.error(
          "Failed to import document, are you sure it's a TPU document?"
        );
      }
    },
    async getItem(id: number) {
      const { data } = await this.axios.get("/notes/" + id);
      return data.data;
    },
    async downloadAsJSON(data: NoteDataV2, name: string) {
      const blob = new Blob([JSON.stringify(data)], {
        type: "text/plain"
      });
      this.triggerDownload(blob, name, "tpudoc");
    },
    triggerDownload(blob: Blob, name: string, ext: string) {
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = name + "." + ext;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent("click", true, false);
      a.dispatchEvent(e);
    },
    /*async downloadAsHTML(data: NoteDataV2, dl = true) {
      const edjsParser = edjsHTML();

      let html = edjsParser.parse(<OutputData>data);

      if (dl) {
        const blob = new Blob([JSON.stringify(html)], {
          type: "text/html"
        });
        this.triggerDownload(blob, this.contextMenu.item.name, "html");
      } else {
        return html;
      }
    },
    async downloadAsDOCX(data: NoteDataV2) {
      const html = await this.downloadAsHTML(data, false);
    },*/
    async downloadItem() {
      try {
        this.download.loading = true;
        const id =
          this.download.workspaceFolderId ||
          this.download.id ||
          this.download.workspaceFolderId;
        const string = this.download.workspaceFolderId
          ? "/notes/folder/" + id + "/download"
          : "/notes/" + id + "/download";
        // download from axios
        const { data } = await this.axios.get(string, {
          params: {
            type: this.download.type
          },
          responseType: "blob",
          headers: {
            Accept: "application/octet-stream"
          }
        });
        const blob = new Blob([data], {
          type: "text/plain"
        });
        this.triggerDownload(
          blob,
          this.contextMenu.item.name,
          this.download.workspaceFolderId ? "zip" : this.download.type
        );
        this.download.dialog = false;
        this.download.id = undefined;
        this.download.workspaceFolderId = undefined;
      } finally {
        this.download.loading = false;
      }
    },
    context(e: any, id: string, item: any) {
      e.preventDefault();
      this.contextMenu.item = item;
      this.contextMenu.id = id;
      this.contextMenu.x = e.clientX + window.scrollX;
      this.contextMenu.y = e.clientY + window.scrollY;
      this.contextMenu.dialog = true;
    },
    async doCreateNote(name: string, internal: boolean = false) {
      console.log(this.createNote);
      this.createNote.loading = true;
      const createNote = await this.$workspaces.createNote(
        name,
        this.createNote.folderId
      );
      this.createNote.dialog = false;
      this.createNote.loading = false;
      if (internal) return createNote;
      this.$router.push(`/workspaces/notes/${createNote.id}`);
    },
    async doRenameNote(name: string) {
      this.renameNote.loading = true;
      const id = this.contextMenu.item?.id || this.renameNote.noteId;
      await this.axios.patch(`/notes/${id}`, {
        name
      });
      await this.$workspaces.refreshWorkspace();
      this.renameNote.dialog = false;
      this.renameNote.loading = false;
    },
    async doCreateFolder(name: string) {
      this.createFolder.loading = true;
      await this.axios.post("/notes/folder", {
        name: name,
        workspaceId: this.$workspaces.workspace?.id
      });
      await this.$workspaces.refreshWorkspace();
      this.createFolder.dialog = false;
      this.createFolder.loading = false;
    },
    async doRenameFolder(name: string) {
      const id = this.contextMenu.item?.id || this.renameFolder.folderId;
      this.renameFolder.loading = true;
      await this.axios.patch(`/notes/folder/${id}`, {
        name
      });
      await this.$workspaces.refreshWorkspace();
      this.renameFolder.dialog = false;
      this.renameFolder.loading = false;
    },
    async doCreateWorkspace(name: string) {
      this.createWorkspace.loading = true;
      const {
        data: { createWorkspace }
      } = await this.$apollo.mutate({
        mutation: CreateWorkspaceDocument,
        variables: {
          input: name
        }
      });
      this.$workspaces.items.unshift(createWorkspace);
      this.$workspaces.selectWorkspace(createWorkspace.id);
      this.createWorkspace.dialog = false;
      this.createWorkspace.loading = false;
    },
    async doRenameWorkspace(name: string) {
      this.renameWorkspace.loading = true;
      const id = this.contextMenu.item?.id || this.renameWorkspace.workspaceId;
      await this.axios.patch(`/notes/workspaces/${id}`, {
        name
      });
      await this.$workspaces.init();
      this.renameWorkspace.dialog = false;
      this.renameWorkspace.loading = false;
    },
    doDeleteNote() {
      this.deleteNote.loading = true;
      const id = this.contextMenu.item?.id || this.deleteNote.noteId;
      this.axios.delete(`/notes/${id}`).then(async () => {
        await this.$workspaces.refreshWorkspace();
        this.deleteNote.dialog = false;
        this.deleteNote.loading = false;
        if (this.$route.params.id == id) this.$router.push("/workspaces");
      });
    },
    doDeleteFolder() {
      this.deleteFolder.loading = true;
      const id = this.contextMenu.item?.id || this.deleteFolder.folderId;
      this.axios.delete(`/notes/folder/${id}`).then(async () => {
        await this.$workspaces.refreshWorkspace();
        this.deleteFolder.dialog = false;
        this.deleteFolder.loading = false;
      });
    },
    doDeleteWorkspace() {
      this.deleteWorkspace.loading = true;
      const id = this.contextMenu.item?.id || this.deleteWorkspace.workspaceId;
      this.axios.delete(`/notes/workspace/${id}`).then(async () => {
        this.$workspaces.workspaceId = null;
        await this.$workspaces.init();
        this.deleteWorkspace.dialog = false;
        this.deleteWorkspace.loading = false;
      });
    },
    async getVersions() {
      const { data } = await this.axios.get("/notes/" + this.$route.params.id);
      this.versions = data.versions;
    }
  }
});
</script>
