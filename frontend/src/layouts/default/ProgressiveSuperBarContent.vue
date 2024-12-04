<template>
  <div class="justify-between superbar flex flex-col h-full overflow-y-auto">
    <div class="flex flex-col flex-grow overflow-y-auto items-center">
      <div class="flex flex-col gap-y-4">
        <div
          class="flex cursor-pointer select-none pt-0 border-b-2 flowinity-border relative justify-center"
          style="min-height: 64px; max-height: 64px"
        >
          <component
            :is="
              $experiments.experiments.DISABLE_ANIMATIONS
                ? FlowinityLogo
                : FlowinityLogoAnimated
            "
            src="@/"
            :animate="
              $app.componentLoading ||
              $app.loading ||
              !$app.connected ||
              clicked
            "
            alt="Flowinity Logo"
            class="cursor-pointer"
            draggable="false"
            style="width: 40px"
            :color="$app.fluidGradient ? 'background' : 'dark'"
            :fill="
              !$app.connected && $experiments.experiments.DISABLE_ANIMATIONS
                ? '#F44336'
                : 'transparent'
            "
            :key="$experiments.experiments.PRIDE as number"
            @click="
              $router.push('/');
              uiStore.navigationMode = RailMode.HOME;
              clicked = true;
            "
          />
          <v-tooltip activator="parent" location="right">
            <template v-if="!$app.connected">Reconnecting...</template>
            <template v-else-if="$app.componentLoading || $app.loading">
              Loading...
            </template>
            <template v-else>Flowinity</template>
          </v-tooltip>
        </div>

        <super-bar-item
          class="mt-n1"
          :highlighted="true"
          @click="$app.dialogs.quickSwitcher = true"
        >
          <v-tooltip activator="parent" location="right">
            {{ $t("generic.search") }}
          </v-tooltip>
          <RiSearchLine />
        </super-bar-item>
        <super-bar-item :highlighted="true">
          <template #badge>
            <div
              v-if="userStore.unreadNotifications"
              class="absolute z-20 -top-2 right-0 bg-red text-center flex justify-center rounded-full px-1 border-2"
              style="font-size: 9px"
              :style="{
                'border-color': $vuetify.theme.current.colors.background
              }"
            >
              {{ userStore.unreadNotifications }}
            </div>
          </template>
          <v-tooltip activator="parent" location="right">
            {{ $t("core.sidebar.notifications") }}
          </v-tooltip>
          <Notifications location="right" />
          <RiNotificationLine v-if="!userStore.unreadNotifications" />
          <RiNotificationFill v-else />
        </super-bar-item>
        <super-bar-item
          v-if="$experiments.experiments.WEATHER && !$app.weather.loading"
          class="unselectable"
          :highlighted="true"
        >
          <v-tooltip activator="parent" location="right">
            <div class="flex flex-col">
              <p>
                {{ appStore.weather.data?.main }} ({{ $app.weatherTemp
                }}{{ $app.weatherUnitText }})
              </p>
              <small>
                Feels like:
                {{ $app.convertTemp(appStore.weather.data?.feels_like, true)
                }}{{ $app.weatherUnitText }}
              </small>
              <small>Humidity: {{ appStore.weather.data?.humidity }}%</small>
              <small>
                Wind Speed: {{ appStore.weather.data?.wind_speed }} m/s
              </small>
              <small>
                Wind Direction: {{ appStore.weather.data?.wind_deg }}°
              </small>
              <small>Pressure: {{ appStore.weather.data?.pressure }} hPa</small>
              <small>Location: {{ appStore.weather.data?.location }}</small>
            </div>
          </v-tooltip>
          <template #badge>
            <div
              class="absolute z-20 -top-2 right-0 text-center flex justify-center bg-outline-dark rounded-full p-1"
              style="font-size: 9px"
            >
              {{ $app.convertTemp(appStore.weather.data?.temp, false)
              }}{{ $app.weatherUnitText }}
            </div>
          </template>
          <v-img
            :src="`https://openweathermap.org/img/wn/${$app.weather.data?.icon}@2x.png`"
            height="32"
            width="32"
          />
        </super-bar-item>
      </div>
      <div class="border-b-2 mt-3 w-full flowinity-border" />
      <div class="flex flex-col gap-y-2 my-3">
        <super-bar-item-template
          v-for="item in uiStore.navigation.railOptions.filter(
            (opt) =>
              !opt.misc &&
              !opt.fake &&
              (opt.experimentsRequired
                ? $experiments.experiments[opt.experimentsRequired]
                : true)
          )"
          :id="`superbar-${item.id}`"
          :key="item.id"
          :item="item"
        />
      </div>
      <template v-if="experimentsStore.experiments.COMMS_SUPERBAR">
        <div class="divide-outline-dark border flowinity-border w-full" />
        <div class="flex flex-col gap-y-2 my-3">
          <super-bar-item
            v-for="item in chatStore.chats.slice(0, 3)"
            :key="item.id"
            @click="$router.push(`/communications/${item.association.id}`)"
            :badge="item.unread"
          >
            <v-tooltip activator="parent" location="right">
              {{ $chat.chatName(item) }}
            </v-tooltip>
            <user-avatar
              :chat="item.recipient ? null : item"
              :user="item.recipient ? $user.users[item.recipient.id] : null"
              :status="true"
              :dot-status="true"
            />
          </super-bar-item>
          <super-bar-item-template
            v-if="$experiments.experiments.WIDGETS"
            :item="{
              id: RailMode.HOME,
              name: 'Create a shortcut',
              icon: RiAddLine,
              selectedIcon: RiAddLine
            }"
            :highlighted="true"
            id="superbar-widgets"
          />
        </div>
      </template>
    </div>
    <div class="items-center sticky bottom-0">
      <div class="border-b-2 mb-3 w-full flowinity-border" />
      <div class="flex flex-col gap-y-2 items-center">
        <super-bar-item
          v-if="$app.desktop.updateAvailable"
          highlighted
          @click="
            $app.platform === Platform.LINUX ? () => {} : updateDesktopApp()
          "
        >
          <v-tooltip activator="parent" location="right">
            {{
              $app.platform === Platform.LINUX
                ? "Update available in your package manager"
                : "Update ready to install"
            }}
          </v-tooltip>
          <RiDownloadCloud2Fill />
        </super-bar-item>
        <v-btn
          v-if="userStore.user?.subscription?.metadata?.hours"
          color="gold"
          variant="tonal"
          icon
          size="40"
          @click="appStore.dialogs.gold.value = true"
        >
          <v-progress-circular
            color="gold"
            style="font-size: 10px"
            size="40"
            :model-value="calculateJitsi"
          >
            {{
              Math.round($user.user?.subscription?.metadata?.hours * 10) / 10
            }}h
          </v-progress-circular>
          <v-tooltip activator="parent" location="right">
            {{ calculateJitsi }}% ({{
              Math.round($user.user?.subscription?.metadata?.hours * 100) / 100
            }}h/8h)
          </v-tooltip>
        </v-btn>

        <v-btn
          :color="calculateColorQuota"
          variant="tonal"
          icon
          size="40"
          @click="appStore.dialogs.gold.value = true"
        >
          <v-progress-circular
            :color="calculateColorQuota"
            style="font-size: 10px"
            size="40"
            :model-value="calculateQuota"
          >
            {{ calculateQuota }}%
          </v-progress-circular>
          <v-tooltip activator="parent" location="right">
            {{
              $t("core.sidebar.quota", {
                used: functions.fileSize(userStore.user?.quota),
                quota: functions.fileSize(userStore.user?.plan?.quotaMax)
              })
            }}
          </v-tooltip>
        </v-btn>
        <super-bar-item-template
          v-for="item in uiStore.navigation.railOptions.filter(
            (opt) => opt.misc
          )"
          :key="item.id"
          :item="item"
          :highlighted="true"
        />
        <super-bar-item highlighted @click="$app.dialogs.feedback = true">
          <v-tooltip activator="parent" location="right">
            Provide Feedback
          </v-tooltip>
          <RiFeedbackLine />
        </super-bar-item>
        <v-menu location="end">
          <template #activator="{ props }">
            <super-bar-item v-bind="props" class="mb-2">
              <v-tooltip activator="parent" location="right">
                {{ $user.user.username }}
              </v-tooltip>
              <user-avatar
                :user="$user.user"
                :status="true"
                :dot-status="true"
              />
            </super-bar-item>
          </template>
          <status-switcher-list>
            <v-divider />
            <v-list-item :to="`/u/${$user.user.username}`">
              <template #prepend>
                <RiUserLine class="mr-2" style="width: 36px" />
              </template>
              My Profile
            </v-list-item>
            <v-list-item
              v-if="$app.platform !== Platform.WEB"
              style="color: rgb(var(--v-theme-error))"
              @click="resetInstance"
            >
              <template #prepend>
                <RiLogoutCircleLine class="mr-2" style="width: 36px" />
              </template>
              Change Instance
            </v-list-item>
            <v-list-item
              style="color: rgb(var(--v-theme-error))"
              @click="$user.logout"
            >
              <template #prepend>
                <RiLogoutBoxLine class="mr-2" style="width: 36px" />
              </template>
              Logout
            </v-list-item>
          </status-switcher-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Platform, useAppStore } from "@/store/app.store";
