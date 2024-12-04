<template>
  <v-app-bar
    v-memo="[
      uiStore.currentNavItem?.item?.name,
      uiStore.currentNavItem?.rail[0]?.id,
      expanded,
      image,
      $vuetify.display.mobile,
      uiStore.appBarType,
      uiStore.scrollPosition,
      appBarHeight
    ]"
    id="navbar"
    :key="$app.activeNags.offset"
    :class="classString"
    :extension-height="$app.activeNags.offset"
    app
    class="navbar border-b-2 w-full backdrop-blur-lg top-0 z-50 overflow-clip no-image"
    color="dark"
    :flat="true"
    :floating="true"
    :style="getStyle"
    :height="uiStore.appBarType === 'collapse' ? 0 : appBarHeight"
  >
    <div
      class="flex flex-col w-full"
      :class="{
        'h-full': expanded,
        'has-image': uiStore.appBarImage,
        'image-offset': isOffset
      }"
    >
      <AppBarNags />
      <div
        class="flex p-4 justify-between z-50 w-full"
        :class="{
          'items-center':
            !expanded || (expanded && uiStore.appBarType === 'stick'),
          'items-end h-full': expanded && uiStore.appBarType === 'collapse',
          'image-offset': uiStore.appBarType === 'collapse'
        }"
      >
        <div
          v-if="!$user.user"
          class="bg-dark h-full flex items-center justify-center"
          style="z-index: 999"
        >
          <FlowinityBanner
            v-if="
              experimentsStore.experiments.OFFICIAL_INSTANCE &&
              !$vuetify.display.mobile
            "
            alt="Flowinity Logo"
            @click="
              $router.push('/');
              uiStore.navigationMode = RailMode.HOME;
            "
            class="cursor-pointer"
            draggable="false"
            style="height: 40px; z-index: 9999; width: auto"
          />
          <FlowinityBannerHandler
            @click="$router.push('/')"
            v-else-if="!$vuetify.display.mobile"
          />
        </div>
        <div class="flex select-none">
          <div v-if="$vuetify.display.mobile">
            <v-btn
              v-if="userStore.user"
              color="white"
              :icon="true"
              class="mr-2"
              @click="appStore.mainDrawer = !appStore.mainDrawer"
            >
              <RiMenuLine class="action-bar-item" />
            </v-btn>
          </div>
          <!-- @vue-ignore -->
          <transition-group
            name="slide-up"
            mode="out-in"
            tag="div"
            class="flex"
            v-if="userStore.user"
          >
            <div
              v-for="(rail, index) in items"
              :key="rail.path"
              class="relative overflow-visible whitespace-nowrap items-center flex"
            >
              <div
                class="flex max-sm:hidden app-bar-item items-center"
                :class="{ 'items-center': !expanded, 'items-end': expanded }"
              >
                <RiArrowRightSLine
                  v-if="items.length > 1 && index !== 0"
                  class="w-6 fill-medium-emphasis-dark items-center mr-2"
                />
                <div class="flex items-center flex-grow">
                  <router-link
                    :to="rail.path"
                    class="cursor-pointer flex items-center"
                    @click="
                      !rail?.fake && rail?.id
                        ? (uiStore.navigationMode = rail?.id)
                        : ''
                    "
                  >
                    <component
                      :is="rail?.icon"
                      v-if="rail?.icon"
                      class="w-8"
                      :class="
                        uiStore.currentNavItem?.item?.path === rail.path
                          ? 'fill-white'
                          : 'fill-medium-emphasis-dark'
                      "
                    />
                    <span
                      style="margin: 0 8px 0 8px"
                      :class="
                        uiStore.currentNavItem?.item?.path === rail.path
                          ? 'text-white'
                          : 'text-medium-emphasis-dark'
                      "
                    >
                      {{ rail.name }}
                    </span>
                  </router-link>
                </div>
              </div>
            </div>
          </transition-group>
          <!--        <accessible-transition mode="out-in" name="slide-up" appear>-->
          <!--          <div-->
          <!--            v-if="-->
          <!--              uiStore.currentNavItem?.item?.path !==-->
          <!--              uiStore.currentNavItem?.rail[0]?.path-->
          <!--            "-->
          <!--            :key="-->
          <!--              uiStore.currentNavItem?.item.name +-->
          <!--              uiStore.currentNavItem?.rail[0]?.id-->
          <!--            "-->
          <!--            class="flex items-center"-->
          <!--          >-->
          <!--            <RiArrowRightSLine-->
          <!--              v-if="-->
          <!--                uiStore.currentNavItem?.item?.path !==-->
          <!--                  uiStore.currentNavItem?.rail[0]?.path &&-->
          <!--                uiStore.currentNavItem?.rail?.length-->
          <!--              "-->
          <!--              v-memo="[]"-->
          <!--              class="w-6 fill-medium-emphasis-dark"-->
          <!--              style="margin: 0px 4px 0px 4px"-->
          <!--            />-->
          <!--            <div class="items-center flex">-->
          <!--              <div>-->
          <!--                <component-->
          <!--                  :is="uiStore.currentNavItem?.item.icon"-->
          <!--                  v-if="uiStore.currentNavItem?.item.icon"-->
          <!--                  class="w-8 fill-white"-->
          <!--                />-->
          <!--              </div>-->

          <!--              <div style="padding-left: 8px">-->
          <!--                {{-->
          <!--                  uiStore.currentNavItem?.item.name || route.name || "Flowinity"-->
          <!--                }}-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--        </accessible-transition>-->
        </div>
        <!-- TODO: Meet Action Bar -->
        <div class="flex">
          <accessible-transition mode="out-in" name="slide-up" appear>
            <div
              v-if="appStore.dialogs.upload.loading"
              class="flex gap-2 mr-2"
              :class="{ 'items-center': !expanded, 'items-end': expanded }"
            >
              <v-tooltip activator="parent" location="bottom">
                Uploading
                {{
                  appStore.dialogs.upload.files
                    .map((file: File) => file.name)
                    .join(", ")
                }}
              </v-tooltip>
              <v-progress-circular
                :model-value="appStore.dialogs.upload.percentage"
                size="35"
              >
                <p style="font-size: 9px">
                  {{ appStore.dialogs.upload.percentage }}%
                </p>
              </v-progress-circular>
            </div>
          </accessible-transition>
          <accessible-transition mode="out-in" name="slide-up" appear>
            <div
              v-if="showLoading"
              class="flex gap-2 mr-2"
              :class="{ 'items-center': !expanded, 'items-end': expanded }"
            >
              <v-progress-circular size="24" indeterminate />
            </div>
          </accessible-transition>
          <div
            id="appbar-options-first"
            class="flex gap-2 mr-2"
            :class="{ 'items-center': !expanded, 'items-end': expanded }"
          />
          <div
            id="appbar-options"
            class="flex gap-2 mr-4"
            :class="{ 'items-center': !expanded, 'items-end': expanded }"
          />
          <div id="logged-out-actions">
            <v-btn v-if="!$user.user" color="white" class="mr-2" to="/login">
              {{ $t("generic.login") }}
            </v-btn>
            <v-btn
              v-if="!$user.user"
              color="blue"
              variant="tonal"
              to="/register"
            >
              {{ $t("generic.getStarted") }}
            </v-btn>
          </div>
        </div>
      </div>
      <div id="appbar-under" class="px-4 w-full"></div>
    </div>
  </v-app-bar>
  <teleport to="#main-first" v-if="uiStore.ready && userStore.user">
    <div
      v-if="uiStore.appBarType === 'collapse'"
      id="fake-dom-no-shift"
      :style="{
        height: `${uiStore.appBarHeight - 20}px`,
        width: '100%'
      }"
    />
  </teleport>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import { RailMode, useProgressiveUIStore } from "@/store/progressive.store";
