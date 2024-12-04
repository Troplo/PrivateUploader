<template>
  <keep-alive :max="<number>$experiments.experiments.CHAT_CACHING || 0">
    <component
      v-if="$route.params.chatId"
      :is="ChatV3"
      :key="parseInt(<string>$route.params.chatId)"
      :chat-id="parseInt(<string>$route.params.chatId)"
    />
  </keep-alive>
  <teleport v-if="$chat.isReady && $ui.ready" to="#appbar-options">
    <accessible-transition mode="out-in" name="slide-up" appear>
      <div class="flex gap-2">
        <v-btn
          v-if="$experiments.experiments.PINNED_MESSAGES"
          icon
          size="small"
        >
          <Pins />
          <RiPushpin2Line class="action-bar-item" />
        </v-btn>
        <v-btn
          icon
          size="small"
          @click="$chat.search.value = !$chat.search.value"
        >
          <RiSearchLine class="action-bar-item" />
        </v-btn>
        <v-btn
          icon
          size="small"
          @click="$chat.memberSidebarShown = !$chat.memberSidebarShown"
        >
          <RiUserLine
            class="action-bar-item"
            v-if="!$chat.memberSidebarShown"
          />
          <RiUserFill class="action-bar-item" v-else />
        </v-btn>
      </div>
    </accessible-transition>
  </teleport>
</template>

<script lang="ts" setup>
import ChatV2 from "@/views/Communications/ChatV2.vue";
import Pins from "@/components/Communications/Menus/Pins.vue";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import {
  RiPushpin2Line,
  RiSearchLine,
  RiUserFill,
  RiUserLine
} from "@remixicon/vue";
import ChatV3 from "@/views/Communications/ChatV3.vue";
</script>

<style scoped></style>
