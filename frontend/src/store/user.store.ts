// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { useFriendsStore } from "@/store/friends.store";
import { Platform, useAppStore } from "@/store/app.store";
import { useToast } from "vue-toastification";
import vuetify from "@/plugins/vuetify";
import i18n from "@/plugins/i18n";
import functions from "@/plugins/functions";
import { GetUserQuery } from "@/graphql/user/user.graphql";
import {
  UpdateUserMutation,
  UpdateUserStatusMutation
} from "@/graphql/user/update.graphql";
import {
  BlockedUser,
  PartialUserFriend,
  UpdateUserInput,
  User,
  UserStatus,
  UserStoredStatus
} from "@/gql/graphql";
import { ProfileQuery } from "@/graphql/user/profile.graphql";
import { BlockUserMutation } from "@/graphql/user/blockUser.graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { IpcChannels } from "@/electron-types/ipc";
import { useProgressiveUIStore } from "@/store/progressive.store";
import { LogoutMutation } from "@/graphql/user/logout.graphql";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    _postInitRan: false,
    actions: {
      emailSent: {
        value: false,
        loading: false
      }
    },
    dialogs: {
      block: {
        userId: undefined as number | undefined,
        value: false,
        silent: false,
        username: ""
      },
      dateOfBirth: {
        value: false
      }
    },
    defaultVuetify: null as any,
    disableProfileColors:
      localStorage.getItem("disableProfileColors") === "true",
    tracked: [] as PartialUserFriend[],
    blocked: [] as BlockedUser[],
    idleTimer: 0,
    ignoreTab: false,
    loggedOut: true
  }),
  getters: {
    contrast() {
      return functions.contrast(vuetify.theme.current.value.colors.primary);
    },
    theme() {
      return vuetify.theme.current.value;
    },
    gold(state) {
      if (!state.user) return false;
      return state.user.plan?.internalName === "GOLD";
    },
    unreadNotifications(state) {
      if (!state.user) return 0;
      return state.user.notifications.filter((n) => !n.dismissed).length;
    },
    users(): Record<number, PartialUserFriend> {
      return this.tracked.reduce((acc, item) => {
        if (item.id === this.user?.id) {
          acc[item.id] = {
            username: this.user.username,
            status: this.user.storedStatus,
            avatar: this.user.avatar,
            moderator: this.user.moderator,
            administrator: this.user.administrator,
            id: this.user.id,
            createdAt: this.user.createdAt
          };
          return acc;
        }
        acc[item.id] = item;
        return acc;
      }, {});
    }
  },
  actions: {
    async setIdleStateFromIdleTime(idleTime: number) {
      if (idleTime >= 300) {
        if (
          this.user.status !== UserStatus.Idle &&
          this.user.storedStatus !== UserStoredStatus.Idle &&
          this.user.storedStatus !== UserStoredStatus.Busy &&
          this.user.storedStatus !== UserStoredStatus.Invisible
        ) {
          this.user.status = UserStatus.Idle;
          await useApolloClient().client.mutate({
            mutation: UpdateUserStatusMutation,
            variables: {
              input: {
                status: UserStatus.Idle
              }
            },
            fetchPolicy: "no-cache"
          });
        }
      } else if (
        this.user.status === UserStatus.Idle &&
        this.user.storedStatus !== UserStoredStatus.Idle
      ) {
        this.user.status = this.user.storedStatus;
        await useApolloClient().client.mutate({
          mutation: UpdateUserStatusMutation,
          variables: {
            input: {
              status: this.user.storedStatus
            }
          },
          fetchPolicy: "no-cache"
        });
        this.$app.$sockets.user.emit("idleTime", this.idleTimer);
      }
    },
    checkIdleState() {
      if (!this.user) return;
      const appStore = useAppStore();
      if (appStore.platform !== Platform.WEB) {
        window.electron.ipcRenderer
          .invoke(IpcChannels.GET_IDLE_TIME)
          .then(async (idleTime: number) => {
            await this.setIdleStateFromIdleTime(idleTime);
          });
      } else {
        this.idleTimer += 3;
        this.setIdleStateFromIdleTime(this.idleTimer);
      }
    },
    async blockUser() {
      await useApolloClient().client.mutate({
        mutation: BlockUserMutation,
        variables: {
          input: {
            userId: this.dialogs.block.userId,
            silent: this.dialogs.block.silent
          }
        }
      });
      this.dialogs.block.value = false;
      this.dialogs.block.userId = undefined;
      this.dialogs.block.silent = false;
    },
    getStatus(user: Partial<User>) {
      if (user.id === this.user?.id) return this.user?.status;
      const tracked = this.tracked.find((tracked) => tracked.id === user.id);
      if (tracked) return tracked.status;
      return useFriendsStore().friends.find((f) => f.friendId === user.id)?.user
        ?.status;
    },
    async getUser(username?: string, id?: number) {
      const {
        data: { user }
      } = await useApolloClient().client.query({
        query: ProfileQuery,
        fetchPolicy: "network-only",
        variables: {
          input: {
            username,
            id
          }
        }
      });
      return user;
    },
    applyTheme() {
      try {
        const app = useAppStore();
        if (
          this.user?.plan?.internalName !== "GOLD" &&
          app.site.officialInstance
        )
          return;
        const themeData = {
          ...(this.user?.themeEngine?.deviceSync
            ? this?.user?.themeEngine
            : JSON.parse(localStorage.getItem("themeEngine") || "{}"))
        };
        if (themeData.version === 1) {
          this.applyCSS();
          document.body.style.setProperty(
            "--gradient-offset",
            `${themeData.gradientOffset}%`
          );
          for (const theme of Object.entries(themeData.theme)) {
            //@ts-ignore
            theme[1].colors = {
              background: "#121212",
              surface: "#212121",
              "surface-bright": "#ccbfd6",
              "surface-variant": "#a3a3a3",
              "on-surface-variant": "#424242",
              primary: "#0190ea",
              "primary-darken-1": "#3700B3",
              secondary: "#757575",
              "secondary-darken-1": "#03DAC5",
              error: "#F44336",
              info: "#2196F3",
              success: "#4CAF50",
              warning: "#ff9800",
              logo1: "#096fea",
              logo2: "#0166ea",
              accent: "#000000",
              card: "#161616",
              toolbar: "#191919",
              sheet: "#151515",
              text: "#000000",
              dark: "#151515",
              background2: "#121212",
              gold: "#ffd700",
              //@ts-ignore
              ...theme[1].colors
            };
          }
          vuetify.theme.themes.value.dark.colors =
            themeData.theme.dark.colors ??
            vuetify.theme.themes.value.dark.colors;
          vuetify.theme.themes.value.light.colors =
            themeData.theme.light.colors ??
            vuetify.theme.themes.value.light.colors;
          vuetify.theme.themes.value.amoled.colors =
            themeData.theme.amoled.colors ??
            vuetify.theme.themes.value.amoled.colors;

          app.fluidGradient = themeData.fluidGradient;
          if (themeData.fluidGradient) {
            document.body.classList.add("fluid-gradient");
          } else {
            document.body.classList.remove("fluid-gradient");
          }
        } else {
          throw new Error("Invalid theme version");
        }
      } catch (e) {
        console.log(e);
        document.body.style.setProperty("--gradient-offset", "100%");
      }
    },
    primaryColorResult(primaryColor?: string | null, gold?: boolean) {
      if (primaryColor && gold)
        return {
          gradient1: primaryColor,
          gradient2: primaryColor,
          primary: primaryColor
        };
      return gold || this.gold
        ? {
            gradient1: "#ffdb1b",
            gradient2: "#ffd700",
            primary: "#ffd700"
          }
        : {
            gradient1: "#096fea",
            gradient2: "#0166ea",
            primary: "#0190ea"
          };
    },
    async resendVerificationEmail() {
      try {
        const toast = useToast();
        this.actions.emailSent.loading = true;
        const {
          data: { success }
        } = await axios().post("/user/verification/send");
        if (success) {
          this.actions.emailSent.value = true;
          this.actions.emailSent.loading = false;
          toast.success("Verification email sent!");
        } else {
          // the user is assumed to already be verified
          this.user.emailVerified = true;
        }
      } catch {
        this.actions.emailSent.loading = false;
      }
    },
    async logout() {
      const uiStore = useProgressiveUIStore();
      uiStore.loggedInViewReady = false;
      await useApolloClient().client.mutate({
        mutation: LogoutMutation
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userStore");
      localStorage.removeItem("friendsStore");
      localStorage.removeItem("themeEngine");
      this.user = null;
      useAppStore().reconnectSocket("");
      this._postInitRan = false;
      this.loggedOut = true;
      this.$router.push("/");
    },
    async changeStatus(status: UserStoredStatus) {
      if (!this.user) return;
      this.user.status = status;
      this.user.storedStatus = status;
      await this.save();
    },
    async init() {
      const user = localStorage.getItem("userStore");
      if (user) {
        try {
          this.user = JSON.parse(user);
          this.loggedOut = false;
        } catch {
          //
        }
      }
      const {
        data: { currentUser }
      } = await useApolloClient().client.query({
        query: GetUserQuery,
        fetchPolicy: "network-only"
      });
      this.user = currentUser;
      this.loggedOut = !currentUser;
      this._postInitRan = true;
      if (this.user?.themeEngine?.defaults?.prev) {
        delete this.user.themeEngine.defaults?.prev;
      }
      this.applyTheme();
      localStorage.setItem("userStore", JSON.stringify(currentUser));
    },
    applyCSS(emergency: boolean = false) {
      //if (this.user?.plan.internalName !== "GOLD") return;
      if (
        this.user.themeEngine?.customCSS !== undefined &&
        this.user.themeEngine?.customCSS !== null
      ) {
        let style = document.getElementById("user-css");
        if (style?.innerHTML === "") {
          emergency = false;
        }
        if (style) {
          style.remove();
        }
        style = document.createElement("style");
        style.id = "user-css";
        style.innerHTML = emergency ? "" : this.user.themeEngine.customCSS;
        document.head.appendChild(style);
      }
    },
    async save() {
      if (!this.user) return;
      this.applyCSS();
      // prev is undocumented and contains previous Vuetify values causing a memory leak
      if (
        !this.user.themeEngine?.theme?.dark?.colors &&
        this.user.themeEngine?.theme?.dark
      ) {
        this.user.themeEngine.theme.dark.colors =
          this.defaultVuetify.dark.colors;
      }
      if (
        !this.user.themeEngine?.theme?.light?.colors &&
        this.user.themeEngine?.theme?.light
      ) {
        this.user.themeEngine.theme.light.colors =
          this.defaultVuetify.light.colors;
      }
      if (
        !this.user.themeEngine?.theme?.amoled?.colors &&
        this.user.themeEngine?.theme?.amoled
      ) {
        this.user.themeEngine.theme.amoled.colors =
          this.defaultVuetify.amoled.colors;
      }
      await useApolloClient().client.mutate({
        mutation: UpdateUserMutation,
        variables: {
          input: {
            darkTheme: this.user.darkTheme,
            description: this.user.description,
            discordPrecache: this.user.discordPrecache,
            excludedCollections: this.user.excludedCollections,
            insights: this.user.insights,
            itemsPerPage: this.user.itemsPerPage,
            language: this.user.language,
            nameColor: this.user.nameColor,
            privacyPolicyAccepted: this.user.privacyPolicyAccepted,
            profileLayout: this.user.profileLayout,
            publicProfile: this.user.publicProfile,
            storedStatus: this.user.storedStatus,
            username: this.user.username,
            weatherUnit: this.user.weatherUnit,
            themeEngine: this.user.themeEngine?.theme?.amoled?.colors
              ? this.user.themeEngine
              : null,
            pulse: this.user.pulse,
            groupPrivacy: this.user.groupPrivacy,
            friendRequests: this.user.friendRequests
          }
        } as UpdateUserInput
      });
      i18n.global.locale = this.user?.language || "en";
    },
    async savePasswordRequired() {
      // TODO: new GraphQL mutation
    }
  }
});
