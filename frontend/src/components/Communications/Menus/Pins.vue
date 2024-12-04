<template>
  <v-menu
    :close-on-content-click="false"
    activator="parent"
    class="rounded-xl"
    location="bottom center"
    max-height="500"
    max-width="650"
    style="z-index: 2001"
    width="400"
    @update:model-value="getPins"
  >
    <v-card>
      <v-toolbar>
        <v-spacer />
        Pins
        <v-spacer />
      </v-toolbar>
      <v-progress-linear
        v-if="loading"
        :model-value="'true'"
        indeterminate
        size="64"
      />
      <v-container>
        <div
          v-if="data.items.length"
          id="chat"
          class="messages communications"
          style="flex-direction: column"
        >
          <message-perf
            v-for="(message, index) in data.items"
            :id="'message-' + index"
            :key="message.id"
            :message="message"
            :pins="true"
            :search="true"
            class="pointer"
            @click="$chat.jumpToMessage(message.id)"
            @jump-to-message="$chat.jumpToMessage($event.id)"
            @refresh="getPins(true)"
          />
        </div>
        <PromoNoContent
          v-else
          description="Pinned messages will appear here."
          icon="mdi-pin-outline"
          title="No pins"
        />
        <Paginate
          v-if="data.pager.totalPages > 1"
          v-model="page"
          :total-pages="data.pager.totalPages"
          class="mt-2"
        />
      </v-container>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Message as MessageType } from "@/models/message";
import { Paginate as PaginateType } from "@/types/paginate";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import Paginate from "@/components/Core/Paginate.vue";
import MessagePerf from "@/components/Communications/MessagePerf.vue";
import { ScrollPosition } from "@/gql/graphql";

export default defineComponent({
  components: { MessagePerf, Paginate, PromoNoContent },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      page: 1,
      loading: false,
      data: {
        items: [] as MessageType[],
        pager: {} as PaginateType
      }
    };
  },
  watch: {
    page() {
      this.getPins(true);
    }
  },
  methods: {
    async getPins(e: boolean) {
      if (!e) return;
      this.loading = true;
      this.data = await this.$chat.getMessages({
        search: {
          pins: true
        },
        page: this.page,
        associationId: this.$chat.selectedChat?.association.id,
        position: ScrollPosition.Bottom
      });
      this.loading = false;
    }
  }
});
</script>
