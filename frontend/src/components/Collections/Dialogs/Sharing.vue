<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>{{ $t("collections.sharing.title") }}</template>
    <v-card-text>
      <v-select
        v-model="shareLinkVisibility"
        :items="shareLinkOptions"
        :loading="loading"
        item-title="title"
        item-value="key"
        label="Public Accessibility"
        @update:model-value="updateCollection"
      />
      <template v-if="collection.shareLink">
        This collection can be viewed publicly from
        <a :href="'/collections/' + shareLink" target="_blank">
          {{ $app.site.hostnameWithProtocol }}/collections/{{ shareLink }}
        </a>
      </template>
    </v-card-text>
    <overline position="start">{{ $t("collections.sharing.users") }}</overline>
    <v-card-text>
      <div class="flex items-center gap-x-2">
        <v-autocomplete
          v-model="friend"
          class="flex-1"
          :items="$friends.validFriends"
          :label="$t('collections.sharing.add')"
          item-title="user.username"
          item-value="user.id"
          @keydown.enter="friend ? addUser : () => {}"
        >
          <template #item="{ item, props }: any">
            <v-list-item v-bind="props">
              <template #title>
                <div class="flex gap-x-4">
                  <user-avatar :user="item.raw.user" size="22"></user-avatar>
                  <div>{{ item.raw.user.username }}</div>
                </div>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-btn icon @click="addUser" :disabled="!friend">
          <RiAddLine />
        </v-btn>
      </div>
    </v-card-text>
    <v-data-table :items="users" :headers="headers" class="pt-2">
      <template v-slot:item.user.username="{ item }: any">
        <div class="flex items-center gap-2">
          <user-avatar :user="item.user" size="22"></user-avatar>
          <div class="flex flex-col">
            {{ item.user.username }}
            <span class="text-medium-emphasis-dark" v-if="!item.accepted">
              {{ $t("collections.sharing.pending") }}
            </span>
          </div>
          <v-btn
            v-if="item.user.id === collection.userId"
            icon
            :ripple="false"
            color="yellow"
          >
            <v-tooltip activator="parent" location="top">
              {{ $t("chats.roles.owner") }}
            </v-tooltip>
            <RiVipCrownFill class="action-bar-item" />
          </v-btn>
        </div>
      </template>
      <template v-slot:item.read="{ item }: any">
        <v-checkbox
          class="items-center flex"
          :model-value="item.read"
          :disabled="true"
          :loading="loading"
        />
      </template>
      <template v-slot:item.write="{ item }: any">
        <v-checkbox
          :model-value="item.write"
          :loading="loading"
          class="justify-center flex"
          :disabled="
            item.configure ||
            item.recipientId === userStore.user?.id ||
            item.recipientId === collection.userId
          "
          @update:model-value="
            updateCollectionUser(
              item.recipientId,
              item.read,
              $event,
              item.configure
            )
          "
        />
      </template>
      <template v-slot:item.configure="{ item }: any">
        <v-checkbox
          :model-value="item.configure"
          :disabled="
            item.recipientId === userStore.user?.id ||
            item.recipientId === collection.userId
          "
          :loading="loading"
          class="flex items-center"
          @update:model-value="
            updateCollectionUser(
              item.recipientId,
              item.read,
              $event ? true : item.write,
              $event
            )
          "
        />
      </template>
      <template v-slot:item.actions="{ item }: any">
        <danger-zone-dialog @confirm="transferOwnership($event)">
          <template #toolbar>
            <span />
          </template>
          <template #content>
            <div class="flex flex-col items-center">
              <h2>
                {{ $t("collections.transfer.title") }}
              </h2>
              <p class="text-medium-emphasis-dark pb-4">
                {{
                  $t("collections.transfer.description", {
                    collection: collection.name,
                    user: transferUser?.username
                  })
                }}
              </p>
              <div class="flex justify-center items-center">
                <user-avatar
                  :user="{
                    id: collection.userId,
                    username: collection.name,
                    avatar: collection.avatar || collection.image
                  }"
                  size="70"
                />
                <RiArrowRightSLine style="width: 70px" />
                <user-avatar
                  :user="transferUser"
                  :avatar="transferUser?.avatar"
                  :username="transferUser?.username"
                  :user-id="transferUser?.id"
                  size="70"
                />
              </div>
            </div>
          </template>
          <template #default="{ toggle }: any">
            <v-btn
              style="width: 40px; height: 40px"
              icon
              @click="
                transferUser = item.user;
                toggle();
              "
              v-if="
                item.recipientId !== collection.userId &&
                collection.userId === userStore.user?.id
              "
              :disabled="!item.accepted"
            >
              <RiUserSharedLine class="w-full h-full" />
            </v-btn>
          </template>

          <template #actions="{ confirm }">
            <v-btn :loading="loading" @click="confirm()" class="mt-4">
              {{ $t("collections.transfer.action") }}
            </v-btn>
          </template>
        </danger-zone-dialog>
        <v-btn
          style="width: 40px; height: 40px"
          icon
          :disabled="item.recipientId === collection.userId"
          @click="removeUser(item.recipientId)"
        >
          <RiCloseLine class="w-full h-full" />
        </v-btn>
      </template>
    </v-data-table>
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue darken-1" @click="$emit('update:modelValue', false)">
        OK
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script setup lang="ts">
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { useCollectionsStore } from "@/store/collections.store";
import { computed, onMounted, ref, watch } from "vue";
import { useAppStore } from "@/store/app.store";
import {
  AddCollectionUserDocument,
  Collection,
  PartialUserFriend,
  RemoveCollectionUserDocument,
  TransferCollectionOwnershipDocument,
  UpdateCollectionDocument,
  UpdateCollectionUserPermissionsDocument
} from "@/gql/graphql";
import { useUserStore } from "@/store/user.store";
import { useFriendsStore } from "@/store/friends.store";
import { useApolloClient } from "@vue/apollo-composable";
import DangerZoneDialog from "@/components/Core/DangerZoneDialog.vue";
import {
  RiAddLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiUserSharedLine,
  RiVipCrownFill
} from "@remixicon/vue";
import Overline from "@/components/Core/Typography/Overline.vue";

