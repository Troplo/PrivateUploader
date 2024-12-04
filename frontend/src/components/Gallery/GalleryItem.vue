<template>
  <div>
    <v-card v-if="item.id" :id="'item-' + item.id" class="d-flex flex-column">
      <v-toolbar
        :class="{
          unselectable: selected.length,
          'cursor-pointer': selected.length
        }"
        style="z-index: 1"
        :color="
          selected.find((select) => select.id === item.id)
            ? '#006fab'
            : undefined
        "
        @click.prevent.stop="
          selected.length && supports.multiSelect ? $emit('select', item) : null
        "
      >
        <v-toolbar-title>{{ item.name }}</v-toolbar-title>
        <v-btn
          v-if="!$vuetify.display.mobile && supports.multiSelect"
          icon
          @click.prevent.stop="$emit('select', item)"
        >
          <RiCheckboxCircleFill
            v-if="selected.find((select) => select.id === item.id)"
          />
          <RiCircleLine v-else />
        </v-btn>
      </v-toolbar>
      <GalleryPreview :item="item" />
      <v-card-subtitle class="mt-3">
        {{ $t("generic.type") }}:
        {{
          item.type === "paste"
            ? "Legacy Paste"
            : String(item.type).charAt(0).toUpperCase() +
              String(item.type).slice(1)
        }}
      </v-card-subtitle>
      <v-card-subtitle>
        {{ $t("generic.originalName") }}: {{ item.originalFilename }}
      </v-card-subtitle>

      <v-card-subtitle>
        {{ $t("generic.uploadedName") }}: {{ item.attachment }}
      </v-card-subtitle>

      <v-card-subtitle>
        {{ $t("generic.createdAt") }}:
        {{ $date(item.createdAt).format("Do of MMMM YYYY, h:mm A") }}
      </v-card-subtitle>
      <v-card-subtitle>
        {{ $t("generic.size") }}: {{ fileSize }}
      </v-card-subtitle>
      <slot :item="item" name="custom-values"></slot>
      <div class="ml-4">
        <slot :item="item" name="custom-properties" />
        <v-chip-group class="mb-1">
          <HoverChip
            v-if="supports.permissions.write && supports.collections"
            :text="$t('gallery.collectSelected')"
            :icon="RiAddLine"
            @click="$emit('collectivize', item)"
          />
          <v-chip
            v-for="collection in item.collections"
            :key="collection.id"
            :disabled="!$user.user"
            :to="'/collections/' + collection.id"
          >
            {{ collection.name }}
            <v-icon
              v-if="supports.permissions.write"
              class="ml-1"
              @click.prevent="removeItem(item, collection)"
            >
              <RiCloseLine />
            </v-icon>
          </v-chip>
        </v-chip-group>
      </div>
      <v-divider />
      <v-card-text class="text-center">
        <slot :item="item" name="actions">
          <HoverChip
            v-if="supports.permissions.write"
            :aria-label="$t('gallery.actions.delete.aria')"
            :text="$t('gallery.actions.delete.text')"
            class="my-1"
            color="red"
            :icon="RiDeleteBinLine"
            @click.shift.prevent.stop="$app.deleteItem(item)"
            @click.prevent.stop="
              $event.shiftKey ? null : ($app.dialogs.deleteItem.item = item);
              $event.shiftKey ? null : ($app.dialogs.deleteItem.value = true);
            "
          />
          <HoverChip
            :aria-label="$t('gallery.actions.link.aria')"
            :text="$t('gallery.actions.link.text')"
            class="my-1"
            color="teal"
            :icon="RiFileCopyLine"
            @click="
              $functions.copy(
                `https://${$user.user?.domain.domain || 'i.troplo.com'}/i/${
                  item.attachment
                }`
              );
              $toast.success($t('generic.copied'));
            "
          />
          <HoverChip
            :aria-label="$t('gallery.actions.download.aria')"
            :href="$app.domain + item.attachment + '?force=true'"
            :text="$t('gallery.actions.download.text')"
            class="my-1"
            color="primary"
            :icon="RiDownloadLine"
          />
          <HoverChip
            v-if="item.type === 'image'"
            :aria-label="$t('gallery.actions.ocr.aria')"
            :text="$t('gallery.actions.ocr.text')"
            class="my-1"
            color="green"
            :icon="RiCharacterRecognitionLine"
            :disabled="!item.textMetadata"
            @click.right.prevent.stop="
              $functions.copy(item.textMetadata);
              $toast.success('Copied to clipboard!');
            "
            @click="
              $app.dialogs.ocr.text = item.textMetadata;
              $app.dialogs.ocr.value = true;
            "
          />
          <HoverChip
            v-if="$user.user"
            :aria-label="$t('gallery.actions.star.aria')"
            :icon="item.starred ? RiStarFill : RiStarLine"
            :text="$t('gallery.actions.star.text')"
            class="my-1"
            color="amber-darken-2"
            @click="star(item)"
          />
          <HoverChip
            v-if="$user.user && item.item && supports.pins"
            :aria-label="$t('gallery.actions.pin.aria')"
            :icon="item.item.pinned ? RiPushpinFill : RiPushpinLine"
            :text="$t('gallery.actions.pin.text')"
            class="my-1"
            color="lime"
            @click="pin(item)"
          />
        </slot>
      </v-card-text>
    </v-card>
    <v-skeleton-loader
      v-else
      class="rounded-xl"
      type="heading, image, paragraph, chip, chip, chip, chip, chip"
      :boilerplate="!loading"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
