<template>
  <v-navigation-drawer
    v-model="val"
    floating
    permanent
    rail
    style="top: 0; height: 100%; z-index: 2001"
    color="dark"
  >
    <v-list
      v-model="$app.railMode"
      density="compact"
      nav
      class="mt-2"
      aria-label="TPU app selection sidebar"
    >
      <v-list-item
        aria-label="TPU (Main)"
        title="TPU"
        value="tpu"
        :active="$app.railMode === 'tpu'"
        prepend-icon="mdi-home"
        @click="$app.railMode = 'tpu'"
      />
      <v-list-item
        aria-label="Workspaces"
        prepend-icon="mdi-folder-account"
        title="Workspaces"
        value="workspaces"
        :active="$app.railMode === 'workspaces'"
        @click="$app.railMode = 'workspaces'"
      />
      <v-list-item
        aria-label="Communications"
        prepend-icon="mdi-message-processing"
        title="Communications"
        value="communications"
        :active="$app.railMode === 'communications'"
        @click="$app.railMode = 'communications'"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RailBar",
  computed: {
    val: {
      get: function () {
        if (!this.$vuetify.display.mobile) return true;
        return this.$app.mainDrawer;
      },
      set: function (value: boolean) {
        if (!this.$vuetify.display.mobile) return;
        this.$app.mainDrawer = value;
      }
    }
  }
});
</script>
