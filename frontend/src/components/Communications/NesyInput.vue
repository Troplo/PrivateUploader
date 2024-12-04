<template>
  <v-toolbar
    ref="toolbar"
    :color="editing ? 'transparent' : 'dark'"
    height="auto"
  >
    <v-textarea
      ref="textarea"
      :class="!editing ? 'mb-n5 mt-1' : 'mt-2'"
      :value="modelValue"
      auto-grow
      :autofocus="true"
      color="primary"
      density="compact"
      label="Type a message..."
      placeholder="Keep it civil."
      rows="1"
      variant="outlined"
      @update:model-value="$emit('update:modelValue', $event)"
      @keydown.enter.exact.prevent="$emit('sendMessage')"
      @click:append="$emit('sendMessage')"
      @keyup.esc="$emit('edit', null)"
    >
      <template v-if="!editing" #prepend>
        <HoverChip :old="true" icon="plus" text="Attachment" />
      </template>
      <template #append-inner>
        <HoverChip :old="true" icon="mdi-star" text="Star" />
        <HoverChip :old="true" icon="mdi-emoticon" text="Emoji Picker" />
      </template>
      <template #append>
        <HoverChip :old="true" icon="mdi-send" text="Send" />
      </template>
    </v-textarea>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HoverChip from "@/components/Core/HoverChip.vue";

export default defineComponent({
  components: { HoverChip },
  props: ["modelValue", "editing"],
  emits: ["update:modelValue", "sendMessage", "edit"]
});
</script>
