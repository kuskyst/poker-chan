<template>
  <v-card v-if="score > 0" height="130" width="90">
    <v-card-title class="text-end">{{ open ? score : '??' }}</v-card-title>
    <v-card-subtitle v-if="score % 2 == 0" class="text-center">♥⬧<br>♧♤</v-card-subtitle>
    <v-card-subtitle v-else class="text-center">♡♢<br>☘♠︎</v-card-subtitle>
    <v-card-title class="text-start">{{ open ? score : '??' }}</v-card-title>
  </v-card>
  <v-card v-else height="130" width="90" class="d-flex align-center justify-center">☕</v-card>
</template>

<script setup lang="ts">
defineProps<{
  score: number,
  open: boolean
}>()
</script>