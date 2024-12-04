<template>
  <div
    :id="`dev-overlay-${id}`"
    class="dev-overlay"
    :style="{ zIndex }"
    :class="{
      foreground: sortedDialogs.slice().reverse()[0]?.id === id,
      collapsed
    }"
    @click="
      debugStore.dialogs.find((dialog) => dialog.id === id)
        ? (debugStore.dialogs.find(
            (dialog) => dialog.id === id
          ).lastInteracted = Date.now())
        : () => {}
    "
  >
    <div
      :id="`dev-header-${id}`"
      class="dev-header unselectable flex justify-between items-center"
    >
      <div class="flex gap-2 items-center">
        <slot name="header"></slot>
      </div>
      <div>
        <v-btn size="x-small" icon @click="collapsed = !collapsed">
          <v-icon v-if="!collapsed">mdi-arrow-collapse</v-icon>
          <v-icon v-else>mdi-arrow-expand</v-icon>
        </v-btn>
        <v-btn size="x-small" icon class="float-right" @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useDebugStore } from "@/store/debug.store";

const id = `tpu-dev-${Math.random().toString(36).substring(2, 10)}`;
const debugStore = useDebugStore();

onMounted(() => {
  drag(document.getElementById(`dev-overlay-${id}`));
  debugStore.dialogs.push({
    id,
    lastInteracted: Date.now() + 100
  });
});

const sortedDialogs = computed(() => {
  return debugStore.dialogs
    .slice()
    .sort((a, b) => a.lastInteracted - b.lastInteracted);
});

const zIndex = computed(() => {
  return sortedDialogs.value.findIndex((dialog) => dialog.id === id) + 10000;
});

onUnmounted(() => {
  debugStore.dialogs = debugStore.dialogs.filter((dialog) => dialog.id !== id);
});

const collapsed = ref(false);

function drag(element: any) {
  try {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(`dev-header-${id}`)) {
      document.getElementById(`dev-header-${id}`).onmousedown = dragMouseDown;
    } else {
      element.onmousedown = dragMouseDown;
    }

    // eslint-disable-next-line no-inner-declarations
    function dragMouseDown(e: any) {
      e = e || window.event;
      e.preventDefault();
      debugStore.dialogs.find((dialog) => dialog.id === id).lastInteracted =
        Date.now();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    // eslint-disable-next-line no-inner-declarations
    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = element.offsetTop - pos2 + "px";
      element.style.left = element.offsetLeft - pos1 + "px";
    }

    // eslint-disable-next-line no-inner-declarations
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  } catch (e) {
    console.log(e);
    this.$toast.error("Error while initializing dev overlay");
  }
}
</script>
