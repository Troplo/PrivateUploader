<template>
  <CoreSidebar
    id="main-drawer"
    v-model="$app.mainDrawer"
    app
    name="default"
    color="dark"
    :floating="true"
    :class="$app.mainDrawer && !$vuetify.display.mobile ? 'sidebar-patch' : ''"
    style="z-index: 2001"
  >
    <p
      v-if="$vuetify.display.mobile && $chat.isCommunications"
      class="text-blue mt-4 ml-4 text-small pointer unselectable"
      @click="$app.railMode = 'communications'"
    >
      <v-icon>mdi-arrow-right</v-icon>
      {{ $t("core.sidebar.backToComms") }}
    </p>
    <v-list density="comfortable" :nav="true" class="mt-1">
      <template v-for="item in $app.sidebar" :key="item.id">
        <overline v-if="item.separator" position="start">
          {{ item.name }}
        </overline>
        <v-list-item
          v-else
          class="mx-1 my-1 unselectable"
          style="text-transform: unset !important"
          :href="item.externalPath"
          :link="true"
          :exact="item.exact"
          :to="item.path"
          :disabled="!$functions.checkScope(item.scope, $user.user?.scopes)"
          :prepend-icon="<any>item.icon"
          @click="handleClick(item.id)"
        >
          <template v-if="item.customIcon" #prepend>
            <DiscordIcon style="margin-right: 32px" />
          </template>
          <v-list-item-title>
            {{ item.name }}
            <v-chip
              v-if="item.new && !item.warning"
              class="pb-n2 ml-1"
              color="green"
              variant="tonal"
              size="x-small"
            >
              {{ $t("generic.new") }}
            </v-chip>
            <v-chip
              v-if="item.warning"
              class="pb-n2 ml-1"
              variant="tonal"
              size="x-small"
            >
              {{ item.warning }}
            </v-chip>
            <v-icon
              v-if="!$functions.checkScope(item.scope, $user.user?.scopes)"
              size="small"
              class="float-right"
              color="grey lighten-1"
            >
              mdi-lock
            </v-icon>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
    <template #append>
      <div
        v-if="$user.user?.administrator || $user.user?.moderator"
        class="text-center justify-center"
      >
        <small class="mb-2 text-grey">
          {{ $t("core.sidebar.experiments") }}
        </small>
      </div>
      <div v-if="$user.user?.subscription?.metadata?.hours" class="pa-2">
        <v-progress-linear
          color="gold"
          :model-value="calculateJitsi"
          height="25"
          rounded
          class="text-black"
        >
          {{ calculateJitsi }}% ({{
            Math.round($user.user?.subscription?.metadata?.hours)
          }}h/8h)
        </v-progress-linear>
      </div>
      <div class="pa-2">
        <v-progress-linear
          :color="calculateColorQuota"
          :model-value="calculateQuota"
          height="25"
          rounded
          :class="{
            'text-white': calculateColorQuota === '#256928',
            'text-black': calculateColorQuota !== '#256928'
          }"
        >
          {{ Math.ceil(calculateQuota) }}% ({{
            $functions.fileSize($user.user?.quota || 0)
          }}/{{ $functions.fileSize($user.user?.plan.quotaMax || 0) }})
        </v-progress-linear>
      </div>
    </template>
  </CoreSidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreSidebar from "@/components/Core/Sidebar.vue";
import DiscordIcon from "@/components/Icons/Discord.vue";
import Overline from "@/components/Core/Typography/Overline.vue";

export default defineComponent({
  name: "Sidebar",
  components: { Overline, DiscordIcon, CoreSidebar },
  data() {
    return {
      order: []
    };
  },
  computed: {
    calculateQuota() {
      if (!this.$user.user) return 0;
      return (this.$user.user?.quota / this.$user.user?.plan?.quotaMax) * 100;
    },
    calculateColorQuota() {
      if (this.calculateQuota >= 80 && this.calculateQuota < 95) {
        return "warning";
      } else if (this.calculateQuota >= 95) {
        return "error";
      } else {
        return "#256928";
      }
    },
    calculateJitsi() {
      return (
        Math.round(
          (this.$user.user?.subscription?.metadata?.hours / 8) * 100
        ) || 0
      );
    }
  },
  methods: {
    handleClick(id: number) {
      //@ts-ignore
      const item = this.$app.sidebar.find((item) => item.id === id);
      if (item?.click) {
        item.click(this);
      }
    }
  }
});
</script>
