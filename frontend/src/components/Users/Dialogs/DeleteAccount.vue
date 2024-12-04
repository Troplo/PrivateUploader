<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{ $t("settings.home.deleteAccount.title") }}
    </template>
    <template v-if="!ownedGroups.length || stage === 1">
      <div class="mx-4">
        <div class="pt-2" />
        {{ $t("settings.home.deleteAccount.deleteText") }}
        <div class="pb-2" />
        <danger-zone-input
          v-model:password="password"
          v-model:password-mode="passwordMode"
          v-model:totp="totp"
          :both="true"
          @confirm="confirmSubmit"
        ></danger-zone-input>
      </div>
      <div class="d-flex justify-end pr-2 pb-2">
        <v-btn
          color="red"
          :loading="loading"
          :disabled="transferring.loading"
          @click="confirmSubmit()"
        >
          {{
            transferring.loading
              ? $t("settings.home.deleteAccount.transferring", {
                  current: transferring.current,
                  total: transferring.total
                })
              : $t("settings.home.deleteAccount.delete")
          }}
        </v-btn>
      </div>
    </template>
    <template v-else>
      <div class="mx-4">
        <div class="pt-2" />
        {{ $t("settings.home.deleteAccount.deleteGroupText") }}
        <div class="pb-2" />
        <div class="d-flex flex-column" style="gap: 10px">
          <div
            v-for="group in ownedGroups"
            :key="group.id"
            class="d-flex justify-space-between"
          >
            <div class="d-flex align-center">
              <user-avatar :chat="group" size="32" />
              <span class="ml-2">{{ group.name }}</span>
            </div>
            <div>
              <v-select
                v-model="transferMap[group.association.id]"
                :items="
                  loadedUsers[group.association.id]?.filter(
                    (user) => user.user.id !== userStore.user?.id
                  )
                "
                label="Transfer"
                style="min-width: 200px"
                dense
                outlined
                item-title="user.username"
                item-value="user.id"
              >
                <template #item="{ item: { raw }, props }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <user-avatar
                        :user="raw?.user"
                        size="24"
                        style="margin-right: 10px"
                      />
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-end pr-2 pb-2">
        <v-btn
          color="red"
          :loading="loading"
          :disabled="Object.keys(transferMap).length !== ownedGroups.length"
          @click="stage++"
        >
          {{ $t("generic.next") }}
        </v-btn>
      </div>
    </template>
  </CoreDialog>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, Ref, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import DangerZoneInput from "@/components/Core/DangerZoneInput.vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { useUserStore } from "@/store/user.store";
import { DeleteAccountMutation } from "@/graphql/user/deleteAccount.graphql";
import { useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { useChatStore } from "@/store/chat.store";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { Chat, ChatAssociation } from "@/gql/graphql";
import { GetChatUsersQuery } from "@/graphql/chats/chats.graphql";
import { TransferOwnershipMutation } from "@/graphql/chats/transferOwnership.graphql";

const password = ref("");
const totp = ref("");
const passwordMode = ref(false);
const dialog = ref(false);
const userStore = useUserStore();
const loading = ref(false);

const emit = defineEmits(["update:modelValue"]);
const toast = useToast();
//@ts-ignore
const t = getCurrentInstance().ctx.$t;
const router = useRouter();
const apolloClient = useApolloClient();
const chatStore = useChatStore();
const transferMap: Ref<Record<number, number>> = ref({});
const loadedUsers: Ref<Record<number, ChatAssociation[]>> = ref({});
const stage = ref(0);
const transferring = ref({
  loading: false,
  total: 0,
  current: 0
});
const props = defineProps({
  modelValue: {
    type: Boolean
  }
});

const ownedGroups = computed(() => {
  return chatStore.chats.filter(
    (chat) => chat.userId === userStore.user?.id && chat.type === "group"
  );
});

async function deleteAccount() {
  loading.value = true;
  try {
    await apolloClient.client.mutate({
      mutation: DeleteAccountMutation,
      variables: {
        input: {
          password: password.value,
          totp: totp.value
        }
      }
    });
    toast.success("Your account is pending removal.");
    await router.push("/");
  } finally {
    loading.value = false;
  }
}

async function loadUsers() {
  for (const chat of ownedGroups.value) {
    if (loadedUsers[chat.association.id]) {
      continue;
    }
    const {
      data: {
        chat: { users }
      }
    } = await apolloClient.client.query({
      query: GetChatUsersQuery,
      variables: {
        input: {
          chatId: chat.id
        }
      }
    });
    loadedUsers.value[chat.association.id] = users;
  }
}

async function transferOwnerships() {
  try {
    transferring.value.loading = true;
    transferring.value.total = Object.keys(transferMap.value).length;
    for (const [chatId, userId] of Object.entries(transferMap.value)) {
      await apolloClient.client.mutate({
        mutation: TransferOwnershipMutation,
        variables: {
          input: {
            associationId: parseInt(chatId),
            userId,
            password: password.value,
            totp: totp.value
          }
        }
      });
      transferring.value.current++;
    }
    transferMap.value = {};
    transferring.value.loading = false;
    deleteAccount();
  } catch {
    stage.value = 0;
  } finally {
    transferring.value.loading = false;
  }
}

function confirmSubmit() {
  if (passwordMode.value && !password.value) {
    toast.error("Password is required");
    return;
  }
  if (!passwordMode.value && !totp.value && userStore.user?.totpEnable) {
    toast.error("2FA code is required");
    return;
  }

  if (Object.keys(transferMap.value).length === 0) {
    deleteAccount();
  } else {
    transferOwnerships();
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      loadUsers();
    } else {
      stage.value = 0;
    }
  }
);
</script>

<style scoped></style>
