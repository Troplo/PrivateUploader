<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="750px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      <div class="d-flex align-center">
        Invite a Friend
        <v-chip
          v-if="$app.activeNags.IAF_PROMO"
          color="blue"
          class="ml-2"
          size="small"
          variant="tonal"
        >
          PROMOTION
        </v-chip>
      </div>
    </template>
    <v-card-text>
      <v-alert
        color="blue"
        variant="tonal"
        v-if="$app.activeNags.IAF_PROMO"
        icon="mdi-check-circle"
      >
        <p v-if="!$user.gold">
          By inviting a friend to {{ $app.site.name }}, you will both get a free
          month of
          <span class="gold-text-gradient">Pro</span>
        </p>
        <p v-else class="gold-text-gradient">
          By inviting a friend to {{ $app.site.name }}, you will receive an
          additional free month of
          <span class="gold-text-gradient">Pro</span>
          and your friend will get a free month of
          <span class="gold-text-gradient">Pro</span>
        </p>
        <small>
          You will automatically be granted Flowinity Pro when the user
          registers. It will not auto-renew by default.
        </small>
      </v-alert>
      <p class="mb-2" :class="{ 'mt-2': $app.activeNags.IAF_PROMO }">
        Enter your friend's email to invite them to
        {{ $app.site.name }} instantly!
      </p>
      <v-text-field
        v-model="email"
        :rules="$validation.user.email"
        :autofocus="true"
        label="Email"
        placeholder="troplo@troplo.com"
        required
        type="email"
        @keyup.enter="inviteFriend"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :disabled="!email.length"
        class="rounded-xl"
        color="primary"
        @click="inviteFriend"
      >
        Invite
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  components: { CoreDialog },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      email: ""
    };
  },
  watch: {
    modelValue() {
      this.email = "";
    }
  },
  methods: {
    async inviteFriend() {
      await this.axios.post("/invites", {
        email: this.email
      });
      if (this.$app.activeNags.IAF_NAG) {
        this.$experiments.setExperiment("IAF_NAG", 3);
      }
      this.$emit("update:modelValue", false);
      this.$toast.success("Invitation sent!");
    }
  }
});
</script>
