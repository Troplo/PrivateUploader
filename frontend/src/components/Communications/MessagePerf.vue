<template>
  <li
    v-if="
      !blocked(message.userId) ||
      (blocked(message.userId) && merge && uncollapseBlocked) ||
      !merge
    "
    :ref="`message-${message.id}`"
    class="position-relative"
  >
    <overline
      v-if="unreadId === message.id"
      position="end"
      style="color: rgb(var(--v-theme-error)) !important"
      class="comms-new"
    >
      NEW
    </overline>
    <div v-if="dateSeparator" class="date-separator">
      <div class="date-separator-line"></div>
      <p class="date-separator-block unselectable">
        {{ $date(message.createdAt).format("ddd, Do of MMMM YYYY") }}
      </p>
      <div class="date-separator-line"></div>
    </div>
    <div
      v-if="message.replyId"
      class="ml-7 unselectable mt-4 mb-n3 pointer limit reply d-flex align-center"
      @click.prevent="
        message.reply && !search ? $emit('jumpToMessage', message.replyId) : ''
      "
    >
      <reply-line class="mt-2" />
      <span v-if="message.reply" class="mt-n2">
        <UserAvatar
          :user="$user.users[message.reply.userId]"
          class="mr-2"
          size="18"
          style="padding-left: 6px"
        />
        <span
          :style="{
            opacity: 0.8,
            color: $chat.getRankColor(
              $chat.selectedChat?.users?.find(
                (assoc) => assoc.userId === message.reply.userId
              )?.ranksMap,
              $chat.selectedChat?.ranks
            ),
            'margin-left': '-1px'
          }"
        >
          {{
            $user.users[message.reply.userId]?.username ||
            message.reply.user?.username
          }}
        </span>
        <template v-if="!blocked($user.users[message.reply.userId]?.id)">
          <template v-if="message.reply.embeds.length">
            <v-icon class="ml-1" color="#878686">mdi-image</v-icon>
          </template>
          <span class="limit ml-1" style="color: #878686">
            {{ message.reply?.content || "Click to see attachment..." }}
          </span>
        </template>
        <template v-else>
          <span class="limit ml-1" style="color: #878686">
            Blocked message...
          </span>
        </template>
      </span>
      <template v-else>
        <span class="text-grey text-small mt-n2 ml-2">Message deleted.</span>
      </template>
    </div>
    <div
      class="d-flex flex-row hover-message-actions"
      @mouseover="hovered = true"
    >
      <div class="flex-grow-tpu">
        <div
          :class="{ merge, unselectable: $vuetify.display.mobile }"
          class="message rounded position-relative"
          @contextmenu="!editing ? context($event) : ''"
        >
          <div class="avatar-section">
            <div v-if="merge" class="message-date">
              <span class="text-grey">
                <v-tooltip
                  activator="parent"
                  location="top"
                  style="z-index: 2001"
                >
                  {{ $date(message.createdAt).format("hh:mm:ss A DD/MM/YYYY") }}
                </v-tooltip>
                {{ $date(message.createdAt).format("hh:mm A") }}
              </span>
            </div>
            <UserAvatar
              v-else-if="
                (!blocked(message.userId) ||
                  (blocked(message.userId) && uncollapseBlocked)) &&
                !merge &&
                (message.type === MessageType.Message || !message.type)
              "
              :id="'message-author-avatar-' + message.id"
              class="pointer"
              :user="user"
              @click="
                $emit('authorClick', {
                  user,
                  bindingElement: 'message-author-avatar-' + message.id,
                  x: $event.x,
                  y: $event.y
                })
              "
            />
            <div v-else class="mr-3 text-grey">
              <v-icon v-if="blocked(message.userId)" class="mr-1" size="32">
                mdi-account-cancel
              </v-icon>
              <v-icon
                v-else-if="message.type === MessageType.Join"
                class="mr-1"
                size="32"
              >
                mdi-account-plus
              </v-icon>
              <v-icon
                v-else-if="message.type === MessageType.Leave"
                class="mr-1"
                size="32"
              >
                mdi-account-minus
              </v-icon>
              <v-icon v-else-if="message.type === MessageType.Pin" size="32">
                pushpin
              </v-icon>
              <v-icon v-else class="mr-1" size="32">mdi-information</v-icon>
            </div>
          </div>
          <div style="width: 100%">
            <p v-if="blocked(message.userId) && !uncollapseBlocked">
              Blocked message.
            </p>
            <p
              v-else-if="
                (!message.type && !merge) ||
                (message.type === MessageType.Message && !merge)
              "
              :class="{ 'text-red': message.error }"
              class="unselectable"
            >
              <span
                :id="'message-author-' + message.id"
                class="mr-2 pointer underline-on-hover user-content"
                :style="`color: ${getColor}`"
                @click.prevent="
                  $emit('authorClick', {
                    user,
                    bindingElement: 'message-author-' + message.id,
                    x: $event.x,
                    y: $event.y
                  })
                "
              >
                <span>
                  {{ $friends.getName(user) || "Unknown User" }}
                </span>
                <v-chip v-if="user?.bot" class="ml-1" size="x-small">
                  BOT
                </v-chip>
              </span>
              <small class="text-grey">
                {{ $date(message.createdAt).format("hh:mm:ss A, DD/MM/YYYY") }}
              </small>
            </p>
            <div v-if="blocked(message.userId) && !uncollapseBlocked">
              <a
                class="pointer"
                @click="$emit('update:uncollapseBlocked', true)"
              >
                Click to expand
              </a>
            </div>
            <div v-else-if="!editing" class="position-relative">
              <span
                v-memo="[message.content, message.error, message.pending]"
                :class="{
                  'text-grey': message.pending,
                  'text-red': message.error
                }"
                class="overflow-content message-content user-content d-inline-block"
                v-html="$functions.markdown(message.content, message)"
              ></span>
              <span
                v-if="message.edited"
                :ripple="false"
                class="d-inline-block"
              >
                <v-tooltip activator="parent" location="top">
                  {{ $date(message.editedAt).format("DD/MM/YYYY hh:mm:ss A") }}
                </v-tooltip>
                <v-icon color="grey" class="ml-1 mb-1" size="x-small">
                  mdi-pencil
                </v-icon>
              </span>
              <div v-if="blocked(message.userId) && uncollapseBlocked">
                <a
                  class="pointer"
                  @click="$emit('update:uncollapseBlocked', false)"
                >
                  Hide blocked message
                </a>
              </div>
            </div>
            <CommunicationsInput
              v-if="editing"
              :editing="true"
              :model-value="editingText"
              style="width: 100%"
              class="user-content"
              @edit="$emit('edit', { id: null, content: null })"
              @send-message="$emit('editMessage', $event)"
              @update:model-value="$emit('editText', $event)"
            />
            <message-actions
              v-if="hovered && !$vuetify.display.mobile"
              :message="message"
              :merge="merge"
              @delete="$emit('delete', { message, shifting: $event })"
              @edit="
                $emit('edit', { id: message.id, content: message.content })
              "
              @reply="$emit('reply', message)"
            />
            <Embed
              v-for="(embed, index) in message.embeds"
              :key="index"
              :embed="embed"
            />
          </div>
        </div>
      </div>
      <div
        v-if="!search"
        class="flex-shrink-1 align-self-end"
        :style="{ width: $vuetify.display.mobile ? '45px' : '100px' }"
      >
        <div
          style="justify-content: flex-end; display: flex; padding-right: 8px"
          :class="{ 'read-receipt-avatars': message.readReceipts.length > 3 }"
        >
          <template
            v-if="
              !$vuetify.display.mobile || message.readReceipts?.length === 1
            "
          >
            <template
              v-for="(readReceipt, index) in message.readReceipts"
              :key="readReceipt.id"
            >
              <ReadReceipt
                v-if="index < 3"
                :message="message"
                :read-receipt="readReceipt"
                :class="{ 'ml-1': message.readReceipts.length <= 3 }"
              />
            </template>
          </template>
          <span
            v-if="message.readReceipts.length > $chat.renderableReadReceipts"
            class="text-grey ml-1 mr-2"
            @click.stop
          >
            <v-menu
              v-if="$vuetify.display.mobile"
              activator="parent"
              location="top"
            >
              <v-card>
                <v-container>
                  <span
                    v-for="readReceipt in message.readReceipts"
                    :key="readReceipt.id"
                    class="d-flex"
                    style="gap: 6px"
                  >
                    <ReadReceipt
                      :message="message"
                      :read-receipt="readReceipt"
                    />
                    {{
                      $user.users[readReceipt.user.id || readReceipt.userId]
                        ?.username
                    }}
                  </span>
                </v-container>
              </v-card>
            </v-menu>
            <template v-if="!$vuetify.display.mobile">
              <span>
                +{{
                  message.readReceipts?.length - $chat.renderableReadReceipts
                }}
                <v-tooltip activator="parent" location="top" :eager="false">
                  <ReadReceipt
                    v-for="readReceipt in message.readReceipts"
                    :key="readReceipt.user.id || readReceipt.userId"
                    :message="message"
                    :read-receipt="readReceipt"
                    class="my-1"
                    :expanded="true"
                  />
                </v-tooltip>
              </span>
            </template>
            <template v-else>
              <span class="d-flex flex-col">
                <v-avatar
                  color="primary"
                  size="22"
                  class="pointer read-receipt-avatar"
                  style="
                    align-self: flex-end;
                    z-index: 1;
                    color: black !important;
                  "
                >
                  {{ message.readReceipts?.length }}
                  <v-tooltip
                    activator="parent"
                    location="top"
                    :eager="false"
                    offset="18"
                  >
                    {{ user?.username }}
                  </v-tooltip>
                </v-avatar>
              </span>
            </template>
          </span>
        </div>
      </div>
    </div>
  </li>
