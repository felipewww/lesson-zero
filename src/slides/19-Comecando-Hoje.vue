<script setup lang="ts">
import Slide from '../deck/Slide.vue'
import Icon, { type IconName } from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passos 1..4 = cada orientação
const { step } = useSteps()

const choices = [
  { title: 'Escolha uma área.', sub: 'Não tente aprender tudo.' },
  { title: 'Estude e construa projetos.', sub: 'A prática transforma informação em conhecimento.' },
  {
    title: 'Aprenda a programar sem depender da IA.',
    sub: 'Depois, use a IA para acelerar seu desenvolvimento.',
  },
  {
    title: 'Seja consistente.',
    sub: 'Estudar 1 dia e ficar 7 parado não leva você a lugar nenhum.',
  },
]

// Card 2: o caminho da informação até o conhecimento
const practice: { name: string; icon: IconName }[] = [
  { name: 'curso', icon: 'book-open' },
  { name: 'exercícios', icon: 'terminal' },
  { name: 'projeto próprio', icon: 'rocket' },
]

// Card 3: primeiro a base é sua; depois a IA acelera em cima dela
const phases = [
  { label: 'primeiro', name: 'você', ai: false },
  { label: 'depois', name: 'você + IA', ai: true },
]

// Duas semanas de estudo: "de vez em quando" (1 dia sim, 7 não) × "todo dia"
const DAYS = 14
const streaks = [
  { label: 'de vez em quando', on: (d: number) => d % 8 === 0, tone: 'off' },
  { label: 'todo dia', on: () => true, tone: 'on' },
]

// Os três grupos do slide 09 (mesmos ícones e cores), lembrados no card "Escolha uma área"
const areas: { name: string; icon: IconName; color: string }[] = [
  { name: 'Aplicações', icon: 'layers', color: 'var(--slide-accent)' },
  { name: 'Dados e IA', icon: 'sparkles', color: 'var(--slide-accent-2)' },
  { name: 'Sistemas e Infra', icon: 'server', color: '#34d399' },
]
</script>

<template>
  <Slide>
    <div class="stage">
      <div class="content">
        <h1 v-reveal:blur class="title">Para começar <em>hoje</em>:</h1>

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
            <div v-if="i === 0" class="areas">
              <span v-for="(a, ai) in areas" :key="a.name" class="area" :style="{ '--c': a.color, '--i': ai }">
                <Icon :name="a.icon" />{{ a.name }}
              </span>
            </div>
            <div v-if="i === 1" class="practice">
              <template v-for="(p, pi) in practice" :key="p.name">
                <span v-if="pi" class="practice__arrow" :style="{ '--i': pi }"><Icon name="arrow-right" /></span>
                <span class="practice__step" :class="{ 'is-last': pi === practice.length - 1 }" :style="{ '--i': pi }">
                  <Icon :name="p.icon" />{{ p.name }}
                </span>
              </template>
            </div>
            <div v-if="i === 2" class="phases">
              <div v-for="(ph, pi) in phases" :key="ph.label" class="phase" :style="{ '--i': pi }">
                <span class="phase__label">{{ ph.label }}</span>
                <span class="phase__bar">
                  <span class="phase__you"><Icon name="brain" />{{ ph.ai ? '' : ph.name }}</span>
                  <span v-if="ph.ai" class="phase__ai"><Icon name="sparkles" />IA</span>
                </span>
              </div>
            </div>
            <div v-if="i === 3" class="streaks">
              <div v-for="(row, ri) in streaks" :key="row.label" class="streak" :class="`streak--${row.tone}`">
                <span class="streak__label">{{ row.label }}</span>
                <span class="streak__days">
                  <i
                    v-for="d in DAYS"
                    :key="d"
                    class="day"
                    :class="{ 'day--on': row.on(d - 1) }"
                    :style="{ '--d': d - 1 + ri * 4 }"
                  />
                </span>
              </div>
            </div>
          </li>
        </ol>
      </div>

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
  align-content: start;
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

