<template>
  <div class="justify-center text-center">
    <v-chip
      key="prev"
      :disabled="modelValue === 1"
      size="large"
      variant="text"
      @click="$emit('update:modelValue', modelValue - 1)"
    >
      <v-icon>arrow-left-s-line</v-icon>
    </v-chip>
    <template v-if="totalPages">
      <template v-if="!pages.includes(1)">
        <v-chip
          :disabled="modelValue === 1"
          size="large"
          variant="text"
          @click="$emit('update:modelValue', 1)"
        >
          1
        </v-chip>
        <v-text-field
          v-if="customLeft"
          key="custom"
          v-model="customPage"
          :max="totalPages"
          :min="1"
          :autofocus="true"
          class="v-btn ml-3 mr-3"
          style="width: 50px; position: relative; top: -0.69em"
          type="number"
          @blur="doCustomPage"
          @keyup.enter="doCustomPage"
        />
        <v-chip
          v-if="!customLeft"
          size="large"
          variant="text"
          @click="customLeft = true"
        >
          ...
        </v-chip>
      </template>
      <v-chip
        v-for="page in pages"
        :key="page"
        :disabled="page === modelValue"
        size="large"
        variant="text"
        @click="$emit('update:modelValue', page)"
      >
        {{ page }}
      </v-chip>

      <template v-if="!pages.includes(totalPages)">
        <v-text-field
          v-if="customRight"
          key="custom"
          v-model="customPage"
          :max="totalPages"
          :min="1"
          :autofocus="true"
          class="v-btn ml-3 mr-3"
          style="width: 50px; position: relative; top: -0.69em"
          type="number"
          @blur="doCustomPage"
          @keyup.enter="doCustomPage"
        />
        <v-chip
          v-if="!customRight"
          size="large"
          variant="text"
          @click="customRight = true"
        >
          ...
        </v-chip>
        <v-chip
          :disabled="modelValue === totalPages"
          variant="text"
          @click="$emit('update:modelValue', totalPages)"
        >
          {{ totalPages }}
        </v-chip>
      </template>
    </template>
    <v-chip
      key="next"
      :disabled="modelValue === totalPages"
      height="25"
      max-width="20"
      variant="text"
      @click="$emit('update:modelValue', modelValue + 1)"
    >
      <v-icon>arrow-right-s-line</v-icon>
    </v-chip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Paginate",
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number as () => number | null | undefined,
      required: false,
      default: 1
    },
    maxVisible: {
      type: Number,
      default: 15
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      customLeft: false,
      customRight: false,
      customPage: undefined as string | undefined
    };
  },
  computed: {
    maxVisibleResponsive() {
      if (!this.totalPages) return this.maxVisible;
      if (this.$vuetify.display.xl) {
        return this.maxVisible;
      } else if (this.$vuetify.display.mobile) {
        return 3;
      } else if (this.$vuetify.display.lg) {
        return Math.floor(this.maxVisible / 2);
      } else {
        return this.maxVisible;
      }
    },
    pages() {
      let startPage = Math.max(
        this.modelValue - Math.floor(this.maxVisibleResponsive / 2),
        1
      );
      let endPage = Math.min(
        startPage + this.maxVisibleResponsive - 1,
        this.totalPages || 1
      );

      const visiblePagesCount = endPage - startPage + 1;
      if (visiblePagesCount < this.maxVisibleResponsive) {
        if (startPage === 1) {
          endPage = Math.min(this.totalPages || 1, this.maxVisibleResponsive);
        } else {
          startPage = Math.max(1, endPage - this.maxVisibleResponsive + 1);
        }
      }

      const visiblePages = [];
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }

      return visiblePages;
    }
  },
  methods: {
    doCustomPage() {
      if (this.totalPages) {
        if (parseInt(this.customPage || "") > this.totalPages) {
          this.customPage = this.totalPages.toString();
        }
      }
      this.$emit("update:modelValue", parseInt(this.customPage || ""));
      this.customLeft = false;
      this.customRight = false;
    }
  }
});
</script>
