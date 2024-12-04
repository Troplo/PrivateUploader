<template>
  <v-text-field
    id="gallery-search"
    :model-value="modelValue"
    :label="$t('generic.search')"
    append-inner-icon="search-line"
    class="rounded-xl"
    :autofocus="autofocus"
    @update:model-value="
      $emit('update:modelValue', $event);
      focused = true;
    "
    @click:append-inner="
      $emit('update:modelValue', modelValue);
      $emit('submit');
      focused = false;
    "
    @keydown.enter="
      $emit('update:modelValue', modelValue);
      $emit('submit');
      focused = false;
    "
    @focus="focused = true"
    @blur="focused = false"
    @change="val = $event.target.value"
    ref="input"
  />
  <v-scroll-y-transition v-if="false">
    <v-card
      v-show="focused"
      style="
        position: absolute;
        z-index: 2;
        max-height: 400px;
        overflow-y: visible;
      "
      color="toolbar"
    >
      <v-container v-if="!mode">
        <v-kbd>user:{{ $user.user?.username || "username" }}</v-kbd>
        Filter by user
        <br />
        <v-kbd>before:2023-01-01</v-kbd>
        Before a certain date
        <br />
        <v-kbd>after:2023-01-01</v-kbd>
        After a certain date
        <br />
        <v-kbd>during:2023-01-01</v-kbd>
        During a certain date
        <br />
        <v-kbd>order:asc</v-kbd>
        Set the direction
        <br />
        <v-kbd>type:image</v-kbd>
        Filter by type
      </v-container>
      <v-container v-else>
        <v-list-item
          v-for="(item, index) of items"
          :key="item.label"
          :active="selectedIndex === index"
          class="rounded pointer"
          @mouseover="selectedIndex = index"
        >
          {{ item.label }}
        </v-list-item>
      </v-container>
    </v-card>
  </v-scroll-y-transition>
</template>

<script lang="ts">
import { GallerySearchMode } from "@/gql/graphql";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "submit"],
  data() {
    return {
      selectedIndex: -1,
      focused: false,
      val: "",
      currentTabIndex: -1
    };
  },
  computed: {
    items() {
      switch (this.mode) {
        case GallerySearchMode.User:
          return this.$user.tracked.map((user) => {
            return {
              label: user.username,
              value: user.id
            };
          });
        default:
          return [];
      }
    },
    mode(): GallerySearchMode | null {
      if (this.modelValue.startsWith("user:")) {
        return GallerySearchMode.User;
      } else if (this.modelValue.startsWith("before:")) {
        return GallerySearchMode.Before;
      } else if (this.modelValue.startsWith("after:")) {
        return GallerySearchMode.After;
      } else if (this.modelValue.startsWith("during:")) {
        return GallerySearchMode.During;
      } else if (this.modelValue.startsWith("order:")) {
        return GallerySearchMode.Order;
      } else if (this.modelValue.startsWith("type:")) {
        return GallerySearchMode.Type;
      } else {
        return null;
      }
    }
  },
  mounted() {
    document.addEventListener("keydown", this.onKeyDown);
  },
  methods: {
    onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.selectedIndex++;
        if (this.selectedIndex >= this.items.length) {
          this.selectedIndex = 0;
        }
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        this.selectedIndex--;
        if (this.selectedIndex < 0) {
          this.selectedIndex = this.items.length - 1;
        }
      }
      if (
        (e.key === "Enter" || e.key === "Tab") &&
        this.items.length > 0 &&
        this.selectedIndex !== -1
      ) {
        e.preventDefault();
        this.$emit(
          "update:modelValue",
          this.modelValue + this.items[this.selectedIndex]?.value
        );
      }
      if (e.key === "Escape") {
        this.closeMenu();
      }
    },
    cancelEvent() {
      document.removeEventListener("keydown", this.onKeyDown);
    },
    closeMenu() {
      this.focused = false;
    }
  }
});
</script>
