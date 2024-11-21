<template>
  <div height="100vh">
    <div width="80%" class="bg-teal-accent-3 text-white pt-3 pl-3 pr-3">
      <v-text-field append-inner-icon="mdi-check-bold" v-model="title" bg-color="white" label="title" variant="solo" clearable @click:append-inner="sendMessage('title', title)" />
      <v-row justify="center" align-items="center">
        <v-col cols="4">
          <v-text-field append-inner-icon="mdi-check-bold" v-model="yourName" bg-color="white" label="your name" variant="solo" @click:append-inner="sendMessage('name', yourName)" />
        </v-col>
        <v-col class="text-truncate">members: {{ members.join(', ') }}</v-col>
      </v-row>
      Vote: {{ votes.length }} / {{ members.length }}
      <v-btn color="blue" class="ma-3" @click="reveal" prepend-icon="mdi-send" :disabled="isReveal || members.length != votes.length">Reveal</v-btn>
      <v-btn color="red" class="ma-3" @click="reset" prepend-icon="mdi-delete" :disabled="votes.length == 0">Reset</v-btn>
      Average: {{ isReveal && average > 0 ? average : '??' }}
    </div>

    <v-container>
      <v-sheet class="d-flex" @drop.prevent="onDrop" @dragover.prevent border="xl" rounded="xl" color="green-lighten-2 position-relative" width="100%" height="45vh">
        <v-card class="position-absolute top-0 left-0 bottom-0 right-0 bg-transparent ma-auto" border="surface-light lg" rounded="xl" width="70%" height="70%" />
        <div class="ma-1 text-white" v-for="(vote, index) in votes" :key="index" :style="votesStyle(index)">
          <score-card
            :open="isReveal"
            :score="vote"
            :class="{
              'bg-red-lighten-4': isReveal && Math.min(...votes.filter(v => v > 0)) == vote,
              'bg-blue-lighten-4': isReveal && Math.max(...votes) == vote,
              'mb-1': isReveal
            }"
          />
          {{ isReveal ? members[index] : '' }}
        </div>
      </v-sheet>

      <v-row class="ml-1 overflow-x-scroll flex-nowrap">
        <v-col v-for="(hand, index) in hands" :key="index" cols="auto" class="d-flex justify-center">
          <score-card
            draggable="true"
            class="ma-1"
            :open="true"
            :score="hand"
            @dragstart="onDrag(hand, $event)"
            @dblclick="play(hand)"
            :class="{
              'bg-green-accent-2': score == hand,
              'text-white': score == hand
            }"
          />
        </v-col>
        <v-col>
          <v-card height="130" width="90" class="ma-1">
            <v-number-input flat hide-details inset v-model="drawScore" variant="solo" controlVariant="stacked" :max="99" :min="1" />
            <v-btn elevation="0" height="60%" width="100%" append-icon="mdi-credit-card-plus-outline" @click="draw(drawScore)">draw</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    {{ status }}
  </div>
</template>

<script setup lang="ts">
import { ref, type StyleValue } from 'vue'
import { useWebSocket } from '@vueuse/core'

const id = useRoute().query.id as string
const { data, send, status } = useWebSocket<MessageEvent>(`wss://poker-chan-api-production.up.railway.app/ws?id=${id}`, { autoReconnect: true })

const title = ref('')
const yourName = ref('匿名ちゃん')
const members = ref([])
const hands = ref([-1, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100])
const score = ref()
const votes = ref<number[]>([])
const average = ref(0)
const isReveal = ref(false)
const drawScore = ref(10)

watch(data, (message) => {
  if (message) {
    const res = JSON.parse(message.toString())
    title.value = res.title
    isReveal.value = res.reveal
    members.value = res.members.map((member: any) => member.name)
    votes.value = Object.values(res.votes).map((score: any) => parseFloat(score))
    average.value = (votes.value.filter(v => v > 0).reduce((sum, element) => sum + element, 0) / votes.value.filter(v => v > 0).length)
  }
})

const sendMessage = (key: string, value: any) => {
  send(`{ "${key}": "${value}" }`)
}

sendMessage('name', yourName.value)

const play = (card: number) => {
  if (!isReveal.value && !isNaN(card)) {
    score.value = card
    sendMessage("vote", String(score.value))
  }
}
const draw = (card: number) => {
  if (!hands.value.includes(card)) {
    hands.value.push(card)
    hands.value.sort((a, b) => a - b)
  }
}
const reset = () => { send('{ "reset": true }') }
const reveal = () => { send('{ "reveal": true }') }

const onDrag = (score: number, event: any) => event.dataTransfer.setData('score', JSON.stringify(score))
const onDrop = (event: any) => play(event.dataTransfer.getData('score'))

const votesStyle = (index: number): StyleValue => {
  const random1 = Math.floor(Math.random() * (40 + 1 - 50)) + 50
  const random2 = Math.floor(Math.random() * (40 + 1 - 50)) + 50
  const random3 = Math.floor(Math.random() * (0 + 1 - 180)) + 180
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
    }
}
</script>
