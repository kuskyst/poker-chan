<template>
  <div height="100vh">
    <div width="80%" class="bg-teal-accent-3 text-grey-darken-2 pt-3 pl-3 pr-3 text-h6">
      <v-text-field
        append-inner-icon="mdi-check-bold"
        v-model="room.title"
        bg-color="white"
        label="title"
        variant="solo"
        clearable
        @blur="sendMessage({title: room?.title})"
        @click:append-inner="sendMessage({title: room?.title})"
      />
      <v-row justify="center" align-items="center">
        <v-col cols="4">
          <v-text-field
            append-inner-icon="mdi-check-bold"
            v-model="yourName"
            bg-color="white"
            label="your name"
            variant="solo"
            @blur="sendMessage({name: yourName})"
            @click:append-inner="sendMessage({name: yourName})"
          />
        </v-col>
        <v-col class="text-truncate text-body-1">members: {{ room?.members.map((member) => member.name).sort().join(', ') }}</v-col>
      </v-row>
      <v-icon class="ml-3 mr-3" v-if="status === 'CLOSED'" icon="mdi-connection" />
      <v-icon class="ml-3 mr-3" v-else-if="status === 'OPEN'" icon="mdi-cast-connected" />
      <v-icon class="ml-3 mr-3" v-else icon="mdi-transit-connection-variant" />
      Vote: {{ Object.keys(room?.votes).length }} / {{ room?.members.length }}
      <v-btn color="blue" class="ml-3 mr-3" @click="reveal" prepend-icon="mdi-send" :disabled="room?.reveal || room?.members.length != Object.keys(room?.votes).length">Reveal</v-btn>
      <v-btn color="red" class="ma-3" @click="reset" prepend-icon="mdi-delete" :disabled="Object.keys(room?.votes).length == 0">Reset</v-btn>
      Average: {{ room?.reveal ? (Object.values(room?.votes).map(parseFloat)
        .reduce((sum, element) => sum + element, 0)) / Object.values(room?.votes).filter(v => v > 0).length : '??' }}
    </div>

    <v-container>
      <v-sheet class="d-flex" @drop.prevent="onDrop" @dragover.prevent border="xl" rounded="xl" color="green-lighten-2 position-relative" width="100%" height="45vh">
        <v-card class="position-absolute top-0 left-0 bottom-0 right-0 bg-transparent ma-auto" border="surface-light lg" rounded="xl" width="70%" height="70%" />
        <v-row justify="start" style="max-height: calc(var(--v-space-md) * 2); overflow-x: auto;">
        <v-col cols="auto" class="text-grey-darken-2" v-for="([uuid, vote], index) in Object.entries(room?.votes)" :key="uuid" :style="votesStyle(index)">
          <score-card
            :open="room?.reveal"
            :score="vote"
            :class="{
              'bg-red-lighten-4': room?.reveal && Math.min(...Object.values(room?.votes).filter(v => v > 0)) == vote,
              'bg-blue-lighten-4': room?.reveal && Math.max(...Object.values(room?.votes)) == vote,
              'mb-1': room?.reveal
            }"
          />
          {{ room?.reveal ? room.members.filter(v => v.uuid === uuid.toString())[0]?.name : '' }}
        </v-col>
      </v-row>
      </v-sheet>

      <v-row class="ml-1 overflow-x-scroll flex-nowrap">
        <v-col v-for="(hand, index) in hands" :key="index" cols="auto" class="d-flex justify-center">
          <score-card
            draggable="true"
            class="ma-1"
            :open="true"
            :score="hand"
            @dragstart="onDrag(hand, $event)"
            @click="play(hand)"
            :ripple="{ class: 'bg-green-accent-1' }"
            :class="{
              'bg-green-accent-2': score == hand,
              'text-white': score == hand
            }"
          />
        </v-col>
        <v-col>
          <v-card height="130" width="90" class="ma-1">
            <v-number-input flat hide-details inset v-model="drawScore" variant="solo" controlVariant="stacked" :max="99" :min="1" />
            <v-btn elevation="0" height="60%" width="100%" append-icon="mdi-credit-card-plus-outline" @click="draw(drawScore)" :ripple="{ class: 'bg-green-accent-1' }">draw</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  votesStyle,
  room,
  yourName,
  hands,
  score,
  drawScore,
  sendMessage,
  play,
  draw,
  reset,
  reveal,
  status,
  initialize
} from '~/usecases/roomUseCase'

initialize(useRoute().query.id as string)

const onDrag = (score: number, event: any) => event.dataTransfer.setData('score', JSON.stringify(score))
const onDrop = (event: any) => play(Number(event.dataTransfer.getData('score')))

</script>
