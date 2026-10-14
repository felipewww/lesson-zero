<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../deck/Slide.vue'
import Icon, { type IconName } from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passos 1..7: cada parada da trilha.  Passo 8: trilha paralela do inglês
const { step } = useSteps()

const stops: { icon: IconName; title: string; detail: string }[] = [
  { icon: 'puzzle', title: 'Lógica', detail: 'de programação' },
  { icon: 'code', title: 'JavaScript', detail: 'e depois TypeScript' },
  { icon: 'monitor', title: 'HTML e CSS', detail: 'a cara da web' },
  { icon: 'database', title: 'SQL', detail: 'e bancos de dados' },
  { icon: 'network', title: 'APIs', detail: 'comunicação entre sistemas' },
  { icon: 'git-branch', title: 'Git', detail: 'controle de versões' },
  { icon: 'layers', title: 'React ou Vue', detail: 'fundamentos de frontend' },
]

// Preenchimento da linha: do centro da 1ª parada até a parada atual
const fill = computed(() => Math.max(0, Math.min(step.value, stops.length) - 1) / (stops.length - 1))
</script>

<template>
  <Slide>
    <div class="stage">
      <header>
        <p v-reveal:fade class="kicker">construindo a base</p>
        <h1 v-reveal:blur="150" class="title">O que eu aprenderia <em>primeiro</em>?</h1>
      </header>

      <div class="trail">
        <div class="track" aria-hidden="true">
          <span class="track__fill" :style="{ transform: `scaleX(${fill})` }" />
        </div>

        <ol class="stops">
          <li
            v-for="(s, i) in stops"
            :key="s.title"
            v-step:zoom
            class="stop"
            :class="{ 'is-current': step === i + 1, 'is-done': step > i + 1 }"
          >
            <span class="stop__dot"><Icon :name="s.icon" /></span>
            <strong class="stop__title">{{ s.title }}</strong>
            <span class="stop__detail">{{ s.detail }}</span>
          </li>
        </ol>

        <div v-step:up class="parallel">
          <span class="parallel__line" aria-hidden="true" />
          <span class="parallel__tag">
            <Icon name="languages" class="parallel__icon" />
            <span><small>em paralelo</small> Inglês para leitura técnica</span>
          </span>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(32px, 8vh, 110px);
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slide-accent);
}

.title {
  margin-top: 0.3em;
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

/* ---------- trilha ---------- */
.trail {
  --dot: clamp(52px, 6vw, 110px);
  position: relative;
}

.track {
  position: absolute;
  top: calc(var(--dot) / 2 - 2px);
  left: calc(100% / 14);
  right: calc(100% / 14);
  height: 4px;
  border-radius: 2px;
  background: rgb(255 255 255 / 0.08);
  overflow: hidden;
}

.track__fill {
  position: absolute;
  inset: 0;
  transform-origin: left;
  background: linear-gradient(90deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  transition: transform 0.8s var(--ease-out);
}

.stops {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.stop {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25em;
  font-size: calc(var(--text-base) * 0.95);
  line-height: 1.2;
}

.stop__dot {
  display: grid;
  place-items: center;
  width: var(--dot);
  height: var(--dot);
  margin-bottom: 0.6em;
  border-radius: 50%;
  font-size: calc(var(--dot) * 0.42);
  color: var(--slide-fg);
  background: rgb(10 15 30 / 0.9);
  border: 2px solid rgb(255 255 255 / 0.15);
  transition:
    border-color 0.4s,
    box-shadow 0.4s,
    color 0.4s,
    scale 0.4s var(--ease-out);
}

.stop__title {
  font-size: 1.1em;
}

.stop__detail {
  color: var(--slide-muted);
  font-size: 0.85em;
  text-wrap: balance;
}

.stop.is-done .stop__dot {
  border-color: var(--slide-accent-2);
  color: var(--slide-accent-2);
}

.stop.is-current .stop__dot {
  scale: 1.12;
  border-color: var(--slide-accent);
  color: var(--slide-accent);
  box-shadow: 0 0 40px -6px var(--slide-accent);
}

/* ---------- trilha paralela: inglês ---------- */
.parallel {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: clamp(28px, 6vh, 72px);
}

.parallel__line {
  position: absolute;
  top: 50%;
  left: calc(100% / 14);
  right: calc(100% / 14);
  height: 2px;
  background: repeating-linear-gradient(90deg, #fbbf24 0 12px, transparent 12px 24px);
  background-size: 24px 2px;
  opacity: 0.6;
  animation: march 1.2s linear infinite;
}

@keyframes march {
  to {
    background-position: 24px 0;
  }
}

.parallel__tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.6em 1.3em;
  border-radius: 999px;
  font-size: var(--text-base);
  font-weight: 700;
  color: #fde68a;
  background: rgb(30 22 5 / 0.95);
  border: 1px solid rgb(251 191 36 / 0.5);
  box-shadow: 0 0 40px -10px #fbbf24;
}

.parallel__tag small {
  margin-right: 0.5em;
  font-family: var(--slide-font-mono);
  font-size: 0.65em;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fbbf24;
}

.parallel__icon {
  font-size: 1.4em;
  color: #fbbf24;
}

/* ---------- tela em pé: trilha vira grade ---------- */
@media (max-aspect-ratio: 1 / 1) {
  .stops {
    grid-template-columns: repeat(4, 1fr);
    row-gap: 32px;
  }

  .track,
  .parallel__line {
    display: none;
  }
}
</style>
