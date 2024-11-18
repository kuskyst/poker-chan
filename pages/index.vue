<template>
  <v-container height="100vh">
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

    <v-sheet class="d-flex" @drop.prevent="onDrop" @dragover.prevent rounded="xl" color="green-lighten-2" width="100%" height="50vh">
      <div class="ma-2" v-for="(score, index) in stackScores" :key="index" :style="stackScoresStyle(index)">
        {{ isOpen ? participants[index] : '' }}
        <score-card :is-open="isOpen" :score="score" />
      </div>
    </v-sheet>

    <v-row>
      <v-col v-for="(score, index) in defaultScores" :key="index" cols="auto" class="d-flex justify-center">
        <score-card
          draggable="true"
          class="ma-1"
          :class="{'bg-grey-darken-1': selectedScore == score}"
          :is-open="true"
          :score="score"
          @dragstart="onDragStart(score, $event)"
          @dblclick="selectCard(score)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const yourName = ref('名無しちゃん');
const participants = ref(['名無しちゃん1', '名無しちゃん2', '名無しちゃん3', '名無しちゃん4', '名無しちゃん5', '名無しちゃん6']);
const defaultScores = ref([0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100]);
const selectedScore = ref();
const stackScores = ref([]);
const average = ref('??');
const isOpen = ref(false);

const selectScore = (score) => {
  if (!isOpen.value) {
    stackScores.value.push(score);
    selectedScore.value = score;
  }
}
const reset = () => {
  isOpen.value = false;
  stackScores.value.splice(0);
  average.value = '??';
}
const reveal = () => {
  isOpen.value = true;
  average.value = stackScores.value.reduce((sum, element) => sum + element, 0) / stackScores.value.length;
};

const onDragStart = (score, event) => {
  event.dataTransfer.setData('score', JSON.stringify(score));
};

const onDrop = (event) => {
  selectScore(JSON.parse(event.dataTransfer.getData('score')));
};

const stackScoresStyle = (index) => {
  const random1 = Math.floor(Math.random() * (40 + 1 - 50)) + 50;
  const random2 = Math.floor(Math.random() * (40 + 1 - 50)) + 50;
  const random3 = Math.floor(Math.random() * (0 + 1 - 180)) + 180;
  return !isOpen.value ? {
    top: `${random1}%`,
    left: `${random2}%`,
    transform: `rotate(${random3}deg) translate(-${random1}%, -${random2}%)`,
    position: `absolute`,
    margin: `auto`,
    transition: `all 0.3s ease`,
    zIndex: index
  } : {};
};
</script>
