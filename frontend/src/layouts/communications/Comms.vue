<template>
  <v-dialog v-model="$chat.dialogs.user.value" style="max-width: 75vw">
    <v-card>
      <user
        :key="$chat.dialogs.user.username"
        :username="$chat.dialogs.user.username"
      />
    </v-card>
  </v-dialog>
  <v-menu
    v-model="$chat.dialogs.userMenu.value"
    :activator="'#' + $chat.dialogs.userMenu.bindingElement"
    :close-on-content-click="false"
    location="top"
    style="z-index: 2001"
  >
    <user-menu />
  </v-menu>
  <Chat />
  <member-sidebar v-if="!$vuetify.display.mobile && $chat.commsSidebar" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MemberSidebar from "@/layouts/communications/MemberSidebar.vue";
import User from "@/views/User/User.vue";
import UserMenu from "@/components/Communications/Menus/UserMenu.vue";
import ImageDialog from "@/components/Communications/Dialogs/ImageDialog.vue";
import GroupSettingsDialog from "@/components/Communications/Dialogs/GroupSettingsV2.vue";
import Chat from "@/views/Communications/Chat.vue";

export default defineComponent({
  name: "ChatLayout",
  components: {
    Chat,
    GroupSettingsDialog,
    ImageDialog,
    MemberSidebar,
    UserMenu,
    User
  },
  computed: {
    menuStyle() {
      return `
        position: absolute;
        top: ${this.$chat.dialogs.userMenu.y - 150}px;
        left: ${this.$chat.dialogs.userMenu.x + 10}px;`;
    }
  }
});
</script>
