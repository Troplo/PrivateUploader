<template>
  <CoreDialog
    v-if="banWizard.user"
    v-model="banWizard.dialog"
    max-width="600px"
    class="user-content"
  >
    <template #title>
      Ban {{ banWizard.user.username }} / {{ banWizard.user.id }}
    </template>

    <v-container>
      <strong>ID: {{ banWizard.user.id }}</strong>
      <br />
      <strong>Username: {{ banWizard.user.username }}</strong>
      <br />
      <strong>Email: {{ banWizard.user.email }}</strong>
      <br />

      <v-checkbox v-model="banWizard.user.banned" label="Banned" class="mt-2" />
      <v-textarea
        v-model="banWizard.user.banReason"
        label="Reason (Shown to user, GUI does not show Reason Type if filled)"
        outlined
        rows="1"
      ></v-textarea>
      <v-select
        v-model="banWizard.user.banReasonType"
        :items="banReasonTypes"
        label="Reason Type (Shown to user if no Reason is filled)"
        outlined
      />
      <date-picker-input
        v-model="banWizard.user.pendingDeletionDate"
        label="Permanent account deletion date"
        outlined
        class="mb-2"
      />
      <small class="text-red">
        This will delete all their Flowinity data after this date, the same
        system is used for account deletion in Settings > Account. If a user
        requested their account deleted immediately, you can use this and set
        "PENDING_MANUAL_ACCOUNT_DELETION" as the reason, this acts identically
        to Settings account deletion, and the user will be able to reactivate
        their account until the date passes. Any other types will not permit the
        user to reactivate their account.
      </small>
      <br />
      <small>ALL FIELDS ARE REQUIRED</small>
    </v-container>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        @click="
          banWizard.dialog = false;
          banWizard.user = undefined;
        "
      >
        Cancel
      </v-btn>
      <v-btn color="red" @click="ban()">Ban</v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script setup lang="ts">
import { BanReason, User } from "@/gql/graphql";
import { PropType } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

const banWizard = defineModel("banWizard", {
  type: Object as PropType<{ dialog: boolean; user: User | undefined }>
});

const banReasonTypes = [
  BanReason.PendingManualAccountDeletion,
  BanReason.Spam,
  BanReason.Harassment,
  BanReason.IllegalContent,
  BanReason.UnderAge,
  BanReason.Other
];

async function ban() {
  await this.axios.patch("/admin/ban", {
    id: banWizard.value.user.id,
    banned: banWizard.value.user.banned,
    banReason: banWizard.value.user.banReason,
    banReasonType: banWizard.value.user.banReasonType,
    pendingDeletionDate: banWizard.value.user.pendingDeletionDate
  });
  this.$toast.success("User banned.");
  banWizard.value.dialog = false;
  banWizard.value.user = undefined;
}
</script>

<style scoped></style>
