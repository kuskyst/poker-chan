<template>
  <v-container>
    <v-btn color="blue" @click="reveal">Reveal</v-btn>
    <v-btn color="red" @click="reset">Reset</v-btn>
    Avarage: {{ average }}
    <v-row justify="center">
      <v-col cols="16" class="d-flex justify-center">
        <v-sheet @drop.prevent="onDrop" @dragover.prevent rounded="xl" color="green-lighten-2" width="100%" height="400">
          <div v-for="(card, index) in selectedCards" :key="index" class="card-stack" :style="getCardStackStyle(index)">
            <v-card height="135" width="80">
              <v-card-title class="text-end">{{ isOpen ? card : '??' }}</v-card-title>
              <v-card-subtitle v-if="card % 2 == 0" class="text-center">❤︎♦️<br>♧♤</v-card-subtitle>
              <v-card-subtitle v-else class="text-center">♡♢<br>♣️♠︎</v-card-subtitle>
              <v-card-title class="text-start">{{ isOpen ? card : '??' }}</v-card-title>
            </v-card>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col v-for="(card, index) in cards" :key="index" cols="auto" class="d-flex justify-center">
        <v-card
          height="135"
          width="80"
          class="ma-1"
          :class="{'bg-grey-darken-1': selectedCard == card}"
          draggable="true"
          @dragstart="onDragStart(card, $event)"
          @dblclick="selectCard(card)"
        >
          <v-card-title class="text-end">{{ card }}</v-card-title>
          <v-card-subtitle v-if="card % 2 == 0" class="text-center">❤︎♦️<br>♧♤</v-card-subtitle>
          <v-card-subtitle v-else class="text-center">♡♢<br>♣️♠︎</v-card-subtitle>
          <v-card-title class="text-start">{{ card }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const cards = ref([0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100]);
const selectedCard = ref();
const selectedCards = ref([]);
const average = ref('??');
const isOpen = ref(false);

const selectCard = (card) => {
  if (!isOpen.value) {
    selectedCards.value.push(card);
    selectedCard.value = card;
  }
}
const reset = () => {
  isOpen.value = false;
  selectedCards.value.splice(0);
  average.value = '??';
}
const reveal = () => {
  isOpen.value = true;
  average.value = selectedCards.value.reduce((sum, element) => sum + element, 0) / selectedCards.value.length;
};

const onDragStart = (card, event) => {
  event.dataTransfer.setData('card', JSON.stringify(card));
};

const onDrop = (event) => {
  const card = JSON.parse(event.dataTransfer.getData('card'));
  selectCard(card);
};

const getCardStackStyle = (index) => {
  const random1 = Math.floor(Math.random() * (20 + 1 - 30)) + 30;
  const random2 = Math.floor(Math.random() * (45 + 1 - 55)) + 55;
  const random3 = Math.floor(Math.random() * (0 + 1 - 180)) + 180;
  return {
    top: `${random1}%`,
    left: `${random2}%`,
    transform: `rotate(${random3}deg)`,
    zIndex: index
  };
};
</script>

<style scoped>
.card-stack {
  position: absolute;
  transition: all 0.3s ease;
}
</style>
