<template>
  <h1
    v-if="!$vuetify.display.mobile && event !== 'bc'"
    id="tpu-brand-logo"
    :title="event === 'j' ? 'Jitsi Anniversary' : $app.site.name || 'Flowinity'"
    class="unselectable ml-4 relative text-gradient"
    style="z-index: 10; cursor: pointer; font-size: 32px; font-weight: 500"
    @click="$router.push('/')"
  >
    <div class="d-flex align-center">
      <template
        v-if="$experiments.experiments.FLOWINITY && $app.site.officialInstance"
      >
        <FlowinityBannerRainbow
          v-if="$experiments.experiments.PRIDE"
          style="width: 150px; height: 60px"
          src="@/assets/images/flowinity-logo-banner-rainbow.svg"
        />
        <FlowinityBanner
          v-else
          style="width: 150px; height: 60px"
          src="@/assets/images/flowinity-logo-banner.svg"
        />
      </template>
      <template v-else>
        {{ $app.site.name || "TPU" }}
      </template>
      <template v-if="$app.site.officialInstance">
        <v-hover v-if="event === 'pi'" v-slot="{ isHovering, props }">
          <span class="ml-3" v-bind="props">
            <template v-if="isHovering">
              <span style="font-size: 1.15em">
                {{ Math.PI }}
              </span>
            </template>
            <template v-else>
              <span style="font-size: 1.15em">π</span>
            </template>
          </span>
        </v-hover>
        <v-icon
          v-if="event === 'bd'"
          class="text-gradient"
          size="23"
          style="bottom: 0.05em"
        >
          mdi-numeric-1-box
        </v-icon>
        <v-icon
          v-if="event === 'bd'"
          class="text-gradient"
          size="23"
          style="bottom: 0.05em"
        >
          mdi-numeric-8-box
        </v-icon>
        <v-img
          v-if="event === 'j'"
          height="32"
          src="https://i.troplo.com/i/1bcf4db450ba.svg"
          style="position: relative; top: 0.15em; display: inline-block"
          width="32"
        />
        <v-icon
          v-if="event === '420'"
          class="text-gradient ml-n1"
          size="34"
          style="bottom: 0.05em"
        >
          mdi-cannabis
        </v-icon>
      </template>
    </div>
  </h1>
  <template v-if="event === 'bc' && $app.site.officialInstance">
    <v-card-title
      id="bettercompass-title"
      class="text-gradient unselectable"
      style="cursor: pointer"
      title="BetterCompass is 2 years old today!"
      @click="$router.push('/')"
    >
      BetterCompass
      <v-icon class="text-gradient" size="23" style="bottom: 0.05em">
        mdi-numeric-2-box
      </v-icon>
    </v-card-title>
    <v-btn class="ml-n5" disabled>Dev</v-btn>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FlowinityBannerRainbow from "@/components/Brand/FlowinityBannerRainbow.vue";
import FlowinityBanner from "@/components/Brand/FlowinityBanner.vue";

export default defineComponent({
  components: { FlowinityBanner, FlowinityBannerRainbow },
  computed: {
    event() {
      const date = this.$date().format("MMDD");
      switch (date) {
        case "0314":
          return "pi";
        case "0317":
          return "bc";
        case "0331":
          return "bd";
        case "0401":
          return "j";
        case "0420":
          return "420";
        case "0101":
          return "ny";
        case "1225":
          return "xmas";
        case "1001":
          return "halloween";
        case "0704":
          return "independence";
        case "0505":
          return "cincodemayo";
        case "0908":
          return "labor";
        case "1101":
          return "veterans";
        default:
          return null;
      }
    }
  }
});
</script>
