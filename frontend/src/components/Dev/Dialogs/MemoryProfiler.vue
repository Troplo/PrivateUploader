<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Memory Usage by Store</v-card-title>
          <v-btn @click="memoryUsageByStore()">Refresh</v-btn>
          <v-card-text>
            <v-data-table
              :headers="[
                { title: 'Store', key: 'name' },
                { title: 'Size', key: 'size' }
              ]"
              :hide-default-footer="true"
              :items="usage"
              :sort-by="[{ key: 'size', order: 'desc' }]"
              items-per-page="999"
            >
              <template #[`item.size`]="{ item }: any">
                {{ $functions.fileSize(item.size) }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAppStore } from "@/store/app.store";
import { useUserStore } from "@/store/user.store";
import { useChatStore } from "@/store/chat.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { useFriendsStore } from "@/store/friends.store";
import { useCollectionsStore } from "@/store/collections.store";
import { useWorkspacesStore } from "@/store/workspaces.store";
import { useAdminStore } from "@/store/admin.store";
import { useProgressiveUIStore } from "@/store/progressive.store";
import { useMessagesStore } from "@/store/message.store";
import { useMailStore } from "@/store/mail.store";
import { useDebugStore } from "@/store/debug.store";

export default defineComponent({
  name: "MemoryProfiler",
  data() {
    return {
      usage: []
    };
  },
  mounted() {
    this.memoryUsageByStore();
  },
  methods: {
    getCircularReplacer() {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    },
    memoryUsageByStore() {
      this.usage = [
        {
          name: "Total (Store)",
          size: JSON.stringify(
            // @ts-ignore
            document.getElementById("tpu-app")?.__vue_app__?.config
              .globalProperties.$pinia.state.value,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "ChatStore",
          size: JSON.stringify(
            useChatStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "UserStore",
          size: JSON.stringify(
            useUserStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "ExperimentsStore",
          size: JSON.stringify(
            useExperimentsStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "AppStore",
          size: JSON.stringify(useAppStore().$state, this.getCircularReplacer())
            .length
        },
        {
          name: "FriendsStore",
          size: JSON.stringify(
            useFriendsStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "CollectionsStore",
          size: JSON.stringify(
            useCollectionsStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "WorkspacesStore",
          size: JSON.stringify(
            useWorkspacesStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "AdminStore",
          size: JSON.stringify(
            useAdminStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "ProgUIStore",
          size: JSON.stringify(
            useProgressiveUIStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "MessagesStore",
          size: JSON.stringify(
            useMessagesStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "MailStore",
          size: JSON.stringify(
            useMailStore().$state,
            this.getCircularReplacer()
          ).length
        },
        {
          name: "ApolloCache",
          size: JSON.stringify(
            // @ts-ignore
            document.getElementById("tpu-app")?.__vue_app__.config
              .globalProperties.$apollo.cache.data.data,
            this.getCircularReplacer()
          ).length
        }
      ];
    }
  }
});
</script>
