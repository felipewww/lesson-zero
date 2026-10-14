<script setup lang="ts">
import Slide from '../deck/Slide.vue'
import Icon, { type IconName } from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passos 1..5: cada etapa do ciclo. No passo 5 o centro vira "habilidade".
const { step } = useSteps()

const stages: { icon: IconName; text: string; color: string }[] = [
  { icon: 'book-open', text: 'Faça cursos', color: 'var(--slide-accent)' },
  { icon: 'terminal', text: 'Pratique os exercícios', color: 'var(--slide-accent-2)' },
  { icon: 'box', text: 'Construa seus próprios projetos', color: '#34d399' },
  { icon: 'bug', text: 'Erre, investigue e corrija', color: '#fbbf24' },
  { icon: 'refresh', text: 'Repita até compreender', color: 'var(--slide-accent-3)' },
]

// Posição de cada etapa no anel (começa no topo, sentido horário)
const pos = (i: number) => {
  const a = (-90 + (i * 360) / stages.length) * (Math.PI / 180)
  return { left: `${50 + 40 * Math.cos(a)}%`, top: `${50 + 40 * Math.sin(a)}%` }
}
</script>

<template>
  <Slide>
    <div class="layout">
      <h1 v-reveal:blur class="title">
        <span>Consumir conteúdo <em>não é</em> o mesmo que desenvolver uma habilidade.</span>
      </h1>

      <div v-reveal:zoom="300" class="cycle" :class="{ 'is-done': step >= stages.length }">
        <svg class="ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="ring__base" cx="50" cy="50" r="40" />
          <circle
            class="ring__fill"
            cx="50"
            cy="50"
            r="40"
            pathLength="1"
            :style="{ strokeDashoffset: 1 - Math.min(step, stages.length) / stages.length }"
          />
        </svg>

        <div class="center">
          <span class="center__state center__state--before">
            <Icon name="play" />
            <span>conteúdo</span>
          </span>
          <span class="center__state center__state--after">
            <Icon name="zap" />
            <span>habilidade</span>
          </span>
        </div>

        <div
          v-for="(s, i) in stages"
          :key="s.text"
          v-step:zoom
          class="node"
          :class="{ 'is-current': step === i + 1 }"
          :style="{ ...pos(i), '--c': s.color }"
        >
          <span class="node__icon"><Icon :name="s.icon" /></span>
          <span class="node__text">{{ s.text }}</span>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  align-items: center;
  gap: clamp(32px, 5vw, 120px);
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    align-content: center;
  }
}

.title {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent-3), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- ciclo ---------- */
.cycle {
  position: relative;
  width: min(100%, 72vh);
  aspect-ratio: 1;
  margin-inline: auto;
}

.ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  rotate: -90deg;
}

.ring__base,
.ring__fill {
  fill: none;
  stroke-width: 0.8;
}

.ring__base {
  stroke: rgb(255 255 255 / 0.08);
}

.ring__fill {
  stroke: var(--slide-accent);
  stroke-linecap: round;
  stroke-dasharray: 1;
  transition:
    stroke-dashoffset 0.9s var(--ease-out),
    stroke 0.6s;
}

.is-done .ring__fill {
  stroke: var(--slide-accent-3);
}

.is-done .ring {
  animation: spin 14s linear infinite;
}

@keyframes spin {
  to {
    rotate: 270deg;
  }
}

.center {
  position: absolute;
  inset: 30%;
  display: grid;
  place-items: center;
}

.center__state {
  grid-area: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3em;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.75);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition:
    opacity 0.6s var(--ease-out),
    scale 0.6s var(--ease-out),
    filter 0.6s;
}

.center__state :deep(.icon) {
  width: 2.2em;
  height: 2.2em;
}

.center__state--before {
  color: var(--slide-muted);
}

.center__state--after {
  color: var(--slide-fg);
  opacity: 0;
  scale: 0.6;
}

.center__state--after :deep(.icon) {
  color: #fbbf24;
  filter: drop-shadow(0 0 16px #fbbf24);
}

.is-done .center__state--before {
  opacity: 0;
  scale: 1.4;
  filter: blur(6px);
}

.is-done .center__state--after {
  opacity: 1;
  scale: 1;
  transition-delay: 0.4s;
}

.node {
  position: absolute;
  translate: -50% -50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  width: 11em;
  text-align: center;
  font-size: calc(var(--text-base) * 0.85);
  line-height: 1.2;
  font-weight: 700;
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out);
}

.node__icon {
  display: grid;
  place-items: center;
  width: 3.2em;
  height: 3.2em;
  border-radius: 50%;
  font-size: 1.2em;
  color: var(--c);
  background: rgb(10 15 30 / 0.95);
  border: 2px solid color-mix(in srgb, var(--c) 50%, transparent);
  transition:
    box-shadow 0.4s,
    border-color 0.4s,
    scale 0.4s var(--ease-out);
}

.node__icon :deep(.icon) {
  width: 1.3em;
  height: 1.3em;
}

.node__text {
  text-wrap: balance;
  text-shadow: 0 2px 12px rgb(0 0 0 / 0.8);
}

.node.is-current .node__icon {
  scale: 1.15;
  border-color: var(--c);
  box-shadow: 0 0 36px -4px var(--c);
}
</style>
