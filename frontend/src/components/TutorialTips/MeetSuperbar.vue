<template>
  <v-tooltip
    activator="parent"
    location="right"
    content-class="social-hub-tip"
    max-width="350"
    :close-on-back="false"
    :close-on-content-click="false"
    :no-click-animation="true"
  >
    <v-card color="default" density="compact" style="pointer-events: all">
      <template #title>This is called the Superbar.</template>
      <template #text>
        <p>
          This allows you to access the various features that
          {{ appStore.site.name }} has to offer.
        </p>
        <strong>Click the "Gallery" item to get started!</strong>
        <small
          class="float-right cursor-pointer pa-4"
          @click="
            experimentsStore.setExperiment(
              'REGISTER_INTRO',
              SkipRegisterStepStage.HANDOFF
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
