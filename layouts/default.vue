<template>
  <v-app>
    <Transition>
      <slot/>
    </Transition>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { onMounted, onBeforeUnmount } from 'vue'
const theme = useTheme()
let mediaQuery: MediaQueryList
const handler = (e: MediaQueryListEvent) => theme.global.name.value = e.matches ? 'dark' : 'light'
onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  theme.global.name.value = mediaQuery.matches ? 'dark' : 'light'
  mediaQuery.addEventListener('change', handler)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', handler)
})
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
  user-select: none;
}
.v-enter-active {
    transition: opacity 2s;
}
.v-enter-active {
    transition: opacity 2s reverse;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>