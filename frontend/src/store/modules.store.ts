// Utilities
import { defineStore } from "pinia";
import { NavigationOption } from "@/store/progressive.store";
import { ref } from "vue";

export const useModulesStore = defineStore("modules", () => {
  const modules = ref({
    FlowForms: {
      navigationOptions: [
        {
          name: "Load FlowForms",
          path: "/forms"
        }
      ] as NavigationOption[],
      id: "#flowforms-app",
      parcelProps: {} as any,
      parcel: null as any
    }
  });

  async function mount(module: keyof typeof modules.value) {
    // create new Parcel
    // const moduleData = modules.value[module];
    // if (moduleData.parcel && moduleData.parcel.getStatus() !== "MOUNTED") {
    //   return moduleData.parcel.mount();
    // } else if (moduleData.parcel) {
    //   return;
    // }
    // moduleData.parcel = mountRootParcel(
    //   () => import("https://flowforms.dev.assets.troplo.com/src/main.ts"),
    //   {
    //     domElement: document.querySelector(moduleData.id)
    //   }
    // );
  }

  async function unmount(module: keyof typeof modules.value) {
    // const moduleData = modules.value[module];
    // if (moduleData.parcel) {
    //   moduleData.parcel.unmount();
    // }
  }

  // const route = useRoute();
  // watch(
  //   () => route.path,
  //   async (path) => {
  //     await nextTick();
  //     if (path.startsWith("/forms")) {
  //       await mount("FlowForms");
  //     } else {
  //       await unmount("FlowForms");
  //     }
  //   }
  // );

  return {
    modules,
    mount,
    unmount
  };
});
