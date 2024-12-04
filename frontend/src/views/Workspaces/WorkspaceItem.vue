<template>
  <div id="workspaces-editor">
    <WorkspaceShareDialog
      v-if="$route.params.id"
      :key="$route.params.id as string"
      v-model="$workspaces.share.dialog"
    />
    <div
      :key="($route.params.version || $route.params.id) as string"
      class="editorx_body mt-3"
    >
      <div id="tpu-editor" />
    </div>
    <v-toolbar
      v-if="!id && !fail"
      id="workspaces-word-count"
      :class="{ patch: !$vuetify.display.mobile && $user.user?.id }"
      bottom
      class="position-fixed"
      color="dark"
      dense
      density="compact"
      flat
      style="z-index: 1000"
    >
      <v-card-subtitle>
        Words: {{ words?.toLocaleString() || 0 }} &bullet; Characters:
        {{ characters?.toLocaleString() || 0 }} &bullet; Speaking Time:
        <span>
          {{ speakingTime }}
          <v-tooltip activator="parent" location="top">
            <span>Average 150wpm estimate</span>
          </v-tooltip>
        </span>
        <template v-if="!$vuetify.display.mobile">
          &bullet; Blocks: {{ blocks?.toLocaleString() || 0 }}
        </template>
      </v-card-subtitle>
    </v-toolbar>
    <template v-if="fail">
      <PromoNoContent
        :icon="RiCloseCircleLine"
        title="Note not found."
        description="The note you are trying to access may not exist or you may not have permission to view it."
        @button:click="$router.push('/')"
      >
        <template #button v-if="!$user.user">
          <FlowinityLogoAnimated
            v-if="$app.site.officialInstance"
            style="width: 24px"
            class="mr-2"
          />
          Learn more about {{ $app.site.name }}
        </template>
      </PromoNoContent>
    </template>
    <template v-if="collaborators.length">
      <teleport
        v-if="
          !$vuetify.display.mobile && !$experiments.experiments.PROGRESSIVE_UI
        "
        to="#header-actions"
      >
        <div style="display: flex; gap: 4px">
          <UserAvatar
            v-for="collab in collaborators"
            :key="collab.userId"
            :user="$user.users[collab.userId]"
            :status="true"
            size="32"
            :dot-status="true"
            :typing="collab.typing"
          />
        </div>
      </teleport>
    </template>
    <template v-if="!fail && ready && $experiments.experiments.PROGRESSIVE_UI">
      <teleport to="#appbar-options">
        <accessible-transition mode="out-in" name="slide-up" appear>
          <span class="flex gap-2 items-center">
            <small v-if="$app.notesSaving && !$vuetify.display.mobile">
              Saving...
            </small>
            <accessible-transition
              v-for="collab in collaborators"
              :key="collab.userId"
              mode="out-in"
              name="slide-up"
              appear
            >
              <div class="flex p-2">
                <UserAvatar
                  :user="$user.users[collab.userId]"
                  :status="true"
                  size="32"
                  :dot-status="true"
                  :typing="collab.typing"
                />
              </div>
            </accessible-transition>
            <v-btn
              size="small"
              icon
              :active="$workspaces.versionHistory"
              @click="
                $workspaces.versionHistory = !$workspaces.versionHistory;
                $ui.navigationMode = RailMode.WORKSPACES;
              "
            >
              <RiHistoryLine class="action-bar-item" />
            </v-btn>
            <v-btn size="small" icon @click="$workspaces.share.dialog = true">
              <RiShareForwardFill class="action-bar-item" />
            </v-btn>
          </span>
        </accessible-transition>
      </teleport>
    </template>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import Header from "editorjs-header-with-anchor";
