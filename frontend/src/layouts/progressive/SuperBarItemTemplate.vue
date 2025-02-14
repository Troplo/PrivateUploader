<template>
  <super-bar-item
    :class="{ 'tutorial-tip-glow-superbar': tutorialTipActive }"
    :selected="uiStore.navigationMode === item.id"
    @click="doClick()"
    :badge="item.badge"
    :disabled="
      item.scopesRequired &&
      !functions.checkScope(item.scopesRequired, $user.user?.scopes)
    "
    @dblclick="
      item.click
        ? () => {}
        : (item.scopesRequired &&
            !functions.checkScope(item.scopesRequired, $user.user?.scopes)) ||
          !uiStore.lastRailRoutes[item.id.toString()]
        ? () => {}
        : $router.push(uiStore.lastRailRoutes[item.id.toString()])
    "
  >
    <!-- if a tutorial tip is active, the tooltip will overlap, and get stuck even after the tutorial tip is dismissed -->
    <v-tooltip activator="parent" location="right" v-if="!tutorialTipActive">
      {{
        item.scopesRequired &&
        !functions.checkScope(item.scopesRequired, $user.user?.scopes)
          ? "Insufficient Permissions"
          : item.name
      }}
    </v-tooltip>
    <template
      #badge
      v-if="!functions.checkScope(item.scopesRequired, $user.user?.scopes)"
    >
      <div
        class="absolute z-20 top-0 right-0 text-center flex justify-center bg-badge-default-dark rounded-full p-1"
      >
        <RiLockLine style="width: 10px; height: 10px" />
      </div>
    </template>
    <component
      :is="uiStore.navigationMode === item.id ? item.selectedIcon : item.icon"
    />
    <component
      :is="item.tutorialTip.component"
      v-if="item.tutorialTip?.component && tutorialTipActive"
      :model-value="
        experimentsStore.experiments[item.tutorialTip.key] ===
        item.tutorialTip.value
      "
    />
  </super-bar-item>
</template>

<script lang="ts" setup>
import SuperBarItem from "@/layouts/progressive/SuperBarItem.vue";
import { RiLockLine } from "@remixicon/vue";
import functions from "@/plugins/functions";
import {
  NavigationOption,
  useProgressiveUIStore
} from "@/store/progressive.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useAppStore } from "@/store/app.store";
import { useUserStore } from "@/store/user.store";

const uiStore = useProgressiveUIStore();
const userStore = useUserStore();
// used for tutorial tips
const appStore = useAppStore();
const experimentsStore = useExperimentsStore();

const props = defineProps({
  item: {
    type: Object as () => NavigationOption,
    required: true
  }
});
const display = useDisplay();

const tutorialTipActive = computed(() => {
  if (!props.item.tutorialTip) return false;
  const value =
    experimentsStore.experiments[props.item.tutorialTip.key] ===
    props.item.tutorialTip.value;

  if (value) {
    if (display.mobile.value && appStore.mainDrawer) {
      return true;
    } else if (!display.mobile.value) {
      return true;
    }
  }

  return false;
});

function doClick() {
  if (tutorialTipActive.value) {
    experimentsStore.setExperiment(
      props.item.tutorialTip.key,
      props.item.tutorialTip.nextValue ?? 0
    );
  }

  if (props.item.click) {
    props.item.click();
  } else {
    if (
      props.item.scopesRequired &&
      !functions.checkScope(props.item.scopesRequired, userStore.user?.scopes)
    ) {
      return;
    } else {
      uiStore.navigationMode = props.item.id;
    }
  }
}
</script>

<style>
.tutorial-tip-glow-superbar {
  animation: tutorial-tip-glow 3s infinite;
}
</style>
