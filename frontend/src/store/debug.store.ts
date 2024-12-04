import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

type Operation = {
  id: string;
  name: string;
  args: any;
  result: any;
  time: number;
  type: "query" | "mutation" | "subscription";
  pending: boolean;
  timestamp: number;
  sdl: string;
};

type Dialog = {
  id: string;
  lastInteracted: number;
};

type Component = {
  id: string;
  name: string;
  renders: number;
  el: HTMLElement;
  stateA: any;
  stateB: any;
};

export const useDebugStore = defineStore("debug", () => {
  const recentOperations = ref<Operation[]>([]);
  const dialogs = ref<Dialog[]>([]);
  const rerenders = ref<Component[]>([]);
  const renderMonitor = ref(localStorage.getItem("renderMonitor") !== "false");

  watch(
    () => renderMonitor.value,
    (value) => {
      localStorage.setItem("renderMonitor", value.toString());
    }
  );

  watch(recentOperations, (value) => {
    if (value.length > 100) {
      // proritize operations that do not contain "Pulse"
      const prioritized = value.filter((op) => !op.name.includes("Pulse"));
      const pulse = value.filter((op) => op.name.includes("Pulse"));
      if (pulse.length > 100) {
        recentOperations.value = [...prioritized, ...pulse.slice(0, 100)].sort(
          (a, b) => a.timestamp - b.timestamp
        );
      }

      if (prioritized.length > 100) {
        recentOperations.value = [...prioritized.slice(0, 100), ...pulse].sort(
          (a, b) => a.timestamp - b.timestamp
        );
      }
    }

    recentOperations.value = value.sort((a, b) => {
      if (a.pending) return -1;
      if (b.pending) return 1;
      return a.timestamp - b.timestamp;
    });
  });

  return {
    recentOperations,
    dialogs,
    rerenders,
    renderMonitor
  };
});