//@ts-ignore
import NestedList from "@flowinity/tpu-editorjs-nested-list";
//@ts-ignore
import CodeTool from "@editorjs/code";
//@ts-ignore
import Paragraph from "@editorjs/paragraph";
//@ts-ignore
import Embed from "@editorjs/embed";
//@ts-ignore
import Table from "@editorjs/table";
//@ts-ignore
import Checklist from "@editorjs/checklist";
//@ts-ignore
import Marker from "@editorjs/marker";
//@ts-ignore
import Warning from "@editorjs/warning";
//@ts-ignore
import RawTool from "@editorjs/raw";
//@ts-ignore
import Quote from "@editorjs/quote";
//@ts-ignore
import InlineCode from "@editorjs/inline-code";
//@ts-ignore
import Delimiter from "@editorjs/delimiter";
//@ts-ignore
import ImageTool from "@editorjs/image";
//@ts-ignore
import EditorJS, { BlockAPI, EditorConfig } from "@flowinity/editorjs";
//@ts-ignore
import Attaches from "@editorjs/attaches";
//@ts-ignore
import LinkTool from "@editorjs/link";
//@ts-ignore
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
//@ts-ignore;
import WorkspaceHome from "@/views/Workspaces/WorkspaceHome.vue";
//@ts-ignore
import Undo from "editorjs-undo";
import { defineComponent, h, markRaw } from "vue";
//@ts-ignore
import SimpleImage from "@flowinity/tpu-simple-image";
import WorkspaceShareDialog from "@/components/Workspaces/Dialogs/Share.vue";
import {
  CollabEventType,
  NoteCollabPosition,
  UpdateNoteEventType,
  WorkspaceNote
} from "@/gql/graphql";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client/core";
import { isNumeric } from "@/plugins/isNumeric";
import { useApolloClient } from "@vue/apollo-composable";
import {
  NoteCollabPositionSubscription,
  SaveNoteCollabPositionMutation,
  UpdateNoteSubscription
} from "@/graphql/workspaces/collaboration";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import functions from "@/plugins/functions";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import {
  RiCloseCircleFill,
  RiCloseCircleLine,
  RiCloseLine,
  RiCollageFill,
  RiCollageLine,
  RiFileTextFill,
  RiFileTextLine,
  RiHistoryLine,
  RiShare2Line,
  RiShareForwardFill,
  RiShareLine,
  RiStickyNoteFill,
  RiStickyNoteLine
} from "@remixicon/vue";
import { RailMode } from "@/store/progressive.store";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import FlowinityLogo from "@/components/Brand/FlowinityLogo.vue";
import FlowinityLogoAnimated from "@/components/Brand/FlowinityLogoAnimated.vue";

interface NoteCollabPositionWithTyping extends NoteCollabPosition {
  typing: boolean;
  timeout: NodeJS.Timeout;
}

