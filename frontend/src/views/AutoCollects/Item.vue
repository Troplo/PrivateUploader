<template>
  <UserBanner
    v-if="collection && !$experiments.experiments.PROGRESSIVE_UI"
    :collection="collection"
    @refresh-user="getCollection"
  >
    <v-card-title>
      {{ collection.name }}
    </v-card-title>
    <v-card-text v-if="collection.users.length" class="mt-n3">
      <v-icon>mdi-swap-horizontal</v-icon>
      {{ collection.user.username }},
      {{ collection.users.map((user) => user.user.username).join(", ") }}
    </v-card-text>
  </UserBanner>
  <v-container v-if="collection">
    <Gallery
      ref="gallery"
      :type="GalleryType.AutoCollect"
      :name="`${collection.name} AutoCollects`"
      :path="`/autoCollect/${collection.id}`"
      :supports="{
        multiSelect: true,
        randomAttachment: false,
        search: true,
        permissions: {
          read: true,
          write: true,
          configure: true
        }
      }"
    >
      <!-- Progressive UI Options -->
      <template
        v-slot:appbar-options-selected="{
          selected,
          items,
          deselectAll,
          selectAll,
          bulkAddCollection
        }"
      >
        <v-btn
          icon
          size="small"
          color="green"
          @click="
            act(selected, 'approve');
            deselectAll();
          "
        >
          <v-tooltip activator="parent" location="bottom">
            {{ $t("autoCollects.item.approveAll") }}
          </v-tooltip>
          <RiCheckLine class="action-bar-item" />
        </v-btn>
        <v-btn
          icon
          size="small"
          color="red"
          @click="
            act(selected, 'deny');
            deselectAll();
          "
        >
          <v-tooltip activator="parent" location="bottom">
            {{ $t("autoCollects.item.rejectAll") }}
          </v-tooltip>
          <RiCloseLine class="action-bar-item" />
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
      </template>

      <!-- Classic UI Options -->
      <template v-slot:multi-select-actions-length="slotProps: any">
        <v-btn class="rounded-xl ml-2" @click="slotProps.selectAll()">
          <v-icon>mdi-plus</v-icon>
          &nbsp;Select all
        </v-btn>
        <v-btn class="rounded-xl ml-2" @click="slotProps.deselectAll()">
          <v-icon>mdi-close</v-icon>
          &nbsp;Unselect all
        </v-btn>
        <v-btn
          class="rounded-xl"
          color="red darken-1"
          @click="
            act(slotProps.selected, 'deny');
            slotProps.deselectAll();
          "
        >
          <v-icon>mdi-close</v-icon>
          Reject all
        </v-btn>
        <v-btn
          class="rounded-xl ml-2"
          color="success"
          @click="
            act(slotProps.selected, 'approve');
            slotProps.deselectAll();
          "
        >
          <v-icon>mdi-check</v-icon>
          &nbsp;Accept all
        </v-btn>
      </template>
      <template v-slot:actions="{ item }: any">
        <HoverChip
          color="green"
          icon="mdi-check"
          text="Approve"
          @click="act(item.autoCollectApproval.id, 'approve')"
        />
        <HoverChip
          color="red"
          icon="mdi-close"
          text="Reject"
          @click="act(item.autoCollectApproval.id, 'deny')"
        />
        <HoverChip
          class="my-1"
          color="teal"
          icon="mdi-content-copy"
          text="Link"
          @click="$functions.copy($app.domain + item.attachment)"
        />
      </template>
    </Gallery>
  </v-container>
</template>

<script lang="ts">
import { CollectionCache } from "@/types/collection";
import { defineComponent, h, markRaw } from "vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import CollectionBanner from "@/components/Collections/CollectionBanner.vue";
import { Upload } from "@/models/upload";
import HoverChip from "@/components/Core/HoverChip.vue";
import Gallery from "@/views/Gallery.vue";
import { GalleryType } from "@/gql/graphql";
import {
  RiAddLine,
  RiCloseLine,
  RiCollageFill,
  RiCollageLine,
  RiImageAddLine
} from "@remixicon/vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { RailMode } from "@/store/progressive.store";
import UserBanner from "@/components/Users/UserBanner.vue";
import RiCheckLine from "@/components/Icons/v5/ri-check-line.vue";
import RiImageCloseLine from "@/components/Icons/v5/ri-image-close-line.vue";
import { isNumeric } from "@/plugins/isNumeric";

