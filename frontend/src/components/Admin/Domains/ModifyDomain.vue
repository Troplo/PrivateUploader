<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{ $t(`settings.domains.dialog.${type}`) }}
    </template>
    <v-card-text v-if="update">
      <v-text-field
        v-model="update.domain"
        :autofocus="true"
        :label="$t('settings.domains.dialog.domain')"
        required
        @keydown.enter="updateDomain"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue darken-1" @click="$emit('update:modelValue', false)">
        {{ $t("generic.cancel") }}
      </v-btn>
      <v-btn :loading="loading" color="blue darken-1" @click="updateDomain">
        {{ $t(`settings.domains.dialog.${type}`) }}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { Domain } from "@/models/domain";

export default defineComponent({
  name: "ModifyDomainDialog",
  components: { CoreDialog },
  props: ["modelValue", "domain", "type"],
  emits: ["update:modelValue", "update"],
  data() {
    return {
      update: undefined as Domain | undefined,
      loading: false
    };
  },
  watch: {
    modelValue(val) {
      if (val) {
        if (this.type === "create")
          return (this.update = {
            domain: "",
            id: 0,
            DNSProvisioned: true,
            active: true,
            zone: "",
            advanced: false,
            userId: 0,
            subdomains: false,
            subdomainsCreate: false,
            customUserEligibility: [],
            restricted: "disabled",
            user: null,
            users: [],
            activeUsersCount: 0
          });
        this.update = this.domain;
      }
    }
  },
  methods: {
    async updateDomain() {
      this.loading = true;
      this.type === "create"
        ? await this.axios.post("/admin/domain", this.update)
        : await this.axios.put("/admin/domain", this.update);
      this.$emit("update:modelValue", false);
      this.$emit("update");
      this.loading = false;
    }
  }
});
</script>
