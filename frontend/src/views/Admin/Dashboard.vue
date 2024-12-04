<template>
  <v-container>
    <v-card v-if="dashboard">
      <v-toolbar>
        <v-toolbar-title>Dashboard</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card-title style="padding: 0">New UI Options</v-card-title>
        <p class="text-grey mb-4">
          The new UI is still in development, but if you'd like, you can enable
          it here for all users by default. Users will still be able to switch
          back at any time.
        </p>
        <tpu-switch
          v-model="newUI"
          label="Enable New UI by default"
          class="mb-4"
          @update:model-value="
            $experiments.createEmergencyOverride({
              id: 'PROGRESSIVE_UI',
              value: $event ? 1 : 0,
              force: false
            })
          "
        />

        <tpu-switch
          v-model="newUISwitch"
          label="Allow users to switch to new UI"
          class="mb-4"
          @update:model-value="
            $experiments.createEmergencyOverride({
              id: 'CAN_ENABLE_PROGRESSIVE_UI',
              value: $event ? 1 : 0,
              force: false
            })
          "
        />

        More options here are coming soon. You can modify tpu.json in
        app/config/tpu.json or /var/lib/tpu_server/config/tpu.json (Docker
        environments) to make manual changes to the TPU environment, and press
        the Restart button below to restart the TPU cluster.
        <br />
        <v-btn class="mx-3 my-3" variant="outlined" @click="restart">
          <v-icon>mdi-restart</v-icon>
          Restart TPU Cluster
        </v-btn>
        <br />
        <v-card-title style="padding: 0">Raw Config Options:</v-card-title>
        <p class="text-grey mb-4">
          Values that are [REDACTED] will remain unchanged when saved unless
          modified manually. Some changes may require a restart & client refresh
          to take effect.
        </p>
        <div v-if="config">
          <v-btn
            :loading="loading"
            class="mx-3 my-3 ml-n1"
            variant="outlined"
            @click="saveConfig"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            Save Config
          </v-btn>
          <div v-for="(value, key, i) in config" :key="key">
            <v-card-text v-if="i === 0" style="padding: 0">root:</v-card-text>
            <ConfigObject
              :value="value"
              :full-config="config"
              :persistent-key="key.toString()"
              :name="key.toString()"
              :deep="0"
              @update:object="update"
            />
          </div>
          <v-btn
            :loading="loading"
            class="mx-3 my-3 ml-n1"
            variant="outlined"
            @click="saveConfig"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            Save Config
          </v-btn>
        </div>
      </v-container>
    </v-card>
    <v-card v-else>
      <v-card-title>
        For management please use TPU Classic until the admin panel is added.
      </v-card-title>
      <v-btn class="mx-3 my-3" variant="outlined" @click="restart">
        <v-icon>mdi-restart</v-icon>
        Restart TPU Cluster
      </v-btn>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConfigObject from "@/components/Admin/ConfigObject.vue";
import TpuSwitch from "@/components/Framework/Input/TpuSwitch.vue";

export default defineComponent({
  name: "Dashboard",
  components: { TpuSwitch, ConfigObject },
  data() {
    return {
      dashboard: null,
      config: null,
      loading: false,
      newUI: false,
      newUISwitch: false
    };
  },
  async mounted() {
    this.getDashboard();
    this.getConfig();
    const experiments = await this.$experiments.getEmergencyOverrides(0);
    this.newUI = experiments.find((k) => k.id === "PROGRESSIVE_UI")?.value;
    this.newUISwitch = experiments.find(
      (k) => k.id === "CAN_ENABLE_PROGRESSIVE_UI"
    )?.value;
  },
  methods: {
    update(object: { key: string; value: any }) {
      if (object.value === null) return;
      const keys = object.key.split(".");
      let currentObject = this.config;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (i === keys.length - 1) {
          // Last key, update the value
          currentObject[key] = object.value;
        } else {
          // Not the last key, update the nested object or create it if it doesn't exist
          if (!currentObject[key] || typeof currentObject[key] !== "object") {
            currentObject[key] = {};
          }
          currentObject = currentObject[key];
        }
      }
    },
    async restart() {
      await this.axios.post("/admin/restart");
      this.$toast.success("Service restart queued.");
    },
    async getDashboard() {
      const { data } = await this.axios.get("/admin/dashboard");
      this.dashboard = data;
    },
    async getConfig() {
      const { data } = await this.axios.get("/admin/config");
      this.config = data;
    },
    async saveConfig() {
      try {
        this.loading = true;
        await this.axios.put("/admin/config", this.config);
        this.loading = false;
        this.$toast.success("Config saved.");
        this.getConfig();
      } catch {
        this.loading = false;
      }
    }
  }
});
</script>
