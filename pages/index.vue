<template>
  <v-container>
    <v-row justify="center">
      <!-- フィールドエリア -->
      <v-col cols="12" class="d-flex justify-center">
        <div class="game-field" @drop.prevent="onDrop" @dragover.prevent>
          <!-- ドロップされたカードを表示 -->
          <div v-for="(card, index) in droppedCards" :key="index" class="card-stack" :style="getCardStackStyle(index)">
            <v-card class="card" :style="cardStyle" @dragEnd="onDragEnd(card, $event)">
                <v-card-title class="text-end">{{ card }}</v-card-title>
                <v-card-subtitle v-if="card % 2 == 0" class="text-center">❤︎♦️<br>♧♤</v-card-subtitle>
                <v-card-subtitle v-else class="text-center">♡♢<br>♣️♠︎</v-card-subtitle>
                <v-card-title class="text-start">{{ card }}</v-card-title>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col v-for="(card, index) in cards" :key="index" cols="auto" class="d-flex justify-center">
        <v-card class="card" :draggable="true" @dragstart="onDragStart(card, $event)">
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

const cards = ref([0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 40]);
const droppedCards = ref([]);

const cardStyle = ref({
  position: 'absolute',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
});

const onDragStart = (card, event) => {
  event.dataTransfer.setData('card', JSON.stringify(card));
};

const onDrop = (event) => {
  const card = JSON.parse(event.dataTransfer.getData('card'));
  droppedCards.value.push(card);
};

const getCardStackStyle = (index) => {
  const stackHeight = 20; // 重なりの高さ
  return {
    top: `${index * stackHeight}px`,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: index, // スタック順を調整
  };
};

const onDragEnd = (card, event) => {
  const cardElement = event.target;
  const offsetX = event.clientX - cardElement.getBoundingClientRect().left;
  const offsetY = event.clientY - cardElement.getBoundingClientRect().top;

  const onMouseMove = (e) => {
    cardStyle.value.left = `${e.clientX - offsetX}px`;
    cardStyle.value.top = `${e.clientY - offsetY}px`;
  };
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    droppedCards.value.push(card);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};
</script>

<style scoped>
.game-field {
  width: 100%;
  height: 300px;
  position: relative;
  border: 2px dashed #aaa;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.card-stack {
  position: absolute;
  transition: all 0.3s ease;
}

.card {
  width: 80px;
  height: 130px;
  margin: 5px;
}
</style>
