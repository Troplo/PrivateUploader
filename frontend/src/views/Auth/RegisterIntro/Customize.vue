<template>
  <div>
    <v-card-title
      class="text-[6vw] md:text-[2.5vw] font-bold text-wrap w-full px-4 font-weight-medium"
    >
      {{ appStore.site.name }}, your way.
    </v-card-title>
    <v-card-subtitle class="text-wrap">
      Customize your experience by choosing a theme, and setting up your
      profile.
    </v-card-subtitle>
    <v-row class="mx-1 my-3">
      <v-col v-for="theme in themes" :key="theme.key" cols="12" md="4">
        <v-card
          :color="themeStore.themes.value[theme.key].colors.background"
          class="hover border-2 d-flex align-center justify-space-between"
          elevation="0"
          @click="setTheme(theme.key)"
        >
          <v-card-title>
            {{ theme.name }}
          </v-card-title>
          <v-btn v-if="themeStore.global.name.value === theme.key" icon>
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <PrideSelector class="px-4" />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import { useTheme } from "vuetify";
import PrideSelector from "@/components/Settings/PrideSelector.vue";

const appStore = useAppStore();

const themeStore = useTheme();

const themes = [
  {
    name: "Light",
    key: "light"
  },
  {
    name: "Dark",
    key: "dark"
  },
  {
    name: "Midnight",
    key: "amoled"
  }
];

function setTheme(key: string) {
  localStorage.setItem("theme", key);
  themeStore.global.name.value = key;
}
</script>

<style scoped></style>
