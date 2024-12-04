// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import ax from "axios";
import { useToast } from "vue-toastification";
import functions from "@/plugins/functions";
import { AxiosProgressEvent } from "axios";
import { useUserStore } from "@/store/user.store";
import { useChatStore } from "@/store/chat.store";
import { useCollectionsStore } from "@/store/collections.store";
import { useWorkspacesStore } from "@/store/workspaces.store";
import vuetify from "@/plugins/vuetify";
import { useExperimentsStore } from "@/store/experiments.store";
import i18nObject, { i18n } from "@/plugins/i18n";
import { SidebarItem } from "@/types/sidebar";
import {
  CoreState,
  CoreStateDocument,
  Upload,
  Weather,
  WeatherDocument
} from "@/gql/graphql";
import { useFriendsStore } from "@/store/friends.store";
import { useMailStore } from "@/store/mail.store";
import { useApolloClient } from "@vue/apollo-composable";
import FlowinityLogo from "@/components/Brand/FlowinityLogo.vue";
import { h } from "vue";
import { useUserPresenceStore } from "@/store/userPresence.store";

export enum Platform {
  WEB = "WEB",
  WINDOWS = "WINDOWS",
  MAC = "MAC",
  LINUX = "LINUX"
}

function getPlatform(): Platform {
  if (!window.electron) return Platform.WEB;
  if (window.electron.process.platform === "win32") return Platform.WINDOWS;
  if (window.electron.process.platform === "darwin") return Platform.MAC;
  if (window.electron.process.platform === "linux") return Platform.LINUX;
  return Platform.WEB;
}