</template>
<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  getCurrentInstance
} from "vue";
import CommunicationsInput from "@/components/Communications/Input.vue";
import MessageActions from "@/components/Communications/MessageActions.vue";
import Embed from "@/components/Communications/Embed.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import ReadReceipt from "@/components/Communications/ReadReceipt.vue";
import { Message, MessageType } from "@/gql/graphql";
import ReplyLine from "@/components/Communications/ReplyLine.vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import { useUserStore } from "@/store/user.store";
import { useChatStore } from "@/store/chat.store";

const hovered = ref(false);
const streamedReply = ref<Message | null>(null);

const userStore = useUserStore();
const chatStore = useChatStore();

const props = defineProps<{
  resizeObserver?: ResizeObserver;
  message: Message;
  editing?: boolean;
  shifting?: boolean;
  editingText?: string;
  merge?: boolean;
  dateSeparator?: boolean;
  mentions?: string[];
  index?: number;
  search?: boolean;
  uncollapseBlocked?: boolean;
  unreadId?: number;
}>();

const user = computed(() => userStore.users[props.message.userId]);

const getColor = computed(() => {
  return chatStore.getRankColor(
    chatStore.selectedChat?.users?.find(
      (assoc) => assoc.userId === props.message.userId
    )?.ranksMap,
    chatStore.selectedChat?.ranks
  );
});

