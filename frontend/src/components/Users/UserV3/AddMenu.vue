<template>
  <v-btn class="float-right mb-2">
    <v-menu activator="parent" location="bottom">
      <template #activator>
        <v-icon class="mr-1">add-line</v-icon>
        Add widget
      </template>
      <v-list max-height="300">
        <div v-for="comp in components" :key="comp.id">
          <v-tooltip
            v-if="comp.disabled"
            :eager="false"
            activator="parent"
            location="top"
          >
            Link your account in Settings > Integrations.
          </v-tooltip>
          <v-list-item :disabled="comp.disabled" @click="$emit('add', comp.id)">
            <v-list-item-title>{{ comp.name }}</v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script lang="ts" setup>
defineProps(["components"]);
defineEmits(["add"]);
</script>
