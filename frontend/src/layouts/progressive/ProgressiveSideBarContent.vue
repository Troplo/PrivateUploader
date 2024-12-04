<template>
  <Leave v-model="$chat.dialogs.leave.value" />
  <GroupWizard
    v-model="$app.dialogs.createChat"
    v-if="$experiments.experiments.CHAT_GUIDED_WIZARD"
  />
  <v-menu v-model="$ui._activeContextMenu.show" :style="menuStyle">
    <v-list>
      <v-list-item
        v-for="menu in uiStore.activeContextMenu.menu"
        :key="menu.name"
        @click="menu.action"
        :base-color="menu.color"
      >
        <v-menu
          :close-delay="100"
          :close-on-click="false"
          :close-on-content-click="false"
          :nudge-right="10"
          :open-delay="0"
          activator="parent"
          class="ml-2"
          location="right"
          offset-x
          open-on-hover
          v-if="menu.menu?.length"
        >
          <v-card>
            <v-list>
              <v-list-item
                v-for="subMenu in menu.menu"
                :key="subMenu.name"
                @click="subMenu.action"
                :base-color="subMenu.color"
                class="flex"
              >
                <div>
                  <v-list-item-title>{{ subMenu.name }}</v-list-item-title>
                  <v-list-item-subtitle v-if="subMenu.subtitle">
                    {{ subMenu.subtitle }}
                  </v-list-item-subtitle>
                </div>
                <template #append>
                  <component :is="subMenu.append" />
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <template #prepend>
          <component :is="menu.icon" class="mr-2" />
        </template>
        <v-list-item-title>{{ menu.name }}</v-list-item-title>
        <template #append v-if="menu.menu?.length">
          <v-icon>mdi-arrow-right</v-icon>
        </template>
        <template #append v-else>
          <component :is="menu.append" />
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
  <router-link
    :to="uiStore.currentRail?.path"
    class="text-inherit sticky top-0"
    style="z-index: 200"
    @click.prevent
  >
    <div
      class="flex cursor-pointer select-none justify-between pt-0 flowinity-border border-b-2 force-bg bg-dark"
      style="min-height: 64px; max-height: 64px"
    >
      <accessible-transition name="slide-fade" mode="out-in">
        <div :key="uiStore.currentRail?.id" class="flex items-center">
          <component :is="uiStore.currentRail?.icon" class="w-8 ml-4" />
          <p class="text-xl font-semibold ml-4">
            {{ uiStore.currentRail?.name }}
          </p>
        </div>
      </accessible-transition>
      <div id="sidebar-actions" class="flex items-center mr-4" />
    </div>
  </router-link>
  <div
    id="sidebar-content"
    class="flex justify-between flex-col"
    style="width: 255px; min-width: 255px; max-width: 255px"
    :style="{
      height: `calc(100vh - ${$vuetify.display.mobile ? '144px' : '64px'})`
    }"
  >
    <div id="sidebar-top" />
    <div class="justify-between flex-col flex-1 px-3" style="margin-top: 16px">
      <div id="sidebar-flex" class="flex-col flex flex-1 relative">
        <accessible-transition
          v-for="[rail, entries] in Object.entries(uiStore.navigation.options)"
          :key="rail"
          name="slide-fade"
          mode="out-in"
        >
          <div
            v-show="uiStore.currentRail?.id === parseInt(rail)"
            class="flex flex-col gap-1"
          >
            <SideBarItem
              v-for="item in entries as NavigationOption[]"
              :key="item.id + item.path + ''"
              class="flex items-center"
              :item="item"
              :disabled="
                item.scopesRequired &&
                !functions.checkScope(item.scopesRequired, $user.user?.scopes)
              "
            >
              <v-tooltip
                v-if="
                  item.scopesRequired &&
                  !functions.checkScope(item.scopesRequired, $user.user?.scopes)
                "
                activator="parent"
                location="right"
              >
                Insufficient Permissions
              </v-tooltip>
              <template
                v-if="
                  item.scopesRequired &&
                  !functions.checkScope(item.scopesRequired, $user.user?.scopes)
                "
                #append
              >
                <div
                  class="text-center flex justify-center bg-badge-default-dark rounded-full p-1"
                >
                  <RiLockLine style="width: 15px; height: 15px" />
                </div>
              </template>
            </SideBarItem>
          </div>
        </accessible-transition>
        <accessible-transition name="slide-fade" mode="out-in">
          <SidebarCollections
            v-show="uiStore.currentRail?.id === RailMode.GALLERY"
          />
        </accessible-transition>
        <accessible-transition name="slide-fade" mode="out-in">
          <SidebarDebug v-show="uiStore.currentRail?.id === RailMode.DEBUG" />
        </accessible-transition>
        <accessible-transition name="slide-fade" mode="out-in">
          <WorkspacesSidebarList
            v-show="uiStore.currentRail?.id === RailMode.WORKSPACES"
          />
        </accessible-transition>
      </div>
    </div>
    <accessible-transition name="slide-fade" mode="out-in">
      <div
        class="flex-col flex gap-y-2 px-3"
        :style="{ marginBottom: $vuetify.display.mobile ? '0px' : '16px' }"
        :key="uiStore.currentRail?.id"
      >
        <SideBarItem
          v-for="item in uiStore.currentMiscNavOptions"
          :key="item.name"
          class="flex items-center text-medium-emphasis-dark"
          :item="item"
          style="fill: #878889"
          :disabled="
            item.scopesRequired &&
            !functions.checkScope(item.scopesRequired, $user.user?.scopes)
          "
        />
      </div>
    </accessible-transition>
  </div>
