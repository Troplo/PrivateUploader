<template>
  <RegisterV2 v-if="$experiments.experiments.REGISTER_V2" />
  <RegisterV1 v-else />
</template>

<script setup lang="ts">
import RegisterV2 from "@/views/Auth/RegisterV2.vue";
import RegisterV1 from "@/views/Auth/RegisterV1.vue";
</script>

<style scoped></style>
