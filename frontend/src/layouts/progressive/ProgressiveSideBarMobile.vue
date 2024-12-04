<template>
  <v-navigation-drawer
    id="sidebar"
    v-model="$app.mainDrawer"
    style="min-width: 328px; max-width: 328px; z-index: 2000"
    :class="{ 'sidebar-patch': !$vuetify.display.mobile }"
    color="dark"
    elevation="0"
    class="no-scroll"
    width="328"
  >
    <div class="flex h-full">
      <ProgressiveSuperBarContent
        style="min-width: 72px; max-width: 72px"
        class="overflow-y-auto"
      />
      <div class="overflow-y-auto">
        <ProgressiveSideBarContent />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import ProgressiveSideBarContent from "@/layouts/progressive/ProgressiveSideBarContent.vue";
import ProgressiveSuperBarContent from "@/layouts/progressive/ProgressiveSuperBarContent.vue";
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
