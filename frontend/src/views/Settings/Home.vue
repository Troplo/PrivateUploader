<template>
  <div v-if="userStore.user">
    <v-card-title>{{ t("settings.home.myAccount.title") }}</v-card-title>
    <v-expansion-panels class="px-4">
      <v-expansion-panel :title="t('settings.home.myAccount.changeUsername')">
        <v-expansion-panel-text>
          <v-form v-model="valid.username">
            <v-text-field
              v-model="username.username"
              :label="t('settings.home.myAccount.username')"
              :rules="$validation.user.username"
              class="mt-4"
            />
            <DangerZoneInput
              v-model:password="username.password"
              v-model:password-mode="username.passwordMode"
              v-model:totp="username.totp"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!valid.username"
                color="primary"
                @click="changeUsername"
              >
                {{ t("generic.update") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :title="t('settings.home.myAccount.changePassword')">
        <v-expansion-panel-text>
          <v-form v-model="valid.password">
            <danger-zone-input
              v-model:password="password.password"
              v-model:totp="password.totp"
              :both="true"
            ></danger-zone-input>
            <v-text-field
              v-model="password.newPassword"
              :label="t('settings.home.myAccount.newPassword')"
              class="mt-4"
              type="password"
            />
            <v-text-field
              v-model="password.confirmNewPassword"
              :label="t('settings.home.myAccount.confirmPassword')"
              :rules="[...$validation.user.passwordSettings]"
              class="mt-4"
              type="password"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!valid.password"
                color="primary"
                @click="changePassword()"
              >
                {{ t("generic.update") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :title="t('settings.home.myAccount.changeEmail')">
        <v-expansion-panel-text>
          <v-form v-model="valid.email">
            <v-text-field
              v-model="email.email"
              :label="t('settings.home.myAccount.email')"
              :rules="$validation.user.email"
              class="mt-4"
            />
            <DangerZoneInput
              v-model:password="email.password"
              v-model:password-mode="email.passwordMode"
              v-model:totp="email.totp"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!valid.username"
                color="primary"
                @click="changeEmail"
              >
                {{ t("generic.update") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title class="bg-card">
          {{ t("settings.home.myAccount.2fa") }}
          <v-chip
            v-if="userStore.user?.totpEnable"
            class="ml-2"
            color="green"
            label
            size="small"
          >
            {{ t("generic.enabled") }}
          </v-chip>
          <v-chip v-else class="ml-2" color="error" label size="small">
            {{ t("generic.disabled") }}
          </v-chip>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <TwoFactor />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel class="text-red v-card--variant-tonal">
        <span class="v-card__underlay"></span>
        <v-expansion-panel-title>
          {{ t("settings.home.deleteAccount.title") }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card-text style="white-space: pre-line">
            {{ t("settings.home.deleteAccount.description") }}
          </v-card-text>
          <delete-account v-model="deletion.deletionDialog" />
          <v-card-actions>
            <v-btn
              color="red"
              variant="tonal"
              @click="deletion.deletionDialog = true"
            >
              {{ t("settings.home.deleteAccount.delete") }}
            </v-btn>
            <danger-zone-dialog :require-both="true" @confirm="deleteGallery">
              <template #title>
                {{ t("settings.home.deleteAccount.purgeGallery") }}
              </template>
              <template #content>
                {{ t("settings.home.deleteAccount.purgeText") }}
              </template>
              <template #default="{ toggle }">
                <v-btn
                  color="red"
                  :loading="deletion.deleting"
                  variant="tonal"
                  @click="toggle()"
                >
                  {{ t("settings.home.deleteAccount.purgeGallery") }}
                </v-btn>
              </template>
              <template #actions="{ confirm }">
                <v-btn
                  color="red"
                  :loading="deletion.purging"
                  @click="confirm()"
                >
                  {{ t("settings.home.deleteAccount.purgeGallery") }}
                </v-btn>
              </template>
            </danger-zone-dialog>
          </v-card-actions>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-title>{{ t("settings.home.preferences.title") }}</v-card-title>
    <v-slider
      v-model="userStore.user.itemsPerPage"
      :label="t('settings.home.preferences.itemsPerPage')"
      class="px-4"
      max="72"
      min="12"
      step="12"
      thumb-label
      @update:model-value="$emit('update')"
    />
    <v-select
      v-model="userStore.user.language"
      :items="languages"
      :label="t('settings.home.preferences.language')"
      class="px-6"
      item-title="title"
      item-value="key"
      @update:model-value="$emit('update')"
    />
    <tpu-switch
      :model-value="!disableProfileColors"
      :label="t('settings.home.preferences.disableProfileColors')"
      class="px-6"
      @update:model-value="disableProfileColors = !$event"
    />
    <tpu-switch
      :model-value="!$experiments.experiments.DISABLE_ANIMATIONS"
      :label="t('settings.home.preferences.animations')"
      class="px-6"
      @update:model-value="
        $experiments.setExperiment('DISABLE_ANIMATIONS', $event ? 0 : 1)
      "
    />
    <v-select
      v-model="theme"
      :items="themes"
      :label="t('settings.home.preferences.theme')"
      class="px-6"
      item-title="title"
      item-value="value"
      @update:model-value="$emit('update')"
    />
    <PrideSelector class="px-6" />
    <!-- select between Farenheit, Celsius or Kelvin -->
    <tpu-switch
      :model-value="!!$experiments.experiments.WEATHER"
      :label="t('settings.home.preferences.weather')"
      class="px-6"
      @update:model-value="
        $experiments.setExperiment('WEATHER', $event ? 1 : 0)
      "
    />
    <v-select
      v-model="userStore.user.weatherUnit"
      :items="temperatureUnits"
      :label="t('settings.home.preferences.tempUnit')"
      class="px-6"
      item-title="title"
      item-value="value"
      :disabled="!$experiments.experiments.WEATHER"
      @update:model-value="$emit('update')"
    />
    <tpu-switch
      :model-value="volume === 0"
      label="Mute Notifications"
      class="px-6"
      @update:model-value="volume = $event ? 0 : 100"
    />
    <v-select
      v-model="$experiments.experiments['NOTIFICATION_SOUND']"
      :items="notificationSounds"
      class="px-6"
      item-title="title"
      item-value="key"
      label="Notification Sound"
      :disabled="volume === 0"
    />
    <v-slider
      v-model="volume"
      label="Notification Volume"
      thumb-label
      class="px-4"
    >
      <template #append>
        <v-icon>
          {{
            volume > 70
              ? "volume-up-line"
              : volume > 0
              ? "volume-down-line"
              : "volume-mute-line"
          }}
        </v-icon>
      </template>
      <template #thumb-label>{{ volume.toFixed(2) }}%</template>
    </v-slider>
    <v-autocomplete
      v-model="userStore.user.excludedCollections"
      :items="collections"
      :label="t('settings.home.preferences.baseCollections')"
      chips
      class="px-6"
      closable-chips
      color="primary"
      item-title="name"
      item-value="id"
      multiple
      variant="underlined"
      @update:model-value="$emit('update')"
    />
    <v-btn
      v-if="userStore.gold || !$app.site.officialInstance"
      class="mb-2 ml-5"
      @click="$app.themeEditor = !$app.themeEditor"
    >
      <v-icon class="mr-2">mdi-palette</v-icon>
      <span>
        {{ t("settings.home.preferences.themeEditor") }}
        <v-chip size="x-small" class="ml-1">{{ t("generic.beta") }}</v-chip>
      </span>
    </v-btn>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useTheme } from "vuetify";
import TwoFactor from "@/components/Settings/TwoFactor.vue";
import DangerZoneInput from "@/components/Core/DangerZoneInput.vue";
import DangerZoneDialog from "@/components/Core/DangerZoneDialog.vue";
import DeleteAccount from "@/components/Users/Dialogs/DeleteAccount.vue";
import PrideSelector from "@/components/Settings/PrideSelector.vue";
import {
  ChangeUserEmailDocument,
  ChangeUserPasswordDocument,
  ChangeUsernameDocument,
  DeleteGalleryDocument,
  UserInsights,
  LightCollectionsDocument,
  LightCollectionsQuery
} from "@/gql/graphql";
import { useUserStore } from "@/store/user.store";
import { useApolloClient } from "@vue/apollo-composable";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

// Emits
defineEmits(["update"]);

const apolloClient = useApolloClient();
const toast = useToast();
const userStore = useUserStore();
const { t } = useI18n();
const router = useRouter();
// Theme setup
const theme = useTheme();
const themeName = ref(theme.global.name.value);

// Toggles the theme
function toggleTheme(themeName: string) {
  localStorage.setItem("theme", themeName);
  theme.global.name.value = themeName;
}

// Volume, email, password, username, and other refs
const volume = ref(100);
const email = ref({
  password: "",
  totp: "",
  email: "",
  passwordMode: false
});

const password = ref({
  confirmNewPassword: "",
  newPassword: "",
  password: "",
  totp: ""
});

const username = ref({
  username: "",
  password: "",
  totp: "",
  passwordMode: false
});

const collections = ref<LightCollectionsQuery["collections"]["items"]>([]);
const notificationSounds = ref([
  { title: "Default", key: 2 },
  { title: "KDE", key: 3 }
]);

const languages = ref([
  { title: "English (United States)", key: "en" },
  { title: "English (United Kingdom)", key: "en-GB" },
  { title: "Русский (Россия)", key: "ru" },
  { title: "French", key: "fr" }
]);

const themes = ref([
  { title: "Light", value: "light" },
  { title: "Dark", value: "dark" },
  { title: "AMOLED", value: "amoled" }
]);

const temperatureUnits = ref([
  { title: "Celsius (Metric)", value: "celsius" },
  { title: "Kelvin (Metric Standard)", value: "kelvin" },
  { title: "Fahrenheit (Imperial)", value: "fahrenheit" }
]);

const insights = ref([
  { title: "Everyone", value: UserInsights.Everyone },
  { title: "Friends", value: UserInsights.Friends },
  { title: "Nobody", value: UserInsights.Nobody }
]);

const confirmPassword = ref("");
const valid = ref({
  password: true,
  username: true,
  email: true
});

const deletion = ref({
  deleting: false,
  purging: false,
  deletionDialog: false
});

// Computed properties
const disableProfileColors = computed({
  get() {
    try {
      return JSON.parse(localStorage.getItem("disableProfileColors")!);
    } catch {
      return false;
    }
  },
  set(val: boolean) {
    localStorage.setItem("disableProfileColors", JSON.stringify(val));
  }
});

const disableBatterySave = computed({
  get() {
    try {
      return JSON.parse(localStorage.getItem("disableBatterySave")!);
    } catch {
      return false;
    }
  },
  set(val: boolean) {
    localStorage.setItem("disableBatterySave", JSON.stringify(val));
  }
});

// Watchers
watch(volume, function (newVal) {
  localStorage.setItem("volume", String(newVal));
});

watch(themeName, function (newTheme) {
  toggleTheme(newTheme);
});

// Lifecycle hook for mounted logic
onMounted(async function () {
  document.title = "Settings";
  const {
    data: {
      collections: { items }
    }
  } = await apolloClient.client.query({
    query: LightCollectionsDocument,
    variables: {
      input: {
        limit: 99999
      }
    }
  });
  collections.value = items;
  volume.value = this.$chat.volume * 100;
});

async function changeEmail() {
  await apolloClient.client.mutate({
    mutation: ChangeUserEmailDocument,
    variables: {
      input: {
        email: email.value.email,
        password: email.value.passwordMode ? email.value.password : undefined,
        totp: email.value.passwordMode ? undefined : email.value.totp
      }
    }
  });
  this.userStore.user.email = email.value.email;
  this.userStore.user.emailVerified = false;
  toast.success("Your email has been updated!");
}

async function changePassword() {
  if (password.value.newPassword !== password.value.confirmNewPassword) {
    return toast.error("Password doesn't match.");
  }
  await apolloClient.client.mutate({
    mutation: ChangeUserPasswordDocument,
    variables: {
      input: {
        newPassword: password.value.newPassword,
        currentPassword: password.value.password,
        totp: password.value.totp
      }
    }
  });
  toast.success("Your password has been updated!");
}

async function changeUsername() {
  await apolloClient.client.mutate({
    mutation: ChangeUsernameDocument,
    variables: {
      input: {
        username: username.value.username,
        password: username.value.passwordMode
          ? username.value.password
          : undefined,
        totp: username.value.passwordMode ? undefined : username.value.totp
      }
    }
  });
  toast.success("Your username has been updated!");
}

async function deleteGallery(dangerZone: { password: string; totp: string }) {
  deletion.value.purging = true;
  try {
    await apolloClient.client.mutate({
      mutation: DeleteGalleryDocument,
      variables: {
        input: {
          password: dangerZone.password,
          totp: dangerZone.totp
        }
      }
    });
    toast.success("Your gallery has been purged.");
    return router.push("/");
  } finally {
    deletion.value.purging = false;
  }
}
</script>