import { useUserStore } from "@/store/user.store";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  StyleValue,
  watch
} from "vue";
import { useRoute } from "vue-router";
import { RiArrowRightSLine, RiMenuLine } from "@remixicon/vue";
import { useDisplay } from "vuetify";
import { useChatStore } from "@/store/chat.store";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import FlowinityBanner from "@/components/Brand/FlowinityBanner.vue";
import { useExperimentsStore } from "@/store/experiments.store";
import { debounce } from "lodash";
import AppBarNags from "@/layouts/default/AppBarNags.vue";
import FlowinityBannerHandler from "@/components/Brand/FlowinityBannerHandler.vue";

const uiStore = useProgressiveUIStore();
const userStore = useUserStore();
const appStore = useAppStore();
const chatStore = useChatStore();

const image = computed(() => {
  return uiStore.appBarImage ? `url(${uiStore.appBarImage})` : undefined;
});

const route = useRoute();
const experimentsStore = useExperimentsStore();
const display = useDisplay();

const classString = computed(() => {
  return {
    "header-patch-progressive":
      (!display.mobile.value && userStore.user) || false
  } as Record<string, boolean>;
});

const showLoading = ref(false);

function showLoadingSpinner() {
  showLoading.value = true;
}

let loadingSpinnerTimeout = undefined;

