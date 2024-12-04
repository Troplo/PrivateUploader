<template>
  <div>
    <div
      style="z-index: 0"
      class="d-flex justify-center flex-column align-center w-full position-absolute h-full"
      v-if="!rendered"
    >
      <iframe
        src="https://flowforms.troplo.com"
        class="w-full h-full"
        ref="module"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { useModulesStore } from "@/store/modules.store";
import FlowinityLogoAnimated from "@/components/Brand/FlowinityLogoAnimated.vue";

const modulesStore = useModulesStore();

const rendered = ref(false);
const module = ref<HTMLElement | null>(null);

const props = defineProps({
  id: String
});

// onMounted(() => {
//   modulesStore.mount("FlowForms");
//   // check every 50ms
//   // TODO: find a better way to detect if the module is rendered
//   const interval = setInterval(() => {
//     if (module.value?.children.length) {
//       clearInterval(interval);
//       rendered.value = true;
//     }
//   }, 50);
// });
</script>
<style scoped></style>
