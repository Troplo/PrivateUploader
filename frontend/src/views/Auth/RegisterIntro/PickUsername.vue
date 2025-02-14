<template>
  <div>
    <v-card-title
      class="text-[6vw] md:text-[2.5vw] font-bold text-wrap w-full px-4 font-weight-medium"
    >
      Let's start with a username.
    </v-card-title>
    <v-card-subtitle class="text-wrap">
      Your username is unique, and can be used by others to friend you.
    </v-card-subtitle>
    <v-text-field
      v-model="auth.username"
      label="Username"
      class="ma-4"
      :rules="$validation.user.username"
      :error-messages="errors"
      @update:model-value="
        canContinue = false;
        checkUsernameDebounced();
      "
      @keydown.enter="!errors && canContinue ? $emit('next') : () => {}"
      :hint="!errors && canContinue ? 'Username is available' : undefined"
      persistent-hint
    ></v-text-field>
    <v-card-actions>
      <v-spacer />
      <v-btn
        @click="$emit('next')"
        color="primary"
        :disabled="!canContinue"
        :loading="loading"
      >
        Next
        <v-icon class="ml-2">mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Auth } from "@/views/Auth/RegisterV2.vue";
import { useLazyQuery } from "@vue/apollo-composable";
import { CheckUsernameDocument } from "@/gql/graphql";
import { debounce } from "lodash";

const auth = defineModel<Auth>("auth");

defineEmits(["next"]);

const {
  load,
  refetch,
  onResult: onCheckUsernameResult,
  onError: onCheckUsernameError,
  loading
} = useLazyQuery(CheckUsernameDocument, undefined, {
  context: {
    noToast: true
  }
});

const errors = ref<string[] | null>(null);

const canContinue = ref(false);

function check() {
  console.log("Checking username");
  load(
    undefined,
    {
      input: {
        username: auth.value.username
      }
    },
    {
      context: {
        noToast: true
      }
    }
  ) ||
    refetch({
      input: {
        username: auth.value.username
      }
    });
}

const checkUsernameDebounced = debounce(check, 500);

onCheckUsernameResult((result) => {
  if (!result.data?.checkUsername) {
    errors.value = ["Username is already taken"];
    canContinue.value = false;
  } else {
    errors.value = null;
    canContinue.value = true;
  }
});

onCheckUsernameError((e) => {
  canContinue.value = false;
  errors.value = [];
  if (!e.graphQLErrors?.[0]?.extensions?.validationErrors) {
    errors.value.push("An error occurred while checking the username");
    return;
  }
  for (const err of e.graphQLErrors[0].extensions.validationErrors as any[]) {
    errors.value.push(err.message);
  }
});

onMounted(() => {
  if (auth.value.username) check();
});
</script>

<style scoped></style>
