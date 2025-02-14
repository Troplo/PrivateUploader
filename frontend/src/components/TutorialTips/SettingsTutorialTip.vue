<template>
  <v-tooltip
    activator="parent"
    location="right"
    content-class="social-hub-tip"
    max-width="350"
    :close-on-back="false"
    :close-on-content-click="false"
    :no-click-animation="true"
    :model-value="true"
  >
    <v-card color="default" density="compact" style="pointer-events: all">
      <template #title>You can alter settings here!</template>
      <template #text>
        <p>Customize your theme, create API keys, and more!</p>
        <strong>Click the "Settings" cog item to get started!</strong>
      </template>
      <small
        class="float-right cursor-pointer pa-4"
        @click="
          experimentsStore.setExperiment(
            'REGISTER_INTRO',
            SkipRegisterStepStage.SETTINGS
          )
        "
      >
        Skip tutorial
      </small>
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
