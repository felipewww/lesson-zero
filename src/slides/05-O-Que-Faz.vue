<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../deck/Slide.vue'
import Icon, { type IconName } from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passos 1..4: cada etapa do caminho problema → solução; passo 5: a solução
const { step } = useSteps()
const LAST = 5

const stages: { icon: IconName; text: string; color: string }[] = [
  { icon: 'heart', text: 'Entende necessidades das pessoas', color: 'var(--slide-accent-3)' },
  { icon: 'workflow', text: 'Organiza e padroniza processos usando lógica', color: 'var(--slide-accent)' },
  { icon: 'repeat', text: 'Automatiza tarefas repetitivas', color: '#fbbf24' },
  { icon: 'scale', text: 'Transforma regras de negócio em sistemas', color: 'var(--slide-accent-2)' },
]

const fill = computed(() => Math.min(step.value, LAST) / LAST)
</script>

<template>
  <Slide>
    <div class="stage">
      <p v-reveal:fade class="kicker">O que faz um programador?</p>
      <h1 v-reveal:blur="150" class="title">
        Transforma <em>problemas reais</em> em soluções tecnológicas.
      </h1>

      <div class="flow">
        <span class="track" aria-hidden="true">
          <span class="track__fill" :style="{ transform: `scaleX(${fill})` }" />
        </span>

        <div v-reveal:right="450" class="end end--start">
          <span class="end__dot"><Icon name="alert" /></span>
          <span class="end__label">problema</span>
        </div>

        <article
          v-for="(s, i) in stages"
          :key="s.text"
          v-step:up="i + 1"
          class="card"
          :class="{ 'is-current': step === i + 1 }"
          :style="{ '--c': s.color }"
        >
          <span class="card__icon"><Icon :name="s.icon" /></span>
          <p class="card__text">{{ s.text }}</p>
        </article>

        <div v-step:zoom="LAST" class="end end--finish">
          <span class="end__dot"><Icon name="check" /></span>
          <span class="end__label">solução</span>
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
  gap: clamp(16px, 3vh, 40px);
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.75);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-accent);
}

.title {
  max-width: 18em;
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent-3), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- caminho problema → solução ---------- */
.flow {
  --icon: clamp(56px, 11vh, 120px);
  position: relative;
  display: grid;
  grid-template-columns: auto repeat(4, 1fr) auto;
  align-items: start;
  gap: clamp(12px, 1.6vw, 32px);
  margin-top: 5vh;
}

.track {
  position: absolute;
  left: calc(var(--icon) / 2);
  right: calc(var(--icon) / 2);
  top: calc(var(--icon) / 2);
  height: 2px;
  background: rgb(255 255 255 / 0.08);
}

.track__fill {
  position: absolute;
  inset: 0;
  transform-origin: left;
  background: linear-gradient(90deg, var(--slide-accent-3), var(--slide-accent), #fbbf24, var(--slide-accent-2), #34d399);
  box-shadow: 0 0 12px rgb(56 189 248 / 0.6);
  transition: transform 0.9s var(--ease-out);
}

.end {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.end__dot {
  display: grid;
  place-items: center;
  width: var(--icon);
  height: var(--icon);
  border-radius: 50%;
  font-size: calc(var(--icon) * 0.42);
}

.end--start .end__dot {
  color: var(--slide-muted);
  background: rgb(15 23 42 / 0.9);
  border: 1px dashed rgb(255 255 255 / 0.25);
}

.end--start .end__label {
  color: var(--slide-muted);
}

.end--finish .end__dot {
  color: #052e1b;
  background: #34d399;
  box-shadow: 0 0 40px -4px #34d399;
}

.end--finish .end__label {
  color: #6ee7b7;
  font-weight: 700;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8em;
  text-align: center;
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out);
}

.card__icon {
  display: grid;
  place-items: center;
  width: var(--icon);
  height: var(--icon);
  border-radius: 30%;
  font-size: calc(var(--icon) * 0.45);
  color: var(--c);
  background: rgb(15 23 42 / 0.92);
  border: 1px solid color-mix(in srgb, var(--c) 45%, transparent);
  transition:
    box-shadow 0.4s,
    scale 0.4s var(--ease-out);
}

.card__text {
  font-size: var(--text-base);
  line-height: 1.3;
  color: var(--slide-muted);
  text-wrap: balance;
  transition: color 0.4s;
}

.card.is-current .card__icon {
  scale: 1.12;
  box-shadow: 0 0 40px -6px var(--c);
}

.card.is-current .card__text {
  color: var(--slide-fg);
}

@media (max-aspect-ratio: 1 / 1) {
  .flow {
    grid-template-columns: 1fr 1fr;
    row-gap: 4vh;
  }

  .track {
    display: none;
  }

  .end {
    grid-column: span 2;
  }
}
</style>
