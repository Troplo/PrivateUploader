<template>
  <div>
    <v-card-title
      class="text-[6vw] md:text-[2.5vw] font-bold text-wrap w-full px-4 font-weight-medium"
    >
      Welcome to Flowinity.
    </v-card-title>
    <v-card-subtitle class="text-wrap">
      Let's get started by creating your account.
    </v-card-subtitle>
    <v-row align-content="center" class="ma-1">
      <v-col cols="12" md="4" v-for="media in promoMedia" :key="media.title">
        <DynamicCard :image="media.url" :title="media.title">
          <template #title>
            <v-card-subtitle class="px-0 whitespace-pre-wrap">
              {{ media.subtitle }}
            </v-card-subtitle>
          </template>
        </DynamicCard>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="emit('next')">Register</v-btn>
    </v-card-actions>
  </div>
</template>

<script setup lang="ts">
import DynamicCard from "@/components/Core/DynamicCard.vue";

const emit = defineEmits(["next"]);

const promoMedia = [
  {
    title: "Chat instantly.",
    subtitle: "Never miss a message with Flowinity Communications.",
    url: "https://assets.flowinity.com/home/1st.png"
  },
  {
    title: "Build your community",
    subtitle: "Manage your members, roles, and permissions in one place.",
    url: "https://assets.flowinity.com/home/2nd.png"
  },
  {
    title: "Convenient file storage.",
    subtitle:
      "Get 10GB free, forever. Flowinity allows you to upload and share files - all in one place.",
    url: "https://assets.flowinity.com/home/3rd.png"
  },
  {
    title: "Never lose a file.",
    subtitle:
      "Organize your files with Collections, and never lose a file again.",
    url: "https://assets.flowinity.com/home/4th.png"
  },
  {
    title: "Security first.",
    subtitle: "Create API keys, manage sessions, and more.",
    url: "https://assets.flowinity.com/home/5th.png"
  },
  {
    title: "Transparent, always.",
    subtitle: "Flowinity is fully open source.",
    url: "https://assets.flowinity.com/home/6th.png"
  }
];
</script>

<style scoped></style>
