<template>
  <div>
    <v-hover v-if="item.type === 'image'" v-slot="{ isHovering, props }">
      <v-img
        v-if="show || item.fileSize <= 12582912"
        :src="$app.domain + item.attachment"
        contain
        height="220"
        v-bind="props"
      >
        <template #placeholder>
          <v-row align="center" class="fill-height ma-0" justify="center">
            <v-progress-circular color="grey lighten-5" indeterminate />
          </v-row>
        </template>
        <a :href="$app.domain + item.attachment" target="_blank">
          <v-overlay
            v-if="isHovering"
            :model-value="true"
            class="align-center justify-center"
            :contained="true"
          >
            <v-icon color="white" large size="40">external-link-line</v-icon>
          </v-overlay>
        </a>
      </v-img>
      <v-card
        v-else
        class="d-flex no-border align-center justify-center"
        elevation="0"
        height="220"
      >
        <v-btn @click="show = true">
          {{ $t("gallery.displayLargeFile") }}
        </v-btn>
      </v-card>
    </v-hover>
    <video
      v-else-if="item.type === 'video'"
      controls
      height="220"
      style="width: 100%"
    >
      <source :src="$app.domain + item.attachment" type="video/mp4" />
    </video>
    <audio v-else-if="item.type === 'audio'" controls>
      <source :src="$app.domain + item.attachment" type="audio/mpeg" />
    </audio>
    <v-card
      v-else
      class="d-flex no-border align-center justify-center"
      elevation="0"
      height="220"
    >
      <v-icon color="grey" size="100">mdi-file</v-icon>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Upload } from "@/models/upload";

export default defineComponent({
  props: {
    item: {
      type: Object as () => Upload,
      required: true
    }
  },
  data() {
    return {
      show: false
    };
  }
});
</script>
