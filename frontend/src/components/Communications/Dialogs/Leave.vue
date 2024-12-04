<template>
  <CoreDialog
    v-if="chat"
    :model-value="modelValue"
    max-width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{
        deleteGroup ? $t("chats.leave.delete.title") : $t("chats.leave.title")
      }}
    </template>
    <template v-if="del.step === 0">
      <v-container>
        <v-card-text>
          {{
            deleteGroup
              ? $t("chats.leave.delete.description", { name: chat.name })
              : $t("chats.leave.description", { name: chat.name })
          }}
        </v-card-text>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" @click="$emit('update:modelValue', false)">
          Cancel
        </v-btn>
        <v-btn color="blue" @click="deleteGroup ? (del.step = 1) : leave()">
          {{ deleteGroup ? $t("generic.next") : $t("chats.leave.action") }}
        </v-btn>
      </v-card-actions>
    </template>
    <template v-else>
      <v-card-text>
        <DangerZoneInput
          v-model:password="del.password"
          v-model:password-mode="del.passwordMode"
          v-model:totp="del.totp"
          @confirm="doDelete()"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue" @click="$emit('update:modelValue', false)">
          Cancel
        </v-btn>
        <v-btn color="red" @click="doDelete()">Delete</v-btn>
      </v-card-actions>
    </template>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import DangerZoneInput from "@/components/Core/DangerZoneInput.vue";
import { DeleteGroupDocument } from "@/gql/graphql";

export default defineComponent({
  name: "Leave",
  components: { DangerZoneInput, CoreDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      del: {
        step: 0,
        password: "",
        totp: "",
        passwordMode: false
      }
    };
  },
  computed: {
    chat() {
      return this.$chat.chats.find(
        (chat) => chat.id === this.$chat.dialogs.leave.itemId
      );
    },
    deleteGroup() {
      return this.chat?.userId === this.$user.user?.id;
    }
  },
  methods: {
    async doDelete() {
      if (!this.chat) return;
      await this.$apollo.mutate({
        mutation: DeleteGroupDocument,
        variables: {
          input: {
            totp: this.del.passwordMode ? undefined : this.del.totp,
            password: this.del.passwordMode ? this.del.password : undefined,
            associationId: this.chat.association.id
          }
        }
      });
      this.$emit("update:modelValue", false);
    },
    async leave() {
      if (!this.chat) return;
      await this.$chat.leaveChat(this.chat.association.id);
      this.$emit("update:modelValue", false);
    }
  }
});
</script>
