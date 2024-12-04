/**
 * @fileoverview progressive UI store
 * @module store/progressive
 * @description The store for the new "Progressive UI" overhaul features for TPUv4 (TPUv5in4). Manages railbar and sidebar state.
 */

import { defineStore } from "pinia";
import { computed, h, markRaw, Raw, Ref, ref, VNode, watch } from "vue";
import {
  RiAddLine,
  RiAppleFill,
  RiAppleLine,
  RiAuctionFill,
  RiAuctionLine,
  RiBarChartFill,
  RiBug2Fill,
  RiBug2Line,
  RiChat1Fill,
  RiChat1Line,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiCloseLine,
  RiCodeFill,
  RiCodeLine,
  RiCollageFill,
  RiCollageLine,
  RiDashboardFill,
  RiDashboardLine,
  RiDownloadFill,
  RiDownloadLine,
  RiFileTextFill,
  RiFileTextLine,
  RiFlowChart,
  RiFolderImageFill,
  RiFolderImageLine,
  RiGiftFill,
  RiGiftLine,
  RiGlobalLine,
  RiGroup2Fill,
  RiGroup2Line,
  RiGroupFill,
  RiGroupLine,
  RiHome5Fill,
  RiHome5Line,
  RiImage2Fill,
  RiImage2Line,
  RiInformationFill,
  RiInformationLine,
  RiLineChartFill,
  RiLineChartLine,
  RiLink,
  RiLockFill,
  RiLockLine,
  RiMailFill,
  RiMailLine,
  RiMicrosoftFill,
  RiMicrosoftLine,
  RiNewsFill,
  RiNewsLine,
  RiNotificationLine,
  RiPieChartLine,
  RiRefreshFill,
  RiRefreshLine,
  RiSettings5Fill,
  RiSettings5Line,
  RiShieldUserFill,
  RiShieldUserLine,
  RiSlideshow2Fill,
  RiSlideshow2Line,
  RiSparkling2Fill,
  RiSparkling2Line,
  RiStarFill,
  RiStarLine,
  RiSurveyFill,
  RiSurveyLine,
  RiToolsFill,
  RiToolsLine,
  RiUserFill,
  RiUserFollowLine,
  RiUserForbidLine,
  RiUserLine,
  RiUserUnfollowLine,
  RiVideoChatFill,
  RiVideoChatLine
} from "@remixicon/vue";
import { useUserStore } from "@/store/user.store";
import { useRoute } from "vue-router";
import { useChatStore } from "@/store/chat.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { Platform, useAppStore } from "@/store/app.store";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import {
  FriendAction,
  FriendStatus,
  PartialUserBase,
  PartialUserFriend,
  User
} from "@/gql/graphql";
import { useMailStore } from "@/store/mail.store";
import { useFriendsStore } from "@/store/friends.store";
import { VIcon } from "vuetify/components";
import functions from "@/plugins/functions";
import { useTheme } from "vuetify";
import { useCollectionsStore } from "@/store/collections.store";
import { useModulesStore } from "@/store/modules.store";

export enum RailMode {
  HOME,
  GALLERY,
  CHAT,
  WORKSPACES,
  MEET,
  FORMS,
  MAIL,
  ADMIN,
  DEBUG,
  SETTINGS
}

export interface NavigationOption {
  icon: Raw<any>;
  name: string;
  path?: string;
  selectedIcon?: Raw<any>;
  badge?: string;
  misc?: boolean;
  id?: RailMode;
  fake?: boolean;
  allowOverride?: boolean;
  rail?: NavigationOption;
  click?: () => void;
  experimentsRequired?: string[];
  scopesRequired?: string[];
  subtitle?: string;
  menu?: ContextMenuItem[];
  options?: NavigationOption[];
  parentPath?: string;
}

export interface ContextMenuItem {
  name: string;
  icon: Raw<any>;
  action: () => void;
  menu?: ContextMenuItem[];
  color?: string;
  shown?: boolean;
  subtitle?: string;
  append?: VNode;
}

