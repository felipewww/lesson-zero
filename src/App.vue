<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SlideDeck from './deck/SlideDeck.vue'
import DeckPicker from './deck/DeckPicker.vue'
import { decks } from './decks'

// A primeira parte da URL escolhe a apresentação (#/ensino-medio/3/2); sem ela, mostra a escolha
const deckId = ref(readDeckId())
const deck = computed(() => decks.find((d) => d.id === deckId.value))

function readDeckId() {
  return window.location.hash.replace(/^#\/?/, '').split('/')[0]
}

function open(id: string) {
  window.location.hash = `/${id}/1`
}

function home() {
  window.location.hash = '/'
}

function onHashChange() {
  deckId.value = readDeckId()
}

onMounted(() => window.addEventListener('hashchange', onHashChange))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHashChange))
</script>

<template>
  <SlideDeck v-if="deck" :id="deck.id" :key="deck.id" :slides="deck.slides" :theme="deck.theme" @home="home" />
  <DeckPicker v-else :decks="decks" @select="open" />
</template>