const shareLinkOptions = [
  {
    key: true,
    title: "Everyone with the link"
  },
  {
    key: false,
    title: "Nobody"
  }
];
const headers = [
  {
    key: "user.username",
    title: "Username"
  },
  {
    key: "read",
    title: "Read"
  },
  {
    key: "write",
    title: "Write"
  },
  {
    key: "configure",
    title: "Configure"
  },
  {
    key: "actions",
    title: "Actions"
  }
];
const friendsStore = useFriendsStore();
const userStore = useUserStore();
const shareLink = ref<string | null>(null);
const shareLinkVisibility = ref(false);
const props = defineProps({
  modelValue: Boolean,
  collection: Object as () => Collection
});
const emit = defineEmits(["update:modelValue"]);
const collectionStore = useCollectionsStore();
const loading = ref(false);
const appStore = useAppStore();
const friend = ref<undefined | number>(undefined);

const transferUser = ref<undefined | PartialUserFriend>(undefined);
async function transferOwnership(args: {
  passwordMode: boolean;
  password: string;
  totp: string;
}) {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: TransferCollectionOwnershipDocument,
      variables: {
        input: {
          password: args.passwordMode ? args.password : undefined,
          totp: !args.passwordMode ? args.totp : undefined,
          collectionId: props.collection?.id,
          userId: transferUser.value?.id
        }
      }
    });
    emit("update:modelValue", false);
  } finally {
    loading.value = false;
  }
}

const users = computed(() => {
  return [
    {
      recipientId: props.collection?.user?.id,
      user: props.collection?.user || {},
      read: true,
      write: true,
      configure: true,
      accepted: true
    },
    ...(props.collection?.users || [])
  ];
});

watch(
  () => [collectionStore.selected, props.modelValue],
  () => {
    shareLink.value = collectionStore.selected?.shareLink || null;
    shareLinkVisibility.value = !!collectionStore.selected?.shareLink;
  }
);

async function removeUser(userId: number) {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: RemoveCollectionUserDocument,
      variables: {
        input: {
          collectionId: collectionStore.selected?.id,
          userId
        }
      }
    });
  } finally {
    loading.value = false;
  }
}

async function addUser() {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: AddCollectionUserDocument,
      variables: {
        input: {
          collectionId: collectionStore.selected?.id,
          userId: friend.value,
          read: true,
          write: false,
          configure: false
        }
      }
    });
    friend.value = undefined;
  } finally {
    loading.value = false;
  }
}

async function updateCollection() {
  loading.value = true;
  try {
    const {
      data: { updateCollection }
    } = await useApolloClient().client.mutate({
      mutation: UpdateCollectionDocument,
      variables: {
        input: {
          collectionId: collectionStore.selected?.id,
          shareLink: shareLinkVisibility.value
        }
      }
    });
    shareLink.value = updateCollection.shareLink;
    shareLinkVisibility.value = !!updateCollection.shareLink;
  } finally {
    loading.value = false;
  }
}

async function updateCollectionUser(
  userId: number,
  read: boolean,
  write: boolean,
  configure: boolean
) {
  loading.value = true;
  try {
    await useApolloClient().client.mutate({
      mutation: UpdateCollectionUserPermissionsDocument,
      variables: {
        input: {
          collectionId: collectionStore.selected?.id,
          userId,
          read,
          write,
          configure
        }
      }
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (collectionStore.selected) {
    shareLink.value = collectionStore.selected.shareLink || null;
    shareLinkVisibility.value = !!shareLink.value;
  }
});
</script>
