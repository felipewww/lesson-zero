<script setup lang="ts">
import Slide from '../deck/Slide.vue'
import { useSteps } from '../deck/steps'

// Passos 1..4 = cada decisão; 5 = frase final (tudo some e ela aparece palavra a palavra)
const { step } = useSteps()
const FINAL = 5

const choices = [
  { title: 'Escolheria uma área.', sub: 'Não tentaria aprender tudo.' },
  { title: 'Estudaria e construiria projetos.', sub: 'A prática transforma informação em conhecimento.' },
  {
    title: 'Aprenderia a programar sem depender da IA.',
    sub: 'Depois usaria a IA para acelerar meu desenvolvimento.',
  },
  {
    title: 'Construiria minha carreira sem me comparar com os outros.',
    sub: 'O crescimento vem com estudo, prática e experiência.',
  },
]

const line1 = 'Não aprenda apenas a escrever código.'.split(' ')
const line2 = ['Aprenda', 'a']
const line2Grad = 'resolver problemas.'
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-final': step >= FINAL }">
      <div class="content">
        <h1 v-reveal:blur class="title">Se eu estivesse começando <em>hoje</em>…</h1>

        <ol class="grid">
          <li
            v-for="(c, i) in choices"
            :key="c.title"
            v-step:zoom
            class="card"
            :class="{ 'is-current': step === i + 1 }"
          >
            <span class="card__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <p class="card__title">{{ c.title }}</p>
            <p class="card__sub">{{ c.sub }}</p>
          </li>
        </ol>
      </div>

      <blockquote v-step:fade class="final">
        <p class="final__line final__line--1">
          <span v-for="(w, i) in line1" :key="i" class="word" :style="{ '--i': i }">{{ w }}</span>
        </p>
        <p class="final__line final__line--2">
          <span v-for="(w, i) in line2" :key="i" class="word" :style="{ '--i': line1.length + 2 + i }">{{ w }}</span>
          <span class="word word--grad" :style="{ '--i': line1.length + 2 + line2.length }">{{ line2Grad }}</span>
        </p>
      </blockquote>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  position: relative;
  height: 100%;
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(20px, 5vh, 64px);
  transition:
    filter 1s var(--ease-out),
    opacity 1s var(--ease-out),
    scale 1s var(--ease-out);
}

.is-final .content {
  filter: blur(10px);
  opacity: 0;
  scale: 0.95;
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

/* ---------- as 4 decisões ---------- */
.grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(12px, 2vw, 32px);
}

@media (max-aspect-ratio: 1 / 1) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1em;
  align-items: baseline;
  padding: clamp(16px, 2vw, 36px);
  border-radius: 22px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
  font-size: calc(var(--text-base) * 1.1);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s,
    box-shadow 0.4s;
}

.card.is-current {
  border-color: var(--slide-accent);
  background: rgb(56 189 248 / 0.07);
  box-shadow: 0 20px 50px -24px var(--slide-accent);
}

.card__n {
  grid-row: span 2;
  font-family: var(--slide-font-mono);
  font-size: 1.6em;
  font-weight: 700;
  background: linear-gradient(160deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.card__title {
  font-size: 1.15em;
  font-weight: 700;
  line-height: 1.25;
}

.card__sub {
  margin-top: 0.4em;
  font-size: 0.85em;
  line-height: 1.35;
  color: var(--slide-muted);
}

/* ---------- frase final, palavra a palavra ---------- */
.final {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25em;
  padding: 0 4vw;
  text-align: center;
  font-size: var(--text-title);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.final__line {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.28em;
}

.final__line--1 {
  font-size: 0.7em;
  font-weight: 600;
  color: var(--slide-muted);
}

.final__line--2 {
  font-size: 1.1em;
}

.word {
  display: inline-block;
  opacity: 0;
  translate: 0 0.4em;
  filter: blur(8px);
  transition:
    opacity 0.7s var(--ease-out),
    translate 0.7s var(--ease-out),
    filter 0.7s var(--ease-out);
}

.word--grad {
  white-space: nowrap;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.final[data-step-shown] .word {
  opacity: 1;
  translate: 0 0;
  filter: blur(0);
  transition-delay: calc(700ms + var(--i) * 160ms);
}
</style>
