<template>
  <div>
    <p>Please use CTRL + ALT + M Menu.</p>
    <p>You are using a prototype version of Progressive UI.</p>
    <p>
      Disable this by setting
      <code>PROGRESSIVE_UI</code>
      to
      <code>0</code>
      in CTRL + ALT + M Menu > Experiments
    </p>

    <v-btn @click="$app.dialogs.actionDialog = !$app.dialogs.actionDialog">
      Open Dialog
    </v-btn>
  </div>
</template>
<script setup lang="ts"></script>
