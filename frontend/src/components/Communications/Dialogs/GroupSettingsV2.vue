<template>
  <CoreDialog
    :model-value="modelValue"
    fullscreen
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      <v-toolbar color="transparent">
        <overline v-if="$vuetify.display.mobile">
          {{ $chat.editingChat.name }}
        </overline>
        <v-spacer />
        <CreateChat
          v-slot="{ props }"
          v-model="add"
          type="add"
          @add="
            $chat.changeUsers($event, true, $chat.editingChat.association.id)
          "
        >
          <v-btn
            v-if="$chat.hasPermission('ADD_USERS', $chat.editingChat)"
            class="float-end mr-2"
            icon
            v-bind="props"
            @click="add = true"
          >
            <v-tooltip activator="parent" location="bottom">
              {{ $t("chats.settings.addUser") }}
            </v-tooltip>
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </CreateChat>

        <v-btn
          class="float-end"
          icon
          @click="$emit('update:modelValue', false)"
        >
          <v-tooltip activator="parent" location="bottom">
            {{ $t("generic.close") }}
          </v-tooltip>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <v-overlay
      absolute
      class="align-center justify-center"
      :model-value="!$chat.editingChat.users"
      persistent
    >
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <UploadCropper
      v-model="groupIcon"
      type="chatIcon"
      :remove-text="$t('dialogs.uploadCropper.removeGroup')"
      @finish="uploadIcon"
      @remove="removeIcon"
    />
    <div
      v-if="$chat.editingChat && $chat.editingChat.users"
      class="d-flex mt-n4"
      :class="{ 'flex-column': $vuetify.display.mobile }"
    >
      <v-tabs
        v-model="tab"
        :direction="$vuetify.display.mobile ? 'horizontal' : 'vertical'"
        :style="{ maxWidth: $vuetify.display.mobile ? undefined : '220px' }"
      >
        <overline v-if="!$vuetify.display.mobile">
          {{ $chat.editingChat.name }}
        </overline>
        <v-tab value="home">
          <v-icon class="mr-2">mdi-home</v-icon>
          {{ $t("chats.settings.tabs.home") }}
        </v-tab>
        <v-tab
          v-if="$chat.hasPermission('MANAGE_RANKS', $chat.editingChat)"
          value="ranks"
        >
          <v-icon class="mr-2">mdi-lock</v-icon>
          {{ $t("chats.settings.tabs.ranks") }}
        </v-tab>
        <v-tab
          v-if="$chat.hasPermission('REMOVE_USERS', $chat.editingChat)"
          value="users"
        >
          <v-icon class="mr-2">mdi-account-group</v-icon>
          {{ $t("chats.settings.tabs.users") }}
        </v-tab>
        <v-tab
          v-if="$chat.hasPermission('REMOVE_USERS', $chat.editingChat)"
          value="invites"
        >
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          {{ $t("chats.settings.tabs.invites") }}
        </v-tab>
        <v-tab
          v-if="$chat.hasPermission('CREATE_EMOJI', $chat.editingChat)"
          value="emoji"
        >
          <v-icon class="mr-2">mdi-emoticon</v-icon>
          {{ $t("chats.settings.tabs.emoji") }}
        </v-tab>
        <v-tab
          v-if="$chat.hasPermission('VIEW_AUDIT_LOG', $chat.editingChat)"
          value="audit"
        >
          <v-icon class="mr-2">mdi-note-search</v-icon>
          {{ $t("chats.settings.tabs.audit") }}
        </v-tab>
        <v-tab
          v-if="
            dev && $chat.hasPermission('MANAGE_INTEGRATIONS', $chat.editingChat)
          "
          value="bots"
        >
          <v-icon class="mr-2">mdi-robot</v-icon>
          {{ $t("chats.settings.tabs.bots") }}
        </v-tab>
        <v-tab
          v-if="dev && $chat.hasPermission('BAN_USERS', $chat.editingChat)"
          value="bans"
        >
          <v-icon class="mr-2">mdi-gavel</v-icon>
          {{ $t("chats.settings.tabs.bans") }}
        </v-tab>
        <v-divider class="my-2" />
        <v-btn
          v-if="$chat.editingChat.userId === $user.user.id"
          class="text-left"
          value="delete"
          style="color: rgb(var(--v-theme-error))"
          @click.prevent="
            $chat.dialogs.leave.itemId = $chat.editingChat.id;
            $chat.dialogs.leave.value = true;
          "
        >
          <v-icon class="mr-2">close-line</v-icon>
          {{ $t("chats.leave.delete.title") }}
        </v-btn>
      </v-tabs>
      <div
        style="width: 100%"
        :style="{ padding: $vuetify.display.mobile ? '10px' : undefined }"
      >
        <ChatSettingsHome v-if="tab === 'home'" />
        <ChatSettingsRanks v-else-if="tab === 'ranks'" />
        <ChatSettingsUsers v-else-if="tab === 'users'" />
        <ChatSettingsInvites v-else-if="tab === 'invites'" />
        <ChatSettingsEmoji v-else-if="tab === 'emoji'" />
        <ChatSettingsAudit v-else-if="tab === 'audit'" />
      </div>
    </div>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import ChatSettingsHome from "@/components/Communications/Dialogs/Settings/Home.vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import ChatSettingsRanks from "@/components/Communications/Dialogs/Settings/Ranks.vue";
import ChatSettingsUsers from "@/components/Communications/Dialogs/Settings/Users.vue";
import ChatSettingsInvites from "@/components/Communications/Dialogs/Settings/Invites.vue";
import ChatSettingsEmoji from "@/components/Communications/Dialogs/Settings/Emoji.vue";
import ChatSettingsAudit from "@/components/Communications/Dialogs/Settings/Audit.vue";

export default defineComponent({
  components: {
    ChatSettingsAudit,
    ChatSettingsEmoji,
    ChatSettingsInvites,
    ChatSettingsUsers,
    ChatSettingsRanks,
    Overline,
    ChatSettingsHome,
    CoreDialog,
    UploadCropper,
    CreateChat
  },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      icon: undefined as File[] | undefined,
      add: false,
      groupIcon: false,
      groupIconLoading: false,
      tab: "home"
    };
  },
  computed: {
    dev() {
      return import.meta.env.DEV;
    }
  },
  methods: {
    async uploadIcon(file: File) {
      if (this.$chat.editingChat) {
        this.groupIconLoading = true;
        const formData = new FormData();
        formData.append("icon", file);
        await this.axios.post(
          `/chats/${this.$chat.editingChat.association?.id}/icon`,
          formData
        );
        this.groupIcon = false;
        this.groupIconLoading = false;
      }
    },
    async removeIcon() {
      if (this.$chat.editingChat) {
        await this.axios.delete(
          `/chats/${this.$chat.editingChat.association?.id}/icon`
        );
      }
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.$chat.loadChatUsers(this.$chat.editingChat?.association?.id);
      }
    }
  }
});
</script>
