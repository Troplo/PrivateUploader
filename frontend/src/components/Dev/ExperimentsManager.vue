<template>
  <teleport to="body">
    <DevDialog
      v-if="emergency.value"
      max-width="600"
      @close="emergency.value = false"
    >
      <template #header>Emergency Override</template>
      <v-container>
        <v-alert
          v-if="$user.user?.moderator && !$user.user?.administrator"
          type="warning"
          variant="tonal"
          class="mb-2"
        >
          You can only create overrides for other users.
        </v-alert>
        <v-autocomplete
          v-model="selected"
          :items="users"
          item-title="username"
          item-value="id"
          label="User"
        />
        <v-autocomplete
          v-model="emergency.experiment.id"
          :items="relevantExperiments"
          label="Experiment"
          item-value="name"
          item-title="name"
        />
        <v-text-field v-model="emergency.experiment.value" label="Value" />
        <v-checkbox
          :disabled="selected !== 0"
          v-model="emergency.experiment.force"
          label="Force for everyone (even when overridden in ExpMan)"
        />
        <v-btn @click="emergency.value = false">Cancel</v-btn>
        <v-btn @click="createEmergencyOverride" color="red">Create</v-btn>
      </v-container>
      <v-card-title>Active</v-card-title>
      <v-list class="mx-4">
        <v-alert
          v-if="
            emergency.active.some(
              (override, i) =>
                emergency.active.findIndex((o) => o.id === override.id) !== i
            )
          "
          type="warning"
          variant="tonal"
        >
          Experiments configuration contains duplicates!
          <br />
          {{ duplicates.join(", ") }}
        </v-alert>
        <v-card
          v-for="override in emergency.active"
          :key="override.id"
          class="my-2"
          rounded="0"
          :color="duplicates.includes(override.id) ? 'red' : 'card'"
          :variant="duplicates.includes(override.id) ? 'tonal' : undefined"
        >
          <v-card-title>ID: {{ override.id }}</v-card-title>
          <v-card-subtitle>Value: {{ override.value }}</v-card-subtitle>
          <v-card-subtitle>Forced: {{ override.force }}</v-card-subtitle>
          <v-card-subtitle v-if="override.userId">
            User ID: {{ override.userId }}
          </v-card-subtitle>
          <v-btn @click="deleteEmergencyOverride(override.id)" color="red">
            Delete
          </v-btn>
        </v-card>
      </v-list>
    </DevDialog>
  </teleport>
  <v-btn color="red" variant="tonal" @click="emergency.value = true">
    !! Create global emergency override !!
  </v-btn>
  <v-text-field v-model="search" label="Search" />
  <v-select
    v-model="version"
    :items="[0, 1, 2, 3, 4, 5, 6]"
    label="TPU Version"
  />
  <span class="text-blue">
    {{
      relevantExperiments.filter(
        (e) => e.meta?.versions?.includes(5) && !e.meta?.versions?.includes(4)
      ).length
    }}
    future
  </span>
  <span class="text-green">
    {{
      relevantExperiments.filter((e) => e.meta?.versions?.includes(4)).length
    }}
    relevant
  </span>
  <span class="text-red">
    {{
      relevantExperiments.filter((e) => !e.meta?.versions?.includes(4)).length
    }}
    incompatible
  </span>
  <br />
  <v-btn size="x-small" @click="$experiments.init(0)">Load incompatible</v-btn>
  <v-card
    v-for="experiment in relevantExperiments"
    :key="experiment.name"
    class="my-2"
  >
    <v-card-title
      :class="{
        'text-red': !experiment.meta?.versions?.includes(4),
        'text-blue': experiment.meta?.versions?.includes(5),
        'text-green':
          experiment.meta?.versions?.includes(4) &&
          !experiment.meta?.versions?.includes(5)
      }"
    >
      {{ experiment.name }}
    </v-card-title>
    <v-card-subtitle style="white-space: pre-line">
      {{ experiment.meta?.description }}
    </v-card-subtitle>
    <v-card-subtitle>
      {{ $date(experiment.meta?.createdAt).format("YYYY-MM-DD") }}
    </v-card-subtitle>
    <v-card-subtitle style="white-space: pre-line">
      Compatible with: TPUv{{ experiment.meta?.versions?.join(", ") }}
    </v-card-subtitle>
    <v-card-text v-if="experiment.type === 'boolean'">
      <v-radio-group v-model="$experiments.experiments[experiment.name]">
        <v-radio :value="experiment.inheritValue" label="Inherit" />
        <v-radio :value="true" label="Enabled" />
        <v-radio :value="false" label="Disabled" />
      </v-radio-group>
    </v-card-text>
    <v-card-text v-else-if="experiment.type === 'number'">
      <v-text-field
        :model-value="$experiments.experiments[experiment.name]"
        type="number"
        @update:model-value="
          $experiments.setExperiment(experiment.name, parseInt($event || '0'))
        "
      />
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";
import { gql } from "@apollo/client/core";
import { ExperimentOverride } from "@/gql/graphql";

