<template>
  <v-card class="rounded-xl d-flex flex-column mb-2" elevation="8">
    <v-img
      :src="collectionImage"
      class="white--text align-end"
      :cover="true"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,1.0)"
      height="200px"
      transition="none"
    >
      <template #placeholder>
        <v-row align="center" class="fill-height ma-0" justify="center">
          <v-progress-circular color="grey lighten-5" indeterminate />
        </v-row>
      </template>
      <v-card-title>
        {{ collection.name }}
        <span class="float-end">
          <v-btn
            v-if="
              !$route.params.type && collection.permissionsMetadata.configure
            "
            @click="$emit('sharingDialog', true)"
          >
            <v-icon class="mr-1" style="font-size: 20px">mdi-share</v-icon>
            Collection Sharing
          </v-btn>
          <v-btn
            v-if="
              !$route.params.type && collection.permissionsMetadata.configure
            "
            @click="$emit('settingsDialog', true)"
          >
            <v-icon class="mr-1" style="font-size: 20px">mdi-cog</v-icon>
            Settings
          </v-btn>
          <v-btn
            v-else-if="collection.shareLink"
            @click="
              $functions.copy(
                $app.site.hostnameWithProtocol +
                  '/collections/' +
                  collection.shareLink
              )
            "
          >
            <v-icon class="mr-1" style="font-size: 20px">mdi-link</v-icon>
            Copy Share Link
          </v-btn>
        </span>
      </v-card-title>
      <v-card-text v-if="collection.users.length" class="mt-n3">
        <v-icon>mdi-swap-horizontal</v-icon>
        {{ collection.user.username }},
        {{ collection.users.map((user) => user.user.username).join(", ") }}
      </v-card-text>
      <v-card-text v-else class="mt-n3">
        {{ collection.itemCount }} items
      </v-card-text>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CollectionCache } from "@/types/collection";

export default defineComponent({
  props: {
    collection: {
      type: Object as () => CollectionCache,
      required: true
    }
  },
  emits: ["sharingDialog", "settingsDialog"],
  computed: {
    collectionImage(): string {
      if (this.collection?.image) {
        return this.$app.domain + this.collection.image;
      } else if (this.collection?.preview?.attachment?.attachment) {
        return this.$app.domain + this.collection.preview.attachment.attachment;
      } else {
        return "https://i.troplo.com/i/a050d6f271c3.png";
      }
    }
  }
});
</script>
