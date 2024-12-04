<template>
  <div
    class="gold-promo v-alert"
    v-if="!$user.user.plan.internalName.includes('FREE')"
  >
    <div class="d-flex">
      <v-icon v-if="!$user.user.subscription?.cancelled">
        checkbox-circle-fill
      </v-icon>
      <v-icon v-else>mdi-alert-circle</v-icon>

      <div class="ml-3" v-if="$user.user.subscription">
        <strong v-if="!$user.user.subscription.cancelled">
          You are subscribed to {{ $app.site.name }} {{ $user.user.plan.name }}!
        </strong>
        <strong v-else>
          Your {{ $app.site.name }} {{ $user.user.plan.name }} subscription has
          been cancelled.
        </strong>
        <p v-if="$user.user.subscription">
          Your {{ $user.user.plan.name }} will
          {{ $user.user.subscription.cancelled ? "expire" : "renew" }} on
          {{ dayjs($user.user.subscription.expiredAt).format("MMMM D, YYYY") }}.
        </p>
        <p v-if="$user.user.subscription.cancelled">
          Your subscription will not auto-renew.
        </p>
        Payment methods & options are coming soon. If you wish to purchase Pro
        now, you can do so by becoming a
        <strong>
          <a
            href="https://github.com/sponsors/Flowinity"
            style="color: white; text-decoration: underline"
          >
            GitHub Sponsor!
          </a>
        </strong>
      </div>
      <div v-else class="ml-3">
        <strong>
          You have {{ $app.site.name }} {{ $user.user.plan.name }}
        </strong>
        <p>
          You have a legacy subscription that will never expire. Cancelling will
          instantly remove your subscription.
        </p>
      </div>
    </div>
  </div>
  <div v-else class="ml-3">
    <GoldContent class="text-center" :centered-buttons="true" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from "@/plugins/dayjs";
import GoldContent from "@/components/Dashboard/Dialogs/GoldContent.vue";
</script>

<style scoped></style>
