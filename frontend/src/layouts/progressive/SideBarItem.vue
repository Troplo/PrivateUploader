<script setup lang="ts">
import {
  NavigationOption,
  TutorialTip,
  useProgressiveUIStore
} from "@/store/progressive.store";
import { computed, onMounted, ref, useAttrs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/app.store";
import { useDisplay } from "vuetify";
import { useExperimentsStore } from "@/store/experiments.store";

const props = defineProps({
  highlighted: Boolean,
  item: [Object as () => NavigationOption, undefined],
  to: [String, undefined],
  closeOnClick: {
    type: Boolean,
    default: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  rail: {
    type: Number
  }
});

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const attrs = useAttrs();
const display = useDisplay();
const uiStore = useProgressiveUIStore();
const experimentsStore = useExperimentsStore();

const selected = computed(() => {
  return props.selected || route?.path === (props.item?.path || props.to);
});

const tutorialTipActive = computed(() => {
  if (!props.item?.tutorialTips?.length) return null;
  let value = null as TutorialTip | null;
  for (const tip of props.item.tutorialTips) {
    if (experimentsStore.experiments[tip.key] === tip.value) {
      value = tip;
      break;
    }
  }

  if (value) {
    if (display.mobile.value && appStore.mainDrawer) {
      return value;
    } else if (!display.mobile.value) {
      return value;
    }
  }

  return null;
});

const renderTooltip = ref(false);

const shouldRenderTooltip = computed(() => {
  return (
    tutorialTipActive.value?.component && uiStore.navigationMode === props.rail
  );
});

async function render() {
  if (shouldRenderTooltip.value) {
    // Hack to make sure the tooltip renders after the component is mounted
    await new Promise((resolve) => setTimeout(resolve, 300));
    renderTooltip.value = true;
  } else {
    renderTooltip.value = false;
  }
}

onMounted(() => {
  render();
});

watch(
  () => shouldRenderTooltip.value,
  () => {
    render();
  }
);

function handleClick() {
  if (tutorialTipActive.value) {
    experimentsStore.setExperiment(
      tutorialTipActive.value.key,
      tutorialTipActive.value.nextValue ?? 0
    );
  }
  if (props.disabled) {
    return;
  } else {
    if (attrs["onClick"]) {
      // @ts-ignore
      attrs["onClick"]();
    }

    if (!props.selected) {
      if (props.item?.externalPath) {
        window.open(props.item?.externalPath!, "_blank");
      } else if (props.item?.click) {
        props.item?.click();
      } else {
        router.push(props.item?.path || props.to || "");
      }
    }

    if (props.closeOnClick && display.mobile.value) {
      appStore.mainDrawer = false;
    }
  }
}

function openContextMenu(event: MouseEvent) {
  if (!props.item?.menu?.length || props.disabled) return;
  event.preventDefault();
  uiStore.activeContextMenu = {
    x: event.clientX,
    y: event.clientY,
    menu: props.item.menu,
    show: true
  };
}
</script>

<template>
  <component
    :is="disabled ? 'div' : 'a'"
    :href="item?.path || item?.externalPath || to"
    class="w-full text-inherit"
    @click.prevent.stop
    tabindex="-1"
  >
    <div
      class="rounded-2xl hover:bg-outline-light p-2 cursor-pointer flex items-center h-full w-full relative dark:fill-white"
      :class="{
        'dark:bg-outline-dark bg-outline-light': selected || props.highlighted,
        'rounded-full': props.highlighted,
        'cursor-not-allowed opacity-50': props.disabled,
        'dark:hover:bg-outline-amoled': !selected && !props.highlighted,
        'tutorial-tip-glow-superbar': tutorialTipActive
      }"
      @click.prevent.stop="handleClick"
      v-ripple
      tabindex="0"
      style="border-radius: 100px"
      @keydown.enter="
        //@ts-ignore
        $event.target?.click()
      "
      v-bind="$attrs"
      @keydown.space="
        $event.preventDefault();
        //@ts-ignore
        $event.target?.click();
      "
      @contextmenu="openContextMenu"
    >
      <slot />
      <template v-if="item?.selectedIcon || item?.icon">
        <component
          :is="selected && item.selectedIcon ? item.selectedIcon : item.icon"
          class="w-7 ml-2"
          style="min-width: 24px"
        />
      </template>
      <template v-else>
        <div class="flex">
          <slot name="icon" />
        </div>
      </template>
      <div class="ml-4 select-none flex justify-between w-full align-center">
        <div
          style="
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

            word-wrap: break-word;
          "
          class="flex flex-col w-full justify-center"
        >
          <div class="flex align-center">
            <div v-if="item?.name">
              {{ item.name }}
            </div>
            <template v-else>
              <slot name="title" />
            </template>
          </div>
          <div class="text-medium-emphasis-dark" style="font-size: 0.85rem">
            {{ item?.subtitle }}
            <slot name="subtitle" />
          </div>
        </div>
        <div>
          <slot name="append" />
          <template v-if="item?.badge">
            <v-chip
              size="x-small"
              class="mr-2 text-black"
              color="red"
              variant="flat"
            >
              {{ item.badge }}
            </v-chip>
          </template>
        </div>
      </div>
    </div>
    <component
      :is="tutorialTipActive.component"
      v-if="tutorialTipActive?.component"
      :model-value="shouldRenderTooltip && renderTooltip"
    />
  </component>
</template>

<style scoped></style>

<style>
.tutorial-tip-glow-superbar {
  animation: tutorial-tip-glow 3s infinite;
}
</style>
