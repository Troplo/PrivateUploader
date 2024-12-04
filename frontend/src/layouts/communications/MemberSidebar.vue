<template>
  <core-sidebar
    :model-value="$chat.memberSidebarShown || $app.rail"
    name="chat-members"
    :class="{
      'sidebar-patch': $app.rail
    }"
    :width="$chat.search.value ? 400 : undefined"
    color="dark"
    floating
    location="right"
    class="user-content"
    @update:model-value="$chat.memberSidebarShown = $event"
  >
    <keep-alive :max="<number>$experiments.experiments.CHAT_CACHING || 0">
      <component
        :is="MemberSidebarList"
        :key="parseInt(<string>$route.params.chatId)"
        :chat-id="parseInt(<string>$route.params.chatId)"
      />
    </keep-alive>
  </core-sidebar>
</template>

<script setup lang="ts">
import MemberSidebarList from "@/layouts/communications/MemberSidebarList.vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";
import { onMounted, watch } from "vue";
import { useChatStore } from "@/store/chat.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { useDisplay } from "vuetify";
import { useAppStore } from "@/store/app.store";

const appStore = useAppStore();
const chatStore = useChatStore();
const experimentsStore = useExperimentsStore();
const display = useDisplay();

watch(
  () => chatStore.memberSidebarShown,
  (val) => {
    if (val && appStore.mainDrawer && display.mobile.value) {
      appStore.mainDrawer = false;
    }
    if (display.mobile.value) return;
    localStorage.setItem("memberSidebarShown", val.toString());
  }
);

onMounted(() => {
  if (!display.mobile.value) {
    if (!localStorage.getItem("memberSidebarShown")) return;
    chatStore.memberSidebarShown =
      localStorage.getItem("memberSidebarShown") === "true";
  }
});
</script>
