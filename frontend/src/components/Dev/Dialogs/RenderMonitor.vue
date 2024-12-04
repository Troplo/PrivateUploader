<template>
  <DevDialog @close="compare.value = false" v-if="compare.value">
    <template #header>
      <RiCodeFill style="height: 18px" />
      Compare State for {{ compare.id }}
    </template>
    <v-container>
      <v-row>
        <v-col cols="6">
          <pre>{{ JSON.stringify(compare.stateA, null, 2) }}</pre>
        </v-col>
        <v-col cols="6">
          <pre>{{ JSON.stringify(compare.stateB, null, 2) }}</pre>
        </v-col>
      </v-row>
    </v-container>
  </DevDialog>
  <DevDialog @close="$app.dialogs.renderMonitor = false">
    <template #header>Render Monitor</template>
    <v-container>
      <v-btn @click="toggleRenderMonitor">
        {{ debugStore.renderMonitor ? "Disable" : "Enable" }} Render Monitor
      </v-btn>

      <v-virtual-scroll :height="300" :items="rerenders">
        <template v-slot:default="{ item: component }">
          <v-list-item>
            <v-list-item-title>
              {{ component.name }}
            </v-list-item-title>
            <template #prepend>
              {{ component.renders }}
            </template>
            <template #append>
              <v-btn @click="jumpToComponent(component.el)">JMP</v-btn>
              <v-btn
                @click="
                  compare = {
                    id: component.id,
                    value: true,
                    stateA: component.stateA,
                    stateB: component.stateB
                  }
                "
              >
                CPR
              </v-btn>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-container>
  </DevDialog>
</template>

<script lang="ts" setup>
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";
import { useDebugStore } from "@/store/debug.store";
import { computed, ref, VNode } from "vue";
import { RiCodeFill } from "@remixicon/vue";

const debugStore = useDebugStore();

const compare = ref({
  id: "",
  value: false,
  stateA: {},
  stateB: {}
});

const rerenders = computed(() => {
  return debugStore.rerenders.slice().sort((a, b) => b.renders - a.renders);
});

function toggleRenderMonitor() {
  debugStore.renderMonitor = !debugStore.renderMonitor;
}

function jumpToComponent(el?: HTMLElement) {
  if (!el) return;
  console.log(el);
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  if (el.style) {
    el.style.outline = "4px solid red";
    setTimeout(() => {
      if (el.style) el.style.outline = "";
    }, 1000);
  }
}
</script>
