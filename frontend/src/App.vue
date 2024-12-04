<template>
  <template v-if="slideshow === false">
    <SocketProfiler v-if="$app.dialogs.socketProfiler" />
    <ActionDialog v-if="$app.dialogs.actionDialog" />
    <ExperimentsManagerDialog v-if="$app.dialogs.experiments" />
    <Maintenance
      v-if="$app.site.maintenance.enabled"
      v-model="$app.site.maintenance.enabled"
    />
    <NetworkInspector v-if="$app.dialogs.networkInspector" />
    <BrandingDebug v-if="$app.dialogs.brandingDebug" />
    <router-view />
  </template>
  <template v-else-if="slideshow === true">
    <Slideshow />
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Maintenance from "@/components/Core/Dialogs/Maintenance.vue";
import SocketProfiler from "@/components/Dev/Dialogs/SocketProfiler.vue";
import ActionDialog from "@/components/Dev/Dialogs/ActionDialog.vue";
import ExperimentsManagerDialog from "@/components/Dev/Dialogs/Experiments.vue";
import { Platform } from "@/store/app.store";
import { IpcChannels } from "@/electron-types/ipc";
import Slideshow from "@/views/Slideshow.vue";
import NetworkInspector from "@/components/Dev/Dialogs/NetworkInspector.vue";
import BrandingDebug from "@/components/Dev/Dialogs/BrandingDebug.vue";

export default defineComponent({
  name: "TPUApp",
  components: {
    BrandingDebug,
    NetworkInspector,
    ExperimentsManagerDialog,
    ActionDialog,
    SocketProfiler,
    Maintenance,
    Slideshow
  },
  data: () => {
    return {
      slideshow: undefined as boolean | undefined
    };
  },
  watch: {
    "$route.path"(val) {
      // Reset component loading state if it's still true on route change
      if (this.$app.componentLoading) {
        this.$app.componentLoading = false;
      }
      this.$app.lastRoute = val;
    }
  },
  methods: {
    resetTimer() {
      this.$user.idleTimer = 0;
    }
  },
  mounted() {
    this.slideshow = window.location.pathname.startsWith("/slideshow/");
    if (this.slideshow) {
      return;
    }
    window._tpu_router = this.$router;
    if (this.$vuetify.display.mobile) {
      this.$app.mainDrawer = false;
      this.$chat.memberSidebarShown = false;
    }

    if (this.$app.platform !== Platform.WEB) {
      console.log("Electron detected");
      window.electron.ipcRenderer.on(IpcChannels.OPEN_SETTINGS, () => {
        this.$router.push("/settings/desktop");
      });
      window.electron.ipcRenderer.on(IpcChannels.OPEN_ABOUT, () => {
        this.$router.push("/settings/about");
      });
      window.electron.ipcRenderer.on(IpcChannels.UPDATE_DOWNLOADED, () => {
        this.$app.desktop.updateAvailable = true;
      });
      window.electron.ipcRenderer.on(IpcChannels.FOCUS_CHAT, (_, data) => {
        this.$router.push(`/communications/${data}`);
        window.electron.ipcRenderer.send(IpcChannels.FOCUS_WINDOW);
      });
      window.electron.ipcRenderer
        .invoke("get-version")
        .then((version: string) => {
          this.$app.desktop.version = version;
        });

      if (this.$app.platform === Platform.LINUX) {
        this.$app.checkForUpdates();
        setInterval(() => {
          this.$app.checkForUpdates();
        }, 60000);
      }
    }

    setInterval(() => {
      this.$user.checkIdleState();
    }, 3000);

    // Electron app uses the native idle time instead
    if (this.$app.platform === Platform.WEB) {
      document.onmousemove = this.resetTimer;
      document.onmousedown = this.resetTimer;
      document.ontouchstart = this.resetTimer;
      document.onkeydown = this.resetTimer;
    }
  }
});
</script>
