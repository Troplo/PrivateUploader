import { useChatStore } from "@/store/chat.store";
import { useMessagesStore } from "@/store/message.store";
import { useSubscription } from "@vue/apollo-composable";
import { ReadChatSubscription } from "@/graphql/chats/subscriptions/readChat.graphql";
import { ReadReceiptSubscription } from "@/graphql/chats/subscriptions/readReceipt.graphql";

export default function setup() {
  const chatStore = useChatStore();
  const messagesStore = useMessagesStore();

  useSubscription(ReadChatSubscription).onResult(({ data: { onReadChat } }) => {
    console.log(`ReadChatSubscription: `, onReadChat);
    chatStore.chats = chatStore.chats.map((c) => {
      if (c.association?.id === onReadChat) {
        return {
          ...c,
          unread: 0
        };
      } else {
        return c;
      }
    });
  });

  useSubscription(ReadReceiptSubscription).onResult(
    ({ data: { onReadReceipt } }) => {
      //    const chat1 = chat.chats.find((c: Chat) => c.id === data.chatId);
      //     if (!chat1) return;
      //     const assocId = chat1.association?.id || -1;
      //     if (!messages.messages[assocId]?.length) return;
      //     const messageIndex = messages.messages[assocId].findIndex(
      //       (m: Message) => m. id === data.id
      //     );
      //     if (messageIndex === -1) return;
      //     messages.messages[assocId].forEach((message: Message) => {
      //       message.readReceipts = message.readReceipts.filter(
      //         (r: ChatAssociation) => r.userId !== data.userId
      //       );
      //     });
      //     messages.messages[assocId][messageIndex].readReceipts.push(data);
      // That's the original code, but it's immutable now
      console.log(`ReadReceiptSubscription: `, onReadReceipt);
      const assocId = onReadReceipt.associationId;
      if (!messagesStore.messages[assocId]?.length) return;
      const messageIndex = messagesStore.messages[assocId].findIndex(
        (m) => m.id === onReadReceipt.messageId
      );
      if (messageIndex === -1) return;
      messagesStore.messages[assocId].forEach((message) => {
        message.readReceipts = message.readReceipts.filter(
          (r) => r.user!.id !== onReadReceipt.user.id
        );
      });
      messagesStore.messages[assocId][messageIndex].readReceipts.push(
        onReadReceipt
      );
    }
  );
}
