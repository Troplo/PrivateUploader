<template>
  <div id="gallery-core">
    <OCRMetadata v-model="$app.dialogs.ocr.value" />
    <AddToCollection
      v-model="addToCollectionDialog"
      :items="collectivize"
      :remove="removeFromCollection"
      @collection-added="collectionAdded($event)"
    />
    <div
      v-if="
        !selected.length &&
        supports.multiSelect &&
        !$experiments.experiments.PROGRESSIVE_UI
      "
      class="float-right"
    >
      <slot name="multi-select-actions">
        <v-btn class="rounded-xl ml-2" variant="text" @click="selectAll()">
          <v-icon>mdi-plus</v-icon>
          &nbsp;{{ $t("gallery.selectAll") }}
        </v-btn>
      </slot>
    </div>
    <div
      v-if="
        selected.length &&
        supports.multiSelect &&
        !$experiments.experiments.PROGRESSIVE_UI
      "
      class="float-right"
    >
      <v-btn class="rounded-xl ml-2" variant="text" @click="download()">
        <v-icon class="mr-1">mdi-download</v-icon>
        {{ $t("gallery.downloadSelected") }}
      </v-btn>
      <slot
        :deselect-all="deselectAll"
        :select-all="selectAll"
        :selected="selected"
        name="multi-select-actions-length"
      >
        <v-btn class="rounded-xl ml-2" variant="text" @click="selectAll()">
          <v-icon class="mr-1">mdi-plus</v-icon>
          {{ $t("gallery.selectAll") }}
        </v-btn>
        <v-btn class="rounded-xl ml-2" variant="text" @click="deselectAll()">
          <v-icon class="mr-1">mdi-close</v-icon>
          {{ $t("gallery.deselectAll") }}
        </v-btn>
        <v-btn
          class="rounded-xl"
          color="red darken-1"
          variant="text"
          @click="$ui.shifting ? bulkDeleteConfirm() : (deleteConfirm = true)"
        >
          <v-icon class="mr-1">mdi-delete</v-icon>
          {{ $t("gallery.deleteSelected") }}
        </v-btn>
        <v-btn
          class="rounded-xl ml-2"
          variant="text"
          @click="bulkAddCollection()"
        >
          <v-icon class="mr-1">mdi-folder-multiple-image</v-icon>
          {{ $t("gallery.collectSelected") }}
        </v-btn>
      </slot>
    </div>
    <br v-if="!$experiments.experiments.PROGRESSIVE_UI" />
    <br v-if="!$experiments.experiments.PROGRESSIVE_UI" />
    <br v-if="!$experiments.experiments.PROGRESSIVE_UI" />
    <v-row v-if="!loading && items?.items?.length">
      <v-col
        v-for="item in items.items"
        :key="'item-' + item.id"
        :lg="!inline ? 4 : 12"
        cols="auto"
        md="6"
        sm="6"
        xl="3"
      >
        <GalleryItem
          :item="item"
          :selected="selected"
          :supports="{
            ...supports,
            collections: true,
            permissions: {
              ...supports.permissions,
              write: item.user ? item.user.id === $user.user?.id : true
            }
          }"
          @collectivize="
            addToCollectionDialog = true;
            collectivize = [$event];
          "
          @delete="$emit('delete', $event)"
          @refresh="$emit('refresh', $event)"
          @remove="$emit('remove', $event)"
          @select="select($event)"
        >
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </GalleryItem>
      </v-col>
    </v-row>
    <div v-else class="relative">
      <div
        v-if="!loading"
        class="absolute inset-0 flex z-10 mt-12 justify-center"
      >
        <div class="flex flex-col items-center">
          <RiUploadCloud2Line
            v-if="emptyType === 'empty'"
            size="100"
            class="cursor-pointer"
            @click="$app.dialogs.upload.value = true"
          />
          <RiCheckboxMultipleFill
            v-if="emptyType === 'upToDate'"
            size="100"
            class="cursor-pointer"
          />
          <RiSearchLine
            v-if="emptyType === 'noResults'"
            size="100"
            class="cursor-pointer"
          />
          <div class="text-center">
            <h2 class="text-2xl font-bold">
              {{ $t(`gallery.${emptyType}.title`) }}
            </h2>
            <p class="text-lg">
              {{ $t(`gallery.${emptyType}.description`) }}
            </p>
          </div>
        </div>
      </div>
      <v-row>
        <v-col
          v-for="item in 12"
          :key="item"
          :lg="!inline ? 4 : 12"
          cols="12"
          md="6"
          sm="6"
          xl="3"
        >
          <GalleryItem
            :class="{
              'opacity-25': !loading
            }"
            :loading="loading"
            :item="item"
          />
        </v-col>
      </v-row>
    </div>
    <Paginate
      v-model="pageComponent"
      :total-pages="items.pager?.totalPages"
      class="mt-10"
      @update:model-value="resetScroll()"
    />
    <small>
      Total Pages: {{ items.pager?.totalPages.toLocaleString() }}
      <v-btn
        v-if="
          supports.randomAttachment && !$experiments.experiments.PROGRESSIVE_UI
        "
        :loading="randomAttachmentLoading"
        style="float: right"
        @click="$emit('randomAttachment')"
      >
        Random Attachment
      </v-btn>
      <br />
      Total Items: {{ items.pager?.totalItems.toLocaleString() }}
    </small>
  </div>

  <WorkspaceDeleteDialog
    v-model="deleteConfirm"
    :title="`Delete ${selected.length} items?`"
    @submit="bulkDeleteConfirm()"
  />
  <!-- Progressive Action Bar options -->

  <teleport
    to="#appbar-options"
    v-if="$experiments.experiments.PROGRESSIVE_UI && $ui.ready"
  >
    <accessible-transition mode="out-in" name="slide-up" appear>
      <slot
        name="appbar-options"
        :items="items.items"
        :selected="selected"
        :emit="$emit"
      >
        <template v-if="!selected.length">
          <slot
            name="appbar-options-unselected"
            :items="items.items"
            :selected="selected"
            :emit="$emit"
          >
            <div class="flex gap-2">
              <v-btn
                icon
                size="small"
                :loading="randomAttachmentLoading"
                @click="$emit('randomAttachment')"
              >
                <v-tooltip activator="parent" location="bottom">
                  {{ $t("gallery.randomAttachment") }}
                </v-tooltip>
                <v-icon>mdi-dice-multiple</v-icon>
              </v-btn>
              <v-btn icon size="small" @click="selectAll()">
                <v-tooltip activator="parent" location="bottom">
                  {{ $t("gallery.selectAll") }}
                </v-tooltip>
                <RiAddLine class="action-bar-item" />
              </v-btn>
              <v-btn
                icon
                size="small"
                @click="$app.dialogs.upload.value = true"
              >
                <v-tooltip activator="parent" location="bottom">
                  {{ $t("generic.upload") }}
                </v-tooltip>
                <RiUploadCloud2Line class="action-bar-item" />
              </v-btn>
            </div>
          </slot>
        </template>
        <div v-else class="flex gap-2">
          <slot
            name="appbar-options-selected"
            :items="items"
            :selected="selected"
            :emit="$emit"
            :deselect-all="deselectAll"
            :select-all="selectAll"
            :bulk-add-collection="bulkAddCollection"
          >
            <v-btn
              icon
              size="small"
              :loading="randomAttachmentLoading"
              @click="$emit('randomAttachment')"
            >
              <v-tooltip activator="parent" location="bottom">
                {{ $t("gallery.randomAttachment") }}
              </v-tooltip>
              <v-icon>mdi-dice-multiple</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              @click="download()"
              :loading="downloadingLoading"
            >
              <v-tooltip activator="parent" location="bottom">
                {{ $t("gallery.downloadSelected") }}
              </v-tooltip>
              <RiDownloadLine class="action-bar-item" />
            </v-btn>

            <v-btn
              icon
              size="small"
              color="red"
              @click="
                $ui.shifting ? bulkDeleteConfirm() : (deleteConfirm = true)
              "
            >
              <v-tooltip activator="parent" location="bottom">
                {{ $t("gallery.deleteSelected") }}
              </v-tooltip>
              <RiDeleteBinLine class="action-bar-item" />
            </v-btn>
            <v-btn
              icon
              size="small"
              :color="$ui.shifting ? 'red' : 'blue'"
              @click="bulkAddCollection($ui.shifting)"
            >
              <v-tooltip activator="parent" location="bottom">
                <div
                  class="text-center"
                  v-html="
                    $ui.shifting
                      ? $t('gallery.removeFromCollectionBulk')
                      : $t('gallery.addToCollectionBulk')
                  "
                ></div>
              </v-tooltip>
              <component
                :is="$ui.shifting ? RiImageCloseLine : RiImageAddLine"
                class="action-bar-item"
                :style="{ fill: $ui.shifting ? '#F44336' : undefined }"
              />
            </v-btn>
            <v-btn icon size="small" @click="deselectAll()">
              <v-tooltip activator="parent" location="bottom">
                {{ $t("gallery.deselectAll") }}
              </v-tooltip>
              <RiCloseLine class="action-bar-item" />
            </v-btn>
            <v-btn
              icon
              size="small"
              :disabled="
                items.items
                  .map((i) => i.id)
                  .filter((i) => !selected.find((s) => s.id === i)).length === 0
              "
              @click="selectAll()"
            >
              <v-tooltip activator="parent" location="bottom">
                {{ $t("gallery.selectAll") }}
              </v-tooltip>
              <RiAddLine />
            </v-btn>
            <v-btn icon size="small" @click="$app.dialogs.upload.value = true">
              <v-tooltip activator="parent" location="bottom">
                {{ $t("generic.upload") }}
              </v-tooltip>
              <RiUploadCloud2Line class="action-bar-item" />
            </v-btn>
          </slot>
        </div>
      </slot>
    </accessible-transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";
