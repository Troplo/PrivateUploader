<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    max-height="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      <v-toolbar-title>Create app</v-toolbar-title>
    </template>
    <v-card-text>
      <v-form class="d-flex flex-column">
        <v-text-field
          v-model="name"
          label="Name"
          outlined
          dense
          required
          :rules="[
            (v) => !!v || 'Name is required',
            (v) => v.length <= 32 || 'Name must be less than 32 characters'
          ]"
        />
        <v-text-field
          v-model="description"
          label="Description"
          outlined
          dense
        />
        <v-text-field
          v-model="icon"
          placeholder="https://i.troplo.com/i/50ba79e4.png"
          label="Icon"
          outlined
          dense
        />
        <v-text-field
          v-model="redirect"
          label="Redirect"
          outlined
          dense
          required
          :rules="[(v) => !!v || 'Redirect is required']"
          placeholder="https://oci3.troplo.com/tpu_callback"
        />
        <v-checkbox
          v-model="private"
          label="Private"
          dense
          required
          persistent-hint
          hint="Private apps can only be used by the owner or manually added users"
        />
        <v-checkbox
          v-if="$user.user?.administrator"
          v-model="verified"
          label="Verified"
          dense
          required
          hint="Only use this for public facing and Flowinity endorsed apps"
          persistent-hint
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('update:modelValue', false)">Cancel</v-btn>
      <v-btn color="primary" :loading="loading" @click="createAppAuth">
        Create
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { CreateOauthAppDocument } from "@/gql/graphql";

export default defineComponent({
  name: "CreateAppAuthDialog",
  components: { CoreDialog },
  props: {
    modelValue: Boolean
  },
  emits: ["update:modelValue", "refresh"],
  data() {
    return {
      name: "",
      description: "",
      icon: "",
      redirect: "",
      private: false,
      verified: false,
      loading: false
    };
  },
  methods: {
    async createAppAuth() {
      try {
        this.loading = true;
        await this.$apollo.mutate({
          mutation: CreateOauthAppDocument,
          variables: {
            input: {
              verified: this.verified,
              redirectUri: this.redirect || undefined,
              private: this.private,
              name: this.name,
              description: this.description
            }
          }
        });
        this.$emit("update:modelValue", false);
        this.$emit("refresh");
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>
