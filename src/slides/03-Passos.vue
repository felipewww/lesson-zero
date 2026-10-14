<script setup lang="ts">
import Slide from '../deck/Slide.vue'
import { useSteps } from '../deck/steps'

const items = [
  'Cada → revela o próximo elemento marcado com v-step',
  'Cada ← esconde o último elemento revelado',
  'Os pontos no canto mostram quantos passos faltam',
  'Acabaram os passos? Aí sim muda de slide',
]

// step.value diz em que passo estamos — aqui usado para destacar o item atual
const { step } = useSteps()
</script>

<template>
  <Slide title="Passos dentro do slide" subtitle="Use as setas para revelar o conteúdo aos poucos">
    <ul class="list">
      <li v-for="(item, i) in items" :key="item" v-step:left :class="{ active: step === i + 1 }">
        {{ item }}
      </li>
    </ul>

    <p v-step:zoom class="callout">E dá para animar do jeito que quiser ✨</p>
  </Slide>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 2vh;
  list-style: none;
}

.list li {
  padding: 0.6em 1em;
  border-left: 4px solid rgb(255 255 255 / 0.1);
  border-radius: 8px;
  color: var(--slide-muted);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    color 0.4s,
    border-color 0.4s,
    background 0.4s;
}

.list li.active {
  color: var(--slide-fg);
  border-color: var(--slide-accent);
  background: rgb(56 189 248 / 0.08);
}

.callout {
  margin-top: 5vh;
  font-size: 1.4em;
  font-weight: 700;
  color: var(--slide-accent-2);
}
</style>
