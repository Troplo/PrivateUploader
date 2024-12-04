<template>
  <UploadCropper
    v-model="upload"
    type="chatIcon"
    :supports-removal="false"
    @finish="uploadIcon"
  />
  <overline position="center">
    {{ $t("chats.settings.emoji.name") }} ({{ emojis.length }}/100)
  </overline>
  <div>
    <v-card-subtitle class="initial" style="max-width: 600px">
      {{ $t("chats.settings.emoji.description") }}
    </v-card-subtitle>
    <v-btn class="my-1 ml-2" @click="upload = true">
      {{ $t("chats.settings.emoji.add") }}
    </v-btn>
    <v-list v-for="emoji in emojis" :key="emoji.id" max-width="600">
      <v-list-item>
        <template #prepend>
          <v-img
            width="40"
            :src="$app.domain + emoji.icon"
            class="mr-4"
            max-height="40"
          />
        </template>
        <template #append>
          <v-btn icon size="small" @click="deleteEmoji(emoji.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <v-list-item-title
          v-if="editing !== emoji.id"
          class="pointer"
          @click="
            editing = emoji.id;
            oldName = emoji.name;
          "
        >
          {{ emoji.name }}
        </v-list-item-title>
        <v-text-field
          v-else
          v-model="emoji.name"
          style="max-width: 200px"
          label="Emoji name"
          maxlength="24"
          autofocus
          @keydown.esc.prevent.stop="
            editing = '';
            emoji.name = oldName;
          "
          @blur="
            editing = '';
            emoji.name = oldName;
          "
          @keydown.enter="updateEmoji(emoji.id, emoji.name)"
        />
        <template #subtitle>
          <div>
            {{ $t("chats.settings.emoji.uploadedBy") }}
            <UserAvatar size="18" :user="$user.users[emoji.userId]" />
            {{ $user.users[emoji.userId]?.username }}
          </div>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { UpdateEmojiMutation } from "@/graphql/chats/updateEmoji.graphql";
import { DeleteEmojiMutation } from "@/graphql/chats/deleteEmoji.graphql";

export default defineComponent({
  name: "ChatSettingsEmoji",
  components: { UserAvatar, UploadCropper, Overline },
  data() {
    return {
      upload: false,
      editing: "",
      oldName: ""
    };
  },
  computed: {
    emojis() {
      return this.$chat.emoji.filter(
        (emoji) => emoji.chatId === this.$chat.editingChat.id
      );
    }
  },
  methods: {
    async deleteEmoji(id: string) {
      await this.$apollo.mutate({
        mutation: DeleteEmojiMutation,
        variables: {
          input: {
            associationId: this.$chat.editingChat.association.id,
            id
          }
        }
      });
    },
    async updateEmoji(id: string, name: string) {
      const emoji = this.$chat.emoji.find((emoji) => emoji.id === this.editing);
      this.editing = "";
      try {
        await this.$apollo.mutate({
          mutation: UpdateEmojiMutation,
          variables: {
            input: {
              associationId: this.$chat.editingChat.association.id,
              name,
              id
            }
          }
        });
        this.oldName = "";
      } catch {
        emoji.name = this.oldName;
      }
    },
    async uploadIcon(file: File) {
      if (this.$chat.editingChat) {
        const formData = new FormData();
        formData.append("icon", file);
        await this.axios.post(
          `/chats/${this.$chat.editingChat.association.id}/icon?type=emoji`,
          formData
        );
        this.upload = false;
      }
    }
  }
});
</script>
