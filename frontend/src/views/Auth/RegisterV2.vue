<template>
  <v-container
    v-if="$user.user || inviter || $app.site.registrations"
    :fluid="false"
  >
    <component
      v-model:auth="auth"
      :key="step"
      :is="component"
      @next="step++"
      @back="step--"
    />
    <small
      v-if="step >= RegisterSteps.CUSTOMIZE"
      class="mx-4 text-blue"
      @click="
        experimentsStore.setExperiment(
          'REGISTER_INTRO',
          SkipRegisterStepStage.INITIAL_SETUP
        );
        $router.push('/');
      "
    >
      Skip account setup and tutorial
    </small>
    <v-card-actions>
      <v-btn
        v-if="step > RegisterSteps.CUSTOMIZE"
        @click="experimentsStore.setExperiment('REGISTER_INTRO', step - 1)"
        color="primary"
      >
        <v-icon class="mr-2">mdi-chevron-left</v-icon>
        Back
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="step >= RegisterSteps.CUSTOMIZE"
        @click="experimentsStore.setExperiment('REGISTER_INTRO', step + 1)"
        color="primary"
      >
        Next
        <v-icon class="ml-2">mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-container>
  <v-container
    v-else-if="!$app.componentLoading"
    class="center-container"
    :fluid="true"
  >
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="8" xl="5">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
        >
          <p class="text-center text-gradient mb-n5" style="font-size: 64px">
            {{ $app.site?.name || "PrivateUploader" }}
          </p>
          <v-card-text>
            {{ $app.site?.name || "PrivateUploader" }} is not currently
            accepting registrations.
            <br />
            If you'd like to join, you need to be invited by a current member.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useExperimentsStore } from "@/store/experiments.store";
import { useRoute } from "vue-router";
import { useAppStore } from "@/store/app.store";
import axios from "@/plugins/axios";
import FlowinityWelcome from "@/views/Auth/RegisterIntro/FlowinityWelcome.vue";
import PickUsername from "@/views/Auth/RegisterIntro/PickUsername.vue";
import PickLoginCredentials from "@/views/Auth/RegisterIntro/PickLoginCredentials.vue";
import VerifyEmail from "@/views/Auth/RegisterIntro/VerifyEmail.vue";
import {
  RegisterSteps,
  SkipRegisterStepStage
} from "@/views/Auth/registerSteps";
import Customize from "@/views/Auth/RegisterIntro/Customize.vue";
import Profile from "@/views/Auth/RegisterIntro/Profile.vue";
import ClientIntegration from "@/views/Auth/RegisterIntro/ClientIntegration.vue";
import HandoffRedirect from "@/views/Auth/RegisterIntro/HandoffRedirect.vue";

const component = computed(() => {
  switch (step.value) {
    case RegisterSteps.WELCOME:
      return FlowinityWelcome;
    case RegisterSteps.USERNAME:
      return PickUsername;
    case RegisterSteps.LOGIN_CREDS:
      return PickLoginCredentials;
    case RegisterSteps.EMAIL_VERIFY:
      return VerifyEmail;
    case RegisterSteps.CUSTOMIZE:
      return Customize;
    case RegisterSteps.PROFILE:
      return Profile;
    case RegisterSteps.SHAREX:
      return ClientIntegration;
    case RegisterSteps.HANDOFF:
      return HandoffRedirect;
  }
});

const step = ref<RegisterSteps>(RegisterSteps.WELCOME);
const inviter = ref<{
  username: string;
  id: number;
} | null>(null);
const facts = ref<string[]>([]);

export type Auth = {
  username: string;
  email: string;
  password: string;
  inviteKey: string;
};

const auth = ref({
  username: "",
  email: "",
  password: "",
  inviteKey: ""
});
const tempAnimHack = ref(0);

const appStore = useAppStore();
const experimentsStore = useExperimentsStore();
const route = useRoute();

async function getInviteKey() {
  if (route.params.key) {
    appStore.componentLoading = true;
    const { data } = await axios().get(`/invites/${route.params.key}`);
    inviter.value = {
      username: data.user.username,
      id: data.user.id
    };
    facts.value = data.facts;
    appStore.componentLoading = false;
    auth.value.inviteKey = route.params.key as string;
  }
}

onMounted(() => {
  step.value = <RegisterSteps>experimentsStore.experiments.REGISTER_INTRO;
  getInviteKey();
  if (
    !experimentsStore.experiments.REGISTER_V2_LANDING &&
    step.value === RegisterSteps.WELCOME
  ) {
    step.value = RegisterSteps.USERNAME;
  }
});

watch(
  () => experimentsStore.experiments.REGISTER_INTRO,
  (value) => {
    step.value = <RegisterSteps>value;
    // Values over 100 are used to measure when the user skips part of the tutorial
    // in order to improve the registration experience
    if (<RegisterSteps>value >= 100) {
      step.value = RegisterSteps.USERNAME;
    }
  }
);

watch(
  () => experimentsStore.experiments.REGISTER_V2_LANDING,
  (val) => {
    if (!val && step.value === RegisterSteps.WELCOME) {
      step.value = RegisterSteps.USERNAME;
    }
  }
);
</script>
