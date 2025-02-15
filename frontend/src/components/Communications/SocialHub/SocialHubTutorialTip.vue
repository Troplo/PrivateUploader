<template>
  <v-tooltip
    activator="parent"
    location="right"
    content-class="social-hub-tip"
    max-width="350"
    :close-on-back="false"
    :close-on-content-click="false"
  >
    <v-card color="default" density="compact" style="pointer-events: all">
      <template #title>Introducing the Social Hub</template>
      <template #text>
        <p>
          The Social Hub is a place to connect with other users on
          {{ appStore.site.name }}. You can discover new users, and manage your
          friends.
        </p>
        <strong>Click the item to get started!</strong>
        <small
          v-if="tutorial"
          class="float-right cursor-pointer pa-4"
          @click="
            experimentsStore.setExperiment(
              'REGISTER_INTRO',
              SkipRegisterStepStage.SOCIAL_HUB
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

defineProps({
  tutorial: {
    type: Boolean,
    required: true
  }
});

const appStore = useAppStore();
const experimentsStore = useExperimentsStore();
</script>

<style>
.social-hub-tip {
  background: transparent !important;
  border: none !important;
}
</style>
