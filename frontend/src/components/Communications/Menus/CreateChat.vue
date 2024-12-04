<template>
  <v-menu
    :close-on-content-click="false"
    :model-value="modelValue"
    location="end"
    max-width="420"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #activator="{ props }">
      <slot :props="props" />
    </template>
    <v-card>
      <v-card-title class="text-h6">
        {{ $t("chats.settings.users.addUser.title") }}
      </v-card-title>
      <v-card-subtitle style="white-space: pre-line">
        {{ $t("chats.settings.users.addUser.description") }}
      </v-card-subtitle>
      <v-list max-height="400">
        <v-text-field
          v-model="search"
          :autofocus="true"
          class="mx-5 my-n1"
          :label="$t('generic.search')"
        />
        <v-list-item
          v-for="friend in friends"
          :key="friend.user.id"
          :active="selected.includes(friend.user.id)"
          :value="friend.user.id"
          @click="add(friend.user.id)"
        >
          <template #prepend>
            <UserAvatar :user="friend.user" class="mr-3" size="38" />
          </template>
          <template #append>
            <v-list-item-action start>
              <v-checkbox-btn
                :model-value="selected.includes(friend.user.id)"
                color="primary"
              />
            </v-list-item-action>
          </template>

          <v-list-item-title>{{ friend.user.username }}</v-list-item-title>

          <v-list-item-subtitle>
            {{
              $t("chats.settings.users.addUser.friendsSince", {
                date: $date(friend.createdAt).format("DD/MM/YYYY")
              })
            }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="!selected.length"
          color="primary"
          @click="type === 'create' ? createChat() : $emit('add', selected)"
        >
          <template v-if="type === 'create'">
            {{
              selected.length < 2
                ? $t("chats.settings.users.addUser.createDM")
                : $t("chats.settings.users.addUser.createGroup")
            }}
          </template>
          <template v-else>
            {{ $t("chats.settings.users.addUser.add") }}
          </template>
        </v-btn>
      </v-card-actions>
      <template
        v-if="
          type === 'add' &&
          $chat.hasPermission('INVITE_USERS', $chat.editingChat)
        "
      >
        <v-divider />
        <v-card-title class="text-h6">
          {{ $t("chats.settings.users.addUser.invites.title") }}
        </v-card-title>
        <v-card-subtitle style="white-space: initial">
          {{ $t("chats.settings.users.addUser.invites.description") }}
        </v-card-subtitle>
        <p v-if="invite" class="mx-4">
          {{ $app.site.hostnameWithProtocol + "/invite/" + invite }}
          <v-btn
            icon
            size="x-small"
            class="ml-1"
            @click="
              $functions.copy(
                $app.site.hostnameWithProtocol + '/invite/' + invite
              )
            "
          >
            <v-icon>file-copy-line</v-icon>
          </v-btn>
        </p>
        <i
          v-else-if="!loading"
          class="text-blue text-small mx-4"
          @click="generateInvite()"
        >
          generate
        </i>
        <v-progress-circular
          v-else
          :width="2"
          size="18"
          :indeterminate="true"
        />
        <v-select
          v-model="expireOption"
          variant="outlined"
          class="mx-4 mt-4"
          density="compact"
          :items="expireOptions"
          :label="$t('chats.settings.users.addUser.invites.expire')"
        />
        <v-select
          v-model="rankId"
          variant="outlined"
          class="mx-4"
          density="compact"
          :items="$chat.editingChat.ranks"
          item-title="name"
          item-value="id"
          :label="$t('chats.settings.users.addUser.invites.rank')"
        />
        <v-btn
          :loading="loading"
          class="mt-n2 mb-4 mx-4 float-right"
          @click="generateInvite()"
        >
          Generate
        </v-btn>
      </template>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { CreateChatInviteDocument, FriendStatus } from "@/gql/graphql";

export default defineComponent({
  name: "CreateChat",
  components: { UserAvatar },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: "create"
    }
  },
  emits: ["update:modelValue", "add"],
  data() {
    return {
      search: "",
      selected: [] as number[],
      select: false,
      invite: null as string | null,
      rankId: null as string | null,
      expireOption: null as number | null,
      loading: false,
      expireOptions: [
        {
          title: "1 hour",
          value: 1
        },
        {
          title: "12 hours",
          value: 12
        },
        {
          title: "1 day",
          value: 24
        },
        {
          title: "7 days",
          value: 168
        },
        {
          title: "14 days",
          value: 336
        },
        {
          title: "30 days",
          value: 720
        },
        {
          title: "Never expire",
          value: null
        }
      ]
    };
  },
  computed: {
    friends() {
      return this.$friends.friends.filter(
        (friend) =>
          friend.user.username
            .toLowerCase()
            .includes(this.search.toLowerCase()) &&
          friend.status === FriendStatus.Accepted
      );
    }
  },
  methods: {
    add(id: number) {
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((i) => i !== id);
      } else {
        this.selected.push(id);
      }
    },
    async createChat() {
      const data = await this.$chat.createChat(this.selected);
      this.$router.push(`/communications/${data.association.id}`);
      this.$emit("update:modelValue", false);
    },
    async generateInvite() {
      try {
        this.loading = true;
        const {
          data: { createChatInvite }
        } = await this.$apollo.mutate({
          mutation: CreateChatInviteDocument,
          variables: {
            input: {
              rankId: this.rankId,
              expiry: this.expireOption,
              associationId: this.$chat.editingChat.association.id
            }
          }
        });
        this.invite = createChatInvite.id;
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>