import HoverChip from "@/components/Core/HoverChip.vue";
import { Upload } from "@/models/upload";
import { Collection } from "@/models/collection";
import {
  RiAddLine,
  RiCharacterRecognitionLine,
  RiCheckboxCircleFill,
  RiCheckboxFill,
  RiCheckboxLine,
  RiCircleFill,
  RiCircleLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiFileCopyLine,
  RiPushpinFill,
  RiPushpinLine,
  RiRadioFill,
  RiRadioLine,
  RiStarFill,
  RiStarLine
} from "@remixicon/vue";

export default defineComponent({
  components: {
    RiCircleFill,
    RiCircleLine,
    RiCheckboxCircleFill,
    RiCheckboxLine,
    RiCheckboxFill,
    RiRadioLine,
    RiRadioFill,
    RiCloseLine,
    HoverChip,
    GalleryPreview
  },
  props: ["item", "supports", "selected", "loading"],
  emits: ["delete", "refresh", "remove", "select", "collectivize"],
  computed: {
    RiAddLine() {
      return RiAddLine;
    },
    RiDeleteBinLine() {
      return RiDeleteBinLine;
    },
    RiPushpinLine() {
      return RiPushpinLine;
    },
    RiPushpinFill() {
      return RiPushpinFill;
    },
    RiStarLine() {
      return RiStarLine;
    },
    RiStarFill() {
      return RiStarFill;
    },
    RiCharacterRecognitionLine() {
      return RiCharacterRecognitionLine;
    },
    RiDownloadLine() {
      return RiDownloadLine;
    },
    RiFileCopyLine() {
      return RiFileCopyLine;
    },
    fileSize() {
      return this.$functions.fileSize(this.item.fileSize);
    }
  },
  watch: {
    "$app.dialogs.deleteItem.emit"(value: boolean) {
      if (value) {
        this.$app.dialogs.deleteItem.emit = false;
        this.$emit("delete", this.$app.dialogs.deleteItem.item);
        this.$app.dialogs.deleteItem.item = undefined;
      }
    }
  },
  methods: {
    async pin(item: Upload) {
      await this.axios.patch(
        `/collections/${this.item.item.collectionId}/pin/${item.item.id}`
      );
      item.item.pinned = !item.item.pinned;
      this.$emit("refresh", true);
    },
    async star(item: Upload) {
      await this.axios.post("/gallery/star/" + item.attachment);
      item.starred = !item.starred;
    },
    async removeItem(item: Upload, collection: Collection) {
      await this.axios.delete(
        `/collections/${collection.id}/remove/${item.id}`
      );
      this.$emit("remove", {
        item,
        collection
      });
    }
  }
});
</script>
