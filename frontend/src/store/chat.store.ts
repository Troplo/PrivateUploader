// Utilities
import { defineStore, Pinia, StoreDefinition } from "pinia";
import axios from "@/plugins/axios";
import { useExperimentsStore } from "@/store/experiments.store";
import vuetify from "@/plugins/vuetify";
import { useRoute } from "vue-router";
import { Platform, useAppStore } from "@/store/app.store";
import { useUserStore } from "@/store/user.store";
import { useFriendsStore } from "@/store/friends.store";
import dayjs from "../plugins/dayjs";
import { useToast } from "vue-toastification";
import {
  AddChatUsersDocument,
  CancelTypingDocument,
  Chat,
  ChatDocument,
  ChatEmoji,
  ChatInvite,
  ChatInviteDocument,
  ChatRank,
  ChatsQueryDocument,
  ChatsQueryQuery,
  ChatType,
  CreateChatDocument,
  InfiniteMessagesInput,
  JoinChatFromInviteDocument,
  LeaveChatDocument,
  Message,
  MessageType,
  PagedMessagesInput,
  PaginatedMessageResponse,
  PartialUserFriend,
  ReadChatDocument,
  ScrollPosition,
  SendMessageDocument,
  ToggleUser,
  ToggleUserRankDocument,
  TypingDocument,
  UpdateChatDocument,
  UpdateChatInput,
  UserEmojiDocument,
  UserEmojiQuery,
  UserStatus
} from "@/gql/graphql";
import { StateHandler } from "@/components/Scroll/types";
import { Typing } from "@/models/chat";
import { Ref, computed, h, markRaw, nextTick, ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useMessagesStore } from "@/store/message.store";
import { IpcChannels } from "@/electron-types/ipc";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { RiCollageFill, RiCollageLine } from "@remixicon/vue";
import { RailMode, useProgressiveUIStore } from "@/store/progressive.store";
import { useDisplay } from "vuetify";
import { updateCache } from "@/utils/cacheManager";