watch(
  () => appStore.componentLoading,
  () => {
    if (!experimentsStore.experiments.DISABLE_ANIMATIONS) return;
    loadingSpinnerTimeout && clearTimeout(loadingSpinnerTimeout);
    if (appStore.componentLoading) {
      loadingSpinnerTimeout = setTimeout(showLoadingSpinner, 50);
    } else {
      showLoading.value = false;
    }
  }
);

onBeforeUnmount(() => {
  uiStore.appBarReady = false;
  loadingSpinnerTimeout && clearTimeout(loadingSpinnerTimeout);
});

onMounted(async () => {
  await nextTick();
  uiStore.appBarReady = true;
});

const items = computed(() => {
  return [
    ...(uiStore.currentNavItem?.rail || []),
    ...(uiStore.currentNavItem?.item ? [uiStore.currentNavItem.item] : [])
  ];
});

const appBarHeight = computed(() => {
  if (uiStore.appBarType === "stick") {
    return uiStore.appBarHeight + appStore.activeNags.offset;
  }

  if (uiStore.scrollPosition > uiStore.appBarHeight - 105) {
    return 64 + appStore.activeNags.offset;
  }

  return uiStore.appBarHeight + appStore.activeNags.offset;
});
const appBarHeightCSS = computed(() => `${appBarHeight.value}px`);
const expanded = computed(() => appBarHeight.value >= 256);

const getStyle = computed(() => {
  const height = `${appBarHeight.value}px`;
  const position =
    uiStore.appBarType === "stick" ||
    uiStore.scrollPosition >= appBarHeight.value - 100
      ? "fixed !important"
      : "absolute !important";

  return { height, position } as unknown as StyleValue;
});

const isOffset = computed(() => {
  return (
    uiStore.appBarType === "collapse" &&
    uiStore.appBarHeight - 105 <= uiStore.scrollPosition
  );
});

const blur = computed(() => {
  // use scrollPosition to determine how blurred the image should be
  if (!uiStore.appBarImage) return `0px`;
  if (isOffset.value) return `10px`;
  return Math.min(uiStore.scrollPosition / 30, 60) + "px";
});
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.1s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-up-leave-to .app-bar-item {
  position: absolute;
  left: 0;
}

.has-image::before {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    v-bind(image);
  background-size: cover;
  position: absolute;
  top: 0px;
  left: 0px;
  content: "";
  width: 100%;
  height: 256px;
  z-index: -1;
}

.image-offset::before {
  background-position-y: 50%;
}

.image-offset {
  backdrop-filter: blur(v-bind(blur));
}

.has-image,
.no-image {
  transition: min-height 0.2s ease, max-height 0.2s ease;
}

.expanded .v-toolbar__content {
  height: unset !important;
}

#navbar .v-toolbar__content {
  height: v-bind(appBarHeightCSS) !important;
}
</style>
