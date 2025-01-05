import { ref, watch, type StyleValue } from 'vue'
import useWebSocketRepository from '~/api/repository'
import type { Room } from '~/api/entity/response'
import type { Message } from '~/api/entity/request'

const room = ref<Room>({ title: '', members: [], votes: new Map<string, number>(), reveal: false })
const yourName = ref('匿名ちゃん')
const hands = ref([-1, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100])
const score = ref()
const average = ref(0)
const drawScore = ref(10)

let repository: ReturnType<typeof useWebSocketRepository>
const status = ref('connectining')

const initialize = (id: string) => {
  repository = useWebSocketRepository(id)
  const { data, status: wsStatus } = repository

  sendMessage({ name: yourName.value })

  watch(wsStatus, (wsStatus) => {
    status.value = wsStatus
  })

  watch(data, (message) => {
    status.value = status.value
    if (message) {
      room.value = JSON.parse(message.toString())
      if (Object.keys(room?.value?.votes).length <= 0) {
        score.value = 0
      }
      average.value = (Object.values(room?.value?.votes).map(parseFloat)
        .reduce((sum, element) => sum + element, 0)) / Object.values(room?.value?.votes).filter(v => v > 0).length
    }
  })
}

const sendMessage = (message: Message) => {
  repository.sendMessage(message)
}

const play = (card: number) => {
  if (!room.value?.reveal && !isNaN(card)) {
    score.value = card
    sendMessage({ vote: String(score.value) })
  }
}

const draw = (card: number) => {
  if (!hands.value.includes(card)) {
    hands.value.push(card)
    hands.value.sort((a, b) => a - b)
  }
}

const reset = () => { sendMessage({ reset: true }) }
const reveal = () => { sendMessage({ reveal: true }) }

const votesStyle = (index: number): StyleValue => {
  const random1 = Math.floor(Math.random() * (40 + 1 - 50)) + 50
  const random2 = Math.floor(Math.random() * (40 + 1 - 50)) + 50
  const random3 = Math.floor(Math.random() * (0 + 1 - 180)) + 180
  return !room.value?.reveal ?
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

export {
  votesStyle,
  room,
  yourName,
  hands,
  score,
  average,
  drawScore,
  sendMessage,
  play,
  draw,
  reset,
  reveal,
  status,
  initialize
}