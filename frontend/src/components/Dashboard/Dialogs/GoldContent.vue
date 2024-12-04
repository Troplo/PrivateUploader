<template>
  <v-card class="no-border" color="transparent" elevation="0">
    <h1 class="mt-2">
      Introducing
      <span class="gold-text-gradient">Flowinity Pro</span>
    </h1>
    <p class="text-overline">Get access to¹:</p>
    <v-list style="background-color: transparent !important">
      <v-list-item color="transparent">
        <v-list-item-title class="d-flex justify-center">
          <UserBadges
            :user="{
              id: $user.user?.id,
              username: 'Demo',
              plan: {
                id: 6,
                internalName: 'GOLD',
                color: '#2396ff',
                icon: 'mdi-plus',
                name: 'Pro'
              }
            }"
          />
          <span>Swagger profile badge</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-icon color="green">mdi-check</v-icon>
          100GB of storage, up from 10GB
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-icon color="green">mdi-check</v-icon>
          Custom Flowinity theme with the Theme Editor
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-icon color="green">mdi-check</v-icon>
          Support Flowinity development
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-icon color="green">mdi-check</v-icon>
          Early access to new features
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-icon color="green">mdi-check</v-icon>
          A dynamic user profile that reacts to your theme
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-icon color="green">mdi-check</v-icon>
          Want to see a feature in Pro that isn't listed here? Let us know!
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <small>
      <sup>1</sup>
      Perks can be altered at any time without prior notice.
    </small>
    <v-card-actions>
      <v-spacer v-if="centeredButtons" />
      <v-btn
        class="no-capital"
        color="red"
        @click="$emit('update:modelValue', false)"
        v-if="!centeredButtons"
      >
        <v-icon class="mr-1">mdi-arrow-left</v-icon>
        Close
      </v-btn>
      <v-spacer v-if="!centeredButtons" />
      <span>
        <v-btn
          v-if="$app.activeNags.IAF_NAG"
          class="no-capital"
          color="primary"
          @click="startTrial"
        >
          Get your free month
          <v-icon class="ml-1">mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn
          v-else-if="!$app.activeNags.IAF_NAG && !$user.gold"
          class="no-capital"
          color="primary"
          href="https://github.com/sponsors/Flowinity"
        >
          Get started
          <v-icon class="ml-1">mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn
          v-else
          to="/settings/subscriptions"
          class="no-capital"
          color="primary"
        >
          Settings
        </v-btn>
      </span>
      <v-spacer v-if="centeredButtons" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserBadges from "@/components/Users/UserBadges.vue";

export default defineComponent({
  components: { UserBadges },
  emits: ["update:modelValue"],
  props: {
    centeredButtons: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      step: 1
    };
  },
  methods: {
    startTrial() {
      this.$emit("update:modelValue", false);
      this.$app.dialogs.inviteAFriend = true;
    }
  }
});
</script>
