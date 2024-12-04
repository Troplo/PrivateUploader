<template>
  <DevDialog @close="$app.dialogs.networkInspector = false">
    <template #header>Network Inspector</template>
    <v-container>
      <small>
        Changing of transport and inspection settings require a refresh.
      </small>
      <v-select
        id="transport-selector"
        v-model="selectedTransport"
        :items="[
          { value: 'ws', title: 'WebSocket' },
          { value: 'http', title: 'HTTP' }
        ]"
        color="primary"
      ></v-select>
      <tpu-switch
        v-model="networkInspectionEnabled"
        label="Network Inspection Enabled (increased RAM usage)"
        color="primary"
        :disabled="dev"
      />
      <v-text-field
        type="number"
        label="Artificial Latency (ms)"
        v-model="artificialLatency"
      />

      <div>
        <tpu-switch v-model="settings.gqlExclPulse" label="Excl. Pulse" />
        <v-text-field v-model="operationsSearch" label="Search" />
        <v-list>
          <v-list-item v-for="operation in operations" :key="operation.id">
            <div>
              {{ operation.name }}
              <div class="d-flex" style="gap: 8px; justify-content: center">
                <v-chip
                  :color="
                    operation.type === 'mutation'
                      ? 'green'
                      : operation.type === 'query'
                        ? 'blue'
                        : 'yellow'
                  "
                  style="font-size: 8px"
                  variant="tonal"
                >
                  {{ operation.type?.toUpperCase().slice(0, 3) }}
                </v-chip>
                <v-chip
                  :color="
                    Math.round(operation.time) > 500
                      ? 'red'
                      : Math.round(operation.time) > 300
                        ? 'yellow'
                        : 'green'
                  "
                  :no-ripple="true"
                  style="font-size: 14px"
                  class="flex items-center"
                >
                  <template v-if="!operation.pending">
                    {{ Math.round(operation.time) }}
                  </template>
                  <template v-else>
                    <v-progress-circular
                      style="width: 20px; height: 22px"
                      color="green"
                    />
                  </template>
                </v-chip>
                <v-chip
                  class="flex items-center"
                  style="font-size: 14px"
                  @click="
                    operationName = operation.name;
                    args = JSON.stringify(operation.args, null, 2);
                    result = JSON.stringify(operation.result, null, 2);
                    dialog = true;
                  "
                >
                  <v-icon>mdi-information-outline</v-icon>
                </v-chip>
              </div>
            </div>
          </v-list-item>
        </v-list>
        <v-pagination v-model="operationsPage" :pages="operationsPages" />
      </div>
    </v-container>
  </DevDialog>

  <DevDialog v-if="dialog" style="max-width: 500px" @close="dialog = false">
    <template #header>Operation {{ operationName }}</template>
    <div class="p-3">
      <strong>Args:</strong>
      <br />
      <v-textarea :model-value="args" :readonly="true" :max-lines="10" />
      <strong>Result:</strong>
      <br />
      <v-textarea :model-value="result" :max-lines="10" :readonly="true" />
    </div>
  </DevDialog>
</template>

<script lang="ts" setup>
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useDebugStore } from "@/store/debug.store";

const selectedTransport = ref(localStorage.getItem("tpuTransport") || "ws");

const args = ref<any>({});
const dialog = ref(false);
const result = ref<any>({});
const operationName = ref("");

watch(selectedTransport, (value) => {
  localStorage.setItem("tpuTransport", value);
});

const networkInspectionEnabled = ref(
  localStorage.getItem("tpuNetworkInspection") === "true" || import.meta.env.DEV
);

const artificialLatency = ref(
  parseInt(localStorage.getItem("tpuArtificialLatency") || "0")
);

const dev = import.meta.env.DEV;

watch(networkInspectionEnabled, (value) => {
  localStorage.setItem("tpuNetworkInspection", value.toString());
});

watch(artificialLatency, (value) => {
  localStorage.setItem("tpuArtificialLatency", value.toString());
});

export type DebugSettings = {
  graphql: boolean;
  websocket: boolean;
  gqlExclPulse: boolean;
  comms: boolean;
  graphqlActions: boolean;
};

const settings = ref({
  graphql: false,
  websocket: false,
  gqlExclPulse: true,
  comms: false,
  graphqlActions: false
});

watch(
  () => [
    settings.value.graphql,
    settings.value.websocket,
    settings.value.gqlExclPulse,
    settings.value.comms,
    settings.value.graphqlActions
  ],
  () => {
    localStorage.setItem("debug", JSON.stringify(settings.value));
  }
);

onMounted(() => {
  const debug = localStorage.getItem("debug");
  if (debug) {
    settings.value = JSON.parse(debug);
  }
});

const apollo = useApolloClient();
const debugStore = useDebugStore();

const operationsSearch = ref("");
const operationsPage = ref(1);
const itemsPerPage = 10;
const operations = computed(() => {
  const ops = debugStore.recentOperations.filter((op) =>
    op.name.toLowerCase().includes(operationsSearch.value.toLowerCase())
  );
  if (settings.value.gqlExclPulse) {
    return ops.filter((op) => !op.name.includes("Pulse"));
  }
  return ops.slice(
    (operationsPage.value - 1) * itemsPerPage,
    operationsPage.value * itemsPerPage
  );
});

const operationsPages = computed(() => {
  return Math.ceil(operations.value.length / 10);
});
</script>

<style>
.v-overlay-container .v-menu {
  z-index: 9999999 !important;
}
</style>