function blocked(userId?: number) {
  return userStore.blocked.find(
    (block) => block.blockedUserId === userId ?? props.message.userId
  );
}

function context(e: any) {
  e.preventDefault();
  userStore.dialogs.message.message = props.message;
  userStore.dialogs.message.x = e.clientX;
  userStore.dialogs.message.y = e.clientY;
  userStore.dialogs.message.value = true;
}

function onEdit(data: Message) {
  if (data?.id !== props.message.replyId) return;
  if (data.content) {
    // props.message.reply.content = data.content
  }
  if (data.edited !== undefined) {
    // props.message.reply.edited = data.edited
  }
  if (data.editedAt !== undefined) {
    // props.message.reply.editedAt = data.editedAt
  }
  if (data.pinned !== undefined) {
    // props.message.reply.pinned = data.pinned
  }
}

const onDelete = (data: Message) => {
  if (data?.id !== props.message.replyId) return;
  // props.message.reply = null
};

onMounted(() => {
  if (!props.message.reply?.id) return;
  // userStore.sockets.chat.on("edit", onEdit)
  // userStore.sockets.chat.on("messageDelete", onDelete)
});

onBeforeUnmount(() => {
  if (!props.message.reply?.id) return;
  // userStore.sockets.chat.off("edit", onEdit)
  // userStore.sockets.chat.off("messageDelete", onDelete)
  const el = getCurrentInstance().refs[`message-${props.message.id}`]?.el;
  if (!el) return;
  props.resizeObserver.unobserve(el);
});
</script>

<style scoped>
li {
  list-style-type: none;
}

.flex-grow-tpu {
  flex-grow: 1;
  flex-basis: 0;
}
</style>
