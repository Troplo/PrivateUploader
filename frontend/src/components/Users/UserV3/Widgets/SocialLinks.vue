<template>
  <CoreDialog v-model="dialog" max-width="600">
    <template #title>Add Social Link</template>
    <v-container>
      <v-text-field v-model="socialLink.name" label="Text" maxlength="20" />
      <v-text-field v-model="socialLink.url" label="URL" />
      <v-color-picker
        v-model="socialLink.color"
        label="Color"
        mode="hex"
        width="100%"
      />
    </v-container>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        @click="
          $emit('addLink', [
            ...(component?.props?.links ?? []),
            ...[socialLink]
          ]);
          dialog = false;
          socialLink = {
            name: '',
            url: '',
            color: ''
          };
        "
      >
        Add
      </v-btn>
    </v-card-actions>
  </CoreDialog>
  <v-card class="mx-2 my-5">
    <v-toolbar>
      <v-toolbar-title>{{ user.username }}'s Social Links</v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-chip
        v-for="link in component?.props?.links"
        :key="link.url"
        target="_blank"
        class="mr-2 social-link unselectable"
        :color="link.color"
        :href="link.url"
        @click.prevent="$chat.processLink(link.url)"
        @click.middle.prevent.stop="$chat.processLink(link.url)"
      >
        {{ link.name }}
        <v-icon
          v-if="user.id === $user.user?.id"
          small
          class="ml-1"
          @click.prevent="
            $emit(
              'addLink',
              component.props.links.filter((l) => l !== link)
            )
          "
        >
          mdi-close
        </v-icon>
      </v-chip>
      <v-chip
        v-if="user.id === $user.user?.id"
        class="unselectable"
        @click="dialog = true"
      >
        <v-icon class="mr-1">mdi-plus</v-icon>
        Add Link
      </v-chip>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { ProfileLayoutComponent, User } from "@/gql/graphql";

export default defineComponent({
  components: { CoreDialog },
  props: {
    user: {
      type: Object as () => User,
      required: true
    },
    component: {
      type: Object as () => ProfileLayoutComponent,
      required: true
    }
  },
  emits: ["addLink"],
  data() {
    return {
      dialog: false,
      socialLink: {
        name: "",
        url: "",
        color: ""
      }
    };
  },
  watch: {
    "component.props.links": {
      immediate: true,
      handler: async function () {
        await this.$nextTick();
        this.aTag();
      }
    }
  },
  unmounted() {
    const aTags = document.getElementsByClassName("social-link");
    //@ts-ignore
    for (const a of aTags) {
      a.removeEventListener("auxclick", this.handleEvent, false);
    }
  },
  methods: {
    // While maybe hacky, this prevents the user from opening a new tab when middle clicking a link
    // while retaining the ability to preview the link using the native browser
    aTag() {
      const aTags = document.getElementsByClassName("social-link");
      //@ts-ignore
      for (const a of aTags) {
        a.addEventListener("auxclick", this.handleEvent, false);
      }
    },
    handleEvent(event: Event) {
      event.preventDefault();
    }
  }
});
</script>
