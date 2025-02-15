<template>
  <v-container>
    <v-btn
      v-for="dialog in Object.keys($app.dialogs).filter(
        (key) => typeof $app.dialogs[key] === 'boolean'
      )"
      :key="dialog"
      @click="$app.dialogs[dialog] = !$app.dialogs[dialog]"
    >
      {{ dialog }}
    </v-btn>

    <v-btn
      v-for="dialog in Object.keys($app.dialogs).filter(
        (key) => typeof $app.dialogs[key] === 'object'
      )"
      :key="dialog"
      @click="$app.dialogs[dialog].value = !$app.dialogs[dialog].value"
    >
      {{ dialog }}
    </v-btn>
    <v-btn
      v-for="dialog in Object.keys($chat.dialogs).filter(
        (key) => typeof $chat.dialogs[key] === 'object'
      )"
      :key="dialog"
      @click="$chat.dialogs[dialog].value = !$chat.dialogs[dialog].value"
    >
      {{ dialog }}
    </v-btn>
    <v-btn
      v-for="dialog in Object.keys($user.dialogs).filter(
        (key) => typeof $user.dialogs[key] === 'object'
      )"
      :key="dialog"
      @click="$user.dialogs[dialog].value = !$user.dialogs[dialog].value"
    >
      {{ dialog }}
    </v-btn>
  </v-container>
</template>

<script setup lang="ts"></script>

<style scoped></style>