export default defineComponent({
  components: {
    FlowinityLogoAnimated,
    FlowinityLogo,
    PromoNoContent,
    RiHistoryLine,
    RiShareForwardFill,
    RiShareLine,
    RiShare2Line,
    AccessibleTransition,
    UserAvatar,
    WorkspaceShareDialog,
    WorkspaceHome
  },
  props: ["id"],
  data: function () {
    return {
      data: null,
      fail: false,
      words: 0,
      characters: 0,
      lastSave: null as any,
      blocks: 0,
      lines: 0,
      activeSubscription: null as ApolloClient<NormalizedCacheObject> | null,
      activeSubscriptionPosition:
        null as ApolloClient<NormalizedCacheObject> | null,
      collaborators: [] as NoteCollabPositionWithTyping[],
      position: {
        blockIndex: 0,
        position: 0
      },
      ready: false
    };
  },
  computed: {
    RiCloseCircleLine() {
      return RiCloseCircleLine;
    },
    RiCloseCircleFill() {
      return RiCloseCircleFill;
    },
    RiCloseLine() {
      return RiCloseLine;
    },
    RailMode() {
      return RailMode;
    },
    speakingTime() {
      const avgWordsPerMinute = 150;
      const minutes = Math.floor(this.words / avgWordsPerMinute);
      const seconds = Math.floor(
        (this.words / avgWordsPerMinute - minutes) * 60
      );

      let result = "";
      if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        result += `${hours}h`;
      }
      if (minutes > 0) {
        result += `${minutes % 60}m`;
      }
      if (seconds > 0) {
        result += `${seconds}s`;
      }

      if (!result) result = "0s";

      return result;
    },
    toolbarStyles() {
      if (this.$app.mainDrawer && !this.$vuetify.display.mobile)
        return "margin-left: 256px";
      else return {};
    }
  },
  watch: {
    $route(val) {
      if (!val.params.id) return;
      this.onMounted();
    }
  },
  mounted() {
    this.onMounted();
    if (!this.$app.workspaceDrawer && !this.$vuetify.display.mobile) {
      this.$app.forcedWorkspaceDrawer = true;
      this.$app.workspaceDrawer = true;
    }
    this.$app.title = "Workspace Editor";
  },
  beforeUnmount() {
    this.unsubscribeFromNote();
  },
  unmounted() {
    document.removeEventListener("keydown", this.saveEvent);
    document.removeEventListener("keydown", this.updateCursor);
    document.removeEventListener("click", this.updateCursor);
    this.destroyCollabCursors();
    this.$app.workspaceDrawer =
      localStorage.getItem("workspaceDrawer") === "true";
    this.$app.forcedWorkspaceDrawer = false;
    if (window.editor) {
      window?.editor?.destroy?.();
    }
  },
  methods: {
    subscribeToNote() {
      const id = isNumeric(this.$route.params.id)
        ? parseInt(this.$route.params.id)
        : this.$route.params.id;
      this.unsubscribeFromNote();
      const observer = useApolloClient().client.subscribe({
        query: UpdateNoteSubscription,
        variables: {
          id: typeof id === "number" ? id : null,
          shareLink: typeof id === "string" ? id : null
        }
      });

      this.activeSubscription = observer.subscribe({
        next: (data) => {
          console.log(data);
          // set to typing, and then set typing to false after 5 seconds of no event
          const index = this.collaborators.findIndex(
            (c) => c.userId === data.data.onUpdateNote.userId
          );
          if (index !== -1) {
            this.collaborators[index].typing = true;
            if (this.collaborators[index].timeout) {
              clearTimeout(this.collaborators[index].timeout);
            }
            this.collaborators[index].timeout = setTimeout(() => {
              this.collaborators[index].typing = false;
            }, 5000);
          }
          const updateData = data.data.onUpdateNote;
          switch (updateData.type) {
            case UpdateNoteEventType.Insert:
              break;
            case UpdateNoteEventType.Delete:
              window.editor.blocks.delete(updateData.data.id);
              break;
            case UpdateNoteEventType.Update:
              if (!window.editor.blocks?.getById(updateData.blockId)) {
                if (!updateData.data) return;
                window.editor.blocks.insert(
                  updateData.data.type,
                  updateData.data.data,
                  updateData.data.config,
                  undefined,
                  undefined,
                  undefined,
                  updateData.blockId
                );
                break;
              }
              window.editor.blocks.update(updateData.blockId, {
                ...updateData.data,
                collab: true
              });
              break;
          }
        }
      });
      const observerPosition = useApolloClient().client.subscribe({
        query: NoteCollabPositionSubscription,
        variables: {
          id: typeof id === "number" ? id : null,
          shareLink: typeof id === "string" ? id : null
        }
      });
      this.activeSubscriptionPosition = observerPosition.subscribe({
        next: (data) => {
          const updateData = data.data.onNoteCollabPosition;
          console.log(updateData);
          // do not render own cursor
          // TODO: add different session support for tab instances
          const index = this.collaborators.findIndex(
            (c) => c.userId === updateData.userId
          );
          if (updateData.type === CollabEventType.Join) {
            if (index === -1) {
              this.collaborators.push(updateData);
            } else {
              this.collaborators[index] = updateData;
            }
          } else if (updateData.type === CollabEventType.Leave) {
            if (index !== -1) {
              this.collaborators.splice(index, 1);
            }
          }
          if (updateData.userId === this.$user.user?.id) return;
          // rerender cursor logic
          let cursor: HTMLElement = document.getElementById(
            `workspaces-cursor-${updateData.userId}`
          );
          console.log("UPDATE DATA", updateData);
          // it uses block index and character offset to calculate the position
          // so we need to get the block index and character offset
          const block = window.editor.blocks.getBlockByIndex(
            updateData.blockIndex
          );
          const holder = block.holder;
          console.log(cursor, holder, block);

          if (!cursor) {
            cursor = document.createElement("span");
            cursor.className = "workspaces-cursor";
            cursor.id = `workspaces-cursor-${updateData.userId}`;
            cursor.style.backgroundColor = functions.randomColorGenerator(
              this.collaborators.findIndex(
                (c) => c.userId === updateData.userId
              )
            );
            cursor.style.width = "3px";
            cursor.style.height = "1em";
            cursor.style.borderRadius = "2px";
            cursor.style.zIndex = "1000";
            cursor.style.position = "absolute";
          }

          // Get the bounding client rect of the cursor position
          console.log(
            window.getSelection()?.getRangeAt(0).startContainer.parentElement
          );
          const rect = this.getCaretCoordinates(
            updateData.position,
            block.holder.querySelector(".cdx-block")
          );
          console.log(`RECT for ${this.$user.user?.id}`, rect);
          if (!rect) return console.error("Could not get rect");

          // Position the cursor indicator
          cursor.style.left = rect.x + "px";
          cursor.style.top = rect.y + 2 + "px";
          console.log(cursor, cursor.style, rect.x, rect.y);
          // on hover, tooltip with username
          cursor.onmouseover = () => {
            this.$toast.success(
              `${
                this.$user.users[updateData.userId].username
              } (dev placeholder)`
            );
          };
          document.body.appendChild(cursor);
        }
      });
    },
    getCaretCoordinates(offset: number, element: HTMLElement) {
      let x = 0,
        y = 0;
      const range = document.createRange();
      console.log(element);
      const node = element.childNodes[0]; // Assuming the text node is the first child
      range.setStart(node, offset); // Set the range start at the specified offset
      range.collapse(true); // Collapse the range to the start

      const rect = range.getClientRects()[0];
      if (rect) {
        x = rect.left; // X-coordinate of the caret
        y = rect.top; // Y-coordinate of the caret
      }
      return { x, y };
    },
    unsubscribeFromNote() {
      if (this.activeSubscription) this.activeSubscription?.unsubscribe?.();
    },
    async upload(file: any) {
      try {
        let formData = new FormData();
        formData.append("attachment", file);

        const { data } = await this.axios.post("/gallery", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        return {
          success: 1,
          file: {
            url: this.$app.domain + data.upload.attachment,
            name: data.upload.name,
            size: data.upload.fileSize,
            extension: data.upload.name.split(".").pop(),
            title: data.upload.name
          },
          title: data.upload.name
        };
      } catch {
        this.$toast.error("The file could not be uploaded.");
        return {
          success: 0
        };
      }
    },
    async saveBlock(data: BlockAPI, type: UpdateNoteEventType) {
      if (!this.$experiments.experiments.NOTE_COLLAB) return;
      try {
        if (!this.$route.params.id) return;
        if (this.lastSave && Date.now() - this.lastSave < 500) return;
        this.lastSave = Date.now();
        this.$app.notesSaving = true;
        await this.$workspaces.saveBlock(data, type);
        this.$app.notesSaving = false;
        console.log("[TPU/Editor] Saved!");
      } catch (e) {
        console.log(e);
        this.$app.notesSaving = false;
        this.$toast.error("The document could not be saved.");
      }
    },
    async save(data: WorkspaceNote, manualSave = false) {
      if (this.$experiments.experiments.NOTE_COLLAB) return;
      try {
        if (!this.$route.params.id) return;
        if (this.lastSave && Date.now() - this.lastSave < 500) return;
        this.lastSave = Date.now();
        this.$app.notesSaving = true;
        await this.$workspaces.saveNote(data, manualSave);
        this.$app.notesSaving = false;
        console.log("[TPU/Editor] Saved!");
      } catch (e) {
        console.log(e);
        this.$app.notesSaving = false;
        this.$toast.error("The document could not be saved.");
      }
    },
    getItemCount(item: any, type: any) {
      let count = 0;
      if (item.items?.length) {
        count += item.items.reduce((acc: any, item: any) => {
          return acc + this.getItemCount(item, type);
        }, 0);
      }
      if (type === "length") {
        return item.items?.length || 0;
      }
      if (item.content) {
        if (type === "char") {
          count += item.content.length;
        } else if (type === "word") {
          count += item.content.split(" ").length;
        }
      }
      if (item.text) {
        if (type === "char") {
          count += item.text.length;
        } else if (type === "word") {
          count += item.text.split(" ").length;
        }
      }
      return count;
    },
    count(blocks: any) {
      this.characters = blocks?.reduce((acc, block) => {
        if (block.data.text) {
          return acc + block.data.text.length || 0;
        } else if (block.data.content?.length) {
          return (
            acc +
            block.data.content.reduce((acc, row) => {
              row.forEach((cell) => {
                acc += cell.length || 0;
              });
              return acc;
            }, 0)
          );
        } else if (block.data.items?.length) {
          return (
            acc +
            block.data.items.reduce((acc, item) => {
              return acc + this.getItemCount(item, "char") || 0;
            }, 0)
          );
        } else {
          return acc;
        }
      }, 0);
      this.words = blocks?.reduce((acc, block) => {
        if (block.data.text) {
          return acc + block.data.text?.split(" ").length || 0;
        } else if (block.data.content?.length) {
          return (
            acc +
            block.data.content.reduce((acc, row) => {
              row.forEach((cell) => {
                acc += cell?.split(" ").length || 0;
              });
              return acc;
            }, 0)
          );
        } else if (block.data.items?.length) {
          return (
            acc +
            block.data.items.reduce((acc, item) => {
              return acc + this.getItemCount(item, "word") || 0;
            }, 0)
          );
        } else {
          return acc;
        }
      }, 0);
      this.blocks = blocks?.length;
    },
    editor(data, readOnly) {
      window.__TROPLO_INTERNALS_EDITOR_SAVE = this.save;
      window.__TROPLO_INTERNALS_EDITOR_SAVE_BLOCK = this.saveBlock;
      window.__TROPLO_INTERNALS_EDITOR_UPLOAD = this.upload;
      window.__TROPLO_INTERNALS_UPDATE_COUNT = this.count;
      window.__TROPLO_INTERNALS_EDITOR_COLLAB_MODE =
        this.$experiments.experiments.NOTE_COLLAB;
      //window.__TROPLO_INTENRALS_SOCKET = this.$socket;
      window.__TROPLO_INTERNALS_NOTE_ID = this.$route.params.id;
      window.__TROPLO_INTERNALS_EDITOR_SAVE_POSITION = this.updateCursor;
      window.__NOTE_DATA = data;
      //this.$socket.emit("notes/subscribe", this.$route.params.id);
      let init: EditorConfig = {
        holder: "tpu-editor",
        autofocus: !readOnly,
        readOnly,
        //@ts-ignore
        logLevel: "ERROR",
        /**
         * This Tool will be used as default
         */
        defaultBlock: "paragraph",
        tools: {
          code: {
            class: CodeTool,
            shortcut: "CMD+SHIFT+C"
          },
          linkTool: {
            class: LinkTool
          },
          header: {
            class: Header,
            shortcut: "CMD+SHIFT+H",
            tunes: ["align"]
          },
          list: {
            class: NestedList
          },
          paragraph: {
            class: Paragraph,
            tunes: ["align"],
            config: {
              placeholder: "."
            }
          },
          embed: {
            class: Embed
          },
          attaches: {
            class: Attaches,
            config: {
              uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param {File} file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */ async uploadByFile(file) {
                  return await window.__TROPLO_INTERNALS_EDITOR_UPLOAD(file);
                }
              },
              endpoints: {
                byFile: "/api/v3/gallery"
              },
              field: "attachment"
            }
          },
          table: {
            //@ts-ignore
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3
            }
          },
          simpleImage: {
            class: SimpleImage,
            inlineToolbar: true
          },
          checklist: {
            class: Checklist
          },
          Marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+M"
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+W",
            config: {
              titlePlaceholder: "Title",
              messagePlaceholder: "Message"
            }
          },
          raw: RawTool,
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+O",
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author"
            }
          },
          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+M"
          },
          delimiter: Delimiter,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param {File} file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */ async uploadByFile(file) {
                  return await window.__TROPLO_INTERNALS_EDITOR_UPLOAD(file);
                }
              },
              endpoints: {
                byFile: "/api/v3/gallery"
              },
              field: "attachment"
            }
          },
          align: {
            class: AlignmentTuneTool,
            config: {
              default: "left",
              blocks: {
                header: "center",
                list: "left"
              }
            }
          }
        },
        onReady() {
          if (typeof window.__NOTE_DATA === "string") {
            window.editor.blocks.renderFromHTML(window.__NOTE_DATA);
          }
          const undo = new Undo({
            editor: window.editor,
            config: {
              debounceTimer: 30,
              shortcuts: {
                undo: "CMD+Z",
                redo: "CMD+SHIFT+Z"
              }
            }
          });
          undo.initialize(init.data);
          console.log("[TPU/Editor] Ready.");
          window.__TROPLO_INTERNALS_UPDATE_COUNT(
            window.editor.configuration.data.blocks
          );
          window.__TROPLO_INTERNALS_EDITOR_SAVE_POSITION({ isTrusted: true });
        },
        onChange(data, block) {
          console.log("[TPU/Editor] Saving...");
          console.log(data, block);
          window.editor.save().then(async (outputData) => {
            if (window.__TROPLO_INTERNALS_EDITOR_COLLAB_MODE) {
              // TODO: Fix type errors here for experimental collaboration
              //@ts-ignore
              console.log(block.type);
              const type =
                //@ts-ignore
                block.type === "block_added"
                  ? UpdateNoteEventType.Insert
                  : //@ts-ignore
                  block.type === "block_removed"
                  ? UpdateNoteEventType.Delete
                  : UpdateNoteEventType.Update;
              console.log(data, block);
              window.__TROPLO_INTERNALS_EDITOR_SAVE_BLOCK(
                //@ts-ignore
                outputData.blocks?.find(
                  //@ts-ignore
                  (b) => b.id === block.detail?.target?.id
                ),
                type
              );
              //window.__TROPLO_INTERNALS_EDITOR_SAVE_BLOCK(block);
            } else {
              window.__TROPLO_INTERNALS_EDITOR_SAVE(outputData);
            }
            await window.__TROPLO_INTERNALS_UPDATE_COUNT(outputData.blocks);
          });
        }
      };
      if (Object.keys(data).length) {
        init.data = data;
      }
      // the configuration object is present
      //@ts-ignore
      window.editor = new EditorJS(init);
    },
    updateCursor(e: Event) {
      if (!this.$experiments.experiments.NOTE_COLLAB) return;
      // complete disaster
      if (e.isTrusted) {
        const currentBlock = window.editor.blocks.getCurrentBlockIndex();
        const position = window.getSelection()?.getRangeAt(0).startOffset;
        if (
          position === this.position.position &&
          currentBlock === this.position.blockIndex
        )
          return;
        this.position = {
          blockIndex: currentBlock,
          position
        };
        this.$apollo.mutate({
          mutation: SaveNoteCollabPositionMutation,
          variables: {
            input: {
              noteId: parseInt(this.$route.params.id),
              position,
              blockIndex: currentBlock
            }
          }
        });
      }
    },
    destroyCollabCursors() {
      // destroy collaborative cursors
      document.querySelectorAll(".workspaces-cursor").forEach((cursor) => {
        cursor.remove();
      });
    },
    async onMounted() {
      this.$ui.navigationMode = RailMode.WORKSPACES;
      this.destroyCollabCursors();
      try {
        if (window.editor) {
          await window?.editor?.destroy?.();
        }
        this.fail = false;
        const res = await this.$workspaces.getNote(
          this.id || this.$route.params.id
        );
        this.$app.title = res.name;
        this.ready = true;
        console.log(res);
        const note = this.$route.params.version
          ? res.versions?.find((v) => v.id === this.$route.params.version)?.data
          : res.data;
        const workspaceRail = {
          name: this.$workspaces.items.find((i) =>
            i.folders.find((f) => f.id === res.workspaceFolderId)
          )?.name,
          icon: markRaw(RiFileTextLine),
          path: "/workspaces"
        };
        let versionItem = null;
        if (this.$route.params.version) {
          versionItem = {
            name: `${this.$date(
              res.versions?.find((v) => v.id === this.$route.params.version)
                .createdAt
            ).fromNow()}`,
            icon: markRaw(RiHistoryLine),
            path: this.$route.path
          };
        }
        const item = {
          name: res.name,
          icon: markRaw(RiStickyNoteLine),
          path: `/workspaces/notes/${res.id}`
        };
        this.$ui.currentNavItem = {
          item: versionItem ? versionItem : item,
          rail: versionItem ? [workspaceRail, item] : [workspaceRail]
        };
        if (!this.id) {
          this.$app.lastNote = parseInt(this.$route.params.id);
          localStorage.setItem("lastNote", this.$route.params.id);
        }
        try {
          this.editor(
            note,
            this.$route.params.version || !res.permissions.modify
          );
          this.count(res.data.blocks);
        } catch (e) {
          console.log(e);
          this.editor(null);
        }
        this.subscribeToNote();
      } catch (e) {
        console.log(e);
        this.fail = true;
      }

      document.addEventListener("keydown", this.saveEvent, false);

      // watch for changes to cursor position, editorjs does not provide a way to do this
      document.addEventListener("keydown", this.updateCursor);
      document.addEventListener("click", this.updateCursor);
    },
    saveEvent(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        window.editor.save().then((outputData) => {
          window.__TROPLO_INTERNALS_EDITOR_SAVE(outputData);
        });
      }
    }
  }
});
</script>

