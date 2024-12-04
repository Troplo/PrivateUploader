import { useChatStore } from "@/store/chat.store";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user.store";
import { useMessagesStore } from "@/store/message.store";
import { useToast } from "vue-toastification";
import { useSubscription } from "@vue/apollo-composable";
import { NewMessageSubscription } from "@/graphql/chats/subscriptions/newMessage.graphql";
import { EditMessageEvent, Message, UserStoredStatus } from "@/gql/graphql";
import MessageToast from "@/components/Communications/MessageToast.vue";
import {
  CancelTypingSubscription,
  TypingSubscription
} from "@/graphql/chats/subscriptions/typing.graphql";
import { EditMessageSubscription } from "@/graphql/chats/subscriptions/editMessage.graphql";
import { DeleteMessageSubscription } from "@/graphql/chats/subscriptions/deleteMessage.graphql";
import { Chat, Typing } from "@/models/chat";
import { Platform, useAppStore } from "@/store/app.store";
import { IpcChannels } from "@/electron-types/ipc";
import functions from "@/plugins/functions";

export default function setup() {
  const chatStore = useChatStore();
  const router = useRouter();
  const userStore = useUserStore();
  const messagesStore = useMessagesStore();
  const appStore = useAppStore();
  const toast = useToast();

  const newMsg = useSubscription(NewMessageSubscription);

  newMsg.onResult(({ data: { onMessage } }) => {
    console.log("message");
    const index = chatStore.chats.findIndex(
      (c) => c.id === onMessage.message.chatId
    );
    if (index === -1) return;
    // move chat to top
    const chatToMove = chatStore.chats[index];
    chatStore.chats = [
      {
        ...chatToMove,
        unread:
          chatStore.selectedChat?.id === onMessage.message.chatId
            ? chatToMove.unread
            : (chatToMove.unread || 0) + 1
      },
      ...chatStore.chats.slice(0, index),
      ...chatStore.chats.slice(index + 1)
    ];
    const msgChat = chatStore.chats.find((c) => c.id === onMessage.chat.id);
    const assocId = msgChat?.association?.id || -1;
    if (
      assocId &&
      messagesStore.messages[assocId] &&
      !messagesStore.messages[assocId].find(
        (m) => m.id === onMessage.message.id
      )
    ) {
      const index = messagesStore.messages[assocId]?.findIndex(
        (msg) => msg.pending && msg.content === onMessage.message.content
      );
      if (index === -1) {
        messagesStore.messages[assocId].unshift(onMessage.message as Message);
      } else {
        messagesStore.messages[assocId].splice(index, 1);
        messagesStore.messages[assocId].unshift(onMessage.message);
      }

      if (
        document.hasFocus() &&
        chatStore.selectedChat?.id === onMessage.message.chatId
      ) {
        chatStore.readChat();
      }
    }
    if (
      onMessage.message.userId === userStore.user?.id ||
      (chatToMove.association?.notifications === "mentions" &&
        !onMessage.mention) ||
      chatToMove.association?.notifications === "none"
    )
      return;
    if (
      userStore.user?.storedStatus !== UserStoredStatus.Busy &&
      onMessage.message.userId !== userStore.user?.id
    ) {
      chatStore.sound();
      toast.info(
        {
          component: MessageToast,
          props: {
            message: onMessage.message
          }
        },
        {
          toastClassName: "message-toast",
          icon: false,
          onClick: () => {
            router.push("/communications/" + onMessage.associationId);
          }
        }
      );
    }

    if (appStore.platform !== Platform.WEB) {
      window.electron.ipcRenderer.send(IpcChannels.NEW_MESSAGE, {
        ...onMessage,
        instance: {
          name: appStore.site.name,
          domain: appStore.domain,
          hostname: appStore.site.hostname,
          hostnameWithProtocol: appStore.site.hostnameWithProtocol,
          notificationIcon: functions.avatar(
            userStore.users[onMessage.message.userId]
          )
        }
      });
    }
  });

  const typing = useSubscription(TypingSubscription);
  const cancelTyping = useSubscription(CancelTypingSubscription);

  typing.onResult(({ data: { onTyping } }) => {
    const index = chatStore.chats.findIndex((c) => c.id === onTyping.chatId);
    if (index === -1) return;
    const chat: Chat = chatStore.chats[index];
    if (!chat) return;
    if (!chat.typers) chat.typers = [] as Typing[];
    const find = chat.typers.find(
      (t) => t.userId === onTyping.user.id && t.chatId === onTyping.chatId
    );
    if (find) {
      clearTimeout(find?.timeout);
      chat.typers.splice(
        chat.typers.findIndex(
          (t) => t.chatId === onTyping.chatId && t.userId === onTyping.user.id
        ),
        1
      );
    }
    chat.typers.push({
      chatId: onTyping.chatId,
      userId: onTyping.user.id,
      expires: onTyping.expires,
      user: onTyping.user,
      timeout: setTimeout(() => {
        const chat: Chat = chatStore.chats.find(
          (c) => c.id === onTyping.chatId
        );
        if (!chat || !chat.typers) return;
        chat.typers.splice(
          chat.typers.findIndex(
            (t) => t.chatId === onTyping.chatId && t.userId === onTyping.user.id
          ),
          1
        );
      }, new Date(onTyping.expires).getTime() - Date.now())
    });
  });

  cancelTyping.onResult(({ data: { onCancelTyping } }) => {
    const index = chatStore.chats.findIndex(
      (c) => c.id === onCancelTyping.chatId
    );
    if (index === -1) return;
    const chat: Chat = chatStore.chats[index];
    if (!chat.typers) chat.typers = [] as Typing[];
    const find = chat.typers.find((t) => t.userId === onCancelTyping.user.id);
    if (find) {
      clearTimeout(find?.timeout);
      chat.typers.splice(
        chat.typers.findIndex(
          (t) =>
            t.chatId === onCancelTyping.chatId &&
            t.userId === onCancelTyping.user.id
        ),
        1
      );
    }
  });

  const embedFails = [] as {
    data: EditMessageEvent;
    retries: number;
  }[];

  function onEmbedResolution(embedResolution: EditMessageEvent) {
    if (!messagesStore.messages[embedResolution.associationId]) return;
    const index = messagesStore.messages[
      embedResolution.associationId
    ]?.findIndex((msg) => msg.id === embedResolution.message.id);
    if (index !== -1) {
      const message =
        messagesStore.messages[embedResolution.associationId][index];
      messagesStore.messages[embedResolution.associationId].splice(index, 1, {
        ...message,
        ...embedResolution.message
      });
    } else {
      let embedFailIndex = embedFails.findIndex(
        (e) => e.data.message.id === embedResolution.message.id
      );

      if (embedFailIndex === -1) {
        embedFails.push({
          data: embedResolution,
          retries: 0
        });
        embedFailIndex = embedFails.length - 1;
      }
      if (embedFails[embedFailIndex]?.retries > 5) {
        embedFails.splice(embedFailIndex, 1);
        return;
      }
      setTimeout(() => {
        onEmbedResolution(embedResolution);
      }, 50);
      embedFails[embedFailIndex].retries++;
      return;
    }
  }

  useSubscription(EditMessageSubscription).onResult(
    ({ data: { onEditMessage } }) => {
      onEmbedResolution(onEditMessage);
    }
  );

  useSubscription(DeleteMessageSubscription).onResult(
    ({ data: { onDeleteMessage } }) => {
      if (!messagesStore.messages[onDeleteMessage.associationId]) return;
      const index = messagesStore.messages[
        onDeleteMessage.associationId
      ]?.findIndex((msg) => msg.id === onDeleteMessage.id);
      if (index !== -1) {
        messagesStore.messages[onDeleteMessage.associationId].splice(index, 1);
      }
    }
  );
}
