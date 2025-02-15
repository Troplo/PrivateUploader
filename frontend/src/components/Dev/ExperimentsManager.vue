<template>
  <v-container>
    <v-btn
      class="mb-2"
      color="red"
      variant="tonal"
      @click="toggleWidget('Emergency Experiment Override')"
    >
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
    <v-btn size="x-small" @click="$experiments.init(0)">
      Load incompatible
    </v-btn>
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
  </v-container>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { toggleWidget } from "@troplo/debug-overlay/src";

export default defineComponent({
  name: "ExperimentsManager",
  props: ["username"],
  data() {
    return {
      retain: false,
      selected: 0,
      search: "",
      version: 0,
      experiments: [] as Record<string, any>[]
    };
  },
  methods: {
    toggleWidget
  },
  computed: {
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
  }
});
</script>
