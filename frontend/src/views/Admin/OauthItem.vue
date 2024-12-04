<template>
  <div v-if="app">
    <v-tabs v-model="tab" class="mr-2 mb-2">
      <v-tab value="home">Home</v-tab>
      <v-tab value="bot">Bot</v-tab>
    </v-tabs>
    <CoreDialog v-model="deleteConfirm" max-width="500">
      <template #title>Delete {{ app.name }}?</template>
      <v-card-text>
        Are you sure you want to delete {{ app.name }}? This cannot be undone.
        It will delete all sessions, saves, and other data associated with this
        app.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue" @click="deleteConfirm = false">Cancel</v-btn>
        <v-btn color="red" @click="deleteApp()">Delete</v-btn>
      </v-card-actions>
    </CoreDialog>
    <v-card width="100%">
      <v-toolbar>
        <v-toolbar-title>{{ app.name }}</v-toolbar-title>
      </v-toolbar>

      <v-window v-model="tab">
        <v-window-item value="home">
          <v-container>
            <div class="d-flex align-center mb-4">
              <UserAvatar
                v-if="tab === 'home'"
                :user="{ avatar: app.icon, username: app.name }"
                :bot="false"
                :override-id="app.id"
                size="128"
                :edit="true"
                @refresh="getAppAuth"
              />
              <v-card-text class="ml-n4">
                <div class="d-flex flex-column flex-grow-1 justify-center">
                  <v-card-title>
                    {{ app.name }}
                    <span v-if="app.verified">
                      <v-tooltip location="top" activator="parent">
                        Created by the TPU team
                      </v-tooltip>
                      <v-icon color="grey">mdi-check-circle</v-icon>
                    </span>
                  </v-card-title>
                  <v-card-subtitle>
                    {{ app.description || "No description" }}
                  </v-card-subtitle>
                  <v-card-subtitle>by {{ app.user.username }}</v-card-subtitle>
                </div>
              </v-card-text>
            </div>
            <v-text-field
              v-model="username"
              label="Username"
              class="mx-2"
              @keyup.enter="addUser()"
            >
              <template #append>
                <v-btn color="primary" :loading="loading" @click="addUser()">
                  Add User
                </v-btn>
              </template>
            </v-text-field>
            <v-card-subtitle class="initial">
              Here you can add users to your app, if your app is private, this
              will allow explicitly set users to login, you can also give them
              the Manage permission which will grant them full access to your
              app (such as accessing the secret, and managing users themselves)
              which will apply to both Public and Private apps.
            </v-card-subtitle>
            <v-data-table :headers="headers" :items="app.oauthUsers">
              <template #[`item.actions`]="{ item }: any">
                <v-btn
                  icon
                  color="red"
                  @click="addUser(item.user.username, true)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <template #[`item.manage`]="{ item }: any">
                <v-checkbox
                  label="Manage"
                  :model-value="item.manage"
                  @update:model-value="updateUser(item.id, $event)"
                />
              </template>
            </v-data-table>
          </v-container>
          <v-card-text v-if="app.userId === $user.user?.id">
            <v-form class="d-flex flex-column">
              <v-text-field
                v-model="app.name"
                label="Name"
                outlined
                dense
                required
                :rules="[
                  (v) => !!v || 'Name is required',
                  (v) =>
                    v.length <= 32 || 'Name must be less than 32 characters'
                ]"
              />
              <v-text-field
                v-model="app.description"
                label="Description"
                outlined
                dense
              />
              <v-text-field
                v-model="app.icon"
                placeholder="https://i.troplo.com/i/50ba79e4.png"
                label="Icon"
                outlined
                dense
              />
              <v-text-field
                v-model="app.redirectUri"
                label="Redirect"
                outlined
                dense
                required
                :rules="[(v) => !!v || 'Redirect is required']"
                placeholder="https://oci3.troplo.com/tpu_callback"
              />
              <v-checkbox
                v-model="app.private"
                label="Private"
                dense
                required
                persistent-hint
                hint="Private apps can only be used by the owner or manually added users"
              />
              <v-checkbox
                v-if="$user.user.administrator"
                v-model="app.verified"
                label="Verified"
                dense
                required
                hint="Only use this for public facing and Flowinity endorsed apps"
                persistent-hint
              />
              <v-expansion-panels class="my-2">
                <v-expansion-panel title="Scopes">
                  <template #text>
                    <v-container class="my-2">
                      <v-checkbox
                        v-for="scope in scopesDefinitions"
                        :key="scope.id"
                        v-model="scopes"
                        :value="scope.id"
                        :label="scope.name"
                        :hint="scope.description"
                        persistent-hint
                        class="mt-n8"
                      />
                    </v-container>
                  </template>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-btn color="primary" :loading="loading" @click="updateAppAuth">
                Save
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-text>
            <v-btn color="blue" @click="$functions.copy(app.secret)">
              <v-icon class="mr-1">mdi-content-copy</v-icon>
              Copy secret
            </v-btn>
            <v-btn class="ml-1" color="blue" @click="$functions.copy(app.id)">
              <v-icon class="mr-1">mdi-content-copy</v-icon>
              Copy client ID
            </v-btn>
            <v-btn class="ml-1" color="red" @click="resetSecret">
              <v-icon class="mr-1">mdi-sync</v-icon>
              Reset secret
            </v-btn>
            <v-btn class="ml-1" color="red" @click="deleteConfirm = true">
              <v-icon class="mr-1">mdi-delete</v-icon>
              Delete
            </v-btn>
            <br />
            <small>
              The secret is only used for OpenID Connect and Communications Bot
              integrations, and not TPUAppAuth.
            </small>
            <v-card-title>Configuring your app</v-card-title>
            <v-card-text>
              <strong>NGINX:</strong>
              <ol>
                <li>
                  Download
                  <a href="https://github.com/PrivateUploader/nginx-auth">
                    nginx auth scripts
                  </a>
                  (tpu.conf and tpu.js) and put them in /etc/nginx
                </li>
                <li>
                  Download the NGINX NJS module and add
                  <code>
                    load_module /usr/lib/nginx/modules/ngx_http_js_module.so;
                  </code>
                  (replace path if needed) to the top of your nginx.conf
                </li>
                <li>
                  Additionally add
                  <code>
                    proxy_cache_path /etc/nginx/auth_cache levels=1:2
                    keys_zone=auth_cache:1m max_size=1g inactive=60m;
                  </code>
                  to the http directive
                </li>
                <li>
                  Add
                  <code>set $tpu_app_id "{{ app.id }}";</code>
                  and
                  <code>include tpu.conf;</code>
                  above the location directives you want to protect.
                </li>
                <li>
                  Add
                  <br />
                  <code>
                    error_page 500 https://flowinity.com/oauth/$tpu_app_id;
                    <br />
                    auth_request /_tpu_get_user;
                  </code>
                  <br />
                  inside the location directives you want to protect.
                </li>
                <li>You're done!</li>
              </ol>
            </v-card-text>
          </v-card-text>
        </v-window-item>
        <v-window-item value="bot">
          <template v-if="app.bot">
            <v-container>
              <div class="d-flex align-center mb-4">
                <UserAvatar
                  v-if="tab === 'bot'"
                  :size="128"
                  :user="app.bot"
                  :edit="true"
                  :override-id="app.id"
                  :bot="true"
                  @refresh="getAppAuth"
                />
                <v-card-text class="ml-n4">
                  <div class="d-flex flex-column flex-grow-1 justify-center">
                    <v-card-title>
                      {{ app.bot.username }}
                    </v-card-title>
                    <v-card-subtitle>
                      by {{ app.user.username }}
                    </v-card-subtitle>
                  </div>
                </v-card-text>
              </div>
              <v-card-title>Generate Invite Link</v-card-title>
              <v-row>
                <v-col
                  v-for="permission in availablePermissions"
                  :key="permission.id"
                  cols="12"
                  sm="12"
                  md="6"
                  lg="4"
                  xl="2"
                >
                  <v-checkbox
                    :label="permission.name"
                    :model-value="selectedPermissions.includes(permission.id)"
                    persistent-hint
                    :hint="permission.description"
                    @update:model-value="
                      selectedPermissions.includes(permission.id)
                        ? selectedPermissions.splice(
                            selectedPermissions.indexOf(permission.id),
                            1
                          )
                        : selectedPermissions.push(permission.id)
                    "
                  />
                </v-col>
              </v-row>
              <v-text-field
                :model-value="botLink"
                readonly
                @click="
                  $functions.copy(botLink);
                  $toast.success('Copied to clipboard!');
                "
              />
              View the documentation at
              <a href="https://docs.privateuploader.com">
                docs.privateuploader.com
              </a>
              or view an
              <a href="https://github.com/PrivateUploader/StatsBot">
                example bot on GitHub
              </a>
            </v-container>
          </template>
          <template v-else>
            <CreateBotAccountDialog
              :id="app?.id"
              v-model="createBot"
              @refresh="getAppAuth"
            />
            <v-btn class="my-2 mx-2" @click="createBot = true">
              Create bot account
            </v-btn>
          </template>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ScopeDefinition } from "@/views/Auth/Oauth.vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { MyAppQuery } from "@/graphql/developer/myApps.graphql";
