<template>
  <v-card>
    <v-container class="text-center">
      <strong class="text-gradient text-center" style="font-size: 24px">
        {{ title }}
      </strong>
      <p v-if="subtitle" class="text-grey" style="font-size: 14px">
        {{ subtitle }}
      </p>
      <h1 v-if="count !== undefined" style="font-size: 4em">
        {{ count.toLocaleString() }}
      </h1>
      <slot v-else></slot>
      <v-card-subtitle v-if="difference !== undefined">
        <v-icon :color="differenceIcon(difference).color">
          {{ differenceIcon(difference).icon }}
        </v-icon>
        {{ difference.toLocaleString() }}
      </v-card-subtitle>
      <v-card-subtitle v-if="last !== undefined">
        {{ last.toLocaleString() }} previously
      </v-card-subtitle>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    subtitle: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: false
    },
    difference: {
      type: Number,
      required: false
    },
    last: {
      type: Number,
      required: false
    }
  },
  methods: {
    differenceIcon(diff: number, reverse = false) {
      if (!reverse) {
        if (diff > 0) {
          return {
            icon: "arrow-up-line",
            color: "success"
          };
        } else if (diff < 0) {
          return {
            icon: "arrow-down-line",
            color: "red"
          };
        } else {
          return {
            icon: "subtract-line",
            color: "warning"
          };
        }
      } else {
        if (diff > 0) {
          return {
            icon: "arrow-up-line",
            color: "red"
          };
        } else if (diff < 0) {
          return {
            icon: "arrow-down-line",
            color: "success"
          };
        } else {
          return {
            icon: "subtract-line",
            color: "warning"
          };
        }
      }
    }
  }
});
</script>
