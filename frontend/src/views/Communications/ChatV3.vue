<template>
  <chat-dev-options v-if="chatStore.dialogs.chatDevOptions.value" />
  <WorkspaceDeleteDialog
    v-model="dialogs.delete.value"
    title="Delete Message"
    @submit="
      deleteMessage(dialogs.delete.message?.id);
      dialogs.delete.value = false;
    "
  />
  <div
    class="chat-container"
    @dragover="dragDropHandler"
    @drop="dragDropHandler"
  >
    <v-menu
      v-model="chatStore.dialogs.emojiMenu.value"
      :attach="chatStore.dialogs.emojiMenu.bindingElement"
      style="margin-left: 60px; z-index: 99999"
      height="60px"
      content-class="force-bg"
    >
      <v-card color="toolbar" width="100%" class="no-border">
        <div
          v-if="chatStore.dialogs.emojiMenu.emoji"
          class="justify-items-center align-content-center width flex-row"
          style="width: 100%"
        >
          <v-card-title class="mt-n1">
            :{{ chatStore.dialogs.emojiMenu.emoji.name }}:
          </v-card-title>
          <v-card-subtitle class="mt-n3">
            {{
              chatStore.dialogs.emojiMenu.chat
                ? chatStore.chatName(chatStore.dialogs.emojiMenu.chat)
                : "Private group"
            }}
          </v-card-subtitle>
        </div>
      </v-card>
    </v-menu>
    <v-navigation-drawer
      v-if="$vuetify.display.mobile"
      v-model="chatStore.dialogs.message.value"
      color="card"
      :floating="true"
      location="bottom"
      :temporary="true"
      :touchless="true"
    >
      <message-actions-list
        v-if="chatStore.dialogs.message.message"
        @delete="
          $event
            ? deleteMessage(chatStore.dialogs.message.message?.id)
            : confirmDelete(chatStore.dialogs.message.message);
          chatStore.dialogs.message.value = false;
        "
        @edit="
          handleEdit({
            id: chatStore.dialogs.message.message?.id || 0,
            content: chatStore.dialogs.message.message?.content || ''
          });
          chatStore.dialogs.message.value = false;
        "
        @reply="
          replyId = chatStore.dialogs.message.message?.id;
          chatStore.dialogs.message.value = false;
        "
      />
    </v-navigation-drawer>
    <v-menu v-else v-model="chatStore.dialogs.message.value" :style="menuStyle">
      <message-actions-list
        @delete="
          $event
            ? deleteMessage(chatStore.dialogs.message.message?.id)
            : confirmDelete(chatStore.dialogs.message.message);
          chatStore.dialogs.message.value = false;
        "
        @edit="
          handleEdit({
            id: chatStore.dialogs.message.message?.id || 0,
            content: chatStore.dialogs.message.message?.content || ''
          });
          chatStore.dialogs.message.value = false;
        "
        @reply="
          replyId = chatStore.dialogs.message.message?.id;
          chatStore.dialogs.message.value = false;
        "
      />
    </v-menu>
    <div
      id="chat"
      :key="chatId"
      class="messages communications position-relative"
      @scroll="scrollEvent"
    >
      <div id="sentinel-bottom" ref="sentinelBottom" />
      <infinite-loading
        v-if="messages && chatStore.loadNew"
        :identifier="`${chatStore.selectedChat?.id}-${chatStore.loadNew}-bottom`"
        @infinite="chatStore.loadHistory($event, ScrollPosition.Bottom)"
      >
        <template #spinner>
          <div class="text-center">
            <v-progress-circular
              :size="36"
              :width="2"
              indeterminate
              :model-value="1"
            />
          </div>
        </template>
        <template #complete>
          <span />
        </template>
      </infinite-loading>
      <message-perf
        v-for="(message, index) in messages"
        :id="'message-id-' + message.id"
        :ref="`message-${index === 0 ? 0 : message.id}`"
        :unread-id="unreadId"
        v-memo="[message, expandBlocked, editing, editingText, replyId]"
        :key="message.id"
        :uncollapse-blocked="expandBlocked"
        class="mr-2 ml-2"
        :style="{ zIndex: 1000 - index }"
        :class="{
          'message-jumped': message.id === replyId,
          'message-mention': message.content.includes(`<@${$user.user?.id}>`)
        }"
        :date-separator="dateSeparator(index)"
        :editing="editing === message.id"
        @update:uncollapse-blocked="expandBlocked = $event"
        :editing-text="editingText"
        :merge="$chat.merge(message, index, chatId)"
        :message="message"
        :index="index"
        @author-click="handleAuthorClick($event, message.user.username)"
        @delete="
          $event.shifting
            ? deleteMessage($event.message.id)
            : confirmDelete($event.message)
        "
        @edit="handleEdit"
        @edit-message="doEditMessage"
        @edit-text="editingText = $event"
        @jump-to-message="$chat.jumpToMessage($event, chatId)"
        @reply="replyId = $event.id"
      />
      <template
        v-if="!chatStore.selectedChat?.messages?.length && chatStore.loading"
      >
        <v-skeleton-loader
          v-for="index in 20"
          :key="index"
          type="list-item-avatar-three-line"
          color="background no-border"
        />
      </template>
      <infinite-loading
        v-if="$messages.currentMessages"
        direction="top"
        :top="true"
        :identifier="`${chatStore.selectedChat?.id}-${chatStore.loadNew}`"
        :value="'bottom'"
        @infinite="chatStore.loadHistory"
      >
        <template #spinner>
          <div class="text-center">
            <v-progress-circular
              :size="36"
              :width="2"
              indeterminate
              :model-value="1"
            />
          </div>
        </template>
        <template #complete>
          <div class="text-center">
            <PromoNoContent
              icon="mdi-message-processing-outline"
              :title="`Welcome to the start of ${chatStore.chatName(
                chatStore.selectedChat
              )}!`"
              description="Send a message to start the conversation!"
            />
          </div>
        </template>
      </infinite-loading>
      <div v-if="chatStore.isReady" id="sentinel" ref="sentinel"></div>
    </div>
    <div class="input-container">
      <v-toolbar
        v-if="chatStore.loadNew || avoidAutoScroll"
        class="pointer unselectable pl-2 force-bg dynamic-background"
        color="toolbar"
        height="25"
        style="
          border-radius: 20px 20px 0 0;
          font-size: 14px;
          backdrop-filter: blur(10px);
        "
        @click="jumpToBottom"
      >
        <v-icon class="mr-1 ml-1" size="17">arrow-down-s-line</v-icon>
        {{ $t("chats.jumpToBottom") }}
      </v-toolbar>
      <v-toolbar
        v-if="replyId"
        class="pointer px-3"
        color="card"
        height="35"
        style="opacity: 0.95"
        @click="jumpToBottom"
      >
        <RiReplyLine class="mr-3" />
        <UserAvatar
          :user="$user.users[replying?.userId]"
          class="mr-2"
          size="24"
        />
        {{ replying?.content }}
        <v-spacer />
        <v-btn @click="replyId = null">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar v-if="files.length" color="card" height="auto">
        <v-slide-group class="my-2 mx-1">
          <v-slide-group-item
            v-for="(file, index) in files"
            :key="file.name + file.size + index"
          >
            <v-card class="mr-2" elevation="0" max-width="400px">
              <v-progress-linear
                :color="finished ? 'success' : 'primary'"
                :model-value="file.uploadProgress"
                height="20"
              >
                <small>{{ uploadProgress }}%</small>
              </v-progress-linear>
              <v-toolbar>
                <v-icon class="ml-2">mdi-upload</v-icon>
                <v-card-text class="text-center limit">
                  {{ file.name }}
                </v-card-text>
                <v-spacer />
                <v-card-actions>
                  <v-btn
                    class="mr-2"
                    color="error"
                    @click="files.splice(index, 1)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-toolbar>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-toolbar>
      <CommunicationsInput
        ref="inputRef"
        v-model="message"
        class="message-input user-content"
        style="margin-top: auto; z-index: 1001"
        :blocked="blocked"
        :editing="false"
        :active="active"
        @emoji="
          message += $event;
          $nextTick(() => focusInput());
        "
        @file-upload="uploadHandle"
        @paste="handlePaste"
        @quick-t-p-u-link="handleQuickTPULink"
        @send-message="sendMessage"
        @focus-input="focusInput"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  computed,
  nextTick
} from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import User from "@/views/User/User.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import GalleryPreview from "@/components/Gallery/GalleryPreview.vue";
import WorkspaceDeleteDialog from "@/components/Workspaces/Dialogs/Delete.vue";
import MobileMenu from "@/components/Core/Dialogs/MobileMenu.vue";
import MessageActionsList from "@/components/Communications/MessageActionsList.vue";
import MessagePerf from "@/components/Communications/MessagePerf.vue";
import UserCard from "@/components/Users/UserCard.vue";
import InfiniteLoading from "@/components/Scroll/InfiniteScroll.vue";
import "v3-infinite-loading/lib/style.css";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import ChatDevOptions from "@/components/Dev/Dialogs/ChatDevOptionsDialog.vue";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import Pins from "@/components/Communications/Menus/Pins.vue";
import {
  RiPushpin2Line,
  RiPushpinLine,
  RiReplyLine,
  RiSearchLine,
  RiUserFill,
  RiUserLine
} from "@remixicon/vue";
import {
  Chat,
  Message,
  MessageType,
  ScrollPosition,
  UserStoredStatus
} from "@/gql/graphql";
import { Platform, useAppStore } from "@/store/app.store";
import { IpcChannels } from "@/electron-types/ipc";
import functions from "@/plugins/functions";
import { RailMode } from "@/store/progressive.store";
import { useChatStore } from "@/store/chat.store";
import { useUserStore } from "@/store/user.store";
import { useMessagesStore } from "@/store/message.store";
import axios from "@/plugins/axios";
import { useDisplay } from "vuetify";
import dayjs from "@/plugins/dayjs";
import { useExperimentsStore } from "@/store/experiments.store";

const props = defineProps({
  chatId: {
    type: Number,
    required: true
  }
});

const resizeObserver = ref<ResizeObserver | null>(null);
const unreadId = ref(0);
const expandBlocked = ref(false);
const setup = ref(false);
const messageObserver = ref<IntersectionObserver | undefined>(undefined);
const messageBottomObserver = ref<IntersectionObserver | undefined>(undefined);
const previousScrollHeight = ref(0);
const message = ref("");
const avoidAutoScroll = ref(false);
const avoidAutoScrollSince = ref(0);
const editing = ref<number | undefined>(undefined);
const editingText = ref<string | undefined>(undefined);
const replyId = ref<number | undefined>(undefined);
const observer = ref<MutationObserver | undefined>(undefined);
const typingStatus = reactive({
  rateLimit: null as number | null
});
const files = ref(
  [] as {
    file: File;
    name: string;
    size: number;
    type: string;
    tpuLink: string | undefined;
    uploadProgress: number;
    finished: boolean;
  }[]
);
const uploadProgress = ref(0);
const uploading = ref(false);
const dialogs = reactive({
  delete: {
    value: false,
    message: undefined as Message | undefined
  }
});
const limit = ref(false);
const inputHeight = ref(87);
const embedFails = ref(
  [] as {
    data: { chatId: any; id: any; embeds: any };
    retries: number;
  }[]
);
const unread = ref(0);
const active = ref(false);

const chatStore = useChatStore();
const messagesStore = useMessagesStore();
const userStore = useUserStore();

const chat = computed(() => {
  return chatStore.chats.find((chat) => chat.association.id === props.chatId);
});

const messages = computed(() => {
  return messagesStore.messages[props.chatId];
});

const name = computed(() => chat.value?.name);

const blocked = computed(() => {
  const blockedUser = userStore.blocked.find(
    (block) => block.blockedUserId === chat.value?.recipient?.id
  );
  return blockedUser
    ? { value: true, you: true }
    : userStore.users[chat.value?.recipient?.id]?.blocked
    ? { value: true, you: false }
    : { value: false, you: false };
});

const height = computed(() => {
  const navbar = document.getElementById("navbar");
  if (!navbar) return "calc(100vh)";
  return "calc(100vh - " + navbar.offsetHeight + "px)";
});

const display = useDisplay();
const menuStyle = computed(() => {
  let offset = 0;
  const chatDialogsMessage = chatStore.dialogs.message;
  if (chatDialogsMessage?.message?.userId === userStore.user?.id) {
    offset += 48;
  }
  if (
    chatDialogsMessage?.message?.userId === userStore.user?.id ||
    chatStore.hasPermission("DELETE_MESSAGES")
  ) {
    offset += 48;
  }
  if (chatDialogsMessage.message && chatStore.hasPermission("PIN_MESSAGES")) {
    offset += 48;
  }
  return `position: absolute; top: ${
    chatDialogsMessage.y + window.scrollY + 211 + offset < display.height.value
      ? chatDialogsMessage.y + window.scrollY
      : display.height.value - 211 - offset
  }px; left: ${chatDialogsMessage.x + window.scrollX}px;`;
});

const uploadFileHeight = computed(() => (files.value.length > 0 ? 84 : 0));
const replyingHeight = computed(() => (replyId.value ? 35 : 0));

const replying = computed(() => {
  return messages.value?.find((message) => message.id === replyId.value);
});

const finished = computed(() => {
  if (!files.value.length) return true;
  return !!files.value.filter((file) => file.finished).length;
});

watch(name, (val) => {
  useAppStore().title = val;
});

watch(
  () => props.chatId,
  (val, oldVal) => {
    unread.value = chat.value?.unread || 0;
    chatStore.setDraft(oldVal, message.value);
    message.value = chatStore.getDraft(val.toString()) || "";
    files.value = [];
    replyId.value = undefined;
    focusInput();
    autoScroll();
    nextTick(() => {
      autoScroll();
    });
  }
);

watch(
  () => chatStore.isReady,
  () => {
    avoidAutoScroll.value = false;
    nextTick(() => {
      autoScroll();
    });

    if (unread.value) {
      const lastReadMessage = messages.value?.find(
        (message) => message.id === chat.value?.association?.lastRead
      );
      const nextMessageIndex = messages.value?.indexOf(lastReadMessage) - 1;

      if (nextMessageIndex !== -1) {
        unreadId.value = messages.value?.[nextMessageIndex]?.id;
      } else if (lastReadMessage) {
        unreadId.value = lastReadMessage?.id;
      }
    }
  }
);

watch(
  () => message.value,
  () => {
    const userStatus = userStore.user.storedStatus;
    if (userStatus === UserStoredStatus.Invisible) return;

    if (message.value.length > 0) {
      if (!typingStatus.rateLimit || typingStatus.rateLimit < Date.now()) {
        chatStore.typing();
        typingStatus.rateLimit = Date.now() + 2000;
      }
    } else {
      chatStore.cancelTyping();
      typingStatus.rateLimit = null;
    }
  }
);

watch(replyId, () => {
  focusInput();
  nextTick(() => {
    autoScroll();
  });
});

const experimentsStore = useExperimentsStore();

onUnmounted(() => {
  if (!experimentsStore.experiments.REMOVE_LEGACY_SOCKET) {
    // useSockets().chat.off("message", onMessage);
    // useSockets().chat.off("typing", onTyping);
    // useSockets().chat.off("embedResolution", onEmbedResolution);
  }
});

// Define your other methods similarly using `ref` and `computed`
const sentinel = ref<HTMLElement | null>(null);
const sentinelBottom = ref<HTMLElement | null>(null);
function autoScroll() {
  if (
    avoidAutoScroll.value &&
    new Date().getTime() - avoidAutoScrollSince.value > 500
  )
    return;

  if (!messages.value) return;

  const sentinelElem = sentinelBottom.value;
  if (!sentinelElem) return;

  try {
    const messageEl = document.querySelector('[data-message-id="0"]');
    if (messageEl) resizeObserver.value?.observe(messageEl);
  } catch (e) {
    console.error(e);
  }

  sentinelElem.scrollIntoView();
  nextTick(() => sentinelElem.scrollIntoView());
}

// Handle the scroll event in the chat
function scrollEvent() {
  const cached = avoidAutoScroll.value;
  const elem = document.getElementById("chat");
  if (!elem) return;

  const scrollPos = elem.scrollTop;
  avoidAutoScroll.value = scrollPos < -300;

  if (avoidAutoScroll.value && !cached) {
    avoidAutoScrollSince.value = new Date().getTime();
  } else if (!avoidAutoScroll.value && cached) {
    avoidAutoScrollSince.value = 0;
  }
}

// Edit the last message sent by the user
function editLastMessage() {
  const lastMessage = messages.value
    .slice()
    .find((message) => message.userId === userStore.user.id);
  if (!lastMessage || lastMessage.id === editing.value) return;

  editingText.value = lastMessage.content;
  editing.value = lastMessage.id;
  nextTick(() => autoScroll());
}

// Focus the input area
const inputRef = ref<HTMLElement | null>(null);
function focusInput() {
  inputRef.value?.focus();
}

async function jumpToBottom() {
  avoidAutoScroll.value = false;
  if (chatStore.loadNew) {
    chatStore.setChat(this.chat?.association.id);
    chatStore.loadNew = false;
  }
  autoScroll();
}

// Handle keyboard shortcuts
function shortcutHandler(e) {
  if (e.ctrlKey && e.key === "ArrowDown" && e.shiftKey) {
    e.preventDefault();
    if (!editing.value) return;
    const message = messages.value
      .slice()
      .reverse()
      .find(
        (message) =>
          message.id !== editing.value &&
          message.userId === userStore.user.id &&
          message.id > editing.value
      );
    if (!message) {
      editing.value = undefined;
      return;
    }
    editing.value = message.id;
    editingText.value = message.content;
    return;
  }

  if (e.ctrlKey && e.key === "ArrowUp" && !e.shiftKey) {
    e.preventDefault();
    const message = messages.value
      .slice()
      .find((message) => (replyId.value ? message.id < replyId.value : true));
    if (!message) {
      replyId.value = undefined;
      return;
    }
    replyId.value = message.id;
    return;
  }

  if (e.ctrlKey && e.key === "ArrowDown" && !e.shiftKey) {
    e.preventDefault();
    if (!replyId.value) return;
    const message = messages.value
      .slice()
      .reverse()
      .find((message) => (replyId.value ? message.id > replyId.value : true));
    if (!message) {
      replyId.value = undefined;
      return;
    }
    replyId.value = message.id;
    return;
  }

  if (
    e.ctrlKey &&
    (e.key === "v" || (e.key === "a" && editingText.value?.length)) &&
    e.target.tagName !== "INPUT" &&
    e.target.tagName !== "TEXTAREA"
  ) {
    focusInput();
  }

  if (e.ctrlKey && e.key === "f") {
    e.preventDefault();
    chatStore.search.value = !chatStore.search.value;
  }

  if (e.metaKey || e.ctrlKey) return;

  if (e.key === "ArrowUp" && !editingText.value.length) {
    e.preventDefault();
    return editLastMessage();
  }

  if (e.key === "Escape") {
    if (replyId.value) {
      replyId.value = undefined;
      return;
    }
    if (chatStore.search.value) {
      chatStore.search.value = false;
      return;
    }
    autoScroll();
  }

  if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
    focusInput();
  }
}

// Event listener for message updates
async function onMessage(message) {
  if (message.chat.id !== chatStore.chat?.id) return;
  autoScroll();
}

// Handle author click event
async function handleAuthorClick(event, username) {
  if (!chatStore.dialogs.userMenu.value) {
    chatStore.dialogs.userMenu.user = await userStore.getUser(username);
    chatStore.dialogs.userMenu.bindingElement = event.bindingElement;
    chatStore.dialogs.userMenu.x = event.x;
    chatStore.dialogs.userMenu.y = event.y;
    chatStore.dialogs.userMenu.location = event.location || "top";
    chatStore.dialogs.userMenu.value = true;
  }
}

function dateSeparator(index: number) {
  if (!messages.value) return false;
  const message = messages.value[index];
  const previousMessage = messages.value[index + 1];
  return !dayjs(message?.createdAt).isSame(previousMessage?.createdAt, "day");
}

function confirmDelete(message?: Message | null) {
  if (!message) return;
  dialogs.delete.message = message;
  dialogs.delete.value = true;
}

function handleQuickTPULink(e: {
  media_formats: { gif: { url: string } };
  attachment: string;
}) {
  if (!e.attachment) {
    message.value = e.media_formats?.gif.url;
    sendMessage();
    return;
  }
  message.value = chatStore.domain + e.attachment;
  sendMessage();
}

async function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items;
  if (items) {
    for (const item of items) {
      if (item.kind === "file") {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          files.value.push({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            tpuLink: undefined,
            uploadProgress: 0,
            finished: false
          });
        }
      }
    }
    await uploadFiles();
  }
}

async function uploadHandle(e: FileList) {
  if (e.length > 0) {
    for (const file of e) {
      files.value.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        tpuLink: undefined,
        uploadProgress: 0
      });
    }
    await uploadFiles();
  }
}

async function dragDropHandler(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  const filesList = e.dataTransfer?.files;
  if (filesList && filesList.length > 0) {
    for (const file of filesList) {
      files.value.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        tpuLink: undefined,
        uploadProgress: 0
      });
    }
    await uploadFiles();
  }
}

async function uploadFiles() {
  if (files.value.length > 0) {
    if (uploading.value) return;
    uploading.value = true;

    const formData = new FormData();
    for (const file of files.value.filter((file) => !file.tpuLink)) {
      formData.append("attachments", file.file);
    }

    try {
      const { data } = await axios.post(`/gallery/site`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded / (progressEvent.total || 0)) * 100
          );
          files.value.forEach((file) => {
            if (!file.tpuLink) {
              file.uploadProgress = uploadProgress.value;
            }
          });
        }
      });
      files.value.forEach((file, index) => {
        file.tpuLink = data[index]?.upload?.attachment;
        file.finished = true;
      });
      uploading.value = false;
    } catch (e) {
      files.value = [];
    }
  } else {
    uploading.value = false;
  }
}

async function doEditMessage() {
  if (!editingText.value?.length) {
    return deleteMessage(editing.value!);
  }
  const emojiRegex = /(?:^|[^:\w~-]):[\w~-]+:(?![\w~-])/g;
  editingText.value = editingText.value.replace(emojiRegex, (match) => {
    try {
      const name = match.split(":")[1].split(":")[0];
      const emoji = chatStore.emoji.find((emoji) => emoji.name === name);
      return `:${name}:${emoji.id}:`;
    } catch {
      return match;
    }
  });
  await axios.put(`/chats/${chatStore.chat?.association?.id}/message`, {
    id: editing.value,
    content: editingText.value
  });
  editing.value = undefined;
  editingText.value = undefined;
  focusInput();
}

function handleEdit(event: { id: number | undefined; content: string }) {
  if (!event.id) {
    editing.value = undefined;
    editingText.value = undefined;
    focusInput();
  } else {
    editing.value = event.id;
    editingText.value = event.content;
  }
}

async function deleteMessage(id?: number) {
  if (!id) return;
  await axios.delete(
    `/chats/${chatStore.chat?.association?.id}/messages/${id}`
  );
}

async function sendMessage() {
  focusInput();
  chatStore.cancelTyping();
  if (unreadId.value) unreadId.value = 0;
  if (!messages.value) return;

  let content = message.value.trim();
  if (!content && !files.value.length) return;
  if (!finished.value) return;

  const emojiRegex = /:[\w~-]+:/g;
  content = content.replace(emojiRegex, (match) => {
    try {
      const name = match.split(":")[1].split(":")[0];
      const emoji = chatStore.emoji.find((emoji) => emoji.name === name);
      return `:${name}:${emoji.id}:`;
    } catch {
      return match;
    }
  });

  if (!message.value && files.value.length) content = " ";
  const tempId = new Date().getTime();
  const attachments = files.value.map((file) => file.tpuLink);
  message.value = "";

  const tempMessage = {
    content: content,
    createdAt: new Date().toISOString(),
    user: {
      id: userStore.user?.id,
      username: userStore.user?.username,
      avatar: userStore.user?.avatar
    },
    pending: true,
    // Temp ID because it's a pending message
    id: tempId,
    chatId: chatStore.selectedChatId,
    updatedAt: new Date().toISOString(),
    type: MessageType.Message,
    embeds: [],
    edited: false,
    replyId: replyId.value ?? null,
    reply: replying.value ?? null,
    editedAt: null,
    readReceipts: [],
    pinned: false,
    userId: userStore.user?.id,
    emoji: chatStore.emoji.map((emoji) => ({
      id: emoji.id,
      name: emoji.name,
      icon: emoji.icon,
      chatId: emoji.chatId
    })),
    error: false
  };
  await messagesStore.insertMessage(tempMessage, chatStore.selectedChatId);
  replyId.value = undefined;
  files.value = [];
  autoScroll();

  const chatIndex = chatStore.chats.findIndex(
    (c) => c.id === chatStore.chat?.id
  );
  if (chatIndex && chatIndex !== -1) {
    const chatToMove = chatStore.chats[chatIndex];
    chatStore.chats.splice(chatIndex, 1);
    chatStore.chats.unshift(chatToMove);
  }

  chatStore.setDraft(chatStore.selectedChatId.toString(), "");

  try {
    await chatStore.sendMessage(content, attachments, tempMessage.replyId);
  } catch (e) {
    await messagesStore.updateMessage({
      ...tempMessage,
      error: true
    });
  }
}

// On component mount
onMounted(() => {
  window.addEventListener("resize", autoScroll);
  window.addEventListener("focus", () => chatStore.readChat());
  window.addEventListener("keydown", shortcutHandler);
});
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: v-bind(height);
  width: 100%;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  outline: none;
}

.input-container {
  position: sticky;
  bottom: 0;
}
</style>
