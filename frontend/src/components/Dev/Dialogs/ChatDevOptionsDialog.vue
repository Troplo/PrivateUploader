<template>
  <DevDialog @close="$chat.dialogs.chatDevOptions.value = false">
    <template #header>Chat Developer Options & Metrics</template>
    <p class="mt-2 mb-n4">{{ $chat.selectedChat.name }}</p>
    <v-container v-if="$chat.selectedChat">
      <overline>User Permissions for Chat</overline>
      {{ $chat.selectedChat.association.permissions }}
      <overline>User Ranks for Chat</overline>
      {{
        $chat.selectedChat.users?.find(
          (assoc) => assoc.userId === $chat.selectedChat.association.userId
        )?.ranks
      }}
      <template
        v-for="rank in $chat.selectedChat.users?.find(
          (assoc) => assoc.userId === $chat.selectedChat.association.userId
        )?.ranksMap"
        :key="rank"
      >
        <p>
          {{
            $chat.selectedChat.ranks?.find((r) => r.id === rank)?.name ||
            "Unknown? Sync issue?"
          }}
          - {{ rank }}
        </p>
      </template>
      <overline>Emoji</overline>
      {{
        $chat.emoji.filter((emoji) => emoji.chatId === $chat.selectedChat.id)
          ?.length
      }}
      emoji in global store
      <overline>Other</overline>
      <p>chatId: {{ $chat.selectedChat.id }}</p>
      <p>associationId: {{ $chat.selectedChat.association.id }}</p>
      <p>unread: {{ $chat.totalUnread }}</p>
      <p>group type: {{ $chat.selectedChat.type }}</p>
      <p v-if="realUsers.length">users: {{ realUsers.length }}</p>
      <p
        v-if="$messages.messages[$chat.selectedChat.association.id]?.length"
        style="color: rgb(var(--v-theme-success))"
      >
        Chat loaded
      </p>
      <p v-else style="color: rgb(var(--v-theme-error))">Chat not loaded</p>
      <p
        v-if="$chat.selectedChat.id.toString().startsWith('-')"
        style="color: rgb(var(--v-theme-error))"
      >
        Pre-Colubrina migrate group
      </p>
    </v-container>
    <template v-else>Select a chat</template>
  </DevDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";
import Overline from "@/components/Core/Typography/Overline.vue";

export default defineComponent({
  components: { Overline, DevDialog },
  computed: {
    realUsers() {
      return this.$chat.selectedChat.users || [];
    }
  }
});
</script>
