<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="400"
  >
    <div class="flex-column d-flex gap-4">
      <v-card class="py-4 px-4 rounded-xl">
        <v-text-field
          v-model="content"
          label="QuickSwitcher"
          autofocus
          @keydown.down.stop="
            selected >= results.length - 1 ? (selected = 0) : selected++
          "
          @keydown.up.stop="
            selected <= 0 ? (selected = results.length - 1) : selected--
          "
          @keydown.enter.prevent.stop="navigate"
          ref="quickInput"
          class="mb-n4"
        />
        <small
          class="text-blue cursor-pointer"
          style="font-size: 9pt; opacity: 0.9"
          @click="showTips = !showTips"
        >
          {{ showTips ? "Hide" : "Show" }} help
        </small>
      </v-card>
      <div key="cards">
        <v-card
          v-for="(result, index) in results"
          :key="result.id"
          class="mt-2"
        >
          <a @click.prevent :href="result.path" class="fill-white">
            <v-card
              padding
              class="d-flex align-center py-2 px-4"
              @click="
                $router.push(result.path);
                $emit('update:modelValue', false);
              "
              :color="
                selected === index
                  ? dark
                    ? amoled
                      ? 'toolbar'
                      : ''
                    : '#d6d6d6'
                  : 'dark'
              "
              @mouseover="selected = index"
            >
              <component
                v-if="result.icon"
                :is="result.icon"
                style="width: 40px"
                class="mr-4"
              />
              <div>
                <p class="text-grey" v-if="result.subtitle">
                  {{ result.subtitle }}
                </p>
                <span>
                  {{ result.name }}
                  <span v-if="result.rawName" class="text-grey">
                    ({{ result.rawName }})
                  </span>
                </span>
              </div>
            </v-card>
          </a>
        </v-card>
      </div>
      <v-card key="tips" class="mt-2 py-4 px-4" v-if="showTips">
        <div class="d-flex justify-space-between">
          <div class="d-flex flex-column">
            <div>
              <div>
                <v-kbd class="mr-2">#</v-kbd>
                <span>Groups</span>
              </div>
              <div>
                <v-kbd class="mr-2">@</v-kbd>
                <span>Direct Messages</span>
              </div>
              <div>
                <v-kbd class="mr-2">&</v-kbd>
                <span>Collections</span>
              </div>
              <div>
                <v-kbd class="mr-2">!</v-kbd>
                <span>Workspaces</span>
              </div>
              <div>
                <v-kbd class="mr-2">↑</v-kbd>
                <span>Move up</span>
              </div>
              <div>
                <v-kbd class="mr-2">↓</v-kbd>
                <span>Move down</span>
              </div>
              <div>
                <v-kbd class="mr-2">↵</v-kbd>
                <span>Open</span>
              </div>
              <div>
                <v-kbd class="mr-2">ESC</v-kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
          <div>
            <v-btn icon @click="showTips = false">
              <v-tooltip location="bottom" activator="parent">
                Close tips
              </v-tooltip>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import {
  computed,
  ComputedRef,
  h,
  markRaw,
  onMounted,
  Ref,
  ref,
  watch
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useChatStore } from "@/store/chat.store";
import { Chat } from "@/gql/graphql";
import functions from "@/plugins/functions";
import { useCollectionsStore } from "@/store/collections.store";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { VIcon, VTextField } from "vuetify/components";
import { useUserStore } from "@/store/user.store";
import { useWorkspacesStore } from "@/store/workspaces.store";
import { useTheme } from "vuetify";
import {
  NavigationOption,
  useProgressiveUIStore
} from "@/store/progressive.store";
import { RiCollageLine } from "@remixicon/vue";

const selected = ref(0);
const props = defineProps({
  modelValue: Boolean
});
const appStore = useAppStore();
const content = ref("");
const emit = defineEmits(["update:modelValue"]);
const chatStore = useChatStore();
const collectionStore = useCollectionsStore();
const workspaceStore = useWorkspacesStore();
const userStore = useUserStore();
const uiStore = useProgressiveUIStore();
const quickInput = ref<InstanceType<typeof VTextField>>(null);
const showTips = ref(localStorage.getItem("quickSwitcherTips") !== "false");
const theme = useTheme();

const dark = computed(() => theme.current.value.dark);
const amoled = computed(() => theme.name.value === "amoled");

interface HistoryItem {
  path: string;
  count: number;
}

const history: Ref<HistoryItem[]> = ref(
  JSON.parse(localStorage.getItem("quickSwitcherHistory") || "[]")
);

const flattenedOptions: ComputedRef<any> = computed(() => {
  return Object.values(uiStore.lookupNav).reduce(
    (acc: NavigationOption[], val: NavigationOption) => {
      if (val.path.startsWith("/communications")) return acc;
      return [
        ...acc,
        {
          name: val.name,
          path: val.path,
          id: val.id,
          subtitle: val.parentPath
            ? uiStore.navigation.railOptions.find(
                (rail) => rail.id === val.rail?.id
              )?.name || uiStore.lookupNav[val.parentPath]?.name
            : val.rail?.name,
          icon: val.icon
        }
      ];
    },
    []
  );
});

