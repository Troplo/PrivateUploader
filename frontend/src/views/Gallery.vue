<template>
  <component
    v-bind="$props"
    :is="
      experiments.experiments.GALLERY_INFINITE_SCROLL
        ? GalleryInfinite
        : GalleryPaginated
    "
    ref="galleryRef"
  >
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </component>
</template>
<script setup lang="ts">
import GalleryInfinite from "@/views/GalleryInfinite.vue";
import GalleryPaginated from "@/views/GalleryPaginated.vue";
import { ref } from "vue";
import { useExperimentsStore } from "@/store/experiments.store";

const galleryRef = ref(null);
const experiments = useExperimentsStore();

defineExpose({
  gallery: galleryRef
});
</script>
