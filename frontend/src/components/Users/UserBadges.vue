<template>
  <div class="user-badges-group">
    <v-chip-group
      :model-value="selected"
      class="mt-n2"
      disabled
      :show-arrows="true"
    >
      <!-- Permission badges -->
      <HoverChip
        v-if="user.admin || user.administrator"
        v-ripple
        :small="true"
        class="user-badge"
        color="#0190ea"
        icon="mdi-shield"
        :text="`${$app.site.name} Administrator`"
      />
      <HoverChip
        v-if="user.moderator"
        v-ripple
        :small="true"
        class="user-badge"
        color="success"
        icon="mdi-shield"
        :text="`${$app.site.name} Moderator`"
      />
      <!-- Plan/joke badges -->
      <HoverChip
        v-if="!user.plan?.internalName.includes('FREE')"
        v-ripple
        :color="primaryColor || user.plan?.color"
        :short-text="user.plan?.name"
        :small="true"
        :text="`${$app.site.name} ${user.plan?.name}`"
        class="user-badge"
        text-color="black"
      />
      <HoverChip
        v-if="user.xp > 0"
        v-ripple
        :small="true"
        class="user-badge"
        color="primary"
        icon="mdi-star"
        :text="'$' + user.xp + ' donated'"
        :short-text="'$' + user.xp"
        text-color="black"
      />
      <template v-if="$experiments.experiments.NATIVE_BADGES">
        <!-- Rank tiers -->
        <HoverChip
          v-if="rank === 'god'"
          v-ripple
          :small="true"
          class="user-badge"
          color="primary"
          icon="mdi-crown"
          :text="`${$app.site.name} God`"
          title="You're Better than the rest™."
        />
        <HoverChip
          v-if="rank === 'champion'"
          v-ripple
          :small="true"
          class="user-badge"
          color="gold"
          icon="mdi-compass"
          :text="`${$app.site.name} Champion`"
          title="Champion deez nuts."
        />
        <HoverChip
          v-if="rank === 'legend'"
          v-ripple
          :small="true"
          class="user-badge"
          color="purple"
          icon="mdi-chess-knight"
          title="You're a legend."
          :text="`${$app.site.name} Legend`"
        />
        <HoverChip
          v-if="rank === 'medium'"
          v-ripple
          :small="true"
          class="user-badge"
          color="#1ac62b"
          icon="mdi-microsoft-xbox-controller-battery-medium"
          title="You're medium."
          :text="`${$app.site.name} Mediumist`"
        />
        <HoverChip
          v-if="rank === 'intermediate'"
          v-ripple
          :small="true"
          class="user-badge"
          color="cyan"
          icon="mdi-target-account"
          title="You're getting Better™."
          :text="`${$app.site.name} Intermediate`"
        />
        <HoverChip
          v-if="rank === 'noob'"
          v-ripple
          :small="true"
          class="user-badge"
          color="grey"
          icon="mdi-chess-pawn"
          title="Noob. Get Better™."
          :text="`${$app.site.name} Noob`"
        />
        <!-- God, #0190ea/primary -->
        <HoverChip
          v-if="user.stats?.pulse >= 100"
          v-ripple
          :small="true"
          class="user-badge"
          color="#0190ea"
          icon="mdi-clock"
          :text="`Chronic ${$app.site.name} Addiction Condition Disorder (CFACD)`"
          :title="`Have 100h+ in ${$app.site.name}.`"
        />
        <HoverChip
          v-if="user.stats?.uploads >= 100000"
          v-ripple
          :small="true"
          class="user-badge"
          color="#0190ea"
          icon="mdi-account-arrow-up"
          text="Chronic Screenshot Addiction Condition Disorder (CSACD)"
          title="Upload 100K+ items."
        />
        <HoverChip
          v-if="
            user.stats?.uploads >= 10000 &&
            user.stats?.collectionItems / user.stats?.uploads >= 0.99
          "
          v-ripple
          :small="true"
          class="user-badge"
          color="#0190ea"
          icon="mdi-rhombus-split"
          text="Chronic Kollectivization Addiction Condition Disorder (CKACD)"
          title="Have a collectivized to upload percentage of 100% or more."
        />
        <HoverChip
          v-if="user.stats?.collections >= 100"
          v-ripple
          :small="true"
          class="user-badge"
          color="#0190ea"
          icon="mdi-folder-multiple-image"
          text="Chronic Collection Addiction Condition Disorder (CCACD)"
          title="Have 100+ collections."
        />
        <!-- Champion, #ffd700/gold -->
        <HoverChip
          v-if="user.stats?.uploads >= 50000 && user.stats?.uploads < 100000"
          v-ripple
          :small="true"
          class="user-badge"
          color="gold"
          icon="mdi-account-arrow-up"
          text="Champion Uploader"
          title="Upload 50K+ items."
        />
        <HoverChip
          v-if="user.stats?.pulse >= 72 && user.stats?.pulse < 100"
          v-ripple
          :small="true"
          class="user-badge"
          color="gold"
          icon="mdi-clock"
          :text="`${$app.site.name} Addict`"
          :title="`Have 72h+ in ${$app.site.name}.`"
        />
        <HoverChip
          v-if="
            user.stats?.uploads >= 10000 &&
            user.stats?.collectionItems / user.stats?.uploads >= 0.9 &&
            user.stats?.collectionItems / user.stats?.uploads < 0.95
          "
          v-ripple
          :small="true"
          class="user-badge"
          color="gold"
          icon="mdi-rhombus-split"
          text="Champion Collectivist"
          title="Have a collectivized to upload percentage of 90% or more."
        />
        <HoverChip
          v-if="user.stats?.collections >= 25 && user.stats?.collections < 100"
          v-ripple
          :small="true"
          class="user-badge"
          color="purple"
          icon="mdi-folder-multiple-image"
          text="Extreme collection creator"
          title="Have 25+ collections."
        />
        <!-- Legend tier, #673ab7/purple -->
        <HoverChip
          v-if="user.stats?.uploads >= 10000 && user.stats?.uploads < 50000"
          v-ripple
          :small="true"
          class="user-badge"
          color="purple"
          icon="mdi-account-arrow-up"
          text="Extreme Uploader"
          title="Upload 10K+ items."
        />
        <HoverChip
          v-if="user.stats?.pulse >= 69 && user.stats?.pulse < 72"
          v-ripple
          :small="true"
          class="user-badge"
          color="purple"
          icon="mdi-clock"
          text="Nice Hours"
          :title="`Have 69h+ in ${$app.site.name}.`"
        />
        <HoverChip
          v-if="
            user.stats?.uploads >= 1000 &&
            user.stats?.collectionItems / user.stats?.uploads >= 0.8 &&
            (user.stats?.collectionItems / user.stats?.uploads < 0.9 ||
              user.stats?.uploads < 10000)
          "
          v-ripple
          :small="true"
          class="user-badge"
          color="purple"
          icon="mdi-rhombus-split"
          text="True Collectivist"
          title="Have a collectivized to upload percentage of 80% or more."
        />
        <HoverChip
          v-if="user.stats?.collections >= 20 && user.stats?.collections < 25"
          v-ripple
          :small="true"
          class="user-badge"
          color="purple"
          icon="mdi-folder-multiple-image"
          text="Extreme collection creator"
          title="Have 20+ collections."
        />
        <!-- Mediumist tier, #1ac62b/Thomas lime -->
        <HoverChip
          v-if="user.stats?.uploads >= 4154 && user.stats?.uploads < 10000"
          v-ripple
          :small="true"
          class="user-badge"
          color="#1ac62b"
          icon="mdi-upload"
          text="Pro Uploader"
          title="Upload 4154+ items."
        />
        <HoverChip
          v-if="user.stats?.pulse >= 24 && user.stats?.pulse < 69"
          v-ripple
          :small="true"
          class="user-badge"
          color="#1ac62b"
          icon="mdi-clock-fast"
          :text="`${$app.site.name} All Nighter`"
          :title="`Have 24h+ in ${$app.site.name}.`"
        />
        <HoverChip
          v-if="
            user.stats?.uploads >= 1000 &&
            user.stats?.collectionItems / user.stats?.uploads >= 0.69 &&
            user.stats?.collectionItems / user.stats?.uploads < 0.8
          "
          v-ripple
          :small="true"
          class="user-badge"
          color="#1ac62b"
          icon="mdi-rhombus-split"
          text="Nice Collectivist"
          title="Have a collectivized to upload percentage of 69% or more."
        />
        <HoverChip
          v-if="user.stats?.collections >= 15 && user.stats?.collections < 20"
          v-ripple
          :small="true"
          class="user-badge"
          color="#1ac62b"
          icon="mdi-folder-multiple-image"
          text="Pro collection creator"
          title="Have 15+ collections."
        />
        <!-- Mediumist, #00bcd4/cyan -->
        <HoverChip
          v-if="user.stats?.uploads >= 1000 && user.stats?.uploads < 4154"
          v-ripple
          :small="true"
          class="user-badge"
          color="cyan"
          icon="mdi-upload"
          text="Getting Better™"
          title="Upload 1K+ items."
        />
        <HoverChip
          v-if="user.stats?.pulse >= 12 && user.stats?.pulse < 24"
          v-ripple
          :small="true"
          class="user-badge"
          color="cyan"
          icon="mdi-clock"
          text="Better than Average"
          :title="`Have 12h+ in ${$app.site.name}.`"
        />
        <HoverChip
          v-if="
            user.stats?.uploads >= 1000 &&
            user.stats?.collectionItems / user.stats?.uploads >= 0.4154 &&
            user.stats?.collectionItems / user.stats?.uploads < 0.69
          "
          v-ripple
          :small="true"
          class="user-badge"
          color="cyan"
          icon="mdi-rhombus-split"
          text="Noob Collectivist"
          title="Have a collectivized to upload percentage of 41.54% or more."
        />
        <HoverChip
          v-if="user.stats?.collections >= 10 && user.stats?.collections < 15"
          v-ripple
          :small="true"
          class="user-badge"
          color="cyan"
          icon="mdi-folder-multiple-image"
          text="Better™ collection creator"
          title="Have 10+ collections."
        />
        <!-- Noob, grey -->
        <HoverChip
          v-if="user.stats?.uploads >= 500 && user.stats?.uploads < 1000"
          v-ripple
          :small="true"
          class="user-badge"
          color="grey"
          icon="mdi-upload"
          text="Getting Started"
          title="Upload 500+ items."
        />
        <HoverChip
          v-if="user.stats?.pulse >= 8 && user.stats?.pulse < 12"
          v-ripple
          :small="true"
          class="user-badge"
          color="grey"
          icon="mdi-clock"
          text="Average User"
          :title="`Have 8h+ in ${$app.site.name}.`"
        />
        <HoverChip
          v-if="user.stats?.collections >= 5 && user.stats?.collections < 10"
          v-ripple
          :small="true"
          class="user-badge"
          color="grey"
          icon="mdi-folder-multiple-image"
          text="Average collection creator"
          title="Have 5+ collections."
        />

        <!-- Other -->
        <HoverChip
          v-if="age >= 1"
          v-ripple
          :icon="'mdi-numeric-' + age"
          :small="true"
          :text="age + ' year old account'"
          :title="`${user.username}'s account is ${age} years old.`"
          class="user-badge"
          color="teal"
        />
        <HoverChip
          v-if="cakeWeek && age >= 1"
          v-ripple
          :small="true"
          :title="`${user.username}'s account was created this week ${age} years ago.`"
          class="user-badge"
          color="pink lighten-2"
          icon="mdi-cake"
          text="Cake Week"
        />
      </template>
      <template v-if="$experiments.experiments.BADGES">
        <HoverChip
          v-for="badge in user.badges"
          :key="badge.id"
          v-ripple
          :color="badge.color"
          :icon="badge.icon"
          :image="badge.image"
          :small="true"
          :text="badge.name"
          :title="badge.tooltip"
          class="user-badge"
          @click="handleClick(badge)"
        />
      </template>
      <HoverChip
        v-if="user.noFriends"
        v-ripple
        :small="true"
        class="user-badge"
        color="silver"
        icon="mdi-account-multiple-remove"
        text="No friends :("
        title="Get Better ™ 😟"
      />
      <HoverChip
        v-if="
          !$friends.friends.find((f) => f.friendId === user.id) &&
          user.id !== $user.user?.id
        "
        v-ripple
        :small="true"
        class="user-badge"
        color="grey"
        icon="mdi-account-off"
        text="Not friends with user, some information may be unavailable."
      />
      <slot />
    </v-chip-group>
  </div>
