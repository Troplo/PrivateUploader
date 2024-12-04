<template>
  <DevDialog @close="$app.dialogs.actionDialog = false">
    <template #header>
      <RiCodeFill style="height: 18px" />
      Developer Actions
    </template>
    <v-container>
      <p class="mb-3">You found the secret menu! (CTRL + ALT + M)</p>
      <overline>Common</overline>
      <v-btn @click="$app.dialogs.experiments = !$app.dialogs.experiments">
        Experiments Manager
      </v-btn>
      <v-btn
        @click="$app.dialogs.networkInspector = !$app.dialogs.networkInspector"
      >
        Network Inspector
      </v-btn>
      <v-btn
        @click="$app.dialogs.socketProfiler = !$app.dialogs.socketProfiler"
      >
        Legacy Socket Profiler
      </v-btn>
      <v-btn
        @click="$app.dialogs.memoryProfiler = !$app.dialogs.memoryProfiler"
      >
        Memory Profiler
      </v-btn>
      <v-btn
        @click="
          $chat.dialogs.chatDevOptions.value =
            !$chat.dialogs.chatDevOptions.value
        "
      >
        Chat Dev Options
      </v-btn>
      <v-btn
        @click="
          $router.push('/setup');
          $app.site.finishedSetup = false;
          $app.site.step = 1;
          $nextTick(() => {
            $app.site.step = 0;
          });
        "
      >
        Force Setup
      </v-btn>
      <v-btn
        color="blue"
        variant="tonal"
        @click="$app.dialogs.feedback = !$app.dialogs.feedback"
      >
        Provide Feedback
      </v-btn>
      <overline>All Dialogs</overline>
      <v-btn
        v-for="dialog in Object.keys($app.dialogs).filter(
          (key) => typeof $app.dialogs[key] === 'boolean'
        )"
        :key="dialog"
        @click="$app.dialogs[dialog] = !$app.dialogs[dialog]"
      >
        {{ dialog }}
      </v-btn>

      <v-btn
        v-for="dialog in Object.keys($app.dialogs).filter(
          (key) => typeof $app.dialogs[key] === 'object'
        )"
        :key="dialog"
        @click="$app.dialogs[dialog].value = !$app.dialogs[dialog].value"
      >
        {{ dialog }}
      </v-btn>
      <v-btn
        v-for="dialog in Object.keys($chat.dialogs).filter(
          (key) => typeof $chat.dialogs[key] === 'object'
        )"
        :key="dialog"
        @click="$chat.dialogs[dialog].value = !$chat.dialogs[dialog].value"
      >
        {{ dialog }}
      </v-btn>
      <v-btn
        v-for="dialog in Object.keys($user.dialogs).filter(
          (key) => typeof $user.dialogs[key] === 'object'
        )"
        :key="dialog"
        @click="$user.dialogs[dialog].value = !$user.dialogs[dialog].value"
      >
        {{ dialog }}
      </v-btn>
      <overline>UI Options</overline>
      <v-btn
        @click="
          $experiments.setExperiment(
            'DISABLE_ANIMATIONS',
            $experiments.experiments.DISABLE_ANIMATIONS ? 0 : 1
          )
        "
      >
        {{ $experiments.experiments.DISABLE_ANIMATIONS ? "Enable" : "Disable" }}
        Animations (New UI)
      </v-btn>
      <template v-if="$app.platform !== Platform.WEB">
        <overline>Desktop</overline>
        <v-btn @click="$app.platform = Platform.WEB">Force Web</v-btn>
        <v-btn @click="emitIPCComms">Send IPC New Comms Message</v-btn>
      </template>
      <v-text-field
        class="mt-2"
        v-model="route"
        @keydown.enter="goToRoute"
        label="Go to route"
      ></v-text-field>
      <v-select
        :items="Object.keys(moduleStore.modules)"
        v-model="moduleToLoad"
        label="Load Module"
      />
      <v-btn @click="moduleStore.mount(moduleToLoad as any)">Mount</v-btn>
    </v-container>
  </DevDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import { Platform } from "@/store/app.store";
import { IpcChannels } from "@/electron-types/ipc";
import { RiCodeFill, RiSettings5Fill, RiSettings5Line } from "@remixicon/vue";
import { useModulesStore } from "@/store/modules.store";

export default defineComponent({
  name: "ActionDialog",
  components: {
    RiCodeFill,
    Overline,
    DevDialog
  },
  data() {
    return {
      usage: [],
      route: "",
      moduleToLoad: ""
    };
  },
  computed: {
    moduleStore() {
      return useModulesStore();
    },
    IpcChannels() {
      return IpcChannels;
    },
    Platform() {
      return Platform;
    },
    socketConnections() {
      return [
        {
          name: "Chat",
          connected: this.$sockets.chat.connected,
          readyState: this.$sockets.chat.readyState
        }
      ];
    }
  },
  methods: {
    goToRoute() {
      this.$router.push(this.route);
    },
    emitIPCComms() {
      window.electron.ipcRenderer.send(IpcChannels.NEW_MESSAGE, {
        chat: {
          name: "Direct Message",
          recipient: {
            userId: 1,
            username: "troplo"
          }
        },
        message: {
          content: "Sup"
        },
        instance: {
          notificationIcon:
            "https://dev.privateuploader.gql.troplo.com/i/fd75518264a0.png"
        }
      });
    }
  }
});
</script>
