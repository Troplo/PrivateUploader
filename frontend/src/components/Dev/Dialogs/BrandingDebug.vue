<template>
  <v-container>
    <small>Theme: Dark = {{ $vuetify.theme.current.dark }}</small>
    <v-btn
      variant="tonal"
      @click="
        $experiments.setExperiment(
          'NEW_BRANDING',
          $experiments.experiments.NEW_BRANDING ? 0 : 1
        )
      "
    >
      Set Brand Version
    </v-btn>
    <br />
    ANIMATION DOES NOT SUPPORT SVG HOTSWAP
    <div :key="$experiments.experiments.NEW_BRANDING as number">
      <small>
        Variant:
        {{
          $t(
            `settings.home.preferences.prideVariants.${$experiments.experiments.PRIDE}`
          )
        }}
      </small>
      <br />
      Animated:
      <FlowinityLogoAnimated
        :animate="false"
        style="max-width: 120px"
        :key="`${forceAnimate}-${$vuetify.theme.current.dark}-${$experiments.experiments.PRIDE}`"
      />
      <v-btn variant="tonal" @click="forceAnimate++">Re-animate</v-btn>
      <br />
      Animated (Loading):
      <FlowinityLogoAnimated
        :animate="loading"
        :skip-init="true"
        style="max-width: 120px"
        :key="`${$vuetify.theme.current.dark}-${$experiments.experiments.PRIDE}`"
      />
      <v-btn variant="tonal" @click="loading = !loading">
        {{ loading }}
      </v-btn>
      <br />
      Not Animated:
      <FlowinityLogo
        :animate="false"
        style="max-width: 120px"
        :key="`${$vuetify.theme.current.dark}-${$experiments.experiments.PRIDE}`"
      />
      Header (Handled / Old UI and About):
      <FlowinityBannerHandler style="max-height: 120px; max-width: 100%" />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import DevDialog from "@/components/Dev/Dialogs/DevDialog.vue";
import FlowinityLogoAnimated from "@/components/Brand/FlowinityLogoAnimated.vue";
import FlowinityBannerHandler from "@/components/Brand/FlowinityBannerHandler.vue";
import { ref } from "vue";
import FlowinityLogo from "@/components/Brand/FlowinityLogo.vue";

const forceAnimate = ref(0);
const loading = ref(false);
</script>

<style>
.branding-debug-light .content {
  background-color: white !important;
  color: black !important;
}
</style>
