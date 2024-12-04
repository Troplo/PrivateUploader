<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("settings.integrations.link") }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <div>
        <span v-for="integration in integrations" :key="integration.id">
          <v-tooltip
            :text="`${
              ($user.user.integrations.find((i) => i.type === integration.id)
                ? 'Already Linked'
                : null) ||
              (!integration.available ? 'Unavailable' : 'Available')
            }`"
            location="top"
            activator="parent"
          />
          <v-chip
            :color="integration.color"
            :disabled="
              !!(
                !integration.available ||
                $user.user.integrations.find((i) => i.type === integration.id)
              )
            "
            :href="integration.url"
            :short-text="integration.shortText"
            :text="integration.name"
            class="mr-2"
          />
        </span>
      </div>
    </v-container>
    <v-container>
      <small>
        GitHub integration for Flowinity Pro is coming soon. Please email
        <a href="mailto:troplo@troplo.com">troplo@troplo.com</a>
        with your GitHub account username from your Flowinity account if you are
        a recent sponsor and would like to claim your benefits. Please ensure
        the email address linked to your GitHub account is the same as the one
        linked to your Flowinity account. Your Flowinity Pro expiration date
        will start when it's been added to your account and will last for as
        long as you are a sponsor.
      </small>
    </v-container>
  </v-card>
  <v-card v-if="$user.user.integrations.length" class="mt-4">
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("settings.integrations.manage") }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-list>
        <v-list-item
          v-for="integration in $user.user.integrations"
          :key="integration.id"
        >
          <v-list-item-title>
            {{ getIntegrationMeta(integration.type).name }}
            <v-btn
              v-if="integration.error"
              class="ml-1"
              color="red"
              icon
              size="x-small"
              variant="tonal"
            >
              <v-icon left>mdi-alert</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ integration.error }}
              </v-tooltip>
            </v-btn>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ integration.providerUsername
            }}{{
              integration.providerUserCache?.discriminator
                ? "#" + integration.providerUserCache?.discriminator
                : ""
            }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{
              $t("settings.integrations.addedOn", {
                date: $date(integration.createdAt).format("MMMM Do YYYY")
              })
            }}
          </v-list-item-subtitle>
          <template #append>
            <v-btn icon @click="removeIntegration(integration.type)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-container>
  </v-card>
  <v-card v-if="oauth.length" class="mt-4">
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("settings.integrations.manageOauth") }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-card v-for="app in oauth" :key="app.id" class="mb-4">
        <v-card-title>
          {{ app.name }}
          <span v-if="app.verified">
            <v-tooltip location="top" activator="parent">
              Created by the TPU team
            </v-tooltip>
            <v-icon class="text-medium-emphasis" size="20">
              mdi-check-circle
            </v-icon>
          </span>
        </v-card-title>
        <v-card-text>
          {{ app.description }}
        </v-card-text>
        <v-list-item
          v-for="scope in scopeToArray(app.sessions[0].scopes)"
          :key="scope.id"
          class="mb-2"
          :value="scope.id"
          style="opacity: 1"
        >
          <template #prepend>
            <v-icon color="green" class="ml-1 mr-4">mdi-check-circle</v-icon>
          </template>
          <v-list-item-title
            style="text-overflow: unset; white-space: normal"
            :class="{ 'mb-n1': scope.description }"
          >
            {{ scope.name }}
            <v-btn
              v-if="scope.id === 'oauth.save'"
              color="primary"
              class="ml-1"
            >
              {{ $t("settings.integrations.manageSaves") }}
            </v-btn>
          </v-list-item-title>
          <v-list-item-subtitle
            v-if="scope.description"
            style="text-overflow: unset; white-space: normal; display: unset"
          >
            {{ scope.description }}
          </v-list-item-subtitle>
        </v-list-item>
        <small
          v-if="app.scopes !== app.sessions[0].scopes"
          class="text-red ml-5"
        >
          {{ $t("settings.integrations.scopesChanged") }}
        </small>
        <br />
        <small
          v-if="app.sessions[0].scopes.includes('oauth.save')"
          class="text-grey ml-5"
        >
          {{ $t("settings.integrations.unlinkWarningSaves") }}
        </small>
        <v-card-actions>
          <v-btn :to="`/oauth/${app.id}`" color="primary">
            {{ $t("generic.login") }}
          </v-btn>
          <v-btn color="red" @click="disconnect(app.id)">
            {{ $t("settings.integrations.disconnect") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ScopeDefinition } from "@/views/Auth/Oauth.vue";

export default defineComponent({
  data() {
    return {
      loading: false,
      integrations: [] as {
        id: string;
        key: string;
        name: string;
        color: string;
        shortText: string;
        url: string;
        available: boolean;
      }[],
      oauth: [] as {
        id: string;
        name: string;
        description: string | null;
        scopes: string;
        icon: string | null;
        shortCode: string;
        verified: boolean;
        sessions: {
          scopes: string;
        }[];
      }[],
      scopeDefinitions: [] as ScopeDefinition[]
    };
  },
  mounted() {
    this.getIntegrations();
    this.getUserOAuth();
    this.getScopeDefinitions();
  },
  methods: {
    async removeIntegration(type: string) {
      this.loading = true;
      await this.axios.delete(`/providers/unlink/${type}`);
      await this.$user.init();
      this.loading = false;
      this.$toast.success("Third-party account integration removed!");
    },
    getIntegrationMeta(id: string) {
      const integration = this.integrations.find((i) => i.id === id);
      if (!integration) {
        return {
          name: "Unknown",
          color: "grey",
          shortText: "Unknown",
          url: null,
          available: false
        };
      }
      return integration;
    },
    async getIntegrations() {
      const { data } = await this.axios.get("/providers/linkable");
      this.integrations = data;
    },
    async getUserOAuth() {
      const { data } = await this.axios.get("/oauth");
      this.oauth = data;
    },
    scopeToArray(scope: string) {
      return scope.split(",").map((scope: string) => {
        const scopeDefinition = this.scopeDefinitions.find(
          (s: ScopeDefinition) => s.id === scope
        );
        return {
          id: scope,
          name: scopeDefinition ? scopeDefinition.name : scope,
          description: scopeDefinition ? scopeDefinition.description : null
        };
      });
    },
    async getScopeDefinitions() {
      const { data } = await this.axios.get("/oauth/scopeDefinitions");
      this.scopeDefinitions = data;
    },
    async disconnect(id: string) {
      this.loading = true;
      await this.axios.delete(`/oauth/${id}/authorize`);
      await this.getUserOAuth();
      this.loading = false;
      this.$toast.success("TPU app disconnected!");
    }
  }
});
</script>
