<template>
  <div style="width: 100%">
    <Mentionable
      v-if="active"
      :id="`#${editing ? 'input-editing' : 'input-main-comms'}`"
      :items="users"
      :keys="['@', ':', '!', '#', '&']"
      :omit-key="true"
      insert-space
      offset="6"
      :model-value="modelValue"
      @open="onOpen"
    >
      <template #item="{ item }: any">
        <div v-if="key === '@'" class="my-2 mx-2">
          <UserAvatar
            :size="35"
            :user="$chat.lookupUser(item.value)"
            class="mr-1"
          />
          {{ $chat.lookupUser(item.value).username }}
        </div>
        <div v-else-if="key === ':'" class="my-2 mx-2">
          <v-avatar size="24">
            <v-img v-if="item.emoji" :src="$app.domain + item.emoji.icon" />
            <v-img
              v-else
              draggable="false"
              width="24"
              :alt="item.value"
              :src="`/emoji/emoji_u${item.display
                ?.codePointAt(0)
                ?.toString(16)}.svg`"
            />
          </v-avatar>
          {{ item.label }}
          <span v-if="item.emoji" class="text-grey" style="font-size: 12px">
            From
            {{
              $chat.chats.find((chat) => chat.id === item.emoji.chatId)?.name
            }}
          </span>
        </div>
        <div v-else-if="key === '&' || key === '#'" class="my-2 mx-2">
          <UserAvatar v-if="key === '#'" :chat="item.chat" size="24" />
          {{ item.label }}
        </div>
        <div v-else class="my-2 mx-2">
          <UserAvatar :user="$user.users[item.botId]" :size="24" class="mr-2" />
          {{ item.command }}
          <span class="text-grey ml-2" style="font-size: 12px">
            {{ item.description }}
          </span>
        </div>
      </template>
    </Mentionable>
    <v-toolbar
      :id="editing ? '' : 'chat-input'"
      ref="toolbar"
      :color="editing ? 'transparent' : 'transparent'"
      height="auto"
      class="mb-1 mt-1"
    >
      <div class="d-flex flex-column rounded-xl" style="width: 100%">
        <v-textarea
          :id="editing ? 'input-editing' : 'input-main-comms'"
          ref="textarea"
          :class="!editing ? 'mb-n4 mt-1' : 'mt-2'"
          :maxlength="4000"
          :model-value="modelValue"
          auto-grow
          :autofocus="true"
          color="primary"
          density="compact"
          :label="
            blocked?.value
              ? blocked.you
                ? $t('dialogs.block.commsInputYou')
                : $t('dialogs.block.commsInputThem')
              : 'Type a message...'
          "
          :disabled="blocked?.value"
          placeholder="Keep it civil"
          rows="1"
          variant="outlined"
          style="padding: 16px; width: 100%"
          @update:model-value="$emit('update:modelValue', $event)"
          @keydown.enter.exact="
            isMobile ? null : $event.preventDefault();
            isMobile ? null : $emit('sendMessage');
          "
          @click:append="$emit('sendMessage')"
          @keyup.esc="$emit('edit', null)"
          @keydown.up="editing ? cursor($event, true) : null"
          @keydown.down="editing ? cursor($event, false) : null"
        >
          <template #append>
            <RiSendPlane2Fill
              class="pointer raw-icon"
              @click.prevent.stop="$emit('sendMessage')"
            />
          </template>
          <template v-if="!editing" #prepend>
            <add-attachment
              v-model="menu"
              @fileUpload="$emit('fileUpload', $event)"
              @quickTPULink="$emit('quickTPULink', $event)"
            />
            <RiAddCircleFill class="pointer raw-icon" />
          </template>
          <template #append-inner>
            <EmojiPicker
              v-model="emojiPicker"
              @emoji="$emit('emoji', $event)"
            />
            <RiEmotionFill class="pointer raw-icon" />
          </template>
        </v-textarea>
        <div v-if="!editing" style="margin-top: 2px">
          <span
            class="float-start mt-n5 text-grey ml-14"
            style="font-size: 12px; color: white"
          >
            {{ $chat.typers }}
          </span>
          <span
            class="float-end mt-n1 mt-n5 text-grey mr-14"
            style="font-size: 12px; color: white"
          >
            {{ modelValue?.length }} / 4000
          </span>
        </div>
      </div>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Mentionable from "@/components/Core/Mentionable.vue";
import EmojiPicker from "@/components/Communications/Menus/Emoji.vue";
import emoji from "@/components/Communications/Menus/Emoji.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import emojiData from "markdown-it-emoji/lib/data/full.json";
import { Prefix } from "@/gql/graphql";
import { LookupBotPrefix } from "@/graphql/developer/lookupPrefix.graphql";
import AddAttachment from "@/components/Communications/Menus/AddAttachment.vue";
import {
  RiAddCircleFill,
  RiAddCircleLine,
  RiEmotion2Line,
  RiEmotionFill,
  RiEmotionLine,
  RiSendPlane2Fill,
  RiSendPlane2Line,
  RiSendPlaneLine
} from "@remixicon/vue";

export default defineComponent({
  name: "CommunicationsInput",
  components: {
    RiAddCircleFill,
    RiSendPlane2Fill,
    RiEmotionFill,
    RiEmotion2Line,
    RiEmotionLine,
    RiAddCircleLine,
    RiSendPlane2Line,
    RiSendPlaneLine,
    AddAttachment,
    UserAvatar,
    EmojiPicker,
    Mentionable
  },
  props: ["modelValue", "editing", "blocked", "active"],
  emits: [
    "update:modelValue",
    "sendMessage",
    "edit",
    "fileUpload",
    "quickTPULink",
    "emoji",
    "focusInput"
  ],
  data() {
    return {
      menu: false,
      items: [] as any,
      emojiPicker: false,
      key: "@",
      cachedPrefixes: [] as Prefix[]
    };
  },
  computed: {
    emoji() {
      return emoji;
    },
    users() {
      if (this.key.includes("!")) {
        const find = this.cachedPrefixes.find(
          (prefix) => prefix.prefix === this.key
        );
        if (find)
          return find.commands.map((command) => {
            return {
              ...command,
              value: command.command,
              label: command.command
            };
          });
        return [];
      }
      switch (this.key) {
        case "@":
          if (!this.$chat.selectedChat?.users) return [];
          return this.$chat.selectedChat?.users.map((user: any) => {
            return {
              label: this.$user.users[user.userId]?.username,
              value: this.$user.users[user.userId]?.id
            };
          });
        case ":":
          return [
            ...this.$chat.emoji.map((emoji) => {
              return {
                value: emoji.name,
                label: emoji.name,
                emoji: emoji
              };
            }),
            ...Object.entries(emojiData).map((key) => {
              return {
                value: key[0],
                label: key[0],
                display: key[1]
              };
            })
          ].sort((a, b) => {
            const idA = this.$chat.recentEmoji[a.emoji?.id || a.value] || 0;
            const idB = this.$chat.recentEmoji[b.emoji?.id || b.value] || 0;
            return idB - idA;
          });
        case "&":
          return this.$collections.persistent.map((collection) => {
            return {
              label: collection.name,
              value: collection.id
            };
          });
        case "#":
          return this.$chat.chats
            .filter((chat) => chat.type === "group")
            .map((chat) => {
              return {
                label: this.$chat.chatName(chat),
                value: chat.id,
                chat: chat
              };
            });
        default:
          return [];
      }
    },
    isMobile() {
      return (
        this.$vuetify.display.platform.android ||
        this.$vuetify.display.platform.ios
      );
    }
  },
  watch: {
    "$route.params.chatId"() {
      this.cachedPrefixes = [];
    }
  },
  methods: {
    focus() {
      //@ts-ignore
      this.$refs?.textarea?.focus();
    },
    async onOpen(key: string) {
      this.key = key;
      if (this.key.includes("!")) {
        const find = this.cachedPrefixes.find(
          (prefix) => prefix.prefix === this.key
        );
        if (find) return;
        const {
          data: { lookupBotPrefix }
        } = await this.$apollo.query({
          query: LookupBotPrefix,
          variables: {
            input: {
              chatAssociationId: parseInt(this.$route.params.chatId),
              prefix: this.key
            }
          }
        });
        this.cachedPrefixes.push(lookupBotPrefix);
      }
    },
    cursor(e, up: boolean) {
      e.preventDefault();
      e.stopPropagation();
      //@ts-ignore
      const textarea: HTMLInputElement =
        document.getElementById("input-editing");
      if (!textarea) return;
      if (up) textarea.setSelectionRange(0, 0);
      else
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
    }
  }
});
</script>

<style>
.details-container {
  align-items: flex-start !important;
  justify-content: flex-start !important;
  display: flex;
  width: 100%;
  height: 25px;
}

.v-counter {
  margin-top: -50px !important;
  width: 20em;
}
</style>