</template>

<script lang="ts" setup>
import {
  useProgressiveUIStore,
  RailMode,
  NavigationOption
} from "@/store/progressive.store";
import { useAppStore } from "@/store/app.store";
import { computed, nextTick, watch } from "vue";
import SidebarList from "@/layouts/communications/SidebarList.vue";
import SideBarItem from "@/layouts/progressive/SideBarItem.vue";
import SidebarDebug from "@/layouts/progressive/SidebarDebug.vue";
import SidebarCollections from "@/layouts/progressive/SidebarCollections.vue";
import MailSidebarList from "@/layouts/mail/SidebarList.vue";
import WorkspacesSidebarList from "@/layouts/default/WorkspacesSidebarList.vue";
import AdminSidebarList from "@/components/Admin/AdminSidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import CrashComponent from "@/components/Core/CrashAlt.vue";
import functions from "@/plugins/functions";
import { RiChat1Line, RiLock2Line, RiLockLine } from "@remixicon/vue";
import { useChatStore } from "@/store/chat.store";
import { useDisplay } from "vuetify";
import Leave from "@/components/Communications/Dialogs/Leave.vue";
import GroupWizard from "@/components/Communications/Dialogs/GroupWizard.vue";

const appStore = useAppStore();
const chatStore = useChatStore();
const uiStore = useProgressiveUIStore();
const display = useDisplay();

watch(
  () => appStore.mainDrawer,
  (val) => {
    if (!val && !display.mobile.value) {
      appStore.mainDrawer = true;
    }
    if (val && chatStore.memberSidebarShown && display.mobile.value) {
      chatStore.memberSidebarShown = false;
    }
  }
);

const menuStyle = computed(() => {
  return `
        position: absolute;
        top: ${uiStore.activeContextMenu.y}px;
        left: ${uiStore.activeContextMenu.x + 10}px;`;
});

// watch(
//   () => uiStore.currentRail,
//   async (val) => {
//     await nextTick();
//     const yOffset = -10;
//     const element = document.getElementById("sidebar-content");
//     if (element) {
//       element.scrollTop = 0;
//     }
//   }
// );
</script>
<style>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-active {
  opacity: 0;
  overflow: hidden;
}

.no-scroll * {
  scrollbar-width: none;
}
</style>

<style scoped></style>
