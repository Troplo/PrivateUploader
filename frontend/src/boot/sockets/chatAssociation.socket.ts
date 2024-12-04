import { useChatStore } from "@/store/chat.store";
import { useMessagesStore } from "@/store/message.store";
import { useApolloClient, useSubscription } from "@vue/apollo-composable";
import { OnReadChatDocument, OnReadReceiptDocument } from "@/gql/graphql";
import { gql } from "@apollo/client/core";

export default function setup() {
  const chatStore = useChatStore();
  const messagesStore = useMessagesStore();
  const apolloClient = useApolloClient();
  const cache = apolloClient.client.cache;

  useSubscription(OnReadChatDocument).onResult(({ data: { onReadChat } }) => {
    console.log(`ReadChatSubscription: `, onReadChat);
    // get the chat from the cache
    const chat = cache.readFragment({
      // Find the Chat with the association: ChatAssociation:{onReadChat}
      id: `Chat:${onReadChat}`,
      fragment: gql`
        fragment ReadChat on Chat {
          id
          unread
        }
      `
    });
    console.log(`ReadChatSubscription: `, chat, onReadChat);
    if (!chat || !chat.unread) return;
    cache.modify({
      id: `Chat:${chat.id}`,
      fields: {
        unread: () => 0
      }
    });
    chatStore.getChats();
  });

  useSubscription(OnReadReceiptDocument).onResult(
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
      const message = cache.readFragment({
        id: `Message:${onReadReceipt.messageId}`,
        fragment: gql`
          fragment ReadReceipt on Message {
            id
            readReceipts {
              associationId
              user {
                id
                avatar
                username
              }
              messageId
            }
          }
        `
      }) as any;
      console.log(`ReadReceiptSubscription: `, message);
      messagesStore.updateMessage({
        id: onReadReceipt.messageId,
        chatId: onReadReceipt.chatId,
        readReceipts: [
          ...(message.readReceipts || []),
          {
            associationId: onReadReceipt.associationId,
            user: onReadReceipt.user,
            messageId: onReadReceipt.messageId
          }
        ]
      });
    }
  );
}