<style lang="scss">
.v-theme--dark,
.v-theme--amoled {
  .cdx-settings-input {
    color: white !important;
  }

  .cdx-settings-item svg {
    fill: white !important;
  }

  .cdx-settings-button svg {
    fill: white !important;
  }

  .cdx-settings-button--active svg {
    fill: #0190ea !important;
  }

  .ce-code__textarea {
    color: white !important;
    background-color: var(--v-bg-base) !important;
    border: 1px solid var(--v-bg-lighten4) !important;
  }

  .tc-add-column svg {
    text-align: center;
  }

  .tc-cell[heading] {
    background-color: var(--v-toolbar-lighten1) !important;
  }

  .tc-table {
    border-top: 1px solid var(--v-bg-lighten4) !important;
  }

  .tc-add-column {
    border-right: 1px solid var(--v-bg-lighten4) !important;
    border-top: 1px solid var(--v-bg-lighten4) !important;
    border-bottom: 1px solid var(--v-bg-lighten4) !important;
    background-color: var(--v-toolbar-base) !important;
    z-index: 2;
  }

  .tc-add-column:hover {
    transition: 0.1s;
    background-color: var(--v-toolbar-lighten1) !important;
  }

  .tc-add-column svg {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  .tc-add-row {
    margin-top: 0 !important;
    border-bottom: 1px solid var(--v-bg-lighten4) !important;
    border-left: 1px solid var(--v-bg-lighten4) !important;
    border-right: 1px solid var(--v-bg-lighten4) !important;
    background-color: var(--v-toolbar-base) !important;
    z-index: 1;
  }

  .tc-add-row:hover {
    transition: 0.1s;
    background-color: var(--v-toolbar-lighten1) !important;
  }

  .tc-add-row:hover:before {
    background-color: unset !important;
  }

  .tc-add-row svg {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .tc-row {
    border-bottom: 1px solid var(--v-bg-lighten4) !important;
    border-left: 1px solid var(--v-bg-lighten4) !important;
    border-right: 1px solid var(--v-bg-lighten4) !important;
  }

  .tc-wrap {
    --color-border: var(--v-bg-lighten3) !important;
  }

  .tc-toolbox__toggler {
    color: white !important;
  }

  .tc-toolbox__toggler svg rect {
    fill: #202020 !important;
  }

  .ce-inline-tool-input,
  .cdx-search-field__input {
    color: white;
  }
}

@media (min-width: 1650px) and (max-width: 2000px) {
  .ce-block__content,
  .ce-toolbar__content {
    max-width: 1000px !important;
  }
}

@media (min-width: 2000px) and (max-width: 3000px) {
  .ce-block__content,
  .ce-toolbar__content {
    max-width: 1400px !important;
  }
}

@media (min-width: 3000px) {
  .ce-block__content,
  .ce-toolbar__content {
    max-width: 1800px !important;
  }
}

@media (min-width: 0px) and (max-width: 1650px) {
  .ce-block__content,
  .ce-toolbar__content {
    max-width: 82% !important;
  }
}

#workspaces-editor .v-toolbar {
  bottom: 0 !important;
  top: unset !important;
  position: absolute;
  width: 100%;
}

#workspaces-editor .patch {
  width: calc(100% - 256px) !important;
}

.tc-toolbox {
  z-index: 3 !important;
}

.cdx-checklist__item-checkbox-check,
.cdx-checklist__item-checkbox {
  border: none;
}

.cdx-checklist__item-checkbox-check {
  display: none;
}
</style>
