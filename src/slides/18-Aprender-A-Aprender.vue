<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Slide from '../deck/Slide.vue'
import Icon, { type IconName } from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passos 1..3 = o que vai mudar; 4 = "sua capacidade de aprender precisa acompanhar"
const { step } = useSteps()

const changes: { icon: IconName; text: string; cycle: string[]; color: string }[] = [
  {
    icon: 'layers',
    text: 'As tecnologias vão mudar.',
    cycle: ['jQuery', 'Angular', 'React', 'Vue', '?'],
    color: 'var(--slide-accent)',
  },
  {
    icon: 'code',
    text: 'As linguagens vão evoluir.',
    cycle: ['JavaScript', 'TypeScript', '?'],
    color: 'var(--slide-accent-2)',
  },
  {
    icon: 'sparkles',
    text: 'As ferramentas de IA vão melhorar.',
    cycle: ['autocompletar', 'chat', 'agentes', '?'],
    color: 'var(--slide-accent-3)',
  },
]

// Cada card troca de "versão" sozinho, mostrando que nada fica parado
const tick = ref(0)
let timer: number | undefined
onMounted(() => (timer = window.setInterval(() => tick.value++, 1400)))
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-open': step >= 1 }">
      <header class="head">
        <p v-reveal:fade class="kicker">a habilidade mais importante do futuro</p>
        <h1 class="hero">
          <span v-reveal:blur="200">Aprender</span>
          <span v-reveal:zoom="500" class="hero__a">a</span>
          <span class="hero__grad">aprender</span>
        </h1>
      </header>

      <div class="cards">
        <article
          v-for="(c, i) in changes"
          :key="c.text"
          v-step
          class="card"
          :style="{ '--c': c.color }"
        >
          <span class="card__icon"><Icon :name="c.icon" /></span>
          <p class="card__text">{{ c.text }}</p>
          <div class="card__cycle">
            <Icon name="refresh" class="card__spin" />
            <Transition name="swap" mode="out-in">
              <span :key="(tick + i) % c.cycle.length">{{ c.cycle[(tick + i) % c.cycle.length] }}</span>
            </Transition>
          </div>
        </article>
      </div>

      <p v-step:zoom class="close">
        <span>Sua capacidade de <em>continuar aprendendo</em> precisa acompanhar tudo isso.</span>
      </p>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(20px, 5vh, 64px);
}

.head {
  text-align: center;
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.75);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 0 0.28em;
  margin-top: 0.2em;
  font-size: calc(var(--text-hero) * 1.15);
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  transition: font-size 0.8s var(--ease-out);
}

.is-open .hero {
  font-size: var(--text-title);
}

.hero__a {
  font-weight: 300;
  color: var(--slide-muted);
}

.hero__grad {
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3), var(--slide-accent));
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation:
    reveal-blur 0.9s var(--ease-out) 800ms backwards,
    shimmer 6s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 300% 0;
  }
}

/* ---------- o que vai mudar ---------- */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(12px, 2vw, 32px);
  max-height: 0;
  transition: max-height 0.8s var(--ease-out);
}

.is-open .cards {
  max-height: 60vh;
}

@media (max-aspect-ratio: 1 / 1) {
  .cards {
    grid-template-columns: 1fr;
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  padding: clamp(16px, 2vw, 36px);
  border-radius: 22px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
  font-size: var(--text-base);
}

.card__icon {
  display: grid;
  place-items: center;
  width: 2.4em;
  height: 2.4em;
  border-radius: 0.7em;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 14%, transparent);
}

.card__icon :deep(.icon) {
  width: 1.4em;
  height: 1.4em;
}

.card__text {
  font-size: 1.1em;
  font-weight: 700;
  line-height: 1.25;
}

.card__cycle {
  font-family: var(--slide-font-mono);
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.95em;
  color: var(--c);
  height: 1.5em;
  overflow: hidden;
}

.card__spin {
  opacity: 0.6;
  animation: spin 2.8s linear infinite;
}

@keyframes spin {
  to {
    rotate: 360deg;
  }
}

.card__cycle span {
  display: inline-block;
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.3s,
    translate 0.3s var(--ease-out);
}

.swap-enter-from {
  opacity: 0;
  translate: 0 0.8em;
}

.swap-leave-to {
  opacity: 0;
  translate: 0 -0.8em;
}

/* ---------- fechamento ---------- */
.stage:not(.is-open) .close {
  display: none;
}

.close {
  text-align: center;
  font-size: calc(var(--text-title) * 0.75);
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.close > span {
  text-wrap: balance;
}

.close em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