export default defineComponent({
  name: "AutoCollectsItem",
  computed: {
    RiImageCloseLine() {
      return RiImageCloseLine;
    },
    RiImageAddLine() {
      return RiImageAddLine;
    },
    GalleryType() {
      return GalleryType;
    }
  },
  components: {
    RiCloseLine,
    RiAddLine,
    RiCheckLine,
    UserBanner,
    Gallery,
    HoverChip,
    CollectionBanner,
    GalleryNavigation,
    GalleryCore
  },
  data() {
    return {
      collection: undefined as CollectionCache | undefined,
      gallery: {
        items: [] as Upload[]
      },
      page: 1,
      show: {
        search: "",
        metadata: "",
        selected: "all"
      }
    };
  },
  methods: {
    /**
     *
     * @param id Upload[] used in Progressive UI, number[] used in Classic UI
     * @param action
     */
    async act(id: number | number[] | Upload[], action: "approve" | "deny") {
      if (typeof id === "object") {
        const applicable = id.map((id) => {
          if (isNumeric(id)) {
            const objectWithID = this.$refs.gallery.gallery.gallery.items.find(
              (upload) => upload.id === id
            );
            return objectWithID ? objectWithID.autoCollectApproval.id : null;
          } else {
            return id.autoCollectApproval.id;
          }
        });
        for (const item of applicable) {
          this.$refs.gallery.gallery.gallery.items =
            this.$refs.gallery.gallery.gallery.items.filter(
              (i) => i.autoCollectApproval.id !== item
            );
        }
        await this.axios.post(`/autoCollects/bulk`, {
          action,
          ids: applicable
        });
      } else {
        this.$refs.gallery.gallery.gallery.items =
          this.$refs.gallery.gallery.gallery.items.filter(
            (i) => i.autoCollectApproval.id !== id
          );
        await this.axios.post(`/autoCollects/${id}`, {
          action
        });
      }
      const type =
        action === "approve"
          ? "auto-collect-accepted"
          : "auto-collect-rejected";
      this.$functions.doSinglePulse(type, {
        collectionId: this.collection?.id,
        count: 1
      });
      this.$toast.success("Action performed");
      if (!this.$refs.gallery.gallery.gallery.items.length)
        await this.$router.push(`/autoCollect`);
    },
    updateItem({
      item,
      collection
    }: {
      item: number;
      collection: CollectionCache;
    }) {
      const index = this.gallery.gallery.findIndex((i: any) => i.id === item);
      if (index === -1) return;
      this.gallery.gallery[index] = {
        ...this.gallery.gallery[index],
        collections: [
          ...(this.gallery.gallery[index]?.collections || []),
          collection
        ]
      };
    },
    async getCollection() {
      this.$app.componentLoading = true;
      const data = await this.$collections.getCollection(this.$route.params.id);
      console.log(data);
      this.$app.componentLoading = false;
      this.collection = data;
      if (this.collection)
        this.$app.title = this.collection.name + " - AutoCollects";

      this.$ui.appBarImage = this.collection?.banner
        ? this.$app.domain + this.collection?.banner
        : null;

      if (this.$ui.appBarImage) {
        this.$ui.appBarType = "collapse";
        this.$ui.appBarHeight = 256;
      } else {
        this.$ui.appBarType = "stick";
      }
    },
    selectAll(selected: any[]) {
      //
    },
    deselectAll(selected: any[]) {
      //
    }
  },
  mounted() {
    this.getCollection();
    this.$app.title = "AutoCollects";
  },
  unmounted() {
    this.$ui.appBarImage = null;
    this.$ui.appBarType = "stick";
    this.$ui.appBarHeight = 64;
  }
});
</script>
