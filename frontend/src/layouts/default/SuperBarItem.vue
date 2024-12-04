<script setup lang="ts">
const props = defineProps({
  selected: Boolean,
  highlighted: Boolean,
  badge: [Number, String],
  disabled: Boolean
});
</script>

<template>
  <div
    v-ripple
    class="rounded-full hover:bg-outline-light cursor-pointer p-2 relative flex items-center justify-center super-bar-item"
    :class="{
      'bg-outline-dark dark:hover:bg-outline-dark':
        props.selected || props.highlighted,
      'cursor-not-allowed opacity-50': props.disabled,
      'dark:hover:bg-outline-amoled': !props.selected && !props.highlighted
    }"
    style="width: 40px; height: 40px"
    tabindex="0"
    @keydown.enter="
      //@ts-ignore
      props.disabled ? () => {} : $event.target?.click()
    "
    @keydown.space="
      props.disabled
        ? () => {}
        : () => {
            $event.preventDefault();
            //@ts-ignore
            $event.target?.click();
          }
    "
  >
    <div class="blue-line bg-blue" :class="{ active: props.selected }"></div>
    <slot name="badge"></slot>
    <v-chip
      class="absolute text-black z-20 bottom-0 right-0 text-center flex justify-center"
      v-if="props.badge && !$slots.badge"
      color="red"
      variant="flat"
      size="x-small"
    >
      {{ props.badge }}
    </v-chip>
    <slot />
  </div>
</template>