export const useProgressiveUIStore = defineStore("progressive", () => {
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const mailStore = useMailStore();
  const friendStore = useFriendsStore();
  const appStore = useAppStore();
  const drawer = ref(false);
  const appBarReady = ref(false);
  const loggedInViewReady = ref(false);

  const ready = computed(() => {
    return appBarReady.value && loggedInViewReady.value;
  });

  function getParent(itemPath: string) {
    let find: NavigationOption | undefined;
    for (const key in navigation.railOptions.value) {
      const included = navigation.options[key].value?.find(
        (option) => option.path === itemPath
      );
      if (included) {
        find = navigation.railOptions.value.find(
          (option) => option.path === itemPath
        );
        break;
      }
      const findIn = navigation.options[key].value?.find((option) =>
        option.options?.find((o) => o.path === itemPath)
      );
      if (findIn) {
        find = navigation.options[key].value.find(
          (option) => option.path === findIn.path
        );
      }
    }
    return find;
  }

  const lookupNav = computed(() => {
    const pathToOption: Record<string, NavigationOption & { _rail: number }> =
      {};
    // Flatten the navigation options recursively, if it's a sub-option, the parent path for all nav options will be included
    const flattenNavigation = (
      options: NavigationOption[],
      parentPath = ""
    ) => {
      options.forEach((option) => {
        if (option.path) {
          pathToOption[option.path] = {
            ...option,
            // check if only 1 slash
            rail: getParent(option.path),
            _rail: -1,
            parentPath
          };
        }
        if (option.options) {
          flattenNavigation(option.options, option.path || parentPath);
        }
      });
    };
    for (const mode in navigation.options) {
      flattenNavigation(navigation.options[mode].value);
    }
    return pathToOption;
  });
  const navigationMode = ref<RailMode>(
    parseInt(localStorage.getItem("railMode") || "0") ||
      (RailMode.HOME as RailMode as RailMode)
  );
  const modulesStore = useModulesStore();
  const navigation = {
    options: {
      [RailMode.HOME]: computed(() => {
        console.log("HOME - RECOMPUTED");
        return [
          {
            icon: markRaw(RiHome5Line),
            name: "Home",
            path: "/",
            selectedIcon: markRaw(RiHome5Fill)
          },
          {
            icon: markRaw(RiLineChartLine),
            name: "Insights",
            path: "/insights",
            selectedIcon: markRaw(RiLineChartFill),
            scopesRequired: ["insights.view"],
            options: [
              {
                icon: markRaw(RiFlowChart),
                name: "Weekly",
                path: "/insights/weekly"
              },
              {
                icon: markRaw(RiPieChartLine),
                name: "Monthly",
                path: "/insights/monthly"
              },
              {
                icon: markRaw(
                  h(VIcon, {
                    icon: "mdi-chart-gantt",
                    color: userStore.theme.dark ? "white" : "black"
                  })
                ),
                name: "Annually",
                path: "/insights/yearly"
              },
              {
                icon: markRaw(RiBarChartFill),
                name: "Dynamic",
                path: "/insights/dynamic"
              }
            ]
          },
          {
            icon: markRaw(RiGroupLine),
            name: "Users",
            path: "/users",
            selectedIcon: markRaw(RiGroupFill)
          },
          {
            icon: markRaw(RiUserLine),
            name: "My Profile",
            path: `/u/${userStore.user?.username}`,
            selectedIcon: markRaw(RiUserFill),
            allowOverride: true
          },
          {
            icon: markRaw(RiNewsLine),
            name: "News",
            path: "/news",
            selectedIcon: markRaw(RiNewsFill)
          }
        ];
      }),
      [RailMode.GALLERY]: computed(() => {
        console.log("GALLERY - RECOMPUTED");
        return [
          {
            icon: markRaw(RiImage2Line),
            name: "My Gallery",
            path: "/gallery",
            selectedIcon: markRaw(RiImage2Fill),
            scopesRequired: ["gallery.view"]
          },
          {
            icon: markRaw(RiStarLine),
            name: "Starred",
            path: "/starred",
            selectedIcon: markRaw(RiStarFill),
            scopesRequired: ["starred.view"]
          },
          {
            icon: markRaw(RiSparkling2Line),
            name: `AutoCollects`,
            path: "/autoCollect",
            selectedIcon: markRaw(RiSparkling2Fill),
            badge: userStore.user?.pendingAutoCollects || "",
            scopesRequired: ["collections.view"],
            options: [
              {
                icon: markRaw(RiSettings5Line),
                name: "Settings",
                path: "/autoCollect/configure",
                selectedIcon: markRaw(RiSettings5Fill)
              }
            ]
          },
          {
            icon: markRaw(RiSlideshow2Line),
            name: "Slideshows",
            path: "/settings/slideshows",
            selectedIcon: markRaw(RiSlideshow2Fill),
            scopesRequired: ["user.modify"]
          }
        ];
      }),
      [RailMode.CHAT]: computed(() => {
        console.log("CHAT - RECOMPUTED");
        return [
          {
            icon: markRaw(RiGroup2Line),
            name: "Social Hub",
            path: "/social",
            selectedIcon: markRaw(RiGroup2Fill),
            badge: friendStore.incomingFriends.length
              ? friendStore.incomingFriends.length.toLocaleString()
              : undefined,
            scopesRequired: ["user.view"]
          },
          {
            icon: markRaw(RiAddLine),
            name: "Join or Create",
            click: () => {
              appStore.dialogs.createChat = true;
            },
            selectedIcon: markRaw(RiChat1Fill),
            scopesRequired: ["chats.create"]
          },
          ...chatStore.chats
            .map((chat) => ({
              icon: markRaw(
                h(
                  "span",
                  {
                    class: "flex items-center mr-3",
                    style: "height: 40px"
                  },
                  [
                    h(UserAvatar, {
                      chat: chat.recipient ? undefined : chat,
                      user: chat.recipient
                        ? userStore.users[chat.recipient.id]
                        : undefined,
                      size: 40,
                      status: true,
                      dotStatus: true
                    })
                  ]
                )
              ),
              subtitle:
                chat.type === "group"
                  ? `${chat.usersCount} members`
                  : undefined,
              name: chatStore.chatName(chat),
              path: `/communications/${chat.association.id}`,
              badge: chat.unread ? chat.unread.toLocaleString() : undefined
            }))
            .sort((a, b) => {
              const aDate = parseInt(a.sortDate);
              const bDate = parseInt(b.sortDate);
              return bDate - aDate;
            })
        ];
      }),
      [RailMode.WORKSPACES]: computed(() => {
        console.log("WORKSPACES - RECOMPUTED");
        return [
          {
            icon: markRaw(RiFileTextLine),
            name: "Recent",
            path: "/workspaces",
            selectedIcon: markRaw(RiFileTextFill)
          }
        ];
      }),
      [RailMode.SETTINGS]: computed(() => {
        console.log("SETTINGS - RECOMPUTED");
        return [
          {
            icon: markRaw(RiUserLine),
            name: "My Account",
            path: "/settings/dashboard",
            selectedIcon: markRaw(RiUserFill)
          },
          {
            icon: markRaw(RiShieldUserLine),
            name: "Privacy",
            path: "/settings/privacy",
            selectedIcon: markRaw(RiShieldUserFill)
          },
          {
            icon: markRaw(RiLockLine),
            name: "Security",
            path: "/settings/security",
            selectedIcon: markRaw(RiLockFill)
          },
          {
            icon: markRaw(RiToolsLine),
            name: "Setup & Clients",
            path: "/settings/clients",
            selectedIcon: markRaw(RiToolsFill)
          },
          {
            icon: h(VIcon, {
              icon: "add-line"
            }),
            name: "Flowinity Pro",
            path: "/settings/subscriptions",
            selectedIcon: h(VIcon, {
              icon: "add-line"
            })
          },
          {
            icon: markRaw(RiGlobalLine),
            name: "Domains",
            path: "/settings/domains",
            selectedIcon: markRaw(RiGlobalLine)
          },
          {
            icon: markRaw(RiLink),
            name: "Linked Applications",
            path: "/settings/integrations",
            selectedIcon: markRaw(RiLink)
          } /*
              {
                icon: markRaw(RiWebhookLine),
                name: "Webhooks",
                path: "/settings/webhooks",
                selectedIcon: markRaw(RiWebhookFill)
              },*/,
          {
            icon: markRaw(RiCodeLine),
            name: "Developer Portal",
            path: "/settings/developer",
            selectedIcon: markRaw(RiCodeFill)
          },
          ...(appStore.platform !== Platform.WEB
            ? [
                {
                  icon: markRaw(
                    appStore.platform === Platform.WINDOWS
                      ? RiMicrosoftLine
                      : appStore.platform === Platform.MAC
                      ? RiAppleLine
                      : h(VIcon, {
                          icon: "mdi-linux"
                        })
                  ),
                  name: "Desktop Settings",
                  path: "/settings/desktop",
                  selectedIcon: markRaw(
                    appStore.platform === Platform.WINDOWS
                      ? RiMicrosoftFill
                      : appStore.platform === Platform.MAC
                      ? RiAppleFill
                      : h(VIcon, {
                          icon: "mdi-linux"
                        })
                  )
                }
              ]
            : []),
          {
            icon: markRaw(RiInformationLine),
            name: "About",
            path: "/settings/about",
            selectedIcon: markRaw(RiInformationFill)
          }
        ];
      }),
      [RailMode.ADMIN]: computed(() => {
        console.log("ADMIN - RECOMPUTED");
        return [
          {
            icon: null,
            name: `Access Level: ${
              userStore.user?.administrator
                ? "Admin"
                : userStore.user?.moderator
                ? "Moderator"
                : "User"
            }`,
            path: "",
            selectedIcon: null
          },
          {
            icon: markRaw(RiDashboardLine),
            name: "Dashboard",
            path: "/admin/dashboard",
            selectedIcon: markRaw(RiDashboardFill)
          },
          {
            icon: markRaw(RiGroupLine),
            name: "Users",
            path: "/admin/users",
            selectedIcon: markRaw(RiGroupFill)
          },
          {
            icon: markRaw(RiGiftLine),
            name: "Invite a Friend",
            path: "/admin/invites",
            selectedIcon: markRaw(RiGiftFill)
          },
          {
            icon: markRaw(RiGlobalLine),
            name: "Domains",
            path: "/admin/domains",
            selectedIcon: markRaw(RiGlobalLine)
          },
          {
            icon: markRaw(RiRefreshLine),
            name: "Caching",
            path: "/admin/cache",
            selectedIcon: markRaw(RiRefreshFill)
          },
          {
            icon: markRaw(RiChat1Line),
            name: "Communications",
            path: "/admin/communications",
            selectedIcon: markRaw(RiChat1Fill)
          },
          {
            icon: markRaw(RiStarLine),
            name: "Badges",
            path: "/admin/badges",
            selectedIcon: markRaw(RiStarFill)
          },
          {
            icon: markRaw(RiSparkling2Line),
            name: "AutoCollects",
            path: "/admin/autoCollect",
            selectedIcon: markRaw(RiSparkling2Fill)
          },
          {
            icon: markRaw(RiLockLine),
            name: "AppAuth / Developer",
            path: "/admin/oauth",
            selectedIcon: markRaw(RiLockFill)
          }
        ];
      }),
      [RailMode.MAIL]: computed(() => {
        console.log("MAIL - RECOMPUTED");
        return mailStore.mailboxes.map((mailbox) => ({
          icon: markRaw(RiMailLine),
          name: mailbox.name === "INBOX" ? "Inbox" : mailbox.name,
          path: `/mail/${mailbox.path}`,
          selectedIcon: markRaw(RiMailFill),
          badge: mailbox.unread ? mailbox.unread.toLocaleString() : undefined
        }));
      }),
      [RailMode.DEBUG]: computed(() => []),
      [RailMode.MEET]: computed(() => []),
      [RailMode.FORMS]: computed(
        () => modulesStore.modules["FlowForms"].navigationOptions
      )
    },
    miscOptions: {
      [RailMode.HOME]: [
        {
          icon: markRaw(RiGiftLine),
          name: "Invite a Friend",
          path: "",
          selectedIcon: markRaw(RiGiftFill),
          click: () => {
            appStore.dialogs.inviteAFriend = true;
          }
        },
        {
          icon: markRaw(RiDownloadLine),
          name: "Get the App",
          path: "/downloads",
          selectedIcon: markRaw(RiDownloadFill)
        },
        {
          icon: markRaw(RiInformationLine),
          name: "About Flowinity",
          path: "/settings/about",
          selectedIcon: markRaw(RiInformationFill)
        }
      ]
    } as Record<RailMode, NavigationOption[]>,
    railOptions: computed(() => {
      console.log("Recomputing");
      return [
        {
          icon: markRaw(RiDashboardLine),
          name: "Dashboard",
          id: RailMode.HOME,
          path: "/",
          selectedIcon: markRaw(RiDashboardFill)
        },
        {
          icon: markRaw(RiFolderImageLine),
          name: "Files",
          id: RailMode.GALLERY,
          path: "/gallery",
          selectedIcon: markRaw(RiFolderImageFill),
          badge: userStore.user?.pendingAutoCollects || "",
          scopesRequired: ["gallery", "starred", "collections"]
        },
        {
          icon: markRaw(RiChat1Line),
          name: "Comms",
          id: RailMode.CHAT,
          path: "/communications",
          selectedIcon: markRaw(RiChat1Fill),
          badge: chatStore.totalUnread
            ? chatStore.totalUnread.toLocaleString()
            : undefined,
          experimentsRequired: ["COMMUNICATIONS"],
          scopesRequired: ["chats.view"]
        },
        {
          icon: markRaw(RiFileTextLine),
          name: "Workspaces",
          id: RailMode.WORKSPACES,
          path: "/workspaces",
          selectedIcon: markRaw(RiFileTextFill),
          experimentsRequired: ["INTERACTIVE_NOTES"],
          scopesRequired: ["workspaces.view"]
        },
        {
          icon: markRaw(RiVideoChatLine),
          name: "Meet",
          id: RailMode.MEET,
          path: "/meet",
          selectedIcon: markRaw(RiVideoChatFill),
          experimentsRequired: ["MEET"],
          scopesRequired: ["meet.view"]
        },
        {
          icon: markRaw(RiSurveyLine),
          name: "Forms",
          id: RailMode.FORMS,
          path: "/forms",
          selectedIcon: markRaw(RiSurveyFill),
          experimentsRequired: ["SURVEYS"],
          scopesRequired: ["forms.view"]
        },
        {
          icon: markRaw(RiMailLine),
          name: "Mail",
          id: RailMode.MAIL,
          path: "/mail",
          selectedIcon: markRaw(RiMailFill),
          experimentsRequired: ["WEBMAIL"],
          badge: mailStore.unread
            ? mailStore.unread.toLocaleString()
            : undefined,
          scopesRequired: ["mail.view"]
        },
        {
          icon: markRaw(RiAuctionLine),
          name: "Admin",
          id: RailMode.ADMIN,
          path: "/admin",
          selectedIcon: markRaw(RiAuctionFill),
          experimentsRequired: ["ACCOUNT_DEV_ELIGIBLE"],
          scopesRequired: ["*"]
        },
        {
          icon: markRaw(RiBug2Line),
          name: "Debug",
          id: RailMode.DEBUG,
          path: "",
          selectedIcon: markRaw(RiBug2Fill),
          experimentsRequired: ["ACCOUNT_DEV_ELIGIBLE"]
        },
        {
          icon: markRaw(RiSettings5Line),
          name: "Settings",
          id: RailMode.SETTINGS,
          path: "/settings",
          selectedIcon: markRaw(RiSettings5Fill),
          misc: true,
          scopesRequired: ["user.modify"]
        }
      ];
    })
  };

  const shifting = ref(false);

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const experiments = useExperimentsStore();
    if (!experiments.experiments.PROGRESSIVE_UI) return;

    shifting.value = e.shiftKey;

    const eligible = navigation.railOptions.value.filter((rail) => {
      if (rail.fake) return false;
      if (!rail.experimentsRequired) return true;

      return (
        rail.experimentsRequired.every((exp) => experiments.experiments[exp]) &&
        (!rail.scopesRequired ||
          rail.scopesRequired.every((scope) =>
            functions.checkScope(scope, userStore.user?.scopes || "")
          ))
      );
    });

    // Sort eligible rails by id in ascending order
    eligible.sort((a, b) => a.id - b.id);
    const currentIndex = eligible.findIndex(
      (rail) => rail.id === navigationMode.value
    );
    if (e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
      e.preventDefault();
      if (navigationMode.value <= 0) return;
      navigationMode.value = eligible[currentIndex - 1]?.id || 0;
    } else if (e.ctrlKey && e.shiftKey && e.key === "ArrowDown") {
      e.preventDefault();
      if (!eligible[currentIndex + 1]) return;
      navigationMode.value = eligible[currentIndex + 1]?.id || 0;
    }
  });

  document.addEventListener("keyup", (e: KeyboardEvent) => {
    const experiments = useExperimentsStore();
    if (!experiments.experiments.PROGRESSIVE_UI) return;
    if (!shifting.value) return;
    shifting.value = false;
  });

  const currentRail = computed(() => {
    if (!navigationMode.value) return navigation.railOptions.value[0];
    return navigation.railOptions.value.find(
      (rail) => rail.id === navigationMode.value
    );
  });

  watch(
    () => currentRail.value,
    (val) => {
      if (!val) return;
      localStorage.setItem("railMode", val.id.toString());
    }
  );

  const appBarImage: Ref<string | null> = ref(null);
  const appBarHeight = ref<"auto" | "unset" | number>(64);
  const appBarType = ref<"stick" | "collapse">("stick");

  const heightOffset = computed(() => {
    return "h-full";
  });

  const scrollPosition = ref(0);

  const route = useRoute();
  const _currentNavItem = ref<{
    item: NavigationOption & { _rail: number };
    rail: NavigationOption[];
  } | null>(null);

  const currentNavItem = computed({
    get() {
      const lookup = lookupNav.value[route.path];
      if (
        (!lookup || lookup.allowOverride) &&
        _currentNavItem.value?.item?.path === route.path
      )
        return _currentNavItem.value;
      if (!lookup) {
        console.warn(
          "[Flowinity/Nav] No automatic navigation option found for",
          route.path + ", this can have unintended consequences."
        );
        return null;
      }
      // include parentPath recursively so that all parents are in the one array
      const parents = (path: string) => {
        const parent = lookupNav.value[path];
        if (!parent) return [];
        return [parent, ...parents(parent.parentPath || "")];
      };
      const rail = parents(lookup.parentPath || "");
      return {
        item: lookup,
        rail
      };
    },
    /**
     * @deprecated Do not set the currentNavItem directly, they should be added to the navigation options instead if possible.
     */
    set(val) {
      _currentNavItem.value = val;
    }
  });

  document.addEventListener("scroll", (ev) => {
    scrollPosition.value = Math.ceil(window.scrollY);
  });

  function userRail(
    user: User | PartialUserBase | PartialUserFriend | number | string
  ) {
    if (typeof user === "number") {
      const userStore = useUserStore();
      user = userStore.users[user];
    } else if (typeof user === "string") {
      const userStore = useUserStore();
      user = userStore.tracked.find((u) => u.username === user);
    }
    return {
      name: user?.username,
      icon: h(UserAvatar, {
        user,
        size: 30,
        class: "ml-1"
      }),
      path: `/u/${user?.username}`
    };
  }

  const _activeContextMenu = ref({
    menu: [] as ContextMenuItem[],
    x: 0,
    y: 0,
    show: false
  });

  const activeContextMenu = computed({
    get() {
      const filterMenu = (menu: ContextMenuItem[]) => {
        return menu.filter((item) => {
          if (item.shown === undefined || item.shown) {
            if (item.menu?.length) {
              const filtered = filterMenu(item.menu);
              if (filtered.length !== item.menu.length) {
                item.menu = filterMenu(item.menu);
              }
            }
            return true;
          }
          return false;
        });
      };
      return {
        ..._activeContextMenu.value,
        menu: filterMenu(_activeContextMenu.value.menu)
      };
    },
    set(val) {
      _activeContextMenu.value = val;
    }
  });

  const lastRailRoutes = ref<Record<RailMode, string>>(
    localStorage.getItem("lastRailRoutes")
      ? JSON.parse(localStorage.getItem("lastRailRoutes")!)
      : {}
  );

  return {
    drawer,
    navigation,
    appBarImage,
    heightOffset,
    scrollPosition,
    currentNavItem,
    _currentNavItem,
    currentRail,
    shifting,
    lookupNav,
    userRail,
    ready,
    navigationMode,
    activeContextMenu,
    _activeContextMenu,
    lastRailRoutes,
    appBarHeight,
    appBarType,
    loggedInViewReady,
    appBarReady
  };
});
