<template>
  <div>
    <v-toolbar class="rounded-xl" color="toolbar">
      <CreateAPIKey v-model="dialogs.key" type="api" @create="getAPIKeys" />
      <v-toolbar-title>
        {{ $t("settings.security.apiKeys") }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="dialogs.key = true">
        <v-icon left>add-line</v-icon>
        {{ $t("settings.security.addAPIKey") }}
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="apiKeys">
      <template #[`item.actions`]="{ item }: any">
        <v-icon
          :disabled="!item.info?.accessedFrom.length"
          class="mr-3"
          @click="
            ipHistory = item.info?.accessedFrom;
            dialogs.ipHistory = true;
          "
        >
          <v-tooltip activator="parent" location="top">
            <span v-if="item.info?.accessedFrom?.length">
              {{ $t("settings.security.ipHistory") }}
            </span>
            <span v-else>
              {{ $t("settings.security.noIPHistory") }}
            </span>
          </v-tooltip>
          global-line
        </v-icon>
        <v-icon class="mr-2" small @click="$functions.copy(item.token)">
          file-copy-line
        </v-icon>
        <v-icon class="mr-2" small @click="deleteApiKey(item.id)">
          close-line
        </v-icon>
      </template>
    </v-data-table>
    <v-toolbar class="rounded-xl mt-5" color="toolbar">
      <CreateAPIKey
        v-model="dialogs.password"
        type="password"
        @create="getAlternatePasswords"
      />
      <v-toolbar-title>
        {{ $t("settings.security.alternatePasswords") }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="dialogs.password = true">
        <v-icon left>add-line</v-icon>
        {{ $t("settings.security.addAlternatePassword") }}
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="alternatePasswords.items">
      <template #[`item.actions`]="{ item }: any">
        <v-icon class="mr-2" small @click="deleteAlternatePassword(item.name)">
          close-line
        </v-icon>
      </template>
    </v-data-table>
    <v-toolbar class="rounded-xl mt-5" color="toolbar">
      <v-toolbar-title>
        {{ $t("settings.security.recentLogins") }}
      </v-toolbar-title>
    </v-toolbar>
    <v-list subheader three-line>
      <IPHistory v-model="dialogs.ipHistory" :history="ipHistory" />
      <v-list-item v-for="login in sessions" :key="login.id">
        <v-list-item-title>
          {{
            login.info?.accessedFrom?.at(-1)?.location ||
            $t("settings.security.unknownLocation")
          }}
        </v-list-item-title>
        <div>
          <v-list-item-subtitle class="mt-1">
            {{
              login.info?.accessedFrom?.at(-1)?.isp ||
              $t("settings.security.unknownISP")
            }}
            {{
              login.info?.accessedFrom?.at(-1)?.asn ||
              $t("settings.security.unknownASN")
            }}
            -
            {{
              login.info?.accessedFrom?.at(-1)?.ip ||
              $t("settings.security.unknownIP")
            }}
          </v-list-item-subtitle>
          <br />
          <v-list-item-subtitle class="mt-1">
            {{
              $t("settings.security.lastSessionUsage", {
                date: $date().to(login.updatedAt)
              })
            }}
          </v-list-item-subtitle>
          <br />
          <v-list-item-subtitle class="mt-1">
            {{
              $t("settings.security.sessionCreated", {
                date: $date().to(login.createdAt)
              })
            }}
          </v-list-item-subtitle>
          <br />
          <v-list-item-subtitle class="mt-1">
            {{
              $t("settings.security.sessionExpiry", {
                date: login.expiredAt
                  ? $date().to(login.expiredAt)
                  : $t("generic.never")
              })
            }}
          </v-list-item-subtitle>
        </div>
        <template #append>
          <v-btn color="red" icon @click="deleteApiKey(login.id)">
            <v-tooltip activator="parent" location="top">
              {{ $t("settings.security.deleteSession") }}
            </v-tooltip>
            <v-icon>close-line</v-icon>
          </v-btn>
          <v-btn
            :disabled="!login.info?.accessedFrom?.length"
            color="blue"
            icon
            @click="
              ipHistory = login.info?.accessedFrom;
              dialogs.ipHistory = true;
            "
          >
            <v-tooltip activator="parent" location="top">
              <span v-if="login.info?.accessedFrom?.length">
                {{ $t("settings.security.ipHistory") }}
              </span>
              <span v-else>
                {{ $t("settings.security.noIPHistory") }}
              </span>
            </v-tooltip>
            <v-icon>global-line</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CreateAPIKey from "@/components/Settings/Dialogs/CreateAPIKey.vue";
import IPHistory from "@/components/Settings/Dialogs/IPHistory.vue";

export default defineComponent({
  components: { IPHistory, CreateAPIKey },
  data() {
    return {
      apiKeys: [],
      ipHistory: [],
      dialogs: {
        key: false,
        password: false,
        ipHistory: false
      },
      headers: [
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Scopes",
          key: "scopes"
        },
        {
          title: "Expiry",
          key: "expiry"
        },
        {
          title: "Created At",
          key: "createdAt"
        },
        { title: "Actions", key: "actions" }
      ],
      alternatePasswords: {
        items: []
      },
      sessions: [] as any[]
    };
  },
  mounted() {
    this.getAPIKeys();
    this.getAlternatePasswords();
    this.getSessions();
  },
  methods: {
    async getAPIKeys() {
      const { data } = await this.axios.get("/security/keys");
      // split up scopes by space from ,
      data.forEach((item: any) => {
        item.scopes = item.scopes.split(",").join(", ");
      });
      this.apiKeys = data;
    },
    async getAlternatePasswords() {
      const { data } = await this.axios.get("/security/passwords");
      // split up scopes by space from ,
      data.forEach((item: any) => {
        item.scopes = item.scopes.split(",").join(", ");
      });
      this.alternatePasswords.items = data;
    },
    async deleteApiKey(id: number) {
      await this.axios.delete(`/security/keys/${id}`);
      this.getAPIKeys();
      this.getSessions();
    },
    async deleteAlternatePassword(name: string) {
      await this.axios.patch(`/security/passwords`, {
        name
      });
      this.getAlternatePasswords();
    },
    async getSessions() {
      const { data } = await this.axios.get("/security/logins");
      this.sessions = data;
    }
  }
});
</script>
