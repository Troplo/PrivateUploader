<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Cache</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-list>
          <v-text-field
            v-model="user"
            append-outer-icon="mdi-delete"
            class="mx-4 mb-3"
            hide-details
            label="Purge by UserID"
            single-line
            @click:append-outer="purgeKeyUser"
          />
          <v-list-item v-for="item in items" :key="item.id">
            {{ item.name }}
            <template #append>
              <v-btn @click="purgeKeys(item.id)">Purge</v-btn>
            </template>
          </v-list-item>
        </v-list>
        <p v-if="loading">Loading...</p>
        <small>
          * Purging the cache will regenerate and override the existing keys.
        </small>
        <p class="mt-2 mb-2">
          Regenerating insights will delete all Insights reports for every user
          and regenerate them, this should only be used in case of generation
          faults, or updates to the Insights specification. This will take a
          while.
        </p>
        <v-btn variant="outlined" @click="regenerateInsights">
          Regenerate Insights
        </v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Cache",
  data() {
    return {
      loading: false,
      user: "",
      items: [
        {
          id: 0,
          name: "Everything™"
        },
        {
          id: 1,
          name: "State*"
        },
        {
          id: 2,
          name: "Collections*"
        },
        {
          id: 3,
          name: "ShareLinks*"
        },
        {
          id: 4,
          name: "AutoCollects*"
        },
        {
          id: 5,
          name: "InvitesV2"
        },
        {
          id: 6,
          name: "Chats*"
        },
        {
          id: 7,
          name: "Insights*"
        },
        {
          id: 8,
          name: "UserStats*"
        },
        {
          id: 9,
          name: "Provider-LastFM"
        },
        {
          id: 10,
          name: "Provider-MyAnimeList"
        },
        {
          id: 11,
          name: "Tracked Users*"
        },
        {
          id: 12,
          name: "Users*"
        },
        {
          id: 13,
          name: "Sessions"
        }
      ]
    };
  },
  methods: {
    async regenerateInsights() {
      this.loading = true;
      await this.axios.post("/admin/insights/regenerate");
      this.loading = false;
      this.$toast.success("Insights regeneration has been queued.");
    },
    async purgeKeys(id: number) {
      this.loading = true;
      await this.axios.delete("/admin/cache/" + id);
      this.loading = false;
      this.$toast.success("Cache purge has been queued.");
    },
    async purgeKeyUser(id: number) {
      this.loading = true;
      await this.axios.delete("/admin/cache/" + id + "/" + this.user);
      this.loading = false;
      this.$toast.success("Cache purge has been queued.");
    }
  }
});
</script>
