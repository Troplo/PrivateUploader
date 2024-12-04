<template>
  <v-menu
    v-model="contextMenu.dialog"
    :style="menuStyle"
    style="z-index: 6001 !important"
  >
    <v-card>
      <v-list>
        <v-list-item>
          <v-menu
            :close-delay="100"
            :close-on-click="false"
            :close-on-content-click="false"
            :nudge-right="10"
            :open-delay="0"
            activator="parent"
            bottom
            class="ml-2"
            location="left"
            offset-x
            open-on-hover
          >
            <v-list max-height="400" min-width="200" max-width="500">
              <v-text-field
                v-model="searchRanks"
                :autofocus="true"
                class="mx-5 my-n1"
                label="Search"
              />
              <v-list-item
                v-for="rank in ranksFiltered"
                :key="rank.id"
                :active="contextMenu.item.ranksMap.includes(rank.id)"
                :value="rank.id"
                :disabled="
                  !$chat.hasPermission('MANAGE_RANKS', chat) &&
                  (rank.managed || !$chat.canEditRank(rank.index, chat))
                "
                @click="
                  $chat.toggleUserRank(
                    contextMenu.item.id,
                    chat.association.id,
                    rank.id
                  )
                "
              >
                <template #prepend>
                  <v-avatar
                    class="v-avatar--variant-outlined pointer"
                    :color="rank.color"
                    size="22"
                  />
                </template>
                <template #append>
                  <v-list-item-action start>
                    <v-checkbox-btn
                      :model-value="contextMenu.item.ranksMap.includes(rank.id)"
                      color="primary"
                    />
                  </v-list-item-action>
                </template>
                <v-list-item-title>{{ rank.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-icon class="mr-1">arrow-left-s-line</v-icon>
          Roles
        </v-list-item>
        <UserSidebarOptions
          v-if="$user.users[contextMenu.item.userId]"
          :user="$user.users[contextMenu.item.userId]"
        />
      </v-list>
    </v-card>
  </v-menu>
  <template v-if="chat && $route.path !== '/communications/home' && chat.users">
    <div v-if="$vuetify.display.mobile" class="mt-2">
      <UserAvatar
        :chat="chat?.recipient ? null : chat"
        :status="true"
        :user="chat?.recipient"
        class="ml-4"
        size="32"
        style="display: inline-block"
        :dot-status="true"
      />
      <h4
        id="tpu-brand-logo"
        class="unselectable ml-2 limit"
        style="display: inline-block; align-self: center; text-align: center"
        title="TPU Communications"
      >
        {{ $chat.chatName(chat) }}
      </h4>
      <v-card-actions v-if="chat">
        <v-spacer />
        <v-btn
          v-if="$experiments.experiments.PINNED_MESSAGES"
          aria-label="Toggle Communications Sidebar"
          class="mr-2"
          icon
        >
          <v-icon>pushpin</v-icon>
        </v-btn>
        <v-btn
          aria-label="Toggle Communications Search"
          class="mr-2"
          icon
          @click="$chat.search.value = !$chat.search.value"
        >
          <v-icon>search-line</v-icon>
        </v-btn>
        <v-btn
          aria-label="Toggle Communications Settings"
          class="mr-2"
          icon
          @click="
            $chat.dialogs.groupSettings.value = true;
            chat ? ($chat.dialogs.groupSettings.itemId = chat.id) : '';
          "
        >
          <v-icon>settings-5-line</v-icon>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </div>
    <div v-show="!$chat.search.value" class="mt-n2">
      <v-list v-for="group in ranks" :key="group.name" class="mb-n4" nav>
        <template v-if="group.users.length">
          <overline position="start">
            {{ group.name }} ({{ group.users.length }})
          </overline>
          <v-list-item
            v-for="association in group.users"
            :key="association.id"
            :style="{
              color: $chat.getRankColor(association.ranksMap, chat?.ranks)
            }"
            :class="{
              'black-and-white':
                $user.users[association.userId]?.status === UserStatus.Offline
            }"
            @click="
              $chat.dialogs.user.username = association.user?.username;
              $chat.dialogs.user.value = true;
            "
            @contextmenu.prevent="context($event, association)"
          >
            <template #title>
              {{ $friends.getName(association.user) || "Deleted User" }}
              <v-chip
                v-if="$user.users[association.userId]?.bot"
                class="ml-1"
                size="x-small"
              >
                BOT
              </v-chip>
            </template>
            <template #prepend>
              <UserAvatar
                class="mr-2"
                :dot-status="true"
                :status="true"
                :user="association.user"
                :typing="
                  chat.typers?.find(
                    (typer) => typer.userId === association.userId
                  )
                "
              />
            </template>
          </v-list-item>
        </template>
      </v-list>
    </div>
    <div v-show="$chat.search.value">
      <overline position="start" class="ml-3 mb-n1">
        {{ $t("generic.search") }}
        <v-progress-circular
          v-if="$chat.search.loading"
          indeterminate
          size="16"
          width="2"
        />
        <template v-else>
          ({{ $chat.search.results.pager.totalItems }})
        </template>
        <template #end>
          <v-icon @click="$chat.search.value = false">mdi-close</v-icon>
        </template>
      </overline>
      <v-container class="mb-8">
        <GalleryTextField
          ref="searchInput"
          v-model="$chat.search.query"
          :autofocus="true"
          @submit="$chat.doSearch(sort)"
        />
        <div class="float-right">
          <v-btn-toggle v-model="sort" density="compact">
            <v-btn>Newest</v-btn>
            <v-btn>Oldest</v-btn>
          </v-btn-toggle>
        </div>
      </v-container>
      <ol
        v-if="!$chat.search.loading"
        class="d-flex flex-column communications position-relative"
        style="height: unset"
      >
        <message-perf
          v-for="(message, index) in $chat.search.results.items"
          :id="'message-' + index"
          :key="message.id"
          :message="message"
          :search="true"
          class="pointer"
          @click="
            handleJump(
              message.id,
              $chat.chats?.find((chat) => chat.id === message.chatId)
                ?.association.id || 0
            )
          "
        />
      </ol>
      <Paginate
        v-model="$chat.search.results.pager.currentPage"
        :max-visible="5"
        :total-pages="$chat.search.results.pager.totalPages"
        class="mb-2"
        @update:model-value="$chat.doSearch(sort)"
      />
    </div>
  </template>
  <template v-else>
    <MessageSkeleton
      v-for="i in chat?.usersCount > 30 ? 30 : chat?.usersCount || 5"
      :key="i"
      :animate="false"
    />
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Paginate from "@/components/Core/Paginate.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import GalleryTextField from "@/components/Gallery/GalleryTextField.vue";
import MessagePerf from "@/components/Communications/MessagePerf.vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import UserSidebarOptions from "@/components/Communications/Menus/UserSidebarOptions.vue";
import {
  Chat,
  ChatAssociation,
  ChatRank,
  FriendStatus,
  UserStatus,
  UserStoredStatus
} from "@/gql/graphql";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";

