<template>
  <v-container height="100vh">
    <v-text-field label="title" variant="outlined" clearable />
    <v-row justify="center" align-items="center">
      <v-col cols="3">
        <v-text-field label="your name" variant="outlined" v-model="yourName" />
      </v-col>
      <v-col>participants: {{ participants.join(', ') }}</v-col>
    </v-row>

    Vote: {{ stackScores.length }} / {{ participants.length }}
    <v-btn color="blue" class="ma-3" @click="reveal" prepend-icon="mdi-send" :disabled="participants.length != stackScores.length">Reveal</v-btn>
    <v-btn color="red" class="ma-3" @click="reset" prepend-icon="mdi-delete" :disabled="stackScores.length == 0">Reset</v-btn>
    Average: {{ Math.floor((average) * 100) / 100 }}

    <v-sheet class="d-flex" @drop.prevent="onDrop" @dragover.prevent border="xl" rounded="xl" color="green-lighten-2 position-relative" width="100%" height="50vh">
      <v-card class="position-absolute top-0 left-0 bottom-0 right-0 bg-transparent ma-auto" border="surface-light lg" rounded="xl" width="70%" height="70%"></v-card>
      <div class="ma-2" v-for="(score, index) in stackScores" :key="index" :style="stackScoresStyle(index)">
        {{ isReveal ? participants[index] : '' }}
        <score-card :is-open="isReveal" :score="score" />
      </div>
    </v-sheet>

    <v-row class="ml-1 overflow-x-scroll flex-nowrap">
      <v-col v-for="(score, index) in hands" :key="index" cols="auto" class="d-flex justify-center">
        <score-card
          draggable="true"
          class="ma-1"
          :class="{'bg-grey-darken-1': selectedScore == score}"
          :is-open="true"
          :score="score"
          @dragstart="onDragStart(score, $event)"
          @dblclick="play(score)"
        />
      </v-col>
      <v-col>
        <v-card v-if="!drawMode" height="130" width="80" class="ma-1 d-flex align-center justify-center" @click="drawMode = true">
          <v-icon icon="mdi-asterisk" />
        </v-card>
        <v-card v-else height="130" width="80" class="ma-1">
          <v-card-title class="text-end"><v-text-field type="number" v-model="drawScore" variant="underlined" class="text-end" /></v-card-title>
          <v-card-subtitle class="text-center"><v-btn width="26" height="26" icon="mdi-plus" @click="draw(drawScore)" /></v-card-subtitle>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          draggable="true"
          height="130"
          width="80"
          class="ma-1 d-flex align-center justify-center"
          @dragstart="onDragStart(0, $event)"
          @dblclick="play(0)"
        >
          ☕
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, type StyleValue } from 'vue';

const yourName = ref('名無しちゃん');
const participants = ref(['名無しちゃん1', '名無しちゃん2', '名無しちゃん3', '名無しちゃん4', '名無しちゃん5', '名無しちゃん6']);
const hands = ref([0.5, 1, 2, 3, 5, 8, 10, 13, 20, 40, 100]);
const selectedScore = ref();
const stackScores = ref<number[]>([]);;
const average = ref(0);
const isReveal = ref(false);
const drawMode = ref(false);
const drawScore = ref(10);

const play = (score: number) => {
  if (!isReveal.value && !isNaN(score) && participants.value.length != stackScores.value.length) {
    stackScores.value.push(score);
    selectedScore.value = score;
  }
}
const draw = (score: number) => {
  if (!hands.value.includes(score)) {
    hands.value.push(score);
    hands.value.sort((a, b) => a - b);
  }
  drawMode.value = false;
}
const reset = () => {
  isReveal.value = false;
  stackScores.value.splice(0);
  average.value = 0;
}
const reveal = () => {
  isReveal.value = true;
  average.value = stackScores.value.reduce((sum, element) => sum + element, 0) / stackScores.value.filter(v => v != 0).length;
};

const onDragStart = (score: number, event: any) => {
  drawMode.value = false;
  event.dataTransfer.setData('score', JSON.stringify(score));
};

const onDrop = (event: any) => {
  play(JSON.parse(event.dataTransfer.getData('score')));
};

const stackScoresStyle = (index: any): StyleValue => {
  const random1 = Math.floor(Math.random() * (40 + 1 - 50)) + 50;
  const random2 = Math.floor(Math.random() * (40 + 1 - 50)) + 50;
  const random3 = Math.floor(Math.random() * (0 + 1 - 180)) + 180;
  return !isReveal.value ?
    {
      top: `${random1}%`,
      left: `${random2}%`,
      transform: `rotate(${random3}deg) translate(-${random1}%, -${random2}%)`,
      position: 'absolute',
      margin: 'auto',
      transition: 'all 0.3s ease',
      zIndex: index
    } :
    {
      transition: 'all 1s ease',
      transform: 'rotate(0deg) translate(0%, 0%)',
    };
};
</script>
