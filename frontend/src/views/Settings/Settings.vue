<template>
  <v-container>
    <router-view @loading="loading = $event" @update="update" />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Platform } from "@/store/app.store";
import functions from "@/plugins/functions";
import { RailMode } from "@/store/progressive.store";

export default defineComponent({
  name: "SettingsCore",
  computed: {
    functions() {
      return functions;
    },
    Platform() {
      return Platform;
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async update() {
      try {
        this.loading = true;
        if (this.$experiments.experiments.PROGRESSIVE_UI)
          this.$app.componentLoading = true;
        await this.$user.save();
        await new Promise((resolve) => setTimeout(resolve, 300));
        this.$app.componentLoading = false;
      } finally {
        this.loading = false;
        this.$app.componentLoading = false;
      }
    }
  },
  mounted() {
    if (
      this.$route.path !== "/settings/slideshows" &&
      this.$route.path !== "/settings/about"
    )
      this.$ui.navigationMode = RailMode.SETTINGS;
  }
});
</script>
