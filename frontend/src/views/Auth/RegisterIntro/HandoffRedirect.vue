<template></template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useExperimentsStore } from "@/store/experiments.store";

const router = useRouter();
const experimentsStore = useExperimentsStore();

onMounted(() => {
  router.push("/");

  // We don't want to show the same Social Hub tooltip twice in the setup process
  // This flag is for existing users who haven't seen the Social Hub yet
  experimentsStore.setExperiment("SOCIAL_HUB_MOVE_INTRO", 0);
});
</script>

<style scoped></style>
