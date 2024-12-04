<template>
  <v-menu
    v-model="active"
    :close-on-content-click="false"
    location="end"
    style="z-index: 4001"
  >
    <template #activator="{ props }">
      <v-chip class="ml-2 my-1" v-bind="props" :size="size">
        <v-icon>mdi-plus</v-icon>
      </v-chip>
    </template>
    <v-card>
      <v-card-title class="text-h6">
        {{ $t("chats.settings.ranks.add.title") }}
      </v-card-title>
      <v-card-subtitle>
        {{ $t("chats.settings.ranks.add.description") }}
      </v-card-subtitle>
      <v-list max-height="400">
        <v-text-field
          v-model="search"
          :autofocus="true"
          class="mx-5 my-n1"
          label="Search"
        />
        <v-list-item
          v-for="rank in ranksSearch"
          :key="rank.id"
          :active="association.ranksMap.includes(rank.id)"
          :value="rank.id"
          :disabled="
            rank.managed ||
            !$chat.canEditRank(rank.index, chat || $chat.editingChat)
          "
          @click="
            $chat.toggleUserRank(association.id, currentAssociationId, rank.id)
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
                :model-value="association.ranksMap.includes(rank.id)"
                color="primary"
              />
            </v-list-item-action>
          </template>
          <v-list-item-title>{{ rank.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Chat, ChatAssociation, ChatRank } from "@/gql/graphql";

export default defineComponent({
  props: {
    ranks: {
      type: Object as () => ChatRank[],
      required: true
    },
    association: {
      type: Object as () => ChatAssociation,
      required: true
    },
    currentAssociationId: {
      type: Number,
      required: true
    },
    size: {
      type: String
    },
    chat: {
      type: Object as () => Chat
    }
  },
  emits: ["add"],
  data() {
    return {
      active: false,
      search: "",
      selected: [] as number[]
    };
  },
  computed: {
    ranksSearch() {
      return this.ranks.filter((rank: ChatRank) =>
        rank.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {}
});
</script>
