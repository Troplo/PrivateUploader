<template>
  <div id="gallery-core">
    <drag-select v-model="selected">
      <OCRMetadata v-model="$app.dialogs.ocr.value" />
      <AddToCollection
        v-model="addToCollectionDialog"
        :items="collectivize"
        @collection-added="collectionAdded($event)"
      />
      <div v-if="!selected.length && supports.multiSelect" class="float-right">
        <slot name="multi-select-actions">
          <v-btn class="rounded-xl ml-2" variant="text" @click="selectAll()">
            <v-icon>add-line</v-icon>
            &nbsp;{{ $t("gallery.selectAll") }}
          </v-btn>
        </slot>
      </div>
      <div v-if="selected.length && supports.multiSelect" class="float-right">
        <slot
          :deselect-all="deselectAll"
          :select-all="selectAll"
          :selected="selected"
          name="multi-select-actions-length"
        >
          <v-btn class="rounded-xl ml-2" variant="text" @click="selectAll()">
            <v-icon class="mr-1">add-line</v-icon>
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
            @click="bulkDeleteConfirm()"
          >
            <v-icon class="mr-1">close-line</v-icon>
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
      <br />
      <br />
      <v-row>
        <v-col
          v-for="item in items.items"
          :key="'item-' + item.id"
          :lg="!inline ? 3 : 12"
          cols="12"
          md="6"
          sm="1"
          :value="item.id"
        >
          <drag-select-option :value="item.id">
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
                collectivize = $event;
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
          </drag-select-option>
        </v-col>
      </v-row>
      <v-row v-if="loading">
        <v-col
          v-for="item in 12"
          :key="item"
          :lg="!inline ? 3 : 12"
          cols="12"
          md="6"
          sm="1"
        >
          <GalleryItem :item="item" />
        </v-col>
      </v-row>
      <infinite-loading
        identifier="gallery-bottom"
        @infinite="
          $emit('refreshGallery', { state: $event, page: pageComponent++ })
        "
      >
        <template #spinner>
          <div class="text-center">
            <v-progress-circular
              :size="36"
              :width="2"
              indeterminate
              :model-value="1"
            />
          </div>
        </template>
        <template #complete>
          <span />
        </template>
      </infinite-loading>
      <template v-if="false">
        <Paginate
          v-model="pageComponent"
          :total-pages="items.pager?.totalPages"
          class="mt-10"
          @update:model-value="resetScroll()"
        />
        <small>
          Total Pages: {{ items.pager?.totalPages.toLocaleString() }}
          <v-btn
            v-if="supports.randomAttachment"
            :loading="randomAttachmentLoading"
            style="float: right"
            @click="$emit('randomAttachment')"
          >
            Random Attachment
          </v-btn>
          <br />
          Total Items: {{ items.pager?.totalItems.toLocaleString() }}
        </small>
      </template>
    </drag-select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryItem from "@/components/Gallery/GalleryItem.vue";
import AddToCollection from "@/components/Gallery/Dialogs/AddToCollection.vue";
import { CollectionCache } from "@/types/collection";
import Paginate from "@/components/Core/Paginate.vue";
import OCRMetadata from "@/components/Gallery/Dialogs/OCRMetadata.vue";
import { Pager, Upload } from "@/gql/graphql";
import InfiniteLoading from "@/components/Scroll/InfiniteScroll.vue";
import { DragSelect, DragSelectOption } from "@/components/DragToSelect";

export default defineComponent({
  components: {
    DragSelectOption,
    DragSelect,
    InfiniteLoading,
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
    }
  },
  emits: [
    "refresh",
    "updateItem",
    "page-change",
    "randomAttachment",
    "refreshGallery",
    "delete",
    "remove"
  ],
  data() {
    return {
      addToCollectionDialog: false,
      collectivize: [] as Upload[],
      selected: [] as Upload[]
    };
  },
  computed: {
    pageComponent: {
      get() {
        return this.page;
      },
      set(value: number) {
        this.$emit("page-change", value);
      }
    }
  },
  methods: {
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
      if (this.selected.includes(item.id)) {
        this.selected = this.selected.filter((i: number) => i !== item.id);
      } else {
        this.selected.push(item.id);
      }
    },
    bulkAddCollection() {
      this.addToCollectionDialog = true;
      this.collectivize = this.selected;
    },
    async bulkDeleteConfirm() {
      await this.axios.post("/gallery/delete", {
        items: this.selected
      });
      this.$emit("refresh");
      this.$toast.success("Deleted selected items!");
    },
    selectAll() {
      this.selected = this.items.items.map((i: Upload) => i.id);
    },
    deselectAll() {
      this.selected = [];
    }
  }
});
</script>
