<template>
  <v-list v-if="$chat.dialogs.message.message" class="mobile-actions">
    <v-list-item @click="$emit('reply')">
      <template #prepend>
        <v-icon>mdi-reply</v-icon>
      </template>
      <v-list-item-title>Reply</v-list-item-title>
    </v-list-item>
    <v-list-item
      v-if="$chat.dialogs.message.message.userId === $user.user?.id"
      @click="$emit('edit')"
    >
      <template #prepend>
        <v-icon>mdi-pencil</v-icon>
      </template>
      <v-list-item-title>Edit message</v-list-item-title>
    </v-list-item>
    <v-list-item
      v-if="
        $chat.dialogs.message.message.userId === $user.user?.id ||
        ($chat.selectedChat?.association.rank &&
          ['admin', 'owner'].includes($chat.selectedChat?.association.rank))
      "
      @click="$emit('delete', $event.shiftKey)"
    >
      <template #prepend>
        <v-icon>close-line</v-icon>
      </template>
      <v-list-item-title>Delete Message</v-list-item-title>
    </v-list-item>
    <v-list-item
      v-if="
        $chat.dialogs.message.message &&
        $chat.selectedChat?.association.rank &&
        ['admin', 'owner'].includes($chat.selectedChat?.association.rank)
      "
      @click="
        $chat.pinMessage(
          $chat.dialogs.message.message?.id,
          !$chat.dialogs.message.message?.pinned
        );
        $chat.dialogs.message.value = false;
      "
    >
      <template #prepend>
        <v-icon>
          {{ $chat.dialogs.message.message.pinned ? "pushpin-off" : "pushpin" }}
        </v-icon>
      </template>
      <v-list-item-title>
        {{ $chat.dialogs.message.message.pinned ? "Unpin" : "Pin" }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item
      @click="
        $functions.copy($chat.dialogs.message.message?.content);
        $chat.dialogs.message.value = false;
      "
    >
      <template #prepend>
        <v-icon>file-copy-line</v-icon>
      </template>
      <v-list-item-title>Copy message contents</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
defineEmits(["edit", "reply", "delete"]);
</script>
