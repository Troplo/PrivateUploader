<template>
  <CoreDialog
    v-if="chat && user"
    :model-value="modelValue"
    max-width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{ $t("chats.settings.users.transferOwnership") }}
    </template>
    <div class="text-center">
      <v-card-title class="initial">
        Transfer {{ chat.name }} to {{ user.username }}?
      </v-card-title>
      <div class="d-flex justify-center">
        <UserAvatar :chat="chat" size="70" />
        <v-icon size="70">mdi-arrow-right</v-icon>
        <UserAvatar :user="user" size="70" />
      </div>
      <v-card-subtitle class="initial my-2">
        After transferring ownership, {{ user.username }} will get full
        permissions over the group, and you will be considered a regular member
        with permissions permitted by the roles granted to you.
      </v-card-subtitle>
      <v-card-title>
        To confirm please enter your credentials:
        <DangerZoneInput
          v-model:password="password"
          v-model:password-mode="passwordMode"
          v-model:totp="totp"
          @confirm="transfer"
        />
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red">
          {{ $t("generic.cancel") }}
        </v-btn>
        <v-btn color="primary" :loading="loading" @click="transfer">
          Transfer
        </v-btn>
      </v-card-actions>
    </div>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { Chat, PartialUserFriend } from "@/gql/graphql";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import DangerZoneInput from "@/components/Core/DangerZoneInput.vue";
import { TransferOwnershipMutation } from "@/graphql/chats/transferOwnership.graphql";

export default defineComponent({
  components: { DangerZoneInput, UserAvatar, CoreDialog },
  props: {
    modelValue: {
      type: Boolean
    },
    user: {
      type: Object as () => PartialUserFriend
    },
    chat: {
      type: Object as () => Chat
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      password: "",
      totp: "",
      passwordMode: false,
      loading: false
    };
  },
  methods: {
    async transfer() {
      this.loading = true;
      try {
        await this.$apollo.mutate({
          mutation: TransferOwnershipMutation,
          variables: {
            input: {
              userId: this.user.id,
              totp: this.passwordMode ? undefined : this.totp,
              associationId: this.chat.association.id,
              password: this.passwordMode ? this.password : undefined
            }
          }
        });
        this.$emit("update:modelValue", false);
        this.password = "";
        this.totp = "";
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>