import { useProgressiveUIStore, RailMode } from "@/store/progressive.store";
import { useUserStore } from "@/store/user.store";
import { useChatStore } from "@/store/chat.store";
import { useRoute } from "vue-router";
import { useExperimentsStore } from "@/store/experiments.store";
import SuperBarItem from "@/layouts/default/SuperBarItem.vue";
import { computed, ref, watch } from "vue";
import {
  RiFeedbackLine,
  RiLogoutCircleLine,
  RiNotificationFill,
  RiNotificationLine,
  RiSearchLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiAddLine,
  RiDownloadCloud2Fill
} from "@remixicon/vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import FlowinityLogo from "@/components/Brand/FlowinityLogo.vue";
import StatusSwitcherList from "@/components/Communications/StatusSwitcherList.vue";
import FlowinityLogoAnimated from "@/components/Brand/FlowinityLogoAnimated.vue";
import Notifications from "@/components/Core/Notifications.vue";
import SuperBarItemTemplate from "@/layouts/default/SuperBarItemTemplate.vue";
import { IpcChannels } from "@/electron-types/ipc";
import functions from "@/plugins/functions";
const appStore = useAppStore();
const uiStore = useProgressiveUIStore();
const props = defineProps({
  drawer: Boolean
});
const userStore = useUserStore();
const chatStore = useChatStore();
const experimentsStore = useExperimentsStore();
const route = useRoute();

