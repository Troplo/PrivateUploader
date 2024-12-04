<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>Document Sharing</template>
    <v-card-text>
      <v-checkbox
        v-model="share"
        class="mt-n2 mb-n5 ml-n3"
        label="Share this document"
        @change="update"
      />
      Anyone can view this note if they have the link, but cannot edit it.
      <template v-if="share">
        This document can be viewed publicly from
        <a
          class="pointer"
          @click="
            $functions.copy(
              `https://${$app.site.hostnameWithProtocol}/notes/${shareLink}`
            );
            $toast.info('Link copied to clipboard');
          "
        >
          {{ $app.site.hostnameWithProtocol }}/notes/{{ shareLink }}
        </a>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('update:modelValue', false)">Close</v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { UpdateShareLinkMutation } from "@/graphql/workspaces/updateShareLink.graphql";

export default defineComponent({
  components: { CoreDialog },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      share: false,
      shareLink: "",
      loading: false
    };
  },
  async mounted() {
    const data = await this.$workspaces.getNote(this.$route.params.id);
    this.shareLink = data.shareLink;
    this.share = data.shareLink !== null;
  },
  methods: {
    async update() {
      const {
        data: { toggleNoteShare }
      } = await this.$apollo.mutate({
        mutation: UpdateShareLinkMutation,
        variables: {
          input: parseInt(this.$route.params.id)
        }
      });
      this.shareLink = toggleNoteShare.shareLink;
      this.share = toggleNoteShare.shareLink !== null;
    }
  }
});
</script>
