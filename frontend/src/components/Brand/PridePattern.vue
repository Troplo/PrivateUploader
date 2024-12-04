<template>
  <linearGradient
    :id="id || 'pride_gradient'"
    :x1="-146.005"
    :y1="354.015"
    :x2="90.0049"
    :y2="590.024"
    gradientUnits="userSpaceOnUse"
  >
    <template v-if="gradientValues.length">
      <stop
        v-for="gradient in gradientValues"
        :key="gradient.offset"
        :offset="gradient.offset"
        :stop-color="gradient.stopColor"
      />
    </template>
    <template v-else>
      <stop
        offset="0"
        :stop-color="theme.current.value.dark ? '#FFFFFF' : '#000000'"
      />
    </template>
  </linearGradient>
</template>

<script lang="ts" setup>
import { useExperimentsStore } from "@/store/experiments.store";
import { PrideVariant } from "@/types/pride";
import { computed, onMounted, watch } from "vue";
import { useTheme } from "vuetify/lib/framework.mjs";

const theme = useTheme();
const experimentsStore = useExperimentsStore();
const props = defineProps({
  header: Boolean,
  id: String
});

const gradientValues = computed(() => {
  const pride = experimentsStore.experiments.PRIDE as PrideVariant;
  return PrideVariant.gradient(pride);
});

const gradientCSS = computed(() => {
  return `linear-gradient(120deg, ${gradientValues.value
    .map((gradient) => gradient.stopColor)
    .join(", ")})`;
});

const gradientCSSText = computed(() => {
  return `linear-gradient(100deg, ${gradientValues.value
    .map((gradient) => gradient.stopColor)
    .join(", ")})`;
});

const gradientCSSOpaque = computed(() => {
  return `linear-gradient(120deg, ${gradientValues.value
    .map((gradient) => `${gradient.stopColor}28`)
    .join(", ")})`;
});

watch(
  () => gradientValues.value,
  () => {
    setTheme();
  }
);

function setTheme() {
  if (
    !gradientValues.value.length &&
    document.getElementById("pride-gradient-styling")
  ) {
    document.documentElement.style.removeProperty("--pride-gradient");
    document.documentElement.style.removeProperty("--pride-gradient-opaque");
    document.documentElement.style.removeProperty("--pride-gradient-text");
    document.head.removeChild(
      document.getElementById("pride-gradient-styling")
    );
    return;
  }

  if (!gradientValues.value.length) return;

  document.documentElement.style.setProperty(
    "--pride-gradient",
    gradientCSS.value
  );
  document.documentElement.style.setProperty(
    "--pride-gradient-opaque",
    gradientCSSOpaque.value
  );

  document.documentElement.style.setProperty(
    "--pride-gradient-text",
    gradientCSSText.value
  );

  // add the CSS
  if (document.getElementById("pride-gradient-styling")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "pride-gradient-styling";
  style.innerHTML = `
  .rainbow .text-gradient {
  background: var(--pride-gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rainbow .user-avatar-parent:not(:has(.v-img)) {
  background: var(--pride-gradient);
}

.rainbow .v-ripple__animation {
  background: var(--pride-gradient);
}

.bg-outline-dark,
.dark\\:bg-outline-dark {
  background: var(--pride-gradient-opaque) !important;
}

.bg-primary {
  background: var(--pride-gradient) !important;
}
`;
  document.head.appendChild(style);
}

onMounted(() => {
  setTheme();
});
</script>
