<template>
  <v-progress-linear
    v-if="
      $app.dialogs.upload.loading && !$experiments.experiments.PROGRESSIVE_UI
    "
    :model-value="$app.dialogs.upload.percentage"
    color="primary"
  >
    <v-tooltip activator="parent" location="top">
      <span>{{ $app.dialogs.upload.percentage }}%</span>
    </v-tooltip>
  </v-progress-linear>
  <v-alert
    v-if="$app.activeNags.EMAIL_VERIFICATION"
    :icon="false"
    :type="!$user.actions.emailSent.value ? 'error' : 'success'"
    class="rounded-0"
    density="compact"
  >
    <small v-if="!$user.actions.emailSent.value" class="mr-2 unselectable">
      Please verify your email to access all of {{ $app.site.name }}!
    </small>
    <small v-else class="mr-2 unselectable">
      Verification email sent! Please check your email,
      <strong>{{ $user.user?.email }}</strong>
    </small>
    <template #append>
      <v-btn
        class="mr-3"
        :loading="$user.actions.emailSent.loading"
        size="x-small"
        @click="$user.resendVerificationEmail"
      >
        Resend Verification Email
      </v-btn>
    </template>
  </v-alert>
  <v-alert
    v-if="$app.activeNags.DOWNLOAD_THE_APP_NAG"
    variant="tonal"
    :icon="false"
    type="info"
    class="rounded-0"
    color="light-blue"
    density="compact"
  >
    <v-icon size="16" class="mr-1">mdi-download</v-icon>
    <small class="unselectable">
      It's better in the app! Download the brand new desktop app for the best
      {{ $app.site.name }} experience.
    </small>
    <template #append>
      <v-btn
        size="x-small"
        to="/downloads"
        @click="$experiments.setExperiment('DOWNLOAD_THE_APP_NAG', 3)"
      >
        Download now!
      </v-btn>
      <v-icon
        @click="$experiments.setExperiment('DOWNLOAD_THE_APP_NAG', 0)"
        size="16"
        class="ml-3 mr-3"
      >
        mdi-close-circle
      </v-icon>
    </template>
  </v-alert>
  <v-alert
    v-if="$app.activeNags.ENABLE_AUTOSTART_APP_NAG"
    variant="tonal"
    :icon="false"
    type="info"
    color="light-blue"
    class="rounded-0 align-center"
    density="compact"
  >
    <small class="unselectable">
      Never miss a message when {{ $app.site.name }} starts at boot!
    </small>
    <template #append>
      <v-btn size="x-small" @click="enableStartup">Enable now!</v-btn>
      <v-icon
        @click="$experiments.setExperiment('ENABLE_AUTOSTART_APP_NAG', 0)"
        size="16"
        class="ml-3 mr-3"
      >
        mdi-close-circle
      </v-icon>
    </template>
  </v-alert>
  <v-alert
    v-if="$app.activeNags.IAF_NAG"
    variant="tonal"
    type="info"
    color="light-blue"
    class="rounded-0 align-center"
    density="compact"
    :icon="false"
  >
    <v-icon size="16" class="mr-2">mdi-gift</v-icon>
    <small class="unselectable">
      {{
        $user.gold
          ? `Invite a friend to Flowinity today and get another free month of Pro!`
          : `Share the love! Invite a friend to ${$app.site.name} and both get a free month of Pro!`
      }}
    </small>
    <template #append>
      <v-btn
        size="x-small"
        @click="
          $user.gold
            ? ($app.dialogs.inviteAFriend = true)
            : ($app.dialogs.gold.value = true)
        "
      >
        {{ $user.gold ? `Invite a friend!` : `Claim now!` }}
      </v-btn>
      <v-icon
        @click="$experiments.setExperiment('IAF_NAG', 5)"
        size="16"
        class="ml-3 mr-3"
      >
        mdi-close-circle
      </v-icon>
    </template>
  </v-alert>
</template>

<script lang="ts" setup>
import { IpcChannels } from "@/electron-types/ipc";
import { useExperimentsStore } from "@/store/experiments.store";

const experimentsStore = useExperimentsStore();

const enableStartup = () => {
  window.electron.ipcRenderer.send(
    IpcChannels.SET_SETTINGS,
    JSON.stringify({
      startup: true
    })
  );
  experimentsStore.setExperiment("ENABLE_AUTOSTART_APP_NAG", 2);
};
</script>

<style scoped></style>
