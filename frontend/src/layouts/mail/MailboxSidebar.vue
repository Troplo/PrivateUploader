<template>
  <v-navigation-drawer
    v-model="$mail.mailboxDrawer"
    color="dark"
    floating
    permanent
    class="ml-4"
  >
    <v-list nav>
      <v-list-item
        v-for="email in $mail.selected?.emails"
        :key="email.seq"
        :to="`/mail/${$mail.selectedMailbox}/${email.seq}`"
      >
        <v-list-item-title>{{ email.subject }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ $mail.getSender(email) }}
        </v-list-item-subtitle>
      </v-list-item>
      <template v-if="!$mail.selected?.emails?.length">
        <MessageSkeleton v-for="i in 50" :key="i" :pfp="false" />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";

export default defineComponent({
  name: "MailboxSidebar",
  components: { MessageSkeleton }
});
</script>
