<template>
  <v-text-field
    id="gallery-search"
    :model-value="modelValue"
    :label="$t('generic.search')"
    append-inner-icon="search-line"
    class="rounded-xl"
    autocomplete="off"
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
    @change="val = $event.target.value"
    ref="input"
  />
  <v-scroll-y-transition>
    <v-card
      id="gallery-search-menu"
      v-show="focused"
      style="
        position: absolute;
        z-index: 999;
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
        <!-- <br />
        <v-kbd>order:asc</v-kbd>
        Set the direction
        <br />
        <v-kbd>type:image</v-kbd>
        Filter by type-->
      </v-container>
      <v-container v-else>
        <template v-if="mode === GallerySearchMode.User">
          {{ selectedValue }}
          <v-list-item
            v-for="(item, index) of items"
            :key="item.label"
            :active="
              index === items.findIndex((i) => i.value === selectedValue)
            "
            class="rounded pointer"
            @mouseover="selectedValue = item.value"
            @click="
              $emit('update:modelValue', `${prefix}${item.label}`);
              $emit('submit');
              focused = false;
            "
          >
            <template #prepend>
              <user-avatar
                :user="{ username: item.label, avatar: item.image }"
                size="30"
                class="mr-2"
              />
            </template>
            {{ item.label }}
          </v-list-item>
        </template>
        <template
          v-else-if="
            mode === GallerySearchMode.Before ||
            mode === GallerySearchMode.After ||
            mode === GallerySearchMode.During
          "
        >
          <v-date-picker
            :hide-header="true"
            :multiple="mode === GallerySearchMode.During ? 2 : undefined"
            v-model="dateValue"
            @update:model-value="handleDateUpdate"
          />
        </template>
      </v-container>
    </v-card>
  </v-scroll-y-transition>
</template>

<script lang="ts">
import { GallerySearchMode } from "@/gql/graphql";
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  components: { UserAvatar },
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
      selectedValue: -1,
      focused: false,
      val: "",
      dateValue: null,
      currentTabIndex: -1,
      types: {
        [GallerySearchMode.User]: "user:",
        [GallerySearchMode.Before]: "before:",
        [GallerySearchMode.After]: "after:",
        [GallerySearchMode.During]: "during:",
        [GallerySearchMode.Order]: "order:",
        [GallerySearchMode.Type]: "type:"
      }
    };
  },
  computed: {
    GallerySearchMode() {
      return GallerySearchMode;
    },
    items() {
      switch (this.mode) {
        case GallerySearchMode.User:
          return this.$user.tracked.map((user) => {
            return {
              label: user.username,
              value: user.id,
              image: user.avatar
            };
          });
        default:
          return [];
      }
    },
    mode(): GallerySearchMode | null {
      let lastMode: GallerySearchMode | null = null;

      const segments = this.modelValue.split(" ");

      for (const segment of segments) {
        let isValidMode = false;

        for (const [key, value] of Object.entries(this.types)) {
          if (segment.startsWith(value) && segment.includes(":")) {
            lastMode = key as GallerySearchMode;
            isValidMode = true;
            break;
          }
        }

        // If a segment is not a valid mode and isn't empty, return null
        if (!isValidMode && segment.trim() !== "") {
          return null;
        }
      }

      return lastMode;
    },
    prefix() {
      return this.types[this.mode || GallerySearchMode.User];
    }
  },
  mounted() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("click", this.onClick);
  },
  unmounted() {
    this.cancelEvent();
  },
  methods: {
    onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex =
          this.items.findIndex((i) => i.value === this.selectedValue) + 1;
        if (nextIndex < this.items.length) {
          this.selectedValue = this.items[nextIndex].value;
        } else {
          this.selectedValue = this.items[0].value;
        }
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const nextIndex =
          this.items.findIndex((i) => i.value === this.selectedValue) - 1;
        if (nextIndex >= 0) {
          this.selectedValue = this.items[nextIndex].value;
        } else {
          this.selectedValue = this.items[this.items.length - 1].value;
        }
      }
      if (
        (e.key === "Enter" || e.key === "Tab") &&
        this.items.length > 0 &&
        this.selectedIndex !== -1
      ) {
        e.preventDefault();
        const item = this.items.find((i) => i.value === this.selectedValue);
        if (!item) return;
        this.$emit("update:modelValue", `${this.prefix}${item?.label || ""}`);
      }
      if (e.key === "Escape") {
        this.closeMenu();
      }
    },
    onClick(e: any) {
      if (
        !e.target ||
        (e.target.id !== "gallery-search" &&
          !e.composedPath().find((el) => el.id === "gallery-search-menu"))
      ) {
        this.closeMenu();
      }
    },
    cancelEvent() {
      document.removeEventListener("keydown", this.onKeyDown);
      document.removeEventListener("click", this.onClick);
    },
    closeMenu() {
      this.focused = false;
    },
    handleDateUpdate(val: string | string[]) {
      if (
        (this.mode === GallerySearchMode.During &&
          this.dateValue.length === 2) ||
        this.mode !== GallerySearchMode.During
      ) {
        this.$emit(
          "update:modelValue",
          `${this.prefix}${
            this.mode === GallerySearchMode.During
              ? `${this.dateValue[0].toISOString().split("T")[0]}..${
                  this.dateValue[this.dateValue.length - 1]
                    .toISOString()
                    .split("T")[0]
                }`
              : this.dateValue.toISOString().split("T")[0]
          }`
        );
        this.focused = false;
        this.$emit("submit");
      }
    }
  },
  watch: {
    modelValue(val) {
      if (this.mode) {
        const selectedItem = this.items.find(
          (i) => i.value === this.selectedValue
        );
        if (selectedItem?.label !== val.replace(this.prefix, "")) {
          this.selectedValue = -1;
        }
      }
    }
  }
});
</script>
