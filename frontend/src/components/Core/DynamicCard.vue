<template>
  <v-card
    :height="<string>height"
    :to="to"
    class="rounded-xl d-flex flex-column"
    elevation="8"
    style="cursor: pointer"
  >
    <v-img
      :gradient="
        rightText && !normalGradient
          ? 'to top, rgba(0,0,0,.0), rgba(0,0,0,0.2)'
          : title
          ? 'to bottom, rgba(0,0,0,.1), rgba(0,0,0,1.0)'
          : undefined
      "
      :src="image"
      class="white--text align-end"
      :cover="true"
      transition="none"
    >
      <template #placeholder>
        <v-row align="center" class="fill-height ma-0" justify="center">
          <v-progress-circular color="grey lighten-5" indeterminate />
        </v-row>
      </template>
      <slot />
      <v-card-title v-if="title || $slots['title']">
        {{ title }}
        <slot name="title" />
        <p
          v-if="
            !secondaryText &&
            !$slots['secondary-text'] &&
            (subtitle || $slots['subtitle'])
          "
          class="float-end"
        >
          {{ subtitle }}
          <slot name="subtitle" />
        </p>
      </v-card-title>
      <v-card-text
        v-if="secondaryText || $slots['secondary-text']"
        class="mt-n2"
      >
        {{ secondaryText }}
        <slot name="secondary-text" />
        <p v-if="subtitle || $slots['subtitle']" class="float-end">
          {{ subtitle }}
          <slot name="subtitle" />
        </p>
      </v-card-text>
      <v-card-text
        v-if="rightText || $slots['right-text']"
        :style="blackText ? 'color: black !important;' : 'color: white'"
        style="position: absolute; top: 0; right: 0; font-size: 18px"
      >
        {{ rightText }}
        <slot name="right-text" />
      </v-card-text>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DynamicCard",
  props: {
    to: {
      type: String,
      required: false
    },
    image: {
      type: String,
      default: "https://i.flowinity.com/i/a050d6f271c3.png"
    },
    title: {
      type: String,
      required: false
    },
    subtitle: {
      type: String,
      required: false
    },
    secondaryText: {
      type: String,
      required: false
    },
    rightText: {
      type: String,
      required: false
    },
    blackText: {
      type: Boolean,
      default: false
    },
    height: {
      type: String
    },
    normalGradient: {
      type: Boolean,
      default: false
    }
  }
});
</script>