export default defineComponent({
  components: {
    MessageSkeleton,
    UserSidebarOptions,
    Overline,
    MessagePerf,
    GalleryTextField,
    Paginate,
    UserAvatar
  },
  props: {
    chatId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      create: false,
      sort: 0,
      contextMenu: {
        dialog: false,
        x: 0,
        y: 0,
        item: null as ChatAssociation | null
      },
      searchRanks: ""
    };
  },
  computed: {
    chat() {
      return this.$chat.chats.find(
        (chat) => chat.association.id === this.chatId
      );
    },
    ranksFiltered() {
      return (
        this.chat?.ranks.filter((rank: ChatRank) =>
          rank.name.toLowerCase().includes(this.searchRanks.toLowerCase())
        ) || []
      );
    },
    FriendStatus() {
      return FriendStatus;
    },
    UserStatus() {
      return UserStatus;
    },
    height() {
      if (this.$vuetify.display.mobile) return "calc(100vh - 300px)";
      return "calc(100vh - 64px)";
    },
    ranks() {
      if (!this.chat) return [];
      return [
        ...this.chat.ranks.map((rank) => {
          return {
            ...rank,
            users: this.chat.users
              .filter((user) => {
                return (
                  user.ranksMap[0] === rank.id &&
                  (user.userId === this.$user.user?.id ||
                    (this.$user.users[user.userId]?.status !==
                      UserStatus.Offline &&
                      this.$user.users[user.id]?.status !==
                        UserStoredStatus.Invisible &&
                      this.$user.users[user.userId]?.status))
                );
              })
              .map((user) => {
                return {
                  ...user,
                  user: this.$user.users[user.userId]
                };
              })
          };
        }),
        {
          name: this.$t("chats.roles.online"),
          users: this.chat.users
            .filter((user) => {
              return (
                this.$user.users[user.userId]?.status !== UserStatus.Offline &&
                !user.ranksMap.length
              );
            })
            .map((user) => {
              return {
                ...user,
                user: this.$user.users[user.userId]
              };
            })
        },
        {
          name: this.$t("chats.roles.offline"),
          users: this.chat.users
            .filter((user) => {
              return (
                this.$user.users[user.userId]?.status === UserStatus.Offline &&
                user.userId !== this.$user.user?.id
              );
            })
            .map((user) => {
              return {
                ...user,
                user: this.$user.users[user.userId]
              };
            })
        }
      ];
    },
    menuStyle() {
      return `
        position: absolute;
        top: ${this.contextMenu.y}px;
        left: ${this.contextMenu.x + 10}px;`;
    }
  },
  watch: {
    sort(val) {
      this.$chat.doSearch(val);
    }
  },
  methods: {
    async handleJump(messageId: number, associationId: number) {
      if (this.chatId !== associationId) {
        this.$router.push(`/communications/${associationId}`);
        await this.$chat.setChat(associationId);
      }
      await this.$chat.jumpToMessage(messageId);
    },
    context(e: any, item: any) {
      e.preventDefault();
      this.contextMenu.item = item;
      this.contextMenu.x = e.clientX + window.scrollX;
      this.contextMenu.y = e.clientY + window.scrollY;
      this.contextMenu.dialog = true;
    },
    chatName(chat: Chat) {
      if (!chat) return "Communications";
      if (chat.type === "direct") {
        return chat.recipient?.username || "Deleted User";
      } else {
        return chat.name;
      }
    }
  }
});
</script>