// Animating the logo when clicked
const clicked = ref(false);
const clickedTimeout = ref<undefined | ReturnType<typeof setTimeout>>(
  undefined
);

watch(
  () => clicked.value,
  (value) => {
    if (value) {
      if (clickedTimeout.value) clearTimeout(clickedTimeout.value);
      clickedTimeout.value = setTimeout(() => {
        clicked.value = false;
      }, 100);
    }
  }
);

function resetInstance() {
  window.electron.ipcRenderer.send(IpcChannels.CHANGE_INSTANCE, null);
}

const updateDesktopApp = () => {
  if (appStore.platform === Platform.WEB) return;
  window.electron.ipcRenderer.send(IpcChannels.UPDATE);
};

const calculateQuota = computed(() => {
  if (!userStore.user) return 0;
  return Math.round(
    (userStore.user?.quota / userStore.user?.plan?.quotaMax) * 100
  );
});

const calculateColorQuota = computed(() => {
  if (calculateQuota.value >= 80 && calculateQuota.value < 95) {
    return "warning";
  } else if (calculateQuota.value >= 95) {
    return "error";
  } else {
    return "green";
  }
});

const calculateJitsi = computed(() => {
  return (
    Math.round((userStore.user?.subscription?.metadata?.hours / 8) * 100) || 0
  );
});
</script>
