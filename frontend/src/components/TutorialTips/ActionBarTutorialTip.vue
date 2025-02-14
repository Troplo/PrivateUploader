<template>
  <v-tooltip
    activator="parent"
    location="bottom"
    content-class="social-hub-tip"
    max-width="350"
    :close-on-back="false"
    :close-on-content-click="false"
    :no-click-animation="true"
  >
    <v-card color="default" density="compact" style="pointer-events: all">
      <template #title>This is the Action Bar!</template>
      <template #text>
        <p>Across {{ appStore.site.name }}, you'll find common actions here.</p>
        <strong>Click the "Upload" button to continue!</strong>
        <small
          class="float-right cursor-pointer pa-4"
          @click="
            experimentsStore.setExperiment(
              'REGISTER_INTRO',
              SkipRegisterStepStage.GALLERY_ACTION_BAR
            )
          "
        >
          Skip tutorial
        </small>
      </template>
    </v-card>
  </v-tooltip>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { SkipRegisterStepStage } from "@/views/Auth/registerSteps";

const appStore = useAppStore();
const experimentsStore = useExperimentsStore();
</script>

<style>
.social-hub-tip {
  background: transparent !important;
  border: none !important;
}
</style>
