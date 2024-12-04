<template>
  <super-bar-item
    :selected="uiStore.navigationMode === item.id"
    @click="
      item.click
        ? item.click()
        : item.scopesRequired &&
          !functions.checkScope(item.scopesRequired, $user.user?.scopes)
        ? () => {}
        : (uiStore.navigationMode = item.id)
    "
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
    <v-tooltip activator="parent" location="right">
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

const uiStore = useProgressiveUIStore();

defineProps({
  item: {
    type: Object as () => NavigationOption,
    required: true
  }
});
</script>

<style scoped></style>