import GalleryItem from "@/components/Gallery/GalleryItem.vue";
import AddToCollection from "@/components/Gallery/Dialogs/AddToCollection.vue";
import { CollectionCache } from "@/types/collection";
import Paginate from "@/components/Core/Paginate.vue";
import OCRMetadata from "@/components/Gallery/Dialogs/OCRMetadata.vue";
import { Pager, Upload } from "@/gql/graphql";
import {
  RiAddLine,
  RiCheckboxMultipleFill,
  RiCloseLine,
  RiCollageFill,
  RiCollageLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiFolderImageFill,
  RiImageAddLine,
  RiSearchLine,
  RiUploadCloud2Line,
  RiUploadLine
} from "@remixicon/vue";
import { NavigationOption, RailMode } from "@/store/progressive.store";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import RiImageCloseLine from "@/components/Icons/v5/ri-image-close-line.vue";
import WorkspaceDeleteDialog from "@/components/Workspaces/Dialogs/Delete.vue";
import RiCheckLine from "@/components/Icons/v5/ri-check-line.vue";

export default defineComponent({
  components: {
    RiCheckboxMultipleFill,
    RiSearchLine,
    RiCheckLine,
    WorkspaceDeleteDialog,
    RiImageCloseLine,
    RiDownloadLine,
    AccessibleTransition,
    RiUploadCloud2Line,
    RiDeleteBinLine,
    RiCloseLine,
    RiUploadLine,
    RiAddLine,
    OCRMetadata,
    Paginate,
    AddToCollection,
    GalleryItem
  },
  props: {
    randomAttachmentLoading: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    items: {
      type: Object as () => {
        items: Upload[];
        pager: Pager;
      },
      default: () => {
        return {
          gallery: [],
          pager: {
            totalItems: 0,
            totalPages: 0
          }
        };
      }
    },
    page: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    supports: {
      type: Object,
      default: () => {
        return {
          multiSelect: false,
          randomAttachment: false,
          pins: false,
          permissions: {
            read: true,
            write: true,
            configure: true
          }
        };
      }
    },
    searched: {
      type: Boolean
    }
  },
  emits: [
    "delete",
    "refresh",
    "remove",
    "randomAttachment",
    "updateItem",
    "page-change"
  ],
  data() {
    return {
      addToCollectionDialog: false,
      removeFromCollection: false,
      collectivize: [] as Upload[],
      selected: [] as Upload[],
      downloadingLoading: false,
      deleteConfirm: false
    };
  },
  computed: {
    RiImageCloseLine() {
      return RiImageCloseLine;
    },
    RiFolderImageFill() {
      return RiFolderImageFill;
    },
    RiImageAddLine() {
      return RiImageAddLine;
    },
    pageComponent: {
      get() {
        return this.page;
      },
      set(value: number) {
        this.$emit("page-change", value);
      }
    },
    emptyType() {
      if (this.$route.path.startsWith("/autoCollect/")) {
        return "upToDate";
      } else if (this.searched) {
        return "noResults";
      } else {
        return "empty";
      }
    }
  },
  methods: {
    download() {
      this.downloadingLoading = true;
      this.axios
        .post(
          "/gallery/download",
          {
            items: this.selected.map((i) => i.id)
          },
          {
            responseType: "blob"
          }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(
            new Blob([response.data], {
              type: "application/zip"
            })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `gallery-${this.$date().format("YYYY-MM-DD-HH-mm-ss")}.zip`
          );
          document.body.appendChild(link);
          link.click();
        })
        .finally(() => {
          this.downloadingLoading = false;
        });
    },
    resetScroll() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    collectionAdded({
      collection,
      items
    }: {
      collection: CollectionCache;
      items: number[] | number;
    }) {
      console.log("collectionAdded", collection, items);
      if (Array.isArray(items)) {
        for (const item of items) {
          this.$emit("updateItem", { item, collection });
        }
      } else {
        this.$emit("updateItem", { item: items, collection });
      }
      this.selected = [];
    },
    select(item: Upload) {
      if (this.selected.find((i) => i.id === item.id)) {
        this.selected = this.selected.filter((upload) => upload.id !== item.id);
      } else {
        this.selected.push(item);
      }
    },
    bulkAddCollection(remove: boolean = false) {
      this.removeFromCollection = remove;
      this.addToCollectionDialog = true;
      this.collectivize = this.selected;
    },
    async bulkDeleteConfirm() {
      this.deleteConfirm = false;
      await this.axios.post("/gallery/delete", {
        items: this.selected.map((i) => i.id)
      });
      this.$emit("refresh");
      this.$toast.success("Deleted selected items!");
      this.deselectAll();
    },
    selectAll() {
      this.selected = this.items.items;
    },
    deselectAll() {
      this.selected = [];
    },
    setAppBar() {
      const collection = this.$collections.persistent.find(
        (c) =>
          c.id === parseInt(this.$route.params.id) ||
          c.shareLink === this.$route.params.id
      );
      const option = {
        icon: markRaw(RiCollageLine),
        name: collection?.name,
        path: `${
          this.$route.path.startsWith("/autoCollect/")
            ? "/autoCollect"
            : "/collections"
        }/${collection?.id}`,
        selectedIcon: markRaw(RiCollageFill)
      };
      let rail: NavigationOption[] = [];
      if (this.$route.path.startsWith("/autoCollect/")) {
        rail.push(
          this.$ui.navigation.options[RailMode.GALLERY].find(
            (i) => i.path === "/autoCollect"
          )
        );
      }

      if (this.page !== 1 || this.$route.params.page) {
        rail.push(option);
      }

      this.$ui.currentNavItem = {
        item:
          this.page === 1 && !this.$route.params.page
            ? option
            : {
                name: `Page ${this.page}`,
                path: this.$route.path
              },
        rail
      };
    }
  },
  mounted() {
    this.setAppBar();
    this.$ui.navigationMode = RailMode.GALLERY;
  },
  watch: {
    "$route.params.page"() {
      this.setAppBar();
    }
  }
});
</script>
