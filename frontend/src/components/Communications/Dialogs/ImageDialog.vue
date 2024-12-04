<template>
  <v-dialog
    :model-value="modelValue"
    :width="width"
    max-width="800px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card v-if="$chat.dialogs.image.object">
      <v-img
        max-height="500px"
        :width="width"
        :height="height"
        :src="
          $chat.dialogs.image.object?.isInternal
            ? $app.domain + $chat.dialogs.image.object?.attachment
            : $chat.dialogs.image.object?.proxyUrl
        "
      />
    </v-card>
    <a
      class="text-grey pointer v-card py-2 rounded-xl px-2 hover-shade"
      style="
        background: rgb(var(--v-theme-toolbar));
        position: absolute;
        bottom: 10px;
        right: 10px;
      "
      @click="
        $chat.processLink(
          $chat.dialogs.image.object?.url ||
            $app.domain + $chat.dialogs.image.object.attachment
        )
      "
    >
      <v-tooltip location="top" activator="parent">
        {{ domain }}
      </v-tooltip>
      <span>
        <v-icon size="18" class="mx-1">mdi-open-in-new</v-icon>
      </span>
    </a>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["modelValue"],
  emits: ["update:modelValue"],
  computed: {
    width() {
      if (!this.$chat.dialogs.image.object) return 0;
      return this.$chat.dialogs.image.object?.width * 2;
    },
    height() {
      if (!this.$chat.dialogs.image.object) return 0;
      return this.$chat.dialogs.image.object?.height * 2.5;
    },
    domain() {
      try {
        if (this.$chat.dialogs.image.object?.isInternal)
          return new URL(this.$app.domain).hostname;
        return this.$chat.dialogs.image.object?.url
          ? new URL(this.$chat.dialogs.image.object?.url).hostname
          : new URL(this.$chat.dialogs.image.object?.proxyUrl).hostname;
      } catch (e) {
        return "Open in new tab";
      }
    }
  }
});
</script>
