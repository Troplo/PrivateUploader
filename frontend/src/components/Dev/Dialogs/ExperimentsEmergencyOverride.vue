<template>
  <v-container>
    <v-alert
      v-if="$user.user?.moderator && !$user.user?.administrator"
      type="warning"
      variant="tonal"
      class="mb-3"
    >
      You can only create overrides for other users.
    </v-alert>
    <v-alert variant="tonal" color="red" class="mb-3">
      This can be very dangerous! Only use this in extreme circumstances. Do not
      use without approval of instance owner.
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
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Experiment, ExperimentOverride } from "@/gql/graphql";
import { useExperimentsStore } from "@/store/experiments.store";
import { useAdminStore } from "@/store/admin.store";

const emergency = ref({
  value: false,
  experiment: {
    value: 0 as number | string,
    id: "",
    force: false
  },
  active: [] as ExperimentOverride[]
});
const selected = ref(0);
const experimentsStore = useExperimentsStore();

const users = ref([
  {
    id: 0,
    username: "Global (ALL USERS)"
  }
] as { id: number; username: string }[]);
const relevantExperiments = computed(() => {
  const experiments = experimentsStore.experiments;
  return Object.entries(experiments)
    .map(([name, value]) => ({
      name,
      value,
      //@ts-ignore
      inheritValue: experimentsStore.experimentsInherit?.[name],
      type: typeof value,
      //@ts-ignore
      meta: experimentsStore.experimentsInherit?.meta?.[name] as {
        description: string;
        createdAt: string;
        versions: number[];
      }
    }))
    .filter((experiment) => experiment.name !== "meta")
    .sort((a, b) => {
      const metaA = experimentsStore.experimentsInherit?.meta?.[a.name];
      const metaB = experimentsStore.experimentsInherit?.meta?.[b.name];
      if (!metaA || !metaB) return 0;
      if (metaA.createdAt < metaB.createdAt) return 1;
      if (metaA.createdAt > metaB.createdAt) return -1;
      return 0;
    });
});

const duplicates = computed(() => {
  return emergency.value.active
    .map((e) => e.id)
    .filter((e, i, a) => a.indexOf(e) !== i);
});

async function createEmergencyOverride() {
  await experimentsStore.createEmergencyOverride({
    id: emergency.value.experiment.id,
    value: parseInt(emergency.value.experiment.value as unknown as string),
    force: emergency.value.experiment.force,
    userId: selected.value
  });
  emergency.value.experiment = {
    value: 0,
    id: "",
    force: false
  };
  getEmergencyOverrides();
}

async function deleteEmergencyOverride(id: string) {
  await experimentsStore.deleteEmergencyOverride(
    id,
    selected.value === 0 ? undefined : selected.value
  );
  getEmergencyOverrides();
}

async function getEmergencyOverrides() {
  emergency.value.active = await experimentsStore.getEmergencyOverrides(
    selected.value
  );
}

watch(
  () => selected.value,
  () => {
    getEmergencyOverrides();
  }
);

watch(
  () => emergency.value.experiment.id,
  () => {
    emergency.value.experiment.value = <number>(
      experimentsStore.experiments[emergency.value.experiment.id]
    );
  }
);

const adminStore = useAdminStore();
onMounted(async () => {
  users.value.push(
    ...(await adminStore.getUsers()).map((user) => ({
      id: user.id,
      username: user.username
    }))
  );
  getEmergencyOverrides();
});
</script>

<style scoped></style>
