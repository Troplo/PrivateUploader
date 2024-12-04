<template>
  <div>
    <CoreDialog v-model="dialog" max-width="600px">
      <template #title>
        {{ $t("collections.leave.title") }}
      </template>
      <template #default>
        <p class="my-4 mx-4">
          {{
            $t("collections.leave.description", {
              collection: collection.name
            })
          }}
        </p>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" @click="leaveCollection">
            {{ $t("collections.leave.action") }}
          </v-btn>
        </v-card-actions>
      </template>
    </CoreDialog>
    <slot
      :toggle="
        () => {
          dialog = true;
        }
      "
    ></slot>
  </div>
</template>

<script setup lang="ts">
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { Collection, OnLeaveCollectionDocument } from "@/gql/graphql";

const props = defineProps({
  collection: {
    type: Object as () => Collection,
    required: true
  }
});
const loading = ref(false);
const dialog = ref(false);

async function leaveCollection() {
  loading.value = true;
  try {
    const mutate = useMutation(OnLeaveCollectionDocument, {
      variables: {
        input: {
          collectionId: props.collection.id
        }
      }
    });
    await mutate.mutate();
    dialog.value = false;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
