<template>
  <v-container>
    <v-text-field label="title" variant="outlined" clearable />
    <v-row justify="center" align-items="center">
      <v-col>
        <v-text-field label="your name" variant="outlined" v-model="yourName" />
      </v-col>
      <v-col>participants: {{ participants.join(', ') }}</v-col>
    </v-row>

    <v-btn color="blue" @click="reveal">Reveal</v-btn>
    <v-btn color="red" class="ma-3" @click="reset">Reset</v-btn>
    Average: {{ average }}
    <v-row justify="center">
      <v-col class="justify-center">
        <v-sheet @drop.prevent="onDrop" @dragover.prevent rounded="xl" color="green-lighten-2" width="100%" height="500px">
          <div v-for="(card, index) in selectedCards" :key="index" :style="getCardStackStyle(index)">
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

const yourName = ref('名無しちゃん');
const participants = ref(['名無しちゃん1', '名無しちゃん2', '名無しちゃん3', '名無しちゃん4', '名無しちゃん5', '名無しちゃん6']);
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
  const random1 = Math.floor(Math.random() * (15 + 1 - 30)) + 30;
  const random2 = Math.floor(Math.random() * (45 + 1 - 55)) + 55;
  const random3 = Math.floor(Math.random() * (0 + 1 - 180)) + 180;
  return {
    top: `${random1}%`,
    left: `${random2}%`,
    transform: `rotate(${random3}deg)`,
    position: `absolute`,
    transition: `all 0.3s ease`,
    zIndex: index
  };
};
</script>
