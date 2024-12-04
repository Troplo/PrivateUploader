<template>
  <v-container>
    <v-card
      :class="{ 'd-flex': !$vuetify.display.mobile }"
      v-if="!$experiments.experiments.PROGRESSIVE_UI"
    >
      <v-tabs :direction="$vuetify.display.mobile ? 'horizontal' : 'vertical'">
        <v-tab prepend-icon="mdi-account" to="/settings/dashboard">
          {{ $t("settings.tabs.account") }}
        </v-tab>
        <v-tab prepend-icon="mdi-account" to="/settings/privacy">
          {{ $t("settings.tabs.privacy") }}
        </v-tab>
        <v-tab prepend-icon="mdi-lock" to="/settings/security">
          {{ $t("settings.tabs.security") }}
        </v-tab>
        <v-tab prepend-icon="mdi-cellphone-cog" to="/settings/clients">
          {{ $t("settings.tabs.setup") }}
        </v-tab>
        <v-tab
          v-if="$app.site.officialInstance"
          prepend-icon="mdi-plus"
          class="gold-promo"
          to="/settings/subscriptions"
        >
          {{
            $user.gold
              ? $t("settings.tabs.subscriptionsSettings")
              : $t("settings.tabs.subscriptions")
          }}
        </v-tab>
        <v-tab prepend-icon="mdi-web" to="/settings/domains">
          {{ $t("settings.tabs.domains") }}
        </v-tab>
        <v-tab
          v-if="$experiments.experiments.USER_V3_MODIFY"
          prepend-icon="mdi-link-variant"
          to="/settings/integrations"
        >
          {{ $t("settings.tabs.integrations") }}
          <v-btn
            v-if="$user.user?.integrations?.some((i) => i.error)"
            class="mr-n2"
            color="red"
            icon
            size="x-small"
          >
            <v-icon left>mdi-alert</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ $t("settings.tabs.integrationError") }}
            </v-tooltip>
          </v-btn>
        </v-tab>
        <v-tab prepend-icon="mdi-code-tags" to="/settings/developer">
          {{ $t("settings.tabs.developer") }}
        </v-tab>
        <v-tab prepend-icon="mdi-image-multiple" to="/settings/slideshows">
          {{ $t("settings.tabs.slideshows") }}
        </v-tab>
        <v-tab
          :prepend-icon="functions.platformIcon()"
          to="/settings/desktop"
          v-if="$app.platform !== Platform.WEB"
        >
          {{ $t(`settings.tabs.platforms.${$app.platform}`) }}
        </v-tab>
        <v-tab prepend-icon="mdi-information" to="/settings/about">
          {{ $t("settings.tabs.about") }}
        </v-tab>
        <v-spacer />
        <template v-if="$vuetify.display.mobile">
          <v-progress-circular
            v-if="loading"
            class="mt-2 mr-2"
            indeterminate
            size="24"
            width="3"
          />
        </template>
        <template v-else>
          <v-fade-transition :model-value="loading">
            <v-toolbar
              v-if="loading"
              density="compact"
              class="text-center justify-center"
            >
              <v-spacer />
              Saving...
              <v-spacer />
            </v-toolbar>
          </v-fade-transition>
        </template>
      </v-tabs>
      <v-container>
        <router-view @loading="loading = $event" @update="update" />
      </v-container>
    </v-card>
    <router-view v-else @loading="loading = $event" @update="update" />
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
