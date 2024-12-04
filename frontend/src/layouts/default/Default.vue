<template>
  <BlockUserDialog v-model="$user.dialogs.block.value" />
  <DateOfBirthConfirm v-model="$user.dialogs.dateOfBirth.value" />
  <PrivacyPolicyDialog v-if="$user.user?.privacyPolicyAccepted == false" />
  <Connecting
    :model-value="!$app.connected && !$user.loggedOut && !$user.user"
  />
  <WorkspaceDeleteDialog
    v-model="$app.dialogs.deleteItem.value"
    :item="$app.dialogs.deleteItem.item"
    title="Delete item?"
    @submit="$app.deleteItem($app.dialogs.deleteItem.item)"
  />
  <!-- Caused a crash in Slideshows, some globals aren't initialized in that state, so we v-if it -->
  <URLConfirmDialog
    v-if="$chat?.dialogs"
    v-model="$chat.dialogs.externalSite.value"
  />
  <InviteAFriend v-model="$app.dialogs.inviteAFriend" />
  <Feedback v-model="$app.dialogs.feedback" />
  <Gold v-model="$app.dialogs.gold.value" />
  <image-dialog v-model="$chat.dialogs.image.value" />
  <group-settings-dialog v-model="$chat.dialogs.groupSettings.value" />
  <v-app
    v-if="$user.user"
    class="bg"
    @drop="dragDropHandler"
    @dragover="dragOver"
    @touchstart="touchStart($event)"
    @touchend="touchEnd($event)"
    :class="{ dark: $vuetify.theme.current.dark }"
  >
    <NicknameDialog v-model="$app.dialogs.nickname.value" />
    <QuickSwitcher v-model="$app.dialogs.quickSwitcher" />
    <UploadFileV2 v-model="$app.dialogs.upload.value" />
    <RenderMonitor v-if="$app.dialogs.renderMonitor" />
    <MemoryProfiler v-if="$app.dialogs.memoryProfiler" />
    <!-- must be false because if it's undefined, the appbar will render after the state is loaded -->
    <progressive-app-bar v-else-if="$app.site.finishedSetup !== false" />
    <template v-if="!$vuetify.display.mobile">
      <progressive-super-bar v-if="$app.site.finishedSetup !== false" />
      <progressive-side-bar v-if="$app.site.finishedSetup !== false" />
    </template>
    <template v-else>
      <progressive-side-bar-mobile v-if="$app.site.finishedSetup !== false" />
    </template>
    <theme-engine-wrapper />
    <default-view
      :style="{
        'margin-left': !$vuetify.display.mobile ? '16px' : undefined
      }"
    />
  </v-app>
  <v-app v-else>
    <v-overlay :model-value="$app.loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-overlay
      :model-value="$app.componentLoading"
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <!-- must be false because if it's undefined, the appbar will render after the state is loaded -->
    <template
      v-if="$route.name !== 'Slideshow' && $app.site.finishedSetup !== false"
    >
      <progressive-app-bar />
    </template>
    <default-view />
  </v-app>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MessageToast from "@/components/Communications/MessageToast.vue";
import DefaultView from "./View.vue";
import UnauthBar from "@/layouts/unauth/AppBar.vue";
import URLConfirmDialog from "@/components/Communications/Dialogs/URLConfirm.vue";
import MemoryProfiler from "@/components/Dev/Dialogs/MemoryProfiler.vue";
import UploadDialog from "@/components/Core/Dialogs/Upload.vue";
import WorkspaceDeleteDialog from "@/components/Workspaces/Dialogs/Delete.vue";
import QuickSwitcher from "@/components/Core/Dialogs/QuickSwitcher.vue";
import NicknameDialog from "@/components/Core/Dialogs/Nickname.vue";
import ThemeEngineWrapper from "@/components/Core/ThemeEngineWrapper.vue";
import Gold from "@/components/Dashboard/Dialogs/Gold.vue";
import InviteAFriend from "@/components/Dashboard/Dialogs/InviteAFriend.vue";
import Feedback from "@/components/Dashboard/Dialogs/Feedback.vue";
import PrivacyPolicyDialog from "@/components/Core/Dialogs/PrivacyPolicy.vue";
import BlockUserDialog from "@/components/Users/Dialogs/Block.vue";
import NetworkInspector from "@/components/Dev/Dialogs/NetworkInspector.vue";
import DateOfBirthConfirm from "@/components/Users/Dialogs/DateOfBirthConfirm.vue";
import ProgressiveAppBar from "@/layouts/default/ProgressiveAppBar.vue";
import ProgressiveSideBar from "@/layouts/default/ProgressiveSideBar.vue";
import ProgressiveSuperBar from "@/layouts/default/ProgressiveSuperBar.vue";
import Connecting from "@/components/Core/Dialogs/Connecting.vue";
import ImageDialog from "@/components/Communications/Dialogs/ImageDialog.vue";
import GroupSettingsDialog from "@/components/Communications/Dialogs/GroupSettingsV2.vue";
import FlowinityLogoAnimated from "@/components/Brand/FlowinityLogoAnimated.vue";
import UploadFileV2 from "@/components/Gallery/Dialogs/UploadFileV2.vue";
import ProgressiveSideBarMobile from "@/layouts/default/ProgressiveSideBarMobile.vue";
import RenderMonitor from "@/components/Dev/Dialogs/RenderMonitor.vue";

