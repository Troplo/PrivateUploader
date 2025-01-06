<template>
  <CoreDialog v-model="dialog" max-width="600">
    <template #toolbar>
      <slot name="toolbar" />
    </template>
    <template #title>
      <slot name="title" />
    </template>
    <div class="m-4">
      <div v-if="$slots.content" class="pt-2" />
      <slot name="content" />
      <div v-if="$slots.content" class="pb-2" />
      <danger-zone-input
        v-model:password="password"
        v-model:password-mode="passwordMode"
        v-model:totp="totp"
        :both="requireBoth"
        @confirm="confirmSubmit"
      ></danger-zone-input>
    </div>
    <v-card-actions v-if="$slots.actions" class="d-flex justify-end pr-2 pb-2">
      <slot name="actions" :confirm="confirmSubmit" />
    </v-card-actions>
  </CoreDialog>
  <slot :toggle="() => (dialog = !dialog)"></slot>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import DangerZoneInput from "@/components/Core/DangerZoneInput.vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { useUserStore } from "@/store/user.store";

const props = defineProps({
  requireBoth: {
    type: Boolean,
    default: false
  }
});

const password = ref("");
const totp = ref("");
const passwordMode = ref(false);
const dialog = defineModel<boolean>();
const userStore = useUserStore();

const emit = defineEmits(["confirm"]);
const toast = useToast();
//@ts-ignore
const t = getCurrentInstance().ctx.$t;

function confirmSubmit() {
  if ((props.requireBoth || passwordMode.value) && !password.value) {
    toast.error("Password is required");
    return;
  }
  if (
    (props.requireBoth || !passwordMode.value) &&
    !totp.value &&
    userStore.user?.totpEnable
  ) {
    toast.error("2FA code is required");
    return;
  }
  emit("confirm", {
    password: password.value,
    totp: totp.value,
    passwordMode: passwordMode.value
  });
}
</script>

<style scoped></style>
