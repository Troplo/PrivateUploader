<template>
  <v-navigation-drawer
    id="sidebar"
    v-model="$app.mainDrawer"
    style="min-width: 256px; max-width: 256px; z-index: 2000"
    :class="{ 'sidebar-patch': !$vuetify.display.mobile }"
    :style="{ left: !$app.mainDrawer ? '0' : '72px' }"
    color="dark"
    elevation="0"
    class="no-scroll"
  >
    <ProgressiveSideBarContent />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import ProgressiveSideBarContent from "@/layouts/default/ProgressiveSideBarContent.vue";
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-active {
  opacity: 0;
  overflow: hidden;
}

.no-scroll * {
  scrollbar-width: none;
}
</style>

<style scoped></style>
