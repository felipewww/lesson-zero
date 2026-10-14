<script setup lang="ts">
import Slide from '../deck/Slide.vue'
import Icon, { type IconName } from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passo 1: "Seu tempo não."  Passos 2..5: os quatro princípios (a nuvem de tecnologias recua)
const { step } = useSteps()

const techs = [
  'React', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Deno', 'Bun', 'Python', 'Go', 'Rust', 'Java',
  'Kotlin', 'Swift', 'Flutter', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform',
  'GraphQL', 'Redis', 'Kafka', 'PostgreSQL', 'MongoDB', 'Next.js', 'Nuxt', 'Tailwind',
  'TypeScript', 'LLMs', 'RAG', 'Elixir', 'C#', '.NET', 'Spark', 'Linux', 'Solidity', 'Unity',
]

// Uma célula de grade por tecnologia, com deslocamento pseudoaleatório fixo (sem sobreposição)
const COLS = 7
const ROWS = Math.ceil(techs.length / COLS)
const chips = techs.map((name, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
  const col = i % COLS
  const row = Math.floor(i / COLS)
  return {
    name,
    x: ((col + 0.5 + (r(1) - 0.5) * 0.5 + (row % 2) * 0.3) / COLS) * 96 + 2,
    y: ((row + 0.5 + (r(2) - 0.5) * 0.4) / ROWS) * 92 + 4,
    delay: -r(3) * 12,
    size: 0.55 + r(4) * 0.4,
  }
})

const principles: { icon: IconName; text: string; color: string }[] = [
  { icon: 'compass', text: 'Escolha uma direção.', color: 'var(--slide-accent)' },
  { icon: 'layers', text: 'Aprenda os fundamentos.', color: 'var(--slide-accent-2)' },
  { icon: 'trending-up', text: 'Aprofunde-se gradualmente.', color: '#34d399' },
  { icon: 'x', text: 'Não tente acompanhar todas as tecnologias.', color: 'var(--slide-accent-3)' },
]
</script>

<template>
  <Slide>
    <div class="cloud" :class="{ 'is-calm': step >= 2 }" aria-hidden="true">
      <span
        v-for="chip in chips"
        :key="chip.name"
        class="chip"
        :style="{ left: `${chip.x}%`, top: `${chip.y}%`, animationDelay: `${chip.delay}s`, fontSize: `calc(var(--text-base) * ${chip.size})` }"
      >
        {{ chip.name }}
      </span>
    </div>

    <div class="stage">
      <h1 class="title">
        <span v-reveal:blur class="title__line">Conhecimento é praticamente <em>infinito</em>.</span>
        <span v-step:zoom class="title__line title__time">Seu tempo não.</span>
      </h1>

      <div class="grid">
        <article
          v-for="(p, i) in principles"
          :key="p.text"
          v-step
          class="card"
          :class="{ 'is-current': step === 2 + i }"
          :style="{ '--c': p.color }"
        >
          <span class="card__num">0{{ i + 1 }}</span>
          <span class="card__icon"><Icon :name="p.icon" /></span>
          <p class="card__text">{{ p.text }}</p>
        </article>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
/* ---------- nuvem de tecnologias ---------- */
.cloud {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition:
    opacity 1s var(--ease-out),
    filter 1s var(--ease-out);
}

.cloud.is-calm {
  opacity: 0.25;
  filter: blur(3px);
}

.chip {
  position: absolute;
  padding: 0.35em 0.8em;
  border-radius: 999px;
  font-family: var(--slide-font-mono);
  color: var(--slide-muted);
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
  white-space: nowrap;
  opacity: 0.45;
  translate: -50% -50%;
  animation: drift 12s ease-in-out infinite;
}

@keyframes drift {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(14px, -18px); }
  50% { transform: translate(-10px, -6px); }
  75% { transform: translate(-16px, 14px); }
}

/* ---------- conteúdo ---------- */
.stage {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(32px, 7vh, 96px);
}

.title {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-shadow: 0 4px 30px rgb(7 11 24 / 0.9);
}

.title__line {
  display: block;
  text-wrap: balance;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.title__time {
  font-size: 1.25em;
  color: var(--slide-accent-3);
  transform-origin: left center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: clamp(12px, 1.5vw, 28px);
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  padding: clamp(18px, 2vw, 36px);
  border-radius: 20px;
  background: rgb(10 15 30 / 0.7);
  border: 1px solid rgb(255 255 255 / 0.08);
  backdrop-filter: blur(10px);
  font-size: var(--text-base);
  line-height: 1.3;
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    box-shadow 0.4s,
    translate 0.4s var(--ease-out);
}

.card__num {
  position: absolute;
  top: 0.8em;
  right: 1em;
  font-family: var(--slide-font-mono);
  font-size: 0.65em;
  color: var(--slide-muted);
}

.card__icon {
  display: grid;
  place-items: center;
  width: 2.4em;
  height: 2.4em;
  border-radius: 0.7em;
  font-size: 1.2em;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 14%, transparent);
}

.card__icon :deep(.icon) {
  width: 1.4em;
  height: 1.4em;
}

.card__text {
  font-weight: 700;
  text-wrap: balance;
}

.card.is-current {
  translate: 0 -8px;
  border-color: var(--c);
  box-shadow: 0 20px 50px -20px var(--c);
}
</style>
