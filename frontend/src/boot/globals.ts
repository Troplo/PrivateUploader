import axios from "@/plugins/axios";
import vuetify from "@/plugins/vuetify";
import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/user.store";
import { useAppStore } from "@/store/app.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { useCollectionsStore } from "@/store/collections.store";
import { useWorkspacesStore } from "@/store/workspaces.store";
import { useChatStore } from "@/store/chat.store";
import { useFriendsStore } from "@/store/friends.store";
import { useMailStore } from "@/store/mail.store";
import dayjs from "@/plugins/dayjs";
import validation from "@/plugins/validation";
import { io } from "socket.io-client";
import functions from "@/plugins/functions";
import router from "@/router";
import { useMessagesStore } from "@/store/message.store";
import { useProgressiveUIStore } from "@/store/progressive.store";
import { useModulesStore } from "@/store/modules.store";
import { useToast } from "vue-toastification";
import { useEndpointsStore } from "@/store/endpoints.store";

function createSocket(namespace: string) {
  console.log(`[TPU/Socket] Connecting to ${namespace}`);
  const socket = io(
    `${useEndpointsStore().selected.gateway.url}/${namespace}`,
    {
      auth: {
        token: localStorage.getItem("token")
      },
      transports: ["websocket"],
      reconnection: true,
      path: "/gateway",
      reconnectionAttempts: 99999,
      query: {
        // In v4 legacy socket, the typing will not be emit to the user itself
        // In v5, this was changed, however, we need to access the typing status of the user in v4
        // This is the only difference
        version: "5"
      }
    }
  );
  socket.on("connect", () => {
    console.log(`[TPU/Socket] Connected to ${namespace}`);
  });
  socket.on("disconnect", () => {
    console.log(`[TPU/Socket] Disconnected from ${namespace}`);
  });
  return socket;
}

export default function setup(app) {
  app.config.globalProperties.axios = axios();
  const user = useUserStore();
  const core = useAppStore();
  app.config.globalProperties.$user = user;
  app.config.globalProperties.$app = core;
  if (window.location.pathname.startsWith("/slideshow/")) return;
  const experiments = useExperimentsStore();
  const collections = useCollectionsStore();
  const workspace = useWorkspacesStore();
  const chat = useChatStore();
  const friends = useFriendsStore();
  const mail = useMailStore();
  const messages = useMessagesStore();
  const ui = useProgressiveUIStore();
  core.themeProviderDefaults.theme = vuetify.theme.themes.value;
  core.themeProviderDefaults.global = vuetify.defaults.value;
  app.config.globalProperties.$experiments = experiments;
  app.config.globalProperties.$admin = useAdminStore();
  app.config.globalProperties.$date = dayjs;
  app.config.globalProperties.$collections = collections;
  app.config.globalProperties.$validation = validation;
  app.config.globalProperties.$workspaces = workspace;
  app.config.globalProperties.$chat = chat;
  app.config.globalProperties.$messages = messages;
  app.config.globalProperties.$friends = friends;
  app.config.globalProperties.$mail = mail;
  app.config.globalProperties.$ui = ui;
  app.config.globalProperties.$socket = createSocket("");
  app.config.globalProperties.$sockets = {
    chat: createSocket("chat"),
    friends: createSocket("friends"),
    mail: createSocket("mail"),
    user: createSocket("user"),
    pulse: createSocket("pulse"),
    gallery: createSocket("gallery"),
    autoCollects: createSocket("autoCollects"),
    trackedUsers: createSocket("trackedUsers")
  };
  app.config.globalProperties.$functions = functions;

  window.central = {
    userStore: useUserStore(),
    emit: (platform: string, event: string, data: any) => {
      if (platform === "geo" && event === "history") {
        console.log(data);
      }
    },
    modulesStore: useModulesStore(),
    vuetify,
    router,
    token: localStorage.getItem("token"),
    toast: useToast()
  };
}
