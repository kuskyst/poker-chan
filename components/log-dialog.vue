<template>
  <v-dialog v-model="visible" class="w-75">
    <v-table :fixed-header="true" width="100%" max-width="100%" max-height="80%" class="pa-4 overflow-y-scroll">
      <thead>
        <tr>
          <th colspan="2" class="border-e-sm border-md bg-green-accent-2">
            <div class="d-flex align-center justify-space-between">
              Logs
              <div class="position-relative d-inline-block">
                <v-btn
                  icon="mdi-clipboard-check-multiple-outline"
                  variant="text"
                  density="compact"
                  @click="copyToClipboard(rooms)" />
                <v-snackbar
                  v-model="copied"
                  timeout="1000"
                  location="top center"
                  variant="tonal"
                  color="white"
                  class="mt-16"
                >
                  <div class="text-center font-weight-bold">copy !!</div>
                </v-snackbar>
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <th class="border-e-sm border-md bg-green-accent-1">title</th>
          <td class="border-md bg-green-accent-1">Average SP</td>
        </tr>
      </thead>
      <tbody class="overflow-y-scroll" v-for="(room, index) in rooms" :key="index">
        <tr>
          <th class="border-e-sm border-md">{{ room.title }}</th>
          <td class="border-md">
            {{
              (Object.values(room.votes).filter(v => v > 0).map(parseFloat)
                .reduce((sum, element) => sum + element, 0)) / Object.values(room.votes).filter(v => v > 0).length
            }} SP
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-btn @click="visible = false" color="blue">close</v-btn>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Room } from '~/api/entity/response'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  rooms: {
    type: Array as PropType<Room[]>,
    required: true,
  }
});

const emit = defineEmits(['update:show'])
const visible = ref(props.show)
const copied = ref(false)

watch(() => props.show, v => visible.value = v)
watch(visible, v => emit('update:show', v))

const copyToClipboard = async (rooms: Room[]) => {
  const text = rooms
    .map(room => {
      const votes = Object.values(room.votes).filter(v => v > 0)
      const average =
        votes.length > 0
          ? votes.reduce((a, b) => a + b, 0) / votes.length
          : 0

      return [`${room.title}: ${average}SP`].join('\n')}
    ).join('\n\n')

  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1000)
}

</script>

<style scoped>
.bubble-snackbar {
  position: absolute !important;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.bubble-snackbar .v-snackbar__wrapper {
  border-radius: 12px;
  padding: 6px 10px;
  font-size: 12px;
  position: relative;
}

.bubble-snackbar .v-snackbar__wrapper::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: var(--v-theme-surface) transparent transparent transparent;
}
</style>