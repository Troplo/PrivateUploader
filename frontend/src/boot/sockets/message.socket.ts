import { useChatStore } from "@/store/chat.store";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user.store";
import { useMessagesStore } from "@/store/message.store";
import { useToast } from "vue-toastification";
import { useApolloClient, useSubscription } from "@vue/apollo-composable";
import {
  Chat,
  MessagesDocument,
  NewMessageDocument,
  StandardMessageFragmentDoc,
  UserStoredStatus,
  CancelTypingEventDocument,
  TypingEventDocument
} from "@/gql/graphql";
import MessageToast from "@/components/Communications/MessageToast.vue";
import { Platform, useAppStore } from "@/store/app.store";
import { IpcChannels } from "@/electron-types/ipc";
import functions from "@/plugins/functions";
import { useFragment } from "@/gql";
import { gql } from "@apollo/client/core";

export default function setup() {
  const chatStore = useChatStore();
  const router = useRouter();
  const userStore = useUserStore();
  const messagesStore = useMessagesStore();
  const appStore = useAppStore();
  const toast = useToast();

  const newMsg = useSubscription(NewMessageDocument);
  const cache = useApolloClient().client.cache;

  newMsg.onResult(async ({ data: { onMessage } }) => {
    const data = useFragment(StandardMessageFragmentDoc, onMessage.message);
    console.log("message", data);
    const index = chatStore.chats.findIndex((c) => c.id === data.chatId);
    if (index === -1) return;

    // Move the chat to the top of the list
    cache.modify({
      id: `Chat:${data.chatId}`,
      fields: {
        sortDate: () => new Date().getTime().toString(),
        unread: (unread) => {
          if (
            chatStore.selectedChat?.id === data.chatId &&
            document.hasFocus()
          ) {
            return 0;
          }
          return (unread as number) + 1;
        }
      }
    });
    chatStore.getChats();

    // We use a different query to get messages, not chat. MessagesDocument
    //    const { data } = await apolloClient.client.query({
    //       query: MessagesDocument,
    //       variables: {
    //         input
    //       }
    await messagesStore.insertMessage(data, onMessage.associationId);
    if (
      onMessage.associationId === chatStore.selectedChatId &&
      chatStore.isCommunications
    ) {
      chatStore.readChat();
    }

    if (appStore.platform !== Platform.WEB) {
      window.electron.ipcRenderer.send(IpcChannels.NEW_MESSAGE, {
        ...onMessage,
        instance: {
          name: appStore.site.name,
          domain: appStore.domain,
          hostname: appStore.site.hostname,
          hostnameWithProtocol: appStore.site.hostnameWithProtocol,
          notificationIcon: functions.avatar(userStore.users[data.userId])
        }
      });
    }
  });

  const typing = useSubscription(TypingEventDocument);
  const cancelTyping = useSubscription(CancelTypingEventDocument);

  typing.onResult(({ data: { onTyping } }) => {
    // update the chat with the typing user
    const chat = chatStore.chats.find((c) => c.id === onTyping.chatId);
    cache.modify({
      id: `Chat:${onTyping.chatId}`,
      fields: {
        typing: () => [
          ...(chat?.typing || []),
          { userId: onTyping.userId, expires: onTyping.expires }
        ]
      }
    });
    // TODO: Typing socket
    chatStore.getChats();
  });

  //
  // const typing = useSubscription(TypingEventDocument);
  // const cancelTyping = useSubscription(CancelTypingEventDocument);
  //
  // typing.onResult(({ data: { onTyping } }) => {
  //   const index = chatStore.chats.findIndex((c) => c.id === onTyping.chatId);
  //   if (index === -1) return;
  //   const chat: Chat = chatStore.chats[index];
  //   if (!chat) return;
  //   if (!chat.typers) chat.typers = [] as Typing[];
  //   const find = chat.typers.find(
  //     (t) => t.userId === onTyping.user.id && t.chatId === onTyping.chatId
  //   );
  //   if (find) {
  //     clearTimeout(find?.timeout);
  //     chat.typers.splice(
  //       chat.typers.findIndex(
  //         (t) => t.chatId === onTyping.chatId && t.userId === onTyping.user.id
  //       ),
  //       1
  //     );
  //   }
  //   chat.typers.push({
  //     chatId: onTyping.chatId,
  //     userId: onTyping.user.id,
  //     expires: onTyping.expires,
  //     user: onTyping.user,
  //     timeout: setTimeout(() => {
  //       const chat: Chat = chatStore.chats.find(
  //         (c) => c.id === onTyping.chatId
  //       );
  //       if (!chat || !chat.typers) return;
  //       chat.typers.splice(
  //         chat.typers.findIndex(
  //           (t) => t.chatId === onTyping.chatId && t.userId === onTyping.user.id
  //         ),
  //         1
  //       );
  //     }, new Date(onTyping.expires).getTime() - Date.now())
  //   });
  // });
  //
  // cancelTyping.onResult(({ data: { onCancelTyping } }) => {
  //   const index = chatStore.chats.findIndex(
  //     (c) => c.id === onCancelTyping.chatId
  //   );
  //   if (index === -1) return;
  //   const chat: Chat = chatStore.chats[index];
  //   if (!chat.typers) chat.typers = [] as Typing[];
  //   const find = chat.typers.find((t) => t.userId === onCancelTyping.user.id);
  //   if (find) {
  //     clearTimeout(find?.timeout);
  //     chat.typers.splice(
  //       chat.typers.findIndex(
  //         (t) =>
  //           t.chatId === onCancelTyping.chatId &&
  //           t.userId === onCancelTyping.user.id
  //       ),
  //       1
  //     );
  //   }
  // });
  //
  // const embedFails = [] as {
  //   data: EditMessageEvent;
  //   retries: number;
  // }[];
  //
  // function onEmbedResolution(embedResolution: EditMessageEvent) {
  //   if (!messagesStore.messages[embedResolution.associationId]) return;
  //   const index = messagesStore.messages[
  //     embedResolution.associationId
  //   ]?.findIndex((msg) => msg.id === embedResolution.message.id);
  //   if (index !== -1) {
  //     const message =
  //       messagesStore.messages[embedResolution.associationId][index];
  //     messagesStore.messages[embedResolution.associationId].splice(index, 1, {
  //       ...message,
  //       ...embedResolution.message
  //     });
  //   } else {
  //     let embedFailIndex = embedFails.findIndex(
  //       (e) => e.data.message.id === embedResolution.message.id
  //     );
  //
  //     if (embedFailIndex === -1) {
  //       embedFails.push({
  //         data: embedResolution,
  //         retries: 0
  //       });
  //       embedFailIndex = embedFails.length - 1;
  //     }
  //     if (embedFails[embedFailIndex]?.retries > 5) {
  //       embedFails.splice(embedFailIndex, 1);
  //       return;
  //     }
  //     setTimeout(() => {
  //       onEmbedResolution(embedResolution);
  //     }, 50);
  //     embedFails[embedFailIndex].retries++;
  //     return;
  //   }
  // }
  //
  // useSubscription(OnMessageEditDocument).onResult(
  //   ({ data: { onEditMessage } }) => {
  //     onEmbedResolution(onEditMessage);
  //   }
  // );
  //
  // useSubscription(OnDeleteMessageDocument).onResult(
  //   ({ data: { onDeleteMessage } }) => {
  //     if (!messagesStore.messages[onDeleteMessage.associationId]) return;
  //     const index = messagesStore.messages[
  //       onDeleteMessage.associationId
  //     ]?.findIndex((msg) => msg.id === onDeleteMessage.id);
  //     if (index !== -1) {
  //       messagesStore.messages[onDeleteMessage.associationId].splice(index, 1);
  //     }
  //   }
  // );
}
