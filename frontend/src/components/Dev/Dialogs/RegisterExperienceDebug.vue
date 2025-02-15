<template>
  <v-container>
    <v-select
      label="Set registration flow stage"
      :items="stepsArr"
      item-value="value"
      item-title="text"
      :model-value="experimentsStore.experiments.REGISTER_INTRO"
      @update:model-value="
        experimentsStore.setExperiment('REGISTER_INTRO', $event)
      "
    ></v-select>
    <v-btn
      to="/register"
      :disabled="
        experimentsStore.experiments.REGISTER_INTRO >= RegisterSteps.HANDOFF
      "
    >
      Go to setup flow page
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useExperimentsStore } from "@/store/experiments.store";
import { RegisterSteps } from "@/views/Auth/registerSteps";

const experimentsStore = useExperimentsStore();

const steps = {
  WELCOME: 0,
  USERNAME: 1,
  LOGIN_CREDS: 2,
  EMAIL_VERIFY: 3,
  CUSTOMIZE: 4,
  PROFILE: 5,
  SHAREX: 6,
  HANDOFF: 7,
  GALLERY_INTRO: 8,
  GALLERY_ACTION_BAR: 9,
  SOCIAL_HUB: 10,
  SETTINGS: 11,
  COMPLETE: 12
};

const stepsArr = Object.keys(steps).map((key) => ({
  text: key,
  value: steps[key]
}));

const quitSteps = {
  CUSTOMIZE: 100,
  PROFILE: 101,
  SHAREX: 102,
  HANDOFF: 103,
  GALLERY_INTRO: 104,
  GALLERY_ACTION_BAR: 105,
  SOCIAL_HUB: 106,
  SETTINGS: 107,
  COMPLETE: 108,
  INITIAL_SETUP: 109
};

const quitStepsArr = Object.keys(quitSteps).map((key) => ({
  text: key,
  value: quitSteps[key]
}));
</script>

<style scoped></style>
