<template>
  <component :is="$route.fullPath.startsWith('/admin') ? VContainer : 'div'">
    <CreateAppAuthDialog v-model="create" @refresh="getAppAuth" />
    <v-card>
      <v-toolbar>
        <v-toolbar-title>My Applications</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="create = true">
          <v-tooltip activator="parent" location="bottom">Create app</v-tooltip>
          <v-icon>add-line</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container>
        <v-list>
          <v-list-item v-for="app in apps" :key="app.id">
            <template #prepend>
              <UserAvatar
                class="mr-3"
                :edit="false"
                :user="{ username: app.name, avatar: app.icon }"
              />
            </template>
            <v-list-item-title>{{ app.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ app.description || "No description" }} -
              {{ app.user.username }}
            </v-list-item-subtitle>
            <template #append>
              <v-list-item-action>
                <v-btn
                  :to="
                    $route.fullPath.startsWith('/admin')
                      ? `/admin/oauth/${app.id}`
                      : `/settings/developer/${app.id}`
                  "
                  color="primary"
                >
                  Manage
                </v-btn>
                <v-btn :to="`/oauth/${app.id}`">Login</v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-container>
    </v-card>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CreateAppAuthDialog from "@/components/Admin/AppAuth/CreateAppAuthDialog.vue";
import { VContainer } from "vuetify/components";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { DevAppsDocument } from "@/gql/graphql";

export default defineComponent({
  name: "AdminOAuth",
  components: { UserAvatar, CreateAppAuthDialog },
  data() {
    return {
      apps: [],
      create: false
    };
  },
  computed: {
    VContainer() {
      return VContainer;
    }
  },
  watch: {
    create() {
      this.getAppAuth();
    }
  },
  mounted() {
    this.getAppAuth();
  },
  methods: {
    async getAppAuth() {
      const {
        data: { oauthApps }
      } = await this.$apollo.query({
        query: DevAppsDocument,
        fetchPolicy: "network-only"
      });
      this.apps = oauthApps;
    }
  }
});
</script>
