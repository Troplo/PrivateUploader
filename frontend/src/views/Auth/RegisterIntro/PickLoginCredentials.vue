<template>
  <div>
    <v-card-title
      class="text-[6vw] md:text-[2.5vw] font-bold text-wrap w-full px-4 font-weight-medium"
    >
      Hey, {{ auth.username }}!
    </v-card-title>
    <v-card-subtitle class="text-wrap">
      To keep your account secure, we'll need your email address and a password.
    </v-card-subtitle>
    <v-form v-model="canContinue" @submit="register">
      <v-text-field
        v-model="auth.email"
        label="Email"
        class="ma-4"
        :rules="$validation.user.email"
        :error-messages="errors"
        persistent-hint
        hint="You will be sent a verification email"
      ></v-text-field>
      <v-text-field
        v-model="auth.password"
        label="Password"
        type="password"
        class="ma-4"
        :rules="$validation.user.password"
      ></v-text-field>
      <v-text-field
        v-model="confirmPassword"
        label="Confirm Password"
        type="password"
        class="ma-4"
        :rules="[...$validation.user.password, ...validation]"
      ></v-text-field>
      <div class="d-flex mt-n6 mx-2">
        <v-checkbox v-model="terms" class="flex-0 flex-grow-0" />
        <span
          class="ml-4 mt-4 flex-grow-1 unselectable pointer"
          @click="terms = !terms"
        >
          <span>I agree to the</span>
          <a
            target="_blank"
            style="text-decoration: none; color: #0190ea"
            href="/policies/content"
          >
            Content Policy
            <v-icon size="16">mdi-open-in-new</v-icon>
          </a>
          and the
          <a
            target="_blank"
            style="text-decoration: none; color: #0190ea"
            href="/policies/privacy"
          >
            Privacy Policy
            <v-icon size="16">mdi-open-in-new</v-icon>
          </a>
        </span>
      </div>
    </v-form>
    <v-card-actions>
      <v-btn
        class="mx-2"
        color="primary"
        variant="tonal"
        :loading="loading"
        @click="emit('back')"
      >
        <v-icon class="mr-2">mdi-chevron-left</v-icon>
        Back
      </v-btn>
      <v-spacer />
      <v-btn
        class="mx-2"
        color="primary"
        :disabled="!canContinue || !terms"
        variant="tonal"
        :loading="loading"
        @click="register"
      >
        Register
        <v-icon class="ml-2">mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Auth } from "@/views/Auth/RegisterV2.vue";
import axios from "@/plugins/axios";
import { useAppStore } from "@/store/app.store";
import { useUserStore } from "@/store/user.store";
import { useExperimentsStore } from "@/store/experiments.store";
import { RegisterSteps } from "@/views/Auth/registerSteps";

const auth = defineModel<Auth>("auth");

const terms = ref(false);

const confirmPassword = ref("");
const loading = ref(false);
const validation = [
  (value: string) => {
    if (value !== auth.value.password) return "Passwords do not match";
    return true;
  }
];

const emit = defineEmits(["next", "back"]);

const errors = ref<string[] | null>(null);

const canContinue = ref(false);

const appStore = useAppStore();
const userStore = useUserStore();
const experimentsStore = useExperimentsStore();

async function register() {
  if (!terms.value) return;
  loading.value = true;
  try {
    const { data } = await axios().post("/auth/register", {
      email: auth.value.email,
      username: auth.value.username,
      password: auth.value.password,
      inviteKey: auth.value.inviteKey
    });
    localStorage.setItem("token", data.token);
    appStore.token = data.token;
    userStore.loggedOut = false;
    await appStore.init();
    appStore.reconnectSocket(data.token);
    userStore.resendVerificationEmail();
    experimentsStore.setExperiment(
      "REGISTER_INTRO",
      RegisterSteps.EMAIL_VERIFY
    );
    emit("next");
  } catch {
    this.loading = false;
  }
}
</script>

<style scoped></style>