export default defineComponent({
  name: "FlowinityDefaultLayout",
  components: {
    RenderMonitor,
    ProgressiveSideBarMobile,
    UploadFileV2,
    FlowinityLogoAnimated,
    GroupSettingsDialog,
    ImageDialog,
    Connecting,
    ProgressiveSuperBar,
    ProgressiveSideBar,
    ProgressiveAppBar,
    DateOfBirthConfirm,
    NetworkInspector,
    DefaultView,
    UnauthBar,
    URLConfirmDialog,
    MemoryProfiler,
    UploadDialog,
    WorkspaceDeleteDialog,
    QuickSwitcher,
    NicknameDialog,
    ThemeEngineWrapper,
    Gold,
    InviteAFriend,
    Feedback,
    PrivacyPolicyDialog,
    BlockUserDialog
  },
  data() {
    return {
      fab: false,
      pulse: {
        timeOnPage: 0,
        timeOnPageGlobal: 0,
        interval: undefined as ReturnType<typeof setInterval> | undefined,
        id: "",
        lastCreated: undefined as number | undefined
      },
      msgToast: MessageToast,
      touchStartX: null as number | null,
      touchEndX: null as number | null
    };
  },
  computed: {
    currentRailComponent() {
      if (this.$app.railMode === "communications") {
        return "CommsSidebar";
      } else if (this.$app.railMode === "workspaces") {
        return "WorkspacesSidebar";
      } else {
        return "Sidebar";
      }
    }
  },
  watch: {
    "$chat.totalUnread"(val) {
      console.debug(`updating favicon with ${val}`);
      this.$app.setFavicon();
    },
    $route(to, from) {
      if (!this.$user.gold) {
        const goldElements = document.getElementsByClassName("gold");
        while (goldElements.length > 0) {
          goldElements[0].classList.remove("gold");
        }
      }
      this.getPulseSession();
      this.$sockets.pulse.emit("pulse", {
        action: "page-change",
        route: to.path,
        timeSpent: 0,
        device: navigator.platform,
        sysInfo: {
          ua: navigator.userAgent
        },
        name: null,
        other: {
          lastRoute: from.path
        }
      });
    }
  },
  mounted() {
    if (window.location.pathname.startsWith("/slideshow/")) {
      this.$app.componentLoading = false;
      this.$app.loading = false;
      return;
    }
    if (this.$vuetify.display.mobile && this.$app.workspaceDrawer) {
      this.$app.workspaceDrawer = false;
    }
    // watch for CTRL + ALT + M for Memory Profiler
    document.addEventListener("keydown", this.keydownEvent);
    this.getPulseSession();
    this.getPulseSessionGlobal();
  },
  unmounted() {
    document.removeEventListener("keydown", this.keydownEvent);
  },
  methods: {
    touchEnd(event: TouchEvent) {
      if (event.target instanceof Element) {
        if (
          event.target.classList.contains("v-btn") ||
          event.target.classList.contains("v-icon") ||
          event.target.classList.contains("v-slide") ||
          event.target.classList.contains("v-navigation-drawer") ||
          event.target.classList.contains("v-btn__content") ||
          event.target.classList.contains("v-slider-thumb__ripple") ||
          event.target.classList.contains("v-slider-thumb") ||
          event.target.classList.contains("apexcharts-svg") ||
          event.target.classList.contains("v-img__gradient") ||
          event.target.classList.contains("v-img__image") ||
          event.target.classList.contains("v-card-text") ||
          event.target.classList.contains("v-card-title")
        )
          return;
      }
      if (this.$chat.memberSidebarShown || this.$app.mainDrawer) return;
      this.touchEndX = event.changedTouches[0].screenX;
      if (!this.touchStartX || !this.touchEndX) return;
      if (this.touchEndX > this.touchStartX) {
        if (this.touchEndX - this.touchStartX > 130) {
          this.touchStartX = null;
          this.touchEndX = null;
          this.$app.mainDrawer = !this.$app.mainDrawer;
        }
      } else if (this.touchEndX < this.touchStartX) {
        if (this.touchStartX - this.touchEndX > 130) {
          this.touchStartX = null;
          this.touchEndX = null;
          if (this.$chat.isCommunications) {
            this.$chat.memberSidebarShown = true;
          }
        }
      }
    },
    touchStart(event: TouchEvent) {
      this.touchStartX = event.changedTouches[0].screenX;
    },
    getPulseSessionGlobal() {
      const id = Math.random().toString(36).substring(7);
      this.$sockets.pulse.emit("startPulse", {
        type: "global",
        id,
        action: "focus",
        route: this.$route.path,
        device: navigator.platform,
        sysInfo: {
          ua: navigator.userAgent
        },
        name: null,
        other: {
          type: "session"
        }
      });
      this.$sockets.pulse.on("pulseToken-" + id, (res: any) => {
        setInterval(() => {
          if (document.hasFocus()) {
            this.pulse.timeOnPageGlobal += 5000;
            this.$sockets.pulse.emit("updatePulse", {
              id: res.id,
              timeSpent: this.pulse.timeOnPageGlobal
            });
          }
        }, 5000);
      });
    },
    getPulseSession() {
      this.pulse.timeOnPage = 0;
      if (
        this.pulse.lastCreated &&
        this.pulse.lastCreated > Date.now() - 1000
      ) {
        return;
      }
      this.pulse.lastCreated = Date.now();
      clearInterval(this.pulse.interval);
      this.pulse.timeOnPage = 0;
      const id = Math.random().toString(36).substring(7);
      this.$sockets.pulse.emit("startPulse", {
        type: "global",
        id,
        action: "focus",
        route: this.$route.path,
        device: navigator.platform,
        sysInfo: {
          ua: navigator.userAgent
        },
        name: null,
        other: {
          type: "page"
        }
      });
      this.$sockets.pulse.on("pulseToken-" + id, (res: any) => {
        this.pulse.id = res.id;
        this.pulse.interval = setInterval(() => {
          if (document.hasFocus()) {
            this.pulse.timeOnPage += 5000;
            this.$sockets.pulse.emit("updatePulse", {
              id: res.id,
              timeSpent: this.pulse.timeOnPage
            });
          }
        }, 5000);
      });
    },
    dragDropHandler(e: DragEvent) {
      if (
        this.$route.path.startsWith("/communications/") ||
        this.$route.path.startsWith("/workspaces/")
      )
        return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.dataTransfer?.files?.length) return;
      const files = e.dataTransfer?.files;
      if (files) {
        //@ts-ignore
        this.$app.dialogs.upload.files = [...files];
        this.$app.upload();
      }
    },
    dragOver(e: DragEvent) {
      if (
        this.$route.path.startsWith("/communications/") ||
        this.$route.path.startsWith("/workspaces/")
      )
        return;
      e.preventDefault();
      e.stopPropagation();
    },
    keydownEvent(e: KeyboardEvent) {
      if (e.ctrlKey && e.altKey && e.key === "m") {
        e.preventDefault();
        this.$app.dialogs.actionDialog = !this.$app.dialogs.actionDialog;
      } else if ((e.ctrlKey && e.key === "k") || (e.metaKey && e.key === "k")) {
        e.preventDefault();
        this.$app.dialogs.quickSwitcher = !this.$app.dialogs.quickSwitcher;
      } else if (
        e.ctrlKey &&
        e.key === "q" &&
        this.$app.site.release === "dev"
      ) {
        e.preventDefault();
        this.$app.dialogs.experiments = !this.$app.dialogs.experiments;
      }
      if (
        (e.ctrlKey && e.altKey && e.key === "d") ||
        (e.metaKey && e.altKey && e.key === "d")
      ) {
        e.preventDefault();
        console.log("Revert CSS");
        this.$user.applyCSS(true);
      }
      if (e.ctrlKey && e.altKey && e.key === "e") {
        this.$app.themeEditor = !this.$app.themeEditor;
      }
    }
  }
});
</script>

<style scoped>
.fab {
  bottom: 16px;
  right: 16px;
  z-index: 6969;
}

.fab-2 {
  bottom: 76px;
  right: 16px;
  z-index: 6969;
}

.fab-3 {
  bottom: 136px;
  right: 16px;
  z-index: 6969;
}

.fab-4 {
  bottom: 196px;
  right: 16px;
  z-index: 6969;
}
</style>
