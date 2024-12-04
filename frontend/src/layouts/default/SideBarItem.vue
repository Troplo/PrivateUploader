<script setup lang="ts">
import {
  NavigationOption,
  useProgressiveUIStore
} from "@/store/progressive.store";
import { computed, ref, useAttrs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/app.store";
import { useDisplay } from "vuetify";

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
  }
});

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const attrs = useAttrs();
const display = useDisplay();
const uiStore = useProgressiveUIStore();

const selected = computed(() => {
  return props.selected || route?.path === (props.item?.path || props.to);
});

function handleClick() {
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
        'dark:hover:bg-outline-amoled': !selected && !props.highlighted
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
  </component>
</template>

<style scoped></style>