/* áreas do slide 09, entram depois do card */
.areas {
  grid-column: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 0.8em;
}

.area {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.3em 0.75em;
  border-radius: 999px;
  font-size: 0.72em;
  font-weight: 600;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 40%, transparent);
  opacity: 0;
  translate: 0 8px;
  transition:
    opacity 0.5s var(--ease-out),
    translate 0.5s var(--ease-out);
}

.card[data-step-shown] .area {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(450ms + var(--i) * 150ms);
}

/* card 2: curso → exercícios → projeto */
.practice {
  grid-column: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.9em;
}

.practice__step {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.35em 0.8em;
  border-radius: 10px;
  font-size: 0.72em;
  font-weight: 600;
  color: var(--slide-muted);
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.12);
  opacity: 0;
  translate: 0 8px;
  transition:
    opacity 0.5s var(--ease-out),
    translate 0.5s var(--ease-out),
    color 0.5s,
    border-color 0.5s,
    background 0.5s;
}

.practice__step.is-last {
  color: var(--slide-accent);
  border-color: color-mix(in srgb, var(--slide-accent) 50%, transparent);
  background: rgb(56 189 248 / 0.1);
}

.practice__arrow {
  display: inline-flex;
  font-size: 0.8em;
  color: var(--slide-accent);
  opacity: 0;
  transition: opacity 0.4s;
}

.card[data-step-shown] .practice__step,
.card[data-step-shown] .practice__arrow {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(450ms + var(--i) * 300ms);
}

/* card 3: base própria primeiro, IA acelera depois */
.phases {
  grid-column: 2;
  display: grid;
  gap: 0.5em;
  margin-top: 0.9em;
}

.phase {
  display: grid;
  grid-template-columns: 5.5em 1fr;
  align-items: center;
  gap: 0.6em;
}

.phase__label {
  font-family: var(--slide-font-mono);
  font-size: 0.6em;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.phase__bar {
  display: flex;
  height: 1.5em;
  border-radius: 6px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.05);
  font-size: 0.62em;
  font-weight: 700;
}

.phase__you,
.phase__ai {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0 0.7em;
  white-space: nowrap;
  overflow: hidden;
  width: 0;
  transition: width 0.9s var(--ease-out);
}

.phase__you {
  color: #052e1b;
  background: #34d399;
}

.phase__ai {
  color: #1e1240;
  background: linear-gradient(90deg, var(--slide-accent-2), var(--slide-accent-3));
}

.card[data-step-shown] .phase__you {
  width: 55%;
  transition-delay: calc(450ms + var(--i) * 500ms);
}

/* na 1ª linha a base ocupa a barra toda, devagar; na 2ª a IA completa rápido */
.card[data-step-shown] .phase:first-child .phase__you {
  width: 100%;
  transition-duration: 1.4s;
}

.card[data-step-shown] .phase__ai {
  width: 45%;
  transition-duration: 0.5s;
  transition-delay: 1.6s;
}

/* duas semanas: os dias de estudo acendem em sequência quando o card entra */
.streaks {
  grid-column: 2;
  display: grid;
  gap: 0.5em;
  margin-top: 0.9em;
}

.streak {
  display: grid;
  grid-template-columns: 8.5em 1fr;
  align-items: center;
  gap: 0.6em;
}

.streak__label {
  font-family: var(--slide-font-mono);
  font-size: 0.6em;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.streak__days {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 3px;
}

.day {
  aspect-ratio: 1;
  border-radius: 3px;
  background: rgb(255 255 255 / 0.06);
  transition:
    background 0.3s,
    box-shadow 0.3s;
}

.streak--off .day--on {
  --c: var(--slide-accent-3);
}

.streak--on .day--on {
  --c: #34d399;
}

.card[data-step-shown] .day--on {
  background: var(--c);
  box-shadow: 0 0 8px -2px var(--c);
  transition-delay: calc(500ms + var(--d) * 60ms);
}

.streak--on .streak__label {
  color: #6ee7b7;
}
</style>
