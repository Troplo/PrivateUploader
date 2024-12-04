<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Communications</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card-title>Delete Communications Message</v-card-title>
        <v-form class="ml-4">
          <v-text-field
            v-model="actions.deleteCommunicationsMessage.messageId"
            :autofocus="true"
            label="ID of Communications Message"
            @keydown.enter="deleteCommunicationsMessage"
          />
        </v-form>
        <v-btn
          :disabled="actions.deleteCommunicationsMessage.processing"
          class="mx-3 my-3"
          variant="outlined"
          @click="deleteCommunicationsMessage"
        >
          <v-icon>mdi-delete</v-icon>
          Delete Communications Message
        </v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Communications",
  data() {
    return {
      actions: {
        deleteCommunicationsMessage: {
          messageId: null,
          processing: false
        }
      }
    };
  },
  methods: {
    async deleteCommunicationsMessage() {
      this.actions.deleteCommunicationsMessage.processing = true;
      await this.axios
        .delete(
          "/admin/communications/message/" +
            this.actions.deleteCommunicationsMessage.messageId
        )
        .then(() => {
          this.$toast.success("Deleted communications message.");
          this.actions.deleteCommunicationsMessage.processing = false;
        })
        .catch(() => {
          this.actions.deleteCommunicationsMessage.processing = false;
        });
    }
  }
});
</script>