export default defineComponent({
  name: "ExperimentsManager",
  components: { DevDialog, CoreDialog },
  props: ["username"],
  data() {
    return {
      retain: false,
      selected: 0,
      search: "",
      version: 0,
      experiments: [] as Record<string, any>[],
      users: [
        {
          id: 0,
          username: "Global"
        }
      ],
      emergency: {
        value: false,
        experiment: {
          value: 0,
          id: "",
          force: false
        },
        active: [] as ExperimentOverride[]
      }
    };
  },
  computed: {
    duplicates() {
      return this.emergency.active
        .map((e) => e.id)
        .filter((e, i, a) => a.indexOf(e) !== i);
    },
    relevantExperiments() {
      const experiments = this.experiments.length
        ? this.experiments
        : this.$experiments.experiments;
      return Object.entries(experiments)
        .map(([name, value]) => ({
          name,
          value,
          //@ts-ignore
          inheritValue: this.$experiments.experimentsInherit[name],
          type: typeof value,
          //@ts-ignore
          meta: this.$experiments?.experimentsInherit?.meta?.[name] as {
            description: string;
            createdAt: string;
            versions: number[];
          }
        }))
        .filter((experiment) => experiment.name !== "meta")
        .sort((a, b) => {
          const metaA = this.$experiments.experimentsInherit?.meta?.[a.name];
          const metaB = this.$experiments.experimentsInherit?.meta?.[b.name];
          if (!metaA || !metaB) return 0;
          if (metaA.createdAt < metaB.createdAt) return 1;
          if (metaA.createdAt > metaB.createdAt) return -1;
          return 0;
        })
        .filter((experiment) => {
          if (this.version && !experiment.meta.versions.includes(this.version))
            return false;
          if (!this.search) return true;
          return (
            experiment.name.toLowerCase().includes(this.search) ||
            experiment.meta?.description.toLowerCase().includes(this.search)
          );
        });
    }
  },
  methods: {
    async createEmergencyOverride() {
      await this.$experiments.createEmergencyOverride({
        id: this.emergency.experiment.id,
        value: parseInt(this.emergency.experiment.value),
        force: this.emergency.experiment.force,
        userId: this.selected
      });
      this.emergency.experiment = {
        value: 0,
        id: "",
        force: false
      };
      this.getEmergencyOverrides();
    },
    async deleteEmergencyOverride(id: string) {
      await this.$experiments.deleteEmergencyOverride(
        id,
        this.selected === 0 ? undefined : this.selected
      );
      this.getEmergencyOverrides();
    },
    async getEmergencyOverrides() {
      this.emergency.active = await this.$experiments.getEmergencyOverrides(
        this.selected
      );
    }
  },
  watch: {
    async selected() {
      this.getEmergencyOverrides();
    },
    "emergency.experiment.id": {
      handler() {
        this.emergency.experiment.value =
          this.$experiments.experiments[this.emergency.experiment.id];
      }
    },
    "emergency.value"() {
      this.getEmergencyOverrides();
    }
  },
  async mounted() {
    this.users.push(...(await this.$admin.getUsers()));
    this.getEmergencyOverrides();
  }
});
</script>
