<script setup lang="ts">
import Slide from '../deck/Slide.vue'

const cards = [
  { icon: '⚡', title: 'Animado', text: 'Use v-reveal para animar a entrada de qualquer elemento.' },
  { icon: '📐', title: 'Fluido', text: 'Ocupa 100% da tela e os tamanhos acompanham a janela.' },
  { icon: '🧩', title: 'Interativo', text: 'É Vue: botões, estado, gráficos e demos ao vivo.' },
]
</script>

<template>
  <Slide title="Slide de exemplo" subtitle="Cada slide é um componente Vue em src/slides/">
    <div class="grid">
      <article v-for="(card, i) in cards" :key="card.title" v-reveal="300 + i * 120" class="card">
        <span class="card__icon">{{ card.icon }}</span>
        <h3>{{ card.title }}</h3>
        <p>{{ card.text }}</p>
      </article>
    </div>
  </Slide>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: clamp(16px, 2vw, 40px);
}

.card {
  padding: clamp(20px, 2.5vw, 48px);
  border-radius: 24px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
  backdrop-filter: blur(8px);
  transition:
    transform 0.4s var(--ease-out),
    border-color 0.4s,
    background 0.4s;
}

.card:hover {
  transform: translateY(-8px);
  border-color: var(--slide-accent);
  background: rgb(255 255 255 / 0.07);
}

.card__icon {
  font-size: 2em;
}

.card h3 {
  margin: 0.4em 0 0.3em;
  font-size: 1.2em;
}

.card p {
  font-size: 0.8em;
  color: var(--slide-muted);
}
</style>
