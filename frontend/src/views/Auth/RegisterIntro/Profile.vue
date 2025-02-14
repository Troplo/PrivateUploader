<template>
  <v-card-title
    class="text-[6vw] md:text-[2.5vw] font-bold text-wrap w-full px-4 font-weight-medium"
  >
    Make your account your own.
  </v-card-title>
  <v-card-subtitle class="text-wrap">
    Add a profile picture and a profile description to make your account stand
    out. Click on the
    <v-chip size="x-small" color="gold">glowing</v-chip>
    items to get started!
  </v-card-subtitle>

  <UserV3
    class="rounded-xl ma-4"
    :username="userStore.user.username"
    :force-layout="{
      layout: {
        columns: [
          {
            rows: [
              {
                name: 'profile-info',
                id: functions.uuid()
              }
            ]
          }
        ]
      }
    }"
    :tutorial="true"
  />
</template>

<script setup lang="ts">
import UserV3 from "@/views/User/UserV3.vue";
import { useUserStore } from "@/store/user.store";
import functions from "@/plugins/functions";

const userStore = useUserStore();
</script>

<style scoped></style>
