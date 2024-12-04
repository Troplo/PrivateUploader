import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Message } from "@/gql/graphql";
import { useChatStore } from "@/store/chat.store";

export const useMessagesStore = defineStore("messages", () => {
  const messages = ref<Record<number, Message[]>>({});
  const chatStore = useChatStore();

  const currentMessages = computed(() => {
    return messages.value[chatStore.selectedChatId];
  });

  return {
    messages,
    currentMessages
  };
});