</template>

<script lang="ts">
import HoverChip from "@/components/Core/HoverChip.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserBadges",
  components: { HoverChip },
  props: ["user", "primaryColor"],
  computed: {
    rank() {
      if (
        this.user.stats?.pulse >= 100 &&
        this.user.stats?.uploads >= 100000 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.99 &&
        this.user.stats?.collections >= 100
      ) {
        return "god";
      } else if (
        this.user.stats?.uploads >= 50000 &&
        this.user.stats?.pulse >= 72 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.9 &&
        this.user.stats?.collections >= 25
      ) {
        return "champion";
      } else if (
        this.user.stats?.uploads >= 10000 &&
        this.user.stats?.pulse >= 69 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.8 &&
        this.user.stats?.collections >= 20
      ) {
        return "legend";
      } else if (
        this.user.stats?.uploads >= 4154 &&
        this.user.stats?.pulse >= 24 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.69 &&
        this.user.stats?.collections >= 15
      ) {
        return "medium";
      } else if (
        this.user.stats?.uploads >= 1000 &&
        this.user.stats?.pulse >= 12 &&
        this.user.stats?.collectionItems / this.user.stats?.uploads >= 0.4154 &&
        this.user.stats?.collections >= 10
      ) {
        return "intermediate";
      } else if (
        this.user.stats?.uploads >= 500 &&
        this.user.stats?.pulse >= 8 &&
        this.user.collections?.length >= 5
      ) {
        return "noob";
      } else {
        return null;
      }
    },
    selected() {
      // select all of them
      return [...Array(100).keys()];
    },
    age() {
      if (!this.user?.createdAt) return 0;
      const years = this.$date().diff(this.user?.createdAt, "years");
      if (years > 9) {
        return 9;
      } else {
        return years;
      }
    },
    cakeWeek() {
      if (!this.user?.createdAt) return false;
      let date =
        this.$date().year() +
        "-" +
        this.$date(this.user.createdAt).format("MM-DD");
      return this.$date().isSame(this.$date(date), "week");
    }
  },
  methods: {
    crash() {
      throw "Error";
    },
    async handleClick(badge: any) {
      if (badge.name === ":skull:") {
        this.crash();
      } else if (badge.name === "Click me") {
        try {
          await this.axios.head("/user/getRekt");
        } catch {
          //
        }
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      }
    }
  }
});
</script>

<style scoped>
.v-chip--disabled {
  opacity: 1 !important;
  pointer-events: inherit !important;
  user-select: inherit !important;
}
</style>

<style>
.user-badges-group.justify-center .v-slide-group__content {
  justify-content: center;
}
</style>
