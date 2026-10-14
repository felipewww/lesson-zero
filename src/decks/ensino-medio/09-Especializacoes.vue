<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos 1..3: cada grupo de especialidades; o grupo atual fica em destaque
const { step } = useSteps()

const groups: { title: string; icon: IconName; color: string; fx: string; areas: { icon: IconName; name: string }[] }[] = [
  {
    title: 'Aplicações',
    icon: 'layers',
    color: 'var(--slide-accent)',
    fx: 'bob',
    areas: [
      { icon: 'globe', name: 'Web / Full Stack' },
      { icon: 'smartphone', name: 'Mobile' },
    ],
  },
  {
    title: 'Dados e Inteligência Artificial',
    icon: 'sparkles',
    color: 'var(--slide-accent-2)',
    fx: 'pulse',
    areas: [
      { icon: 'database', name: 'Engenharia de Dados' },
      { icon: 'bar-chart', name: 'Ciência de Dados' },
      { icon: 'brain', name: 'Machine Learning' },
      { icon: 'bot', name: 'Engenharia de IA' },
    ],
  },
  {
    title: 'Sistemas e Infraestrutura',
    icon: 'server',
    color: '#34d399',
    fx: 'blink',
    areas: [
      { icon: 'cloud', name: 'Cloud / Arquitetura' },
      { icon: 'shield', name: 'Cibersegurança / Ethical Hacking' },
      { icon: 'cpu', name: 'Sistemas Embarcados / IoT' },
    ],
  },
]
</script>

<template>
  <Slide>
    <div class="stage">
      <h1 v-reveal:blur class="title">Programação <em>não é</em> uma profissão única</h1>

      <div class="groups">
        <section
          v-for="(g, gi) in groups"
          :key="g.title"
          v-step:up
          class="group"
          :class="[`fx-${g.fx}`, { 'is-current': step === gi + 1 }]"
          :style="{ '--c': g.color }"
        >
          <header class="group__head">
            <span class="group__icon"><Icon :name="g.icon" /></span>
            <h2 class="group__title">{{ g.title }}</h2>
          </header>

          <ul class="areas">
            <li v-for="(a, i) in g.areas" :key="a.name" class="area" :style="{ '--i': i }">
              <span class="area__icon"><Icon :name="a.icon" /></span>
              <span class="area__name">{{ a.name }}</span>
            </li>
          </ul>
        </section>
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
  gap: clamp(20px, 5vh, 64px);
}

.title {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), #34d399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- grupos ---------- */
.groups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: start;
  gap: clamp(14px, 2vw, 36px);
}

@media (max-aspect-ratio: 1 / 1) {
  .groups {
    grid-template-columns: 1fr;
  }
}

.group {
  padding: clamp(16px, 1.8vw, 32px);
  border-radius: 24px;
  background: rgb(255 255 255 / 0.035);
  border: 1px solid rgb(255 255 255 / 0.08);
  border-top: 3px solid var(--c);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    background 0.4s,
    box-shadow 0.4s;
}

.group.is-current {
  background: color-mix(in srgb, var(--c) 8%, transparent);
  box-shadow: 0 30px 60px -30px var(--c);
}

.group__head {
  display: flex;
  align-items: center;
  gap: 0.7em;
  margin-bottom: 1.2em;
}

.group__icon {
  display: grid;
  place-items: center;
  width: 2.2em;
  height: 2.2em;
  border-radius: 30%;
  font-size: calc(var(--text-base) * 0.9);
  color: var(--c);
  background: color-mix(in srgb, var(--c) 16%, transparent);
}

.group__title {
  font-size: calc(var(--text-base) * 1.1);
  font-weight: 800;
  line-height: 1.15;
}

.areas {
  list-style: none;
  display: grid;
  gap: 0.6em;
}

.area {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.65em 0.8em;
  border-radius: 14px;
  background: rgb(2 6 23 / 0.45);
  font-size: calc(var(--text-base) * 0.92);
  line-height: 1.2;
  opacity: 0;
  translate: -12px 0;
  transition:
    opacity 0.5s var(--ease-out),
    translate 0.5s var(--ease-out);
}

.group[data-step-shown] .area {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(250ms + var(--i) * 110ms);
}

.area__icon {
  display: grid;
  place-items: center;
  font-size: 1.35em;
  color: var(--c);
}

/* pequenas animações: cada grupo tem seu "jeito" de se mexer */
.group[data-step-shown].fx-bob .area__icon {
  animation: bob 2.6s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.3s);
}

.group[data-step-shown].fx-pulse .area__icon {
  animation: pulse 2.2s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.35s);
}

.group[data-step-shown].fx-blink .area__icon {
  animation: blink 2.8s steps(1) infinite;
  animation-delay: calc(var(--i) * 0.5s);
}

@keyframes bob {
  50% { translate: 0 -4px; }
}

@keyframes pulse {
  50% { scale: 1.18; filter: drop-shadow(0 0 6px var(--c)); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  92% { opacity: 0.35; }
}
</style>