export const useAppStore = defineStore("app", {
  state: () => ({
    connected: false,
    token: localStorage.getItem("token") || "",
    _postInitRan: false,
    themeProviderDefaults: {
      theme: {},
      global: {}
    },
    fluidGradient: false,
    demo: false,
    lastRoute: "/",
    domain: "/i/",
    mainDrawer: true,
    loading: true,
    /**
     * v4 classic UI:
     * Use a custom loading screen, such as a skeleton loader for each individual component/page context
     *
     * Progressive UI:
     * Used to trigger the Flowinity logo animation, for this, `componentLoading` can be used
     */
    componentLoading: false,
    apiVersion: "v3",
    title: "",
    notesSaving: false,
    themeEditor: false,
    lastNote: localStorage.getItem("lastNote")
      ? parseInt(localStorage.getItem("lastNote") as string)
      : null,
    shifting: false,
    version: {
      current: import.meta.env.TPU_VERSION || "N/A",
      date: import.meta.env.TPU_BUILD_DATE || "N/A"
    },
    site: {
      name: "Flowinity",
      maintenance: {
        enabled: false
      }
    } as CoreState,
    weather: {
      loading: true,
      data: {
        description: "Clouds",
        icon: "04d",
        temp: 0,
        temp_max: 0,
        temp_min: 0,
        name: "Australia",
        id: 2643743,
        main: "Clouds",
        humidity: 0,
        pressure: 0,
        feels_like: 0
      } as Weather
    },
    dialogs: {
      deleteItem: {
        value: false,
        item: undefined,
        emit: false
      },
      feedback: false,
      inviteAFriend: false,
      experiments: false,
      nickname: {
        value: false,
        userId: 0
      },
      gold: {
        value: false
      },
      colubrina: false,
      quickSwitcher: false,
      upload: {
        value: false,
        files: [],
        percentage: 0,
        loading: false
      },
      ocr: {
        value: false,
        text: ""
      },
      memoryProfiler: false,
      socketProfiler: false,
      actionDialog: false,
      networkInspector: false,
      createChat: false,
      brandingDebug: false,
      renderMonitor: false
    },
    platform: getPlatform(),
    desktop: {
      updateAvailable: false,
      nagStartup: true,
      version: ""
    }
  }),
  getters: {
    activeNags() {
      const userStore = useUserStore();
      const experimentsStore = useExperimentsStore();
      const iaf = experimentsStore.experiments.IAF_NAG;

      const nags = {
        DOWNLOAD_THE_APP_NAG:
          this.platform === Platform.WEB &&
          (experimentsStore.experiments.DOWNLOAD_THE_APP_NAG === 1
            ? userStore.user?.emailVerified
            : experimentsStore.experiments.DOWNLOAD_THE_APP_NAG === 2) &&
          !vuetify.display.mobile.value,
        EMAIL_VERIFICATION: !userStore.user?.emailVerified && userStore.user,
        ENABLE_AUTOSTART_APP_NAG:
          this.platform !== Platform.WEB &&
          !this.desktop.nagStartup &&
          experimentsStore.experiments.ENABLE_AUTOSTART_APP_NAG === 1,
        IAF_NAG: (iaf === 1 && userStore.user?.emailVerified) || iaf === 2
      };

      return {
        ...nags,
        offset: Object.keys(nags).filter((key) => nags[key]).length * 40,
        IAF_PROMO: iaf !== 5 && iaf !== 0
      };
    },
    weatherTemp(state) {
      const temp = state.weather.data?.temp;
      return this.convertTemp(temp, true);
    },
    weatherUnitText() {
      const user = useUserStore()?.user;
      if (user?.weatherUnit === "kelvin") return "K";
      if (user?.weatherUnit === "fahrenheit") return "°F";
      return "°C";
    }
  },
  actions: {
    convertTemp(temp: number, decimals = false) {
      const user = useUserStore()?.user;
      if (!user?.weatherUnit) return 0;
      if (user?.weatherUnit === "kelvin") {
        return Math.round((temp + 273.15) * 100) / 100;
      } else if (user?.weatherUnit === "fahrenheit") {
        if (decimals) return Math.round((temp * 9) / 5 + 32 * 100) / 100;
        return Math.round((temp * 9) / 5 + 32);
      } else {
        if (decimals) return Math.round(temp * 100) / 100;
        return Math.round(temp);
      }
    },
    async checkForUpdates() {
      if (this.platform !== Platform.LINUX) return;
      const { data } = await ax.get(
        "https://updates.flowinity.com/versions/sorted"
      );

      for (const version of data.items) {
        if (version.channel.name === "stable") {
          if (version.name !== this.desktop.version) {
            this.desktop.updateAvailable = true;
          }
          break;
        }
      }
    },
    async deleteItem(item: Upload | undefined) {
      if (!item) return;
      this.dialogs.deleteItem.item = item;
      await axios().delete("/gallery/" + item.id);
      this.dialogs.deleteItem.value = false;
      this.dialogs.deleteItem.emit = true;
    },
    async getWeather() {
      try {
        const {
          data: { weather }
        } = await useApolloClient().client.query({
          query: WeatherDocument
        });
        this.weather.data = weather;
        this.weather.loading = false;
      } catch {
        //
      }
    },
    loadLocalStorage() {
      const chatStore = useChatStore();
      chatStore.init();
      const userStore = useUserStore();
      const experimentsStore = useExperimentsStore();
      const core = localStorage.getItem("coreStore");
      if (core) {
        try {
          this.site = JSON.parse(core);
          this.domain = "https://" + this.site.domain + "/i/";
          this.loading = false;
        } catch {
          //
        }
      }
      const user = localStorage.getItem("userStore");
      if (user) {
        try {
          userStore.user = JSON.parse(user);
        } catch {
          //
        }
      }
      const tracked = localStorage.getItem("trackedUsersStore");
      if (tracked) {
        try {
          userStore.tracked = JSON.parse(tracked);
        } catch {
          //
        }
      }
      let experiments: any = localStorage.getItem("experimentsStore");
      if (experiments) {
        try {
          experiments = JSON.parse(experiments);
          for (const experiment of experiments) {
            experimentsStore.experiments[experiment.id] = experiment.value;
          }
        } catch {
          //
        }
      }
    },
    postInit() {
      if (this._postInitRan) return;
      this.$app.$socket.on("disconnect", () => {
        this.connected = false;
      });
      this.$app.$socket.on("connect", () => {
        this.connected = true;
      });
      const user = useUserStore();
      setInterval(() => {
        this.getWeather();
      }, 1000 * 60 * 15);
      this._postInitRan = true;
      this.getWeather();
      if (
        user.user?.plan?.internalName === "GOLD" ||
        !this.site.officialInstance
      ) {
        document.body.classList.add("gold");
        user.applyTheme();
      }
      this.setFavicon();
      i18nObject.global.locale.value =
        (user.user?.language as "en" | "en-GB" | "fr" | "ru") || "en";
    },
    setFavicon() {
      const chat = useChatStore();
      const user = useUserStore();
      const experimentsStore = useExperimentsStore();
      const links = document.getElementsByTagName("link");
      //@ts-ignore
      for (const link of links) {
        if (
          link.getAttribute("rel") !== "manifest" &&
          link.getAttribute("rel") !== "stylesheet" &&
          link.getAttribute("rel") !== "preload" &&
          link.getAttribute("rel") !== "modulepreload"
        ) {
          link.remove();
        }
      }
      // set favicon to gold
      const link =
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
        (document.createElement("link") as HTMLLinkElement);
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = `/api/v3/user/favicon.png?cache=${Date.now()}&username=${
        user.user?.username
      }&unread=${chat.totalUnread || 0}&debug=${
        experimentsStore.experiments.DEBUG_FAVICON
      }&client=Flowinity5`;
      document.head.appendChild(link);
    },
    async init() {
      this.loading = true;
      this.loadLocalStorage();
      const chatStore = useChatStore();
      const collectionsStore = useCollectionsStore();
      if (!window.tpuInternals) {
        window.tpuInternals = {
          processLink: chatStore.processLink,
          readChat: chatStore.readChat,
          lookupUser: chatStore.lookupUser,
          setChat: (id) => window._tpu_router.push(`/communications/${id}`),
          lookupChat: chatStore.lookupChat,
          openUser: chatStore.openUser,
          router: window._tpu_router,
          lookupCollection: (id) => {
            return (
              collectionsStore.persistent.find(
                (collection) => collection.id === id
              ) || {
                name: "Unknown Collection"
              }
            );
          },
          openCollection: ((id) =>
            window._tpu_router.push("/collections/" + id)) as (
            id: number
          ) => void,
          pulse: this.$app.$sockets.pulse,
          openEmoji: chatStore.openEmoji
        };
      }
      const {
        data: { coreState, experiments }
      } = await useApolloClient().client.query({
        query: CoreStateDocument,
        fetchPolicy: "no-cache"
      });
      this.site = coreState;
      const userStore = useUserStore();
      userStore.defaultVuetify = vuetify.theme.themes;
      //userStore.applyTheme();
      // userStore.user = currentUser;
      // userStore.tracked = trackedUsers;
      // userStore.blocked = blockedUsers;
      // if (collections) {
      //   collectionsStore.persistent = collections.items;
      // }
      // chatStore.emoji = userEmoji;
      // chatStore.chats = chats
      //   .map((chat) => {
      //     return {
      //       ...chat,
      //       messages: chatStore.chats.find((c) => c.id === chat.id)?.messages
      //     };
      //   })
      //   .sort((a: Chat, b: Chat) => {
      //     return (
      //       Number(b.sortDate) - Number(a.sortDate) ||
      //       Number(b.id) - Number(a.id)
      //     );
      //   });
      this.loading = false;
      const experimentsStore = useExperimentsStore();
      for (const experiment of experiments) {
        experimentsStore.experiments[experiment.id] = experiment.value;
        if (!experimentsStore.experiments["meta"])
          experimentsStore.experiments["meta"] = {};
        experimentsStore.experiments["meta"][experiment.id] = experiment;
      }
      experimentsStore.experimentsInherit = experimentsStore.experiments;
      if (experimentsStore.experiments.WEBMAIL) useMailStore().init();
      this.experimentsInherit = experimentsStore.experiments;
      this.domain = "https://" + this.site.domain + "/i/";
      localStorage.setItem("coreStore", JSON.stringify(coreState));
      localStorage.setItem("experimentsStore", JSON.stringify(experiments));
      await useUserStore().init();
      this.postInit();
      useChatStore().init();
      useCollectionsStore().init();
      useWorkspacesStore().init();
      useFriendsStore().init();
      useUserPresenceStore().getTracked();
    },
    async refresh() {
      const {
        data: { coreState }
      } = await useApolloClient().client.query({
        query: CoreStateDocument,
        fetchPolicy: "no-cache"
      });
      this.site = coreState;
      this.domain = "https://" + this.site.domain + "/i/";
      localStorage.setItem("coreStore", JSON.stringify(coreState));
    },
    async upload() {
      try {
        const toast = useToast();
        if (!this.dialogs.upload.files.length)
          toast.error("No files selected!");
        const formData = new FormData();
        for (const file of this.dialogs.upload.files) {
          formData.append("attachments", file);
        }
        this.dialogs.upload.loading = true;
        const { data } = await axios().post("/gallery/site", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (!progressEvent.total) return;
            this.dialogs.upload.percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          }
        });
        if (this.dialogs.upload.files.length === 1) {
          functions.copy(data[0].url);
          toast.success(
            `Successfully uploaded file and copied ${this.site.name} link to clipboard!`
          );
        } else {
          toast.success("Successfully uploaded files!");
        }
        const collectionsStore = useCollectionsStore();
        if (collectionsStore.selected) {
          await collectionsStore.addToCollection(
            collectionsStore.selected.id,
            data.map((item) => item.upload.id)
          );
        }
        this.dialogs.upload.value = false;
        this.dialogs.upload.files = [];
        this.dialogs.upload.percentage = 0;
        this.dialogs.upload.loading = false;
      } catch (e) {
        console.log(e);
        this.dialogs.upload.percentage = 0;
        this.dialogs.upload.loading = false;
        return e;
      }
    },
    reconnectSocket(token: string) {
      this.$app.$socket.auth = { token };
      this.$app.$sockets.user.auth = { token };
      this.$app.$sockets.chat.auth = { token };
      this.$app.$sockets.autoCollects.auth = { token };
      this.$app.$sockets.friends.auth = { token };
      this.$app.$sockets.gallery.auth = { token };
      this.$app.$sockets.mail.auth = { token };
      this.$app.$sockets.pulse.auth = { token };

      this.$app.$sockets.user.disconnect().connect();
      this.$app.$sockets.chat.disconnect().connect();
      this.$app.$sockets.autoCollects.disconnect().connect();
      this.$app.$sockets.friends.disconnect().connect();
      this.$app.$sockets.gallery.disconnect().connect();
      this.$app.$sockets.mail.disconnect().connect();
      this.$app.$sockets.pulse.disconnect().connect();
      this.$app.$socket.disconnect().connect();
    }
  }
});
