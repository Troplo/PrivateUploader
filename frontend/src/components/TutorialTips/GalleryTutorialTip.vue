<template>
  <v-tooltip
    activator="parent"
    location="right"
    content-class="social-hub-tip"
    max-width="500"
    :close-on-back="false"
    :close-on-content-click="false"
    :no-click-animation="true"
  >
    <v-card color="default" density="compact" style="pointer-events: all">
      <template #title>The Gallery is the home to your files.</template>
      <template #text>
        <p>Upload any type of file to your Personal Gallery, private to all.</p>
        <strong>Click the "My Gallery" item to get started!</strong>
        <small
          class="float-right cursor-pointer pa-4"
          @click="
            experimentsStore.setExperiment(
              'REGISTER_INTRO',
              SkipRegisterStepStage.GALLERY_INTRO
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