const options = computed(() => {
  return [
    ...flattenedOptions.value,
    ...chatStore.chats
      .map((chat) => {
        return {
          name: chatStore.chatName(chat),
          rawName:
            chat.recipient &&
            chatStore.chatName(chat) !==
              userStore.users[chat.recipient.id].username
              ? userStore.users[chat.recipient.id].username
              : null,
          subtitle: chat.recipient ? "Direct Message" : "Group",
          path: `/communications/${chat.association?.id}`,
          id: `chat-${chat.id}`,
          shortCode: chat.recipient ? "@" : "#",
          icon: markRaw(
            h(UserAvatar, {
              chat: chat.recipient ? null : chat,
              user: userStore.users[chat.recipient?.id] || chat.recipient,
              size: 40,
              status: true,
              dotStatus: true
            })
          )
        };
      })
      .sort((a, b) => {
        return a.subtitle === "Direct Message" ? -1 : 1;
      }),
    ...collectionStore.persistent.map((collection) => {
      console.log(`${appStore.domain}${collection.avatar}`);
      return {
        name: collection.name,
        path: `/collections/${collection.id}`,
        id: `collection-${collection.id}`,
        subtitle: "Collection",
        shortCode: "&",
        icon: markRaw(
          collection.avatar
            ? h(UserAvatar, {
                user: {
                  avatar: collection.avatar,
                  username: collection.name
                },
                username: collection.name
              })
            : markRaw(RiCollageLine)
        )
      };
    }),
    ...workspaceStore.items.map((workspace) => {
      return {
        name: workspace.name,
        workspaceId: workspace.id,
        path: `/workspaces/${workspace.id}`,
        id: `workspace-${workspace.id}`,
        subtitle: "Workspace",
        shortCode: "!",
        icon: markRaw(
          h(VIcon, {
            size: 25,
            icon: "mdi-folder-account",
            color: dark.value ? "white" : "black"
          })
        )
      };
    })
  ].sort((a, b) => {
    const aCount = history.value.find((item) => item.path === a.path)?.count;
    const bCount = history.value.find((item) => item.path === b.path)?.count;
    return (bCount || 0) - (aCount || 0);
  });
});

const results = computed(() => {
  const searchString = content.value.toLowerCase();
  const allOptions = [
    ...(!searchString.length
      ? [
          {
            icon: markRaw(
              h(VIcon, {
                size: 25,
                icon: "mdi-arrow-left",
                color: dark.value ? "white" : "black"
              })
            ),

            name: "Go back",
            path: appStore.lastRoute,
            rail: -1,
            subtitle: appStore.lastRoute,
            id: -1
          }
        ]
      : []),
    ...options.value
  ];

  if (!searchString) {
    return allOptions.slice(0, 5);
  }

  return allOptions
    .filter(
      // if starts with shortcode, only match the first character and then after the shortcode match the rest
      (option) => {
        const shortCode = content.value[0];
        if ([`@`, `#`, `&`, `!`].includes(shortCode)) {
          return (
            option.shortCode === shortCode &&
            (option.name.toLowerCase().includes(searchString.slice(1)) ||
              option.rawName?.toLowerCase().includes(searchString.slice(1)) ||
              option.subtitle.toLowerCase().includes(searchString.slice(1)))
          );
        }
        return (
          option.name.toLowerCase().includes(searchString) ||
          option.rawName?.toLowerCase().includes(searchString)
        );
      }
    )
    .slice(0, 5);
});

const route = useRoute();

watch(
  () => route.path,
  (_, val) => {
    appStore.lastRoute = val;
  }
);

watch(
  () => uiStore.currentNavItem,
  (_, val) => {
    if (val?.item?.path && val?.item?._rail !== -1) {
      uiStore.lastRailRoutes[val.item._rail] = val?.item?.path;
      localStorage.setItem(
        "lastRailRoutes",
        JSON.stringify(uiStore.lastRailRoutes)
      );
    }
  }
);

watch(
  () => props.modelValue,
  () => {
    content.value = "";
    selected.value = 0;
  }
);

watch(
  () => content.value,
  () => {
    selected.value = 0;
  }
);

const router = useRouter();
function navigate() {
  const nav = results.value[selected.value];
  if (!nav) return;
  emit("update:modelValue", false);
  if (nav.workspaceId) {
    workspaceStore.selectWorkspace(nav.workspaceId);
    appStore.railMode = "workspaces";
    appStore.workspaceDrawer = true;
  } else if (nav.path) {
    router.push(nav.path);
  }
  history.value = [
    ...history.value.filter((item) => item.path !== nav.path),
    {
      path: nav.path,
      count:
        (history.value.find((item) => item.path === nav.path)?.count || 0) + 1
    }
  ];
}

watch(
  () => history.value,
  () => {
    // max store of 25 by weight
    localStorage.setItem(
      "quickSwitcherHistory",
      JSON.stringify(
        history.value.sort((a, b) => b.count - a.count).slice(0, 25)
      )
    );
  }
);

function onUnhandledKeydown(e) {
  if (!quickInput.value) {
    console.log("QuickSwitcher event listener listening but it's not mounted!");
    return;
  }
  if (
    e.target.tagName !== "INPUT" &&
    e.target.tagName !== "TEXTAREA" &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey &&
    e.key !== "Tab"
  ) {
    const el = quickInput.value.$el;
    const input = el.querySelector(
      "input:not([type=hidden]),textarea:not([type=hidden])"
    );
    input.focus();
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      document.addEventListener("keydown", onUnhandledKeydown);
    } else {
      document.removeEventListener("keydown", onUnhandledKeydown);
    }
  }
);

watch(
  () => showTips.value,
  (val) => {
    localStorage.setItem("quickSwitcherTips", val.toString());
  }
);
</script>

<style scoped>
.quickswitch-move,
.quickswitch-enter-active,
.quickswitch-leave-active {
  transition: all 0.2s;
}

.quickswitch-enter-from,
.quickswitch-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-x-transition-leave-active {
  transform: translatex(-100%);
}
</style>
