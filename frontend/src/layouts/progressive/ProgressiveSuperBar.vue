<template>
  <v-navigation-drawer
    v-model="$app.mainDrawer"
    rail
    class="superbar sticky z-50 pb-2 space-x-1 flex flex-col overflow-y-auto overflow-x-hidden flowinity-border border-r-2"
    style="
      scrollbar-width: none;
      min-width: 72px;
      max-width: 72px;
      width: 72px;
      border-right-width: 1px;
      border-right-style: solid;
    "
    :class="{ 'sidebar-patch': !$vuetify.display.mobile }"
    color="dark"
    elevation="0"
  >
    <ProgressiveSuperBarContent />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import ProgressiveSuperBarContent from "@/layouts/progressive/ProgressiveSuperBarContent.vue";
</script>

<style>
.superbar,
.superbar-content {
  scrollbar-width: none;
}
.superbar::-webkit-scrollbar {
  display: none;
}

.superbar .v-navigation-drawer__content,
.superbar,
.superbar-content {
  overflow-x: hidden !important;
  overflow-y: inherit !important;
}
</style>
