<template>
  <div>
    <v-list nav>
      <v-list-item
        v-for="item in $mail.mailboxes"
        :key="item.title"
        :to="`/mail/${item.path}`"
      >
        <template #prepend>
          <v-icon v-if="item.name.toLowerCase() === 'inbox'">
            mdi-inbox-arrow-down
          </v-icon>
          <v-icon v-else-if="item.name.toLowerCase() === 'sent'">
            mdi-send-check-outline
          </v-icon>
          <v-icon v-else-if="item.name.toLowerCase() === 'drafts'">
            mdi-file-document-edit-outline
          </v-icon>
          <v-icon
            v-else-if="
              item.name.toLowerCase().includes('spam') ||
              item.name.toLowerCase().includes('junk')
            "
          >
            mdi-alert-circle-outline
          </v-icon>
          <v-icon v-else-if="item.name.toLowerCase() === 'trash'">
            mdi-trash-can-outline
          </v-icon>
          <!-- deleted items -->
          <v-icon
            v-else-if="
              item.name.toLowerCase() === 'deleted' ||
              item.name.toLowerCase() === 'deleted items'
            "
          >
            mdi-delete-outline
          </v-icon>
          <v-icon v-else-if="item.name.toLowerCase() === 'archive'">
            mdi-archive-outline
          </v-icon>
          <v-icon v-else-if="item.name.toLowerCase().includes('failure')">
            mdi-alert-outline
          </v-icon>
          <v-icon v-else>mdi-email-outline</v-icon>
        </template>
        <v-list-item-title class="mailbox-title">
          {{ item.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MailSidebarList"
});
</script>

<style scoped>
.mailbox-title {
  text-transform: lowercase;
}

.mailbox-title:first-letter {
  text-transform: capitalize;
}
</style>