import {
  AvailableChatPermissionsDocument,
  ChatPermission,
  OauthApp,
  OauthUser
} from "@/gql/graphql";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import CreateBotAccountDialog from "@/components/Admin/AppAuth/CreateBotAccountDialog.vue";
import {
  AddOauthUserMutation,
  DeleteOauthAppMutation,
  ResetOauthAppSecretMutation,
  UpdateOauthAppMutation,
  UpdateOauthUserMutation
} from "@/graphql/developer/updateApp.graphql";

export default defineComponent({
  name: "AdminOauthItem",
  components: { CreateBotAccountDialog, UserAvatar, CoreDialog },
  data() {
    return {
      app: null as OauthApp | null,
      createBot: false,
      username: "",
      loading: false,
      scopesDefinitions: [] as ScopeDefinition[],
      deleteConfirm: false,
      availablePermissions: [] as ChatPermission[],
      selectedPermissions: [] as string[],
      tab: "home",
      headers: [
        {
          title: "Username",
          key: "user.username"
        },
        {
          title: "Created",
          key: "createdAt"
        },
        {
          title: "Manage",
          key: "manage"
        },
        {
          title: "Actions",
          key: "actions"
        }
      ]
    };
  },
  computed: {
    botLink() {
      const permissions = this.selectedPermissions.join(",");
      return `${this.$app.site.hostnameWithProtocol}/oauth/${this.app.id}?scope=bot&permissions=${permissions}`;
    },
    scopes: {
      get() {
        // convert "scope1,scope2" to ["scope1", "scope2"]
        return this.app.scopes.split(",");
      },
      set(value: string[]) {
        // convert ["scope1", "scope2"] to "scope1,scope2"
        this.app.scopes = value.join(",");
      }
    }
  },
  watch: {
    create() {
      this.getAppAuth();
    }
  },
  mounted() {
    this.getAppAuth();
    this.getScopeDefinitions();
    this.getPermissions();
  },
  methods: {
    async updateUser(id: string, manage: boolean) {
      try {
        this.loading = true;
        await this.$apollo.mutate({
          mutation: UpdateOauthUserMutation,
          variables: {
            input: {
              id,
              oauthAppId: this.app.id,
              manage
            }
          }
        });
        this.getAppAuth();
      } finally {
        this.loading = false;
      }
    },
    async getPermissions() {
      const {
        data: { availableChatPermissions }
      } = await this.$apollo.query({
        query: AvailableChatPermissionsDocument
      });
      this.availablePermissions = availableChatPermissions;
    },
    async deleteApp() {
      try {
        this.loading = true;
        await this.$apollo.mutate({
          mutation: DeleteOauthAppMutation,
          variables: {
            input: {
              id: this.app.id
            }
          }
        });
        this.$toast.success("App deleted");
        this.$router.push("/admin/oauth");
      } finally {
        this.loading = false;
      }
    },
    async resetSecret() {
      try {
        this.loading = true;
        await this.$apollo.mutate({
          mutation: ResetOauthAppSecretMutation,
          variables: {
            input: {
              id: this.app.id
            }
          }
        });
        this.$toast.success("Secret reset");
        this.getAppAuth();
      } finally {
        this.loading = false;
      }
    },
    async getScopeDefinitions() {
      const { data } = await this.axios.get(`/oauth/scopeDefinitions`);
      this.scopesDefinitions = data;
    },
    async getAppAuth() {
      try {
        this.$app.componentLoading = true;
        const {
          data: { oauthApp }
        } = await this.$apollo.query({
          query: MyAppQuery,
          fetchPolicy: "network-only",
          variables: {
            input: {
              id: this.$route.params.id
            }
          }
        });
        this.app = { ...oauthApp };
      } finally {
        this.$app.componentLoading = false;
      }
    },
    async updateAppAuth() {
      try {
        this.loading = true;
        await this.$apollo.mutate({
          mutation: UpdateOauthAppMutation,
          variables: {
            input: {
              name: this.app.name,
              description: this.app.description,
              redirectUri: this.app.redirectUri,
              private: this.app.private,
              verified: this.app.verified,
              id: this.app.id,
              scopes: this.app.scopes.split(",")
            }
          }
        });
        this.$toast.success("App updated");
      } finally {
        this.loading = false;
      }
    },
    async addUser(username?: string, del: boolean = false) {
      try {
        const name = username || this.username;
        if (
          !del &&
          this.app.oauthUsers.some((user: OauthUser) => {
            return user.user.username.toLowerCase() === name.toLowerCase();
          })
        ) {
          return this.$toast.error("User already added.");
        }
        this.loading = true;
        await this.$apollo.mutate({
          mutation: AddOauthUserMutation,
          variables: {
            input: {
              oauthAppId: this.app.id,
              username: username || this.username,
              manage: false
            }
          }
        });
        this.$toast.success("User configuration updated");
      } finally {
        this.loading = false;
        this.getAppAuth();
        this.username = "";
      }
    }
  }
});
</script>
