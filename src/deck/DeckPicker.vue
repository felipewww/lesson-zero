<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import DeckBackground from './DeckBackground.vue'
import type { DeckInfo } from './slides'

/**
 * Tela inicial: escolhe qual apresentação abrir.
 * Clique num card ou use as teclas 1, 2, 3...
 */
const props = defineProps<{ decks: DeckInfo[] }>()
const emit = defineEmits<{ select: [id: string] }>()

function onKey(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey) return
  const deck = props.decks[Number.parseInt(e.key, 10) - 1]
  if (deck) emit('select', deck.id)
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <main class="picker">
    <DeckBackground :progress="0.5" />

    <div class="picker__content">
      <p v-reveal:fade class="kicker">apresentações</p>
      <h1 v-reveal:blur="150" class="title">Qual vamos usar <em>hoje</em>?</h1>

      <div class="cards">
        <button
          v-for="(deck, i) in decks"
          :key="deck.id"
          v-reveal="350 + i * 150"
          class="card"
          :style="deck.theme"
          @click="emit('select', deck.id)"
        >
          <span class="card__key">{{ i + 1 }}</span>
          <span class="card__audience">{{ deck.audience }}</span>
          <span class="card__title">{{ deck.title }}</span>
          <span class="card__meta">
            <span>{{ deck.slides.length }} {{ deck.slides.length === 1 ? 'slide' : 'slides' }}</span>
            <span v-if="deck.status" class="card__status">{{ deck.status }}</span>
          </span>
          <svg class="card__arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.picker {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: var(--slide-bg);
}

.picker__content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(16px, 3vh, 40px);
  padding: var(--slide-padding);
  font-size: var(--text-base);
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.title {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: clamp(16px, 2vw, 36px);
  margin-top: 2vh;
}

.card {
  font-family: var(--slide-font);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  padding: clamp(20px, 2.6vw, 48px);
  padding-right: clamp(64px, 6vw, 110px);
  border-radius: 24px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.04);
  color: var(--slide-fg);
  font: inherit;
  text-align: left;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition:
    transform 0.4s var(--ease-out),
    border-color 0.4s,
    background 0.4s,
    box-shadow 0.4s;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-6px);
  border-color: var(--slide-accent);
  background: color-mix(in srgb, var(--slide-accent) 8%, transparent);
  box-shadow: 0 30px 70px -30px var(--slide-accent);
  outline: none;
}

.card__key {
  position: absolute;
  top: clamp(16px, 2vw, 32px);
  right: clamp(16px, 2vw, 32px);
  display: grid;
  place-items: center;
  width: 1.8em;
  height: 1.8em;
  border-radius: 0.5em;
  font-family: var(--slide-font-mono);
  font-size: 0.75em;
  color: var(--slide-muted);
  border: 1px solid rgb(255 255 255 / 0.15);
}

.card__audience {
  font-family: var(--slide-font-mono);
  font-size: 0.65em;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-accent);
}

.card__title {
  font-size: 1.35em;
  line-height: 1.2;
  font-weight: 800;
  text-wrap: balance;
}

.card__meta {
  display: flex;
  align-items: center;
  gap: 0.8em;
  margin-top: 0.4em;
  font-size: 0.7em;
  color: var(--slide-muted);
}

.card__status {
  padding: 0.2em 0.7em;
  border-radius: 999px;
  color: #fbbf24;
  border: 1px solid rgb(251 191 36 / 0.4);
}

.card__arrow {
  position: absolute;
  right: clamp(16px, 2vw, 32px);
  bottom: clamp(16px, 2vw, 32px);
  width: 1.4em;
  height: 1.4em;
  fill: none;
  stroke: var(--slide-accent);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: translate 0.4s var(--ease-out);
}

.card:hover .card__arrow,
.card:focus-visible .card__arrow {
  translate: 6px 0;
}
</style>
