<template>
  <div>
    <Leave v-model="$chat.dialogs.leave.value" />
    <v-menu
      v-model="contextMenu.dialog"
      :style="menuStyle"
      location="top"
      style="z-index: 2003"
    >
      <v-card>
        <v-list>
          <v-list-item @click="() => {}">
            <v-menu
              :close-delay="100"
              :close-on-click="false"
              :close-on-content-click="false"
              :nudge-right="10"
              :open-delay="0"
              activator="parent"
              bottom
              class="ml-2"
              location="right"
              offset-x
              open-on-hover
            >
              <v-card>
                <v-list v-if="contextMenu.item">
                  <v-list-item @click="setNotifications('all')">
                    <v-list-item-title>
                      {{ $t("chats.notificationOptions.all") }}
                    </v-list-item-title>
                    <template #append>
                      <v-icon
                        v-if="
                          contextMenu.item.association.notifications === 'all'
                        "
                        style="float: right"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                  </v-list-item>
                  <v-list-item @click="setNotifications('mentions')">
                    <v-list-item-title>
                      {{ $t("chats.notificationOptions.mentions") }}
                    </v-list-item-title>
                    <template #append>
                      <v-icon
                        v-if="
                          contextMenu.item.association.notifications ===
                          'mentions'
                        "
                        style="float: right"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                  </v-list-item>
                  <v-list-item two-line @click="setNotifications('none')">
                    <v-list-item-title>
                      {{ $t("chats.notificationOptions.none") }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t("chats.notificationOptions.noneDesc") }}
                    </v-list-item-subtitle>
                    <template #append>
                      <v-icon
                        v-if="
                          contextMenu.item.association.notifications === 'none'
                        "
                        style="float: right"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-list-item-title>
              <v-icon class="mr-1">mdi-bell-outline</v-icon>
              {{ $t("chats.notifications") }}
              <v-icon class="ml-5">mdi-arrow-right</v-icon>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="
              $chat.hasPermission(
                [
                  'ADMIN',
                  'OVERVIEW',
                  'VIEW_AUDIT_LOG',
                  'ADD_USERS',
                  'REMOVE_USERS',
                  'OWNER',
                  'BAN_USERS',
                  'REMOVE_USERS',
                  'CREATE_EMOJI',
                  'MANAGE_INTEGRATIONS',
                  'MANAGE_RANKS',
                  'VIEW_INSIGHTS'
                ],
                contextMenu.item
              )
            "
            @click="
              $chat.dialogs.groupSettings.itemId = contextMenu.item.id;
              $chat.dialogs.groupSettings.value = true;
            "
          >
            <v-icon class="mr-1">mdi-cog-outline</v-icon>
            Group Settings
          </v-list-item>
          <UserSidebarOptions
            v-if="
              contextMenu.item?.type === 'direct' &&
              $user.users[contextMenu.item.recipient?.id]
            "
            :user="$user.users[contextMenu.item.recipient?.id]"
            :hide-message="true"
          />
          <v-list-item
            v-if="
              contextMenu.item?.userId !== $user.user?.id &&
              contextMenu.item?.type !== 'direct'
            "
            style="color: rgb(var(--v-theme-error))"
            @click="
              $chat.dialogs.leave.itemId = contextMenu.item.id;
              $chat.dialogs.leave.value = true;
            "
          >
            <v-icon class="mr-1">mdi-exit-to-app</v-icon>
            {{ $t("generic.leave") }}
          </v-list-item>
          <v-list-item
            v-if="contextMenu.item?.type === 'direct'"
            @click="$chat.leaveChat(contextMenu.item.association.id)"
          >
            <v-icon class="mr-1">mdi-close</v-icon>
            {{ $t("generic.close") }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <GroupWizard
      v-model="$app.dialogs.createChat"
      v-if="$experiments.experiments.CHAT_GUIDED_WIZARD"
    />
    <div
      class="d-flex flex-column"
      style="gap: 4px"
      v-if="!$experiments.experiments.PROGRESSIVE_UI"
    >
      <v-btn class="mx-2" to="/communications/home">
        <v-icon class="mr-1">mdi-account-multiple</v-icon>
        {{ $t("chats.socialHub.title") }}
      </v-btn>
      <v-btn
        class="mx-2"
        v-if="$experiments.experiments.CHAT_GUIDED_WIZARD"
        @click="$app.dialogs.createChat = !$app.dialogs.createChat"
      >
        <v-icon class="mr-1">mdi-plus</v-icon>
        {{ $t("chats.join.title") }}
      </v-btn>
    </div>
    <overline
      class="ml-3 mb-n1"
      position="start"
      v-if="!$experiments.experiments.CHAT_GUIDED_WIZARD"
    >
      <CreateChat
        v-slot="{ props }"
        v-model="$app.dialogs.createChat"
        type="create"
      >
        <v-btn class="mr-1" icon size="xsmall" v-bind="props">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </CreateChat>
      {{ $t("chats.chats") }}
    </overline>
    <v-list nav>
      <v-list-item
        v-for="chat in $chat.chats"
        :key="chat.id"
        :subtitle="chat.type === 'group' ? `${chat.usersCount} members` : ''"
        :to="`/communications/${chat.association.id}`"
        :class="{
          'black-and-white': chat.association.notifications === 'none'
        }"
        class="position-relative"
        @contextmenu.prevent="context($event, chat)"
      >
        <template #title>
          {{ $chat.chatName(chat) }}
          <v-chip
            v-if="$user.users[chat.recipient?.id]?.bot"
            class="ml-1"
            size="x-small"
          >
            BOT
          </v-chip>
        </template>
        <template #prepend>
          <UserAvatar
            :chat="chat.type === 'group' ? chat : undefined"
            :status="true"
            :user="
              chat.type === 'direct'
                ? $user.users[chat.recipient?.id]
                : undefined
            "
            :dot-status="true"
            class="mr-2"
            :typing="
              chat.recipient
                ? chat.typers?.find(
                    (typer) => typer.userId === chat.recipient.id
                  )
                : // exclude the current user from the typers list
                  chat.typers?.find((typer) => typer.userId !== $user.user?.id)
            "
            :emulated-status="
              chat.type === 'group' && chat.onlineCount > 1
                ? UserStatus.Online
                : undefined
            "
            :status-tooltip="
              chat.type === 'group' ? `${chat.onlineCount} online` : undefined
            "
          >
            <template v-if="chat.type === 'group'" #status-content>
              <p style="font-size: 0.6em; color: black">
                {{ chat.onlineCount }}
              </p>
            </template>
          </UserAvatar>
        </template>
        <template v-if="chat.unread" #append>
          a
          <v-badge
            :class="chat.unread > 99 ? 'mr-6' : 'mr-4'"
            :content="chat.unread > 99 ? '99+' : chat.unread"
            color="red"
          />
        </template>
      </v-list-item>
      <v-list-item v-if="!$chat.chats.length" class="fade-skeleton">
        <MessageSkeleton v-for="i in 5" :key="i" :animate="false" />
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import CreateChat from "@/components/Communications/Menus/CreateChat.vue";
import Leave from "@/components/Communications/Dialogs/Leave.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { Chat, UserStatus } from "@/gql/graphql";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserSidebarOptions from "@/components/Communications/Menus/UserSidebarOptions.vue";
import GroupWizard from "@/components/Communications/Dialogs/GroupWizard.vue";

export default defineComponent({
  components: {
    GroupWizard,
    UserSidebarOptions,
    Overline,
    UserAvatar,
    Leave,
    CreateChat,
    MessageSkeleton
  },
  data() {
    return {
      leave: {
        dialog: false,
        chat: undefined as Chat | undefined
      },
      contextMenu: {
        dialog: false,
        x: 0,
        y: 0,
        item: undefined as Chat | undefined
      }
    };
  },
  computed: {
    UserStatus() {
      return UserStatus;
    },
    menuStyle() {
      return `
        position: absolute;
        top: ${this.contextMenu.y}px;
        left: ${this.contextMenu.x}px;`;
    }
  },
  methods: {
    setNotifications(type: "all" | "mentions" | "none") {
      if (!this.contextMenu.item?.association) return;
      this.axios.patch(
        `/chats/association/${this.contextMenu.item?.association.id}`,
        {
          notifications: type
        }
      );
      this.contextMenu.item.association.notifications = type;
    },
    context(e: any, item: any) {
      e.preventDefault();
      this.contextMenu.item = item;
      this.contextMenu.x = e.clientX + window.scrollX;
      this.contextMenu.y = e.clientY + window.scrollY;
      this.contextMenu.dialog = true;
    }
  }
});
</script>
