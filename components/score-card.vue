<template>
  <v-card height="130" width="90">
    <v-card-title class="text-end">{{ isOpen ? score : '??' }}</v-card-title>
    <v-card-subtitle v-if="Number(score) % 2 == 0" class="text-center">❤︎♦️<br>♧♤</v-card-subtitle>
    <v-card-subtitle v-else class="text-center">♡♢<br>♣️♠︎</v-card-subtitle>
    <v-card-title class="text-start">{{ isOpen ? score : '??' }}</v-card-title>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  score: string,
  isOpen: boolean
}>()

</script>