export const useChatStore = defineStore("chat", () => {
  const search = {
    value: ref(false),
    results: ref<PaginatedMessageResponse>({
      items: [] as Message[],
      pager: {
        totalItems: 0,
        currentPage: 1,
        pageSize: 50,
        totalPages: 1,
        startPage: 1,
        endPage: 1,
        startIndex: 0,
        endIndex: 1,
        pages: [1]
      }
    }),
    loading: ref(false),
    query: ref("")
  };
  const loading = {
    value: ref(false),
    newMessages: ref(false)
  };
  const chats = ref<ChatsQueryQuery["chats"]>([]);
  const drafts = ref({});
  const selectedChatId: Ref<number> = ref<number>(
    parseInt(localStorage.getItem("selectedChatId") || "0")
  );
  const memberSidebarShown = ref(true);
  /**
   * The association ID of the chat that is ready.
   */
  const isReady = ref<number | null>(null);
  const trustedDomains = ref<string[]>([]);
  const dialogs = {
    leave: {
      value: ref(false),
      itemId: ref<number | undefined>(undefined),
      loading: ref(false)
    },
    message: {
      value: ref(false),
      message: ref<Message | null>(null),
      bindingElement: ref<string | null>(null),
      x: ref(0),
      y: ref(0),
      location: ref("top")
    },
    groupSettings: {
      value: ref(false),
      itemId: ref<number | undefined>(undefined),
      loading: ref(false)
    },
    externalSite: {
      value: ref(false),
      url: ref("")
    },
    image: {
      value: ref(false),
      object: ref(null)
    },
    user: {
      value: ref(false),
      username: ref("")
    },
    userMenu: {
      value: ref(false),
      username: ref(""),
      user: ref<PartialUserFriend | null>(null),
      bindingElement: ref<string | null>(null),
      x: ref(0),
      y: ref(0),
      location: ref("top")
    },
    emojiMenu: {
      value: ref(false),
      bindingElement: ref<string | null>(null),
      location: ref("right"),
      emoji: ref<ChatEmoji | null>(null),
      chat: ref<Chat | null>(null)
    },
    statusMenu: {
      value: ref(false),
      x: ref(0),
      y: ref(0)
    },
    chatDevOptions: {
      value: ref(false)
    }
  };
  const emoji = ref<UserEmojiQuery["userEmoji"]>([]);
  const recentEmoji = ref<Record<string, number>>({});
  /**
   * The volume of the notification sound in decimal form.
   */
  const volume = ref<number>(parseFloat(localStorage.getItem("volume") || "1"));
  /**
   * Prevent multiple sounds from playing at once.
   */
  const soundPlaying = ref(false);

  // Computed
  const selectedChat = computed(() => {
    return chats.value.find(
      (chat: Chat) => chat.association.id === selectedChatId.value
    );
  });

  const messagesStore = useMessagesStore();
  const currentOffset = computed(() => {
    const messages = messagesStore.messages[selectedChatId.value];
    if (!messages?.length) return { up: 0, down: 0 };
    const down = messages[0]?.id ? messages[0]?.id : 0;
    const up = messages[messages.length - 1]?.id
      ? messages[messages.length - 1]?.id
      : 0;
    return {
      up,
      down
    };
  });

  const typers = computed(() => {
    const user = useUserStore();
    const friends = useFriendsStore();
    if (!selectedChat.value) return "";
    if (!selectedChat.value.typing?.length) return "";
    if (selectedChat.value?.typing?.length > 3) {
      return `${selectedChat.value.typing.length} people are typing...`;
    }

    // filter out the current user and return the usernames
    const typers = selectedChat.value.typing
      .filter((typer) => typer.userId !== user.user?.id)
      .map((typer) => {
        return friends.getName(typer.userId);
      });

    const last = typers.pop();
    if (typers.length) {
      return `${typers.join(", ")} and ${last} are typing...`;
    } else if (last) {
      return `${last} is typing...`;
    } else {
      return "";
    }
  });

  const totalUnread = computed(() => {
    const val = chats.value.reduce((total: number, chat: Chat) => {
      return total + chat.unread;
    }, 0);
    const appStore = useAppStore();
    if (appStore.platform !== Platform.WEB) {
      console.log("Unread messages count", val);
      window.electron.ipcRenderer.send(IpcChannels.UNREAD_MESSAGES_COUNT, val);
    }
    return val;
  });

  const communicationsSidebar = computed(() => {
    return !useDisplay().mobile.value;
  });

  const memberSidebar = computed(() => {
    if (!memberSidebarShown.value) return false;
    const experimentsStore = useExperimentsStore();
    return !useDisplay().mdAndDown.value;
  });

  const route = useRoute();

  const isCommunications = computed(() => {
    return route.path.startsWith("/communications/");
  });

  const commsSidebar = computed(() => {
    return route.path.startsWith(`/communications/${selectedChatId.value}`);
  });

  // Methods
  function openEmoji(
    emojiId: string,
    emojiName: string,
    emojiUrl: string,
    chatId: number,
    messageId: number,
    bindingElement: string
  ) {
    dialogs.emojiMenu.bindingElement.value = `#${bindingElement}`;
    dialogs.emojiMenu.chat.value = chats.value.find(
      (chat) => chat.id === chatId
    );
    dialogs.emojiMenu.emoji.value = {
      chatId: chatId,
      createdAt: undefined,
      deleted: false,
      updatedAt: undefined,
      name: emojiName,
      id: emojiId,
      icon: emojiUrl
    };
    dialogs.emojiMenu.value.value = true;
  }

  async function toggleUserRank(
    updatingChatAssociationId: number,
    chatAssociationId: number,
    rankId: string
  ) {
    return useApolloClient().client.mutate({
      mutation: ToggleUserRankDocument,
      variables: {
        input: {
          chatAssociationId,
          updatingChatAssociationId,
          rankId
        }
      }
    });
    // TODO: Fix cache
  }

  async function joinInvite(inviteId: string) {
    const {
      data: { joinChatFromInvite }
    } = await useApolloClient().client.mutate({
      mutation: JoinChatFromInviteDocument,
      variables: {
        input: {
          inviteId
        }
      }
    });
    // TODO: Fix cache
    return joinChatFromInvite;
  }

  async function getInvite(inviteId: string) {
    const {
      data: { chatInvite }
    } = await useApolloClient().client.query({
      query: ChatInviteDocument,
      variables: {
        input: {
          inviteId
        }
      }
    });
    // TODO: Fix cache
    return chatInvite;
  }

  async function leaveChat(associationId: number) {
    await useApolloClient().client.mutate({
      mutation: LeaveChatDocument,
      variables: {
        input: {
          associationId
        }
      }
    });
    // TODO: Fix cache
  }

  function getRankColor(ranksMap?: string[], ranks?: ChatRank[]) {
    if (!ranks) return null;
    if (!ranksMap) ranksMap = [];
    for (const rankId of ranksMap) {
      const rank = ranks.find((r) => r.id === rankId);
      if (rank) {
        if (rank.color !== null) {
          return rank.color;
        }
      }
    }
    return null;
  }

  function canEditRank(rankIndex: number, chat?: Chat) {
    const userStore = useUserStore();
    if (chat.userId === userStore.user?.id) return true;
    const userRank = chat.ranks.find(
      (rank) =>
        rank.id ===
        chat.users.find((user) => user.userId === chat.association.userId)
          .ranksMap[0]
    );
    if (userRank.index > rankIndex) return true;
    return userRank.index === rankIndex && hasPermission("TRUSTED", chat);
  }

  function hasPermission(permission: string | string[], chat?: Chat) {
    const permissionsArray = Array.isArray(permission)
      ? permission
      : [permission];

    const c = chat ?? selectedChat.value;

    return (
      c?.association?.permissions?.some(
        (perm) =>
          permissionsArray.includes(perm) ||
          (!permissionsArray.includes("TRUSTED") && perm === "ADMIN")
      ) ||
      (c?.association?.userId === c?.userId && c?.type === "group")
    );
  }

  async function sendMessage(
    content: string,
    attachments = [],
    replyId?: number,
    associationId?: number
  ) {
    const {
      data: { sendMessage }
    } = await useApolloClient().client.mutate({
      mutation: SendMessageDocument,
      variables: {
        input: {
          content,
          attachments: attachments.filter((attachment) => attachment),
          replyId,
          associationId: associationId || selectedChat.value?.association?.id
        }
      }
    });
    return sendMessage;
  }

  async function pinMessage(
    id: number | undefined,
    pinned: boolean | undefined
  ) {
    if (!id || pinned === undefined) return;
    await axios.put(`/chats/${selectedChatId.value}/message`, {
      pinned,
      id
    });
    useToast().success(
      "Message " + (pinned ? "pinned" : "unpinned") + " successfully."
    );
  }

  async function doJump(message: number) {
    const element = document.getElementById(`message-id-${message}`);
    if (!element) return false;
    element.scrollIntoView({
      block: "center",
      inline: "center"
    });
    element.classList.add("message-jumped");
    setTimeout(() => {
      element.classList.remove("message-jumped");
    }, 1000);
    await nextTick();
    element.scrollIntoView({
      block: "center",
      inline: "center"
    });
    return true;
  }

  async function jumpToMessage(message: number, associationId: number) {
    if (!(await doJump(message))) {
      const messagesStore = useMessagesStore();
      messagesStore.messages[associationId] = null;
      loading.newMessages.value = true;
      await loadHistory(
        undefined,
        ScrollPosition.Top,
        message ? message + 30 : undefined
      );
      loading.newMessages.value = false;
      await doJump(message);
    }
  }

  function merge(message: Message, index: number, associationId: number) {
    if (message.replyId) return false;
    if (message.type !== MessageType.Message && message.type) return false;
    const messagesStore = useMessagesStore();
    if (!messagesStore.messages[associationId]) return false;
    const prev = messagesStore.messages[associationId][index + 1];
    if (!prev) return false;
    if (prev.type !== MessageType.Message && prev.type) return false;
    if (dayjs(message.createdAt).diff(prev.createdAt, "minutes") > 5)
      return false;
    return prev.userId === message.userId;
  }

  async function doSearch(sort: number) {
    search.loading.value = true;
    search.results.value = await messagesStore.getMessages({
      search: {
        query: search.query.value
      },
      page: search.results.value.pager.currentPage || 1,
      associationId: selectedChatId.value,
      position: !sort ? ScrollPosition.Top : ScrollPosition.Bottom
    });
    search.loading.value = false;
  }

  function getDraft(chatId: string) {
    return drafts.value[chatId];
  }

  function setDraft(chatId: string, draft: string) {
    if (draft?.trim()?.length) {
      drafts.value[chatId] = draft;
    } else {
      delete drafts.value[chatId];
    }
    localStorage.setItem("draftStore", JSON.stringify(drafts.value));
  }

  async function saveSettings(input?: Partial<UpdateChatInput>) {
    dialogs.groupSettings.loading.value = true;
    const {
      data: { updateChat }
    } = await useApolloClient().client.mutate({
      mutation: UpdateChatDocument,
      variables: {
        input: {
          name: input?.name ?? editingChat.name,
          associationId: input?.associationId ?? editingChat.association.id,
          background: input?.background === null ? null : undefined,
          icon: input?.icon === null ? null : undefined,
          description: input?.description ?? editingChat.description
        }
      }
    });
    dialogs.groupSettings.loading.value = false;
    return updateChat;
  }

  async function sound() {
    if (soundPlaying.value) return;
    soundPlaying.value = true;
    const experiments = useExperimentsStore();
    let sound;
    const id = experiments.experiments.NOTIFICATION_SOUND;
    if (id === 3) {
      sound = await import("@/assets/audio/kfx.wav");
    } else {
      sound = await import("@/assets/audio/notification.wav");
    }
    const audio = new Audio(sound.default);
    audio.volume = volume.value >= 1 ? 1 : volume.value;
    await audio.play();
    soundPlaying.value = false;
  }

  function confirmLink(trust: boolean = false) {
    const url = new URL(dialogs.externalSite.url.value);
    const domain = url.hostname;
    if (trust) {
      try {
        const trusted = localStorage.getItem("trustedDomainsStore");
        if (trusted) {
          const trustedDomains = JSON.parse(trusted);
          if (!trustedDomains.includes(domain)) {
            trustedDomains.push(domain);
            trustedDomains.value = trustedDomains;
            localStorage.setItem(
              "trustedDomainsStore",
              JSON.stringify(trustedDomains)
            );
          }
        } else {
          localStorage.setItem("trustedDomainsStore", JSON.stringify([domain]));
          trustedDomains.value = [domain];
        }
      } catch {
        localStorage.setItem("trustedDomainsStore", JSON.stringify([domain]));
        trustedDomains.value = [domain];
      }
    }
    window.open(dialogs.externalSite.url.value, "_blank");
    dialogs.externalSite.value.value = false;
  }

  function processLink(link: string) {
    const url = new URL(link);
    const domain = url.hostname;
    const core = useAppStore();
    console.log(domain);
    if (
      (core.site.hostnames.includes(domain) || core.site.hostname === domain) &&
      !url.pathname.startsWith("/i/")
    ) {
      useRoute().push(url.pathname);
      return;
    }
    if (
      trustedDomains.value.includes(domain) ||
      core.site.preTrustedDomains.includes(domain)
    ) {
      window.open(link, "_blank");
    } else {
      dialogs.externalSite.value.value = true;
      dialogs.externalSite.url.value = link;
    }
  }

  function lookupChat(id: number) {
    return (
      (chats.value.find((chat) => chat.id === id) as Chat) ||
      ({
        name: "Unknown Chat"
      } as Chat)
    );
  }

  function openUser(id: number) {
    const user = lookupUser(id);
    if (!user.id) return;
    dialogs.user.username.value = user.username;
    dialogs.user.value.value = true;
  }

  function lookupUser(id: number): PartialUserFriend {
    const user = useUserStore();
    return <PartialUserFriend>(user.users[id] || {
      username: "Unknown User",
      status: UserStatus.Offline,
      administrator: false,
      createdAt: new Date().toISOString(),
      id: 0,
      moderator: false,
      bot: false
    });
  }

  async function changeUsers(
    users: number[],
    add: boolean = true,
    chatAssociationId: number
  ) {
    await useApolloClient().client.mutate({
      mutation: AddChatUsersDocument,
      variables: {
        input: {
          chatAssociationId,
          users,
          action: add ? ToggleUser.Add : ToggleUser.Remove
        }
      }
    });
  }

  async function createChat(users: number[], type?: ChatType) {
    console.log(users, type);
    const {
      data: { createChat }
    } = await useApolloClient().client.mutate({
      mutation: CreateChatDocument,
      variables: {
        input: {
          users,
          type
        }
      }
    });
    return createChat;
  }

  // MARKED: DONE
  async function readChat(chatId?: number) {
    if (document.hasFocus()) {
      await useApolloClient().client.mutate({
        mutation: ReadChatDocument,
        variables: {
          input: {
            associationId: chatId || selectedChatId.value
          }
        }
      });
      await getChats();
    }
  }

  async function typing() {
    await useApolloClient().client.mutate({
      mutation: TypingDocument,
      variables: {
        input: selectedChatId.value
      }
    });
  }

  async function cancelTyping() {
    await useApolloClient().client.mutate({
      mutation: CancelTypingDocument,
      variables: {
        input: selectedChatId.value
      }
    });
  }

  async function setChat(id: number) {
    loading.value = true;
    const experimentsStore = useExperimentsStore();
    const messagesStore = useMessagesStore();
    selectedChatId.value = id;
    localStorage.setItem("selectedChatId", id.toString());
    const appStore = useAppStore();
    const chat = chats.value.find(
      (chat: Chat) => chat.association.id === id
    ) as Chat;
    appStore.title = chatName(selectedChat.value);
    await messagesStore.loadChatMessages(id);
    if (id !== selectedChatId.value) return;
    // const index = chats.value.findIndex(
    //   (chat: Chat) => chat.association.id === id
    // );
    // if (chats.value.length) {
    //   if (index === -1) {
    //     chats.value.push({
    //       ...(chats.value.find(
    //         (chat: Chat) => chat.association.id === id
    //       ) as Chat),
    //       unread: 0,
    //       association: {
    //         id
    //       }
    //     });
    //   } else {
    //     chats.value[index] = {
    //       ...(chats.value.find(
    //         (chat: Chat) => chat.association.id === id
    //       ) as Chat),
    //       unread: 0
    //     };
    //   }
    // }
    if (chat) setNavItem(chat);
    await loadChatUsers(id);
    loading.value = false;
    isReady.value = id;
    appStore.title = chatName(selectedChat.value);
    readChat();
  }

  function setNavItem(chat: Chat) {
    const uiStore = useProgressiveUIStore();
    const route = useRoute();
    const userStore = useUserStore();
    const experiments = useExperimentsStore();
    uiStore.currentNavItem = {
      item: {
        name: chatName(chat) || "Loading...",
        icon: h(UserAvatar, {
          chat: chat.recipient ? undefined : chat,
          user: chat.recipient
            ? userStore.users[chat.recipient?.id]
            : undefined,
          size: 30,
          style: "margin: 0px 4px 0px 4px"
        }),
        path: `/communications/${chat.association.id}`
      },
      rail: experiments.experiments.BREADCRUMB_SHOW_PARENT
        ? [
            uiStore.navigation.railOptions.find(
              (rail) => rail.id === RailMode.CHAT
            )
          ]
        : []
    };
  }

  async function loadChatUsers(associationId: number) {
    // if (!chats.value.length) await getChats();
    // let index = chats.value.findIndex(
    //   (chat: Chat) => chat.association.id === associationId
    // );
    // if (index === -1) return;
    // if (!chats.value[index]?.users) {
    //   const {
    //     data: { chat: chatData }
    //   } = await useApolloClient().client.query({
    //     query: ChatDocument,
    //     variables: {
    //       input: {
    //         associationId
    //       }
    //     }
    //   });
    //   index = chats.value.findIndex(
    //     (chat: Chat) => chat.association.id === associationId
    //   );
    //   chats.value[index] = {
    //     ...(chats.value.find(
    //       (chat: Chat) => chat.association.id === associationId
    //     ) as Chat),
    //     ...chatData
    //   };
    //   setNavItem(chats.value[index]);
    // }
  }

  async function loadHistory(
    $state?: StateHandler,
    position: ScrollPosition = ScrollPosition.Top,
    offset?: number
  ) {
    if (import.meta.env.DEV) console.log("called history", offset, position);
    const messagesStore = useMessagesStore();
    if (offset) {
      messagesStore.messages[selectedChatId.value] = null;
      loading.newMessages.value = true;
    }
    loading.value = true;
    if ($state) $state.loading();
    const data = await messagesStore.getMessages({
      associationId: selectedChatId.value,
      position,
      offset:
        offset !== undefined
          ? offset
          : position === ScrollPosition.Top
          ? currentOffset.value.up
          : currentOffset.value.down,
      limit: 50
    });

    if (data.length) {
      if (offset) {
        messagesStore.messages[selectedChatId.value] = data;
      } else {
        if (position === ScrollPosition.Top) {
          messagesStore.messages[selectedChatId.value].push(...data);
          if (messagesStore.messages[selectedChatId.value]?.length > 350) {
            loading.newMessages.value = true;
            messagesStore.messages[selectedChatId.value].splice(0, 50);
          }
        } else {
          messagesStore.messages[selectedChatId.value].unshift(...data);
          if (messagesStore.messages[selectedChatId.value]?.length > 350) {
            loading.newMessages.value = true;
            messagesStore.messages[selectedChatId.value].splice(-50);
          }
        }
      }
      if ($state) $state.loaded();
      if (data.length < 50 || offset === 0) {
        if ($state) $state.complete();
      }
      loading.value = false;
      if (offset) {
        loading.newMessages.value = true;
      }
    } else {
      if ($state) $state.complete();
      loading.value = false;
      if (ScrollPosition.Bottom) {
        loading.newMessages.value = false;
      }
    }
    loading.value = false;
  }

  async function getChats() {
    const {
      data: { chats: data }
    } = await useApolloClient().client.query({
      query: ChatsQueryDocument
    });
    chats.value = data;
  }

  async function getEmoji() {
    const {
      data: { userEmoji }
    } = await useApolloClient().client.query({
      query: UserEmojiDocument
    });
    emoji.value = userEmoji;
  }

  async function init() {
    try {
      const trustedDomainsLS = localStorage.getItem("trustedDomainsStore");
      if (trustedDomainsLS) {
        trustedDomains.value = JSON.parse(trustedDomainsLS);
      }
    } catch {
      //
    }
    try {
      const draftsLS = localStorage.getItem("draftStore");
      if (draftsLS) {
        drafts.value = JSON.parse(draftsLS);
      }
    } catch {
      //
    }
    try {
      const emojiLS = localStorage.getItem("emojiStore");
      if (emojiLS) {
        recentEmoji.value = JSON.parse(emojiLS);
      }
    } catch {
      //
    }
    getChats();
    getEmoji();
  }

  function chatName(chat: Chat) {
    if (!chat) return "Communications";
    if (chat.type === "direct") {
      return useFriendsStore().getName(chat?.recipient) || "Deleted User";
    } else {
      return chat.name;
    }
  }

  async function setNotifications(
    type: "all" | "mentions" | "none",
    associationId: number
  ) {
    axios.patch(`/chats/association/${associationId}`, {
      notifications: type
    });
    chats.value.find(
      (chat: Chat) => chat.association.id === associationId
    ).association.notifications = type;
  }

  return {
    search,
    loading,
    chats,
    drafts,
    selectedChatId,
    memberSidebarShown,
    isReady,
    trustedDomains,
    dialogs,
    emoji,
    recentEmoji,
    volume,
    soundPlaying,
    selectedChat,
    messagesStore,
    currentOffset,
    typers,
    totalUnread,
    communicationsSidebar,
    memberSidebar,
    isCommunications,
    commsSidebar,
    openEmoji,
    toggleUserRank,
    joinInvite,
    getInvite,
    leaveChat,
    getRankColor,
    canEditRank,
    hasPermission,
    sendMessage,
    pinMessage,
    doJump,
    jumpToMessage,
    merge,
    doSearch,
    getDraft,
    setDraft,
    saveSettings,
    sound,
    confirmLink,
    processLink,
    lookupChat,
    openUser,
    lookupUser,
    changeUsers,
    createChat,
    readChat,
    typing,
    setChat,
    setNavItem,
    loadChatUsers,
    loadHistory,
    getChats,
    init,
    chatName,
    setNotifications,
    cancelTyping
  };
});
