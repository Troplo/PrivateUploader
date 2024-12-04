<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="500px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{ $t("chats.settings.ranks.manage.create") }}
    </template>
    <v-container>
      <v-text-field
        v-model="name"
        autofocus
        :label="$t('generic.name')"
        @keydown.enter="create"
      />
    </v-container>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="create">
        {{ $t("generic.create") }}
      </v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { CreateChatRankDocument } from "@/gql/graphql";

export default defineComponent({
  components: { CoreDialog },
  props: ["modelValue", "associationId"],
  emits: ["update:modelValue"],
  data() {
    return {
      name: "",
      loading: false
    };
  },
  methods: {
    async create() {
      this.loading = true;
      await this.$apollo.mutate({
        mutation: CreateChatRankDocument,
        variables: {
          input: { associationId: this.associationId, name: this.name }
        }
      });
      this.loading = false;
      this.name = "";
      this.$emit("update:modelValue", false);
    }
  }
});
</script>
