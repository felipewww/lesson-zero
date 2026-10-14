<script setup lang="ts">
import Slide from '../deck/Slide.vue'
import Icon from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passos 1..2 = "evite"; 3..5 = "priorize". Cada passo também sobe um degrau da escada.
const { step } = useSteps()

const prioritize = [
  'Aprender com profissionais experientes',
  'Aceitar começar em posições iniciais',
  'Construir experiência aos poucos',
]

const avoid = [
  'Escolher vagas só pelo salário ou home office',
  'Se comparar com quem tem décadas de carreira',
]

const STAIRS = 5
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="left">
        <p v-reveal:fade class="kicker">como começar sua carreira</p>
        <h1 v-reveal:blur="200" class="title">
          Seu primeiro emprego não precisa ser o emprego <em>dos sonhos</em>.
        </h1>

        <div v-reveal="500" class="stairs" aria-hidden="true">
          <span
            v-for="n in STAIRS"
            :key="n"
            class="stair"
            :class="{ 'is-built': step >= n }"
            :style="{ '--n': n }"
          />
          <span class="climber" :style="{ '--at': Math.min(step, STAIRS) }"><Icon name="user" /></span>
        </div>
      </div>

      <div class="right">
        <section class="group group--avoid">
          <span v-reveal:fade="600" class="group__label"><Icon name="x" /> evite</span>
          <ul>
            <li v-for="item in avoid" :key="item" v-step:left>{{ item }}</li>
          </ul>
        </section>

        <section class="group group--do">
          <span v-reveal:fade="700" class="group__label"><Icon name="check" /> priorize</span>
          <ul>
            <li v-for="item in prioritize" :key="item" v-step:left>{{ item }}</li>
          </ul>
        </section>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  align-items: center;
  gap: clamp(32px, 5vw, 120px);
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    align-content: center;
  }
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.title {
  margin-top: 0.4em;
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

/* ---------- escada que se constrói a cada passo ---------- */
.stairs {
  --w: clamp(40px, 5vw, 100px);
  --h: clamp(16px, 2.8vh, 36px);
  position: relative;
  height: calc(var(--h) * 6);
  margin-top: 6vh;
}

.stair {
  position: absolute;
  bottom: 0;
  left: calc(var(--n) * var(--w));
  width: var(--w);
  height: calc(var(--n) * var(--h));
  border-radius: 6px 6px 0 0;
  background: rgb(255 255 255 / 0.05);
  border: 1px dashed rgb(255 255 255 / 0.12);
  transform-origin: bottom;
  transition:
    background 0.6s,
    border-color 0.6s,
    box-shadow 0.6s;
}

.stair.is-built {
  background: linear-gradient(180deg, var(--slide-accent), color-mix(in srgb, var(--slide-accent-2) 60%, transparent));
  border: 1px solid transparent;
  box-shadow: 0 0 30px -8px var(--slide-accent);
}

.climber {
  position: absolute;
  left: calc(var(--at) * var(--w) + var(--w) / 2);
  bottom: calc(var(--at) * var(--h) + 6px);
  translate: -50% 0;
  font-size: clamp(20px, 2.4vw, 40px);
  color: var(--slide-fg);
  transition:
    left 0.8s var(--ease-out),
    bottom 0.8s var(--ease-out);
}

/* ---------- evite × priorize ---------- */
.right {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 4vh, 48px);
}

.group__label {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.group--do .group__label { color: #6ee7b7; }
.group--avoid .group__label { color: var(--slide-accent-3); }

.group ul {
  list-style: none;
  display: grid;
  gap: 0.6em;
  margin-top: 0.8em;
}

.group li {
  padding: 0.7em 1em;
  border-radius: 14px;
  font-size: var(--text-base);
  line-height: 1.3;
  border-left: 4px solid;
}

.group--do li {
  background: rgb(52 211 153 / 0.07);
  border-color: #34d399;
}

.group--avoid li {
  background: rgb(244 114 182 / 0.07);
  border-color: var(--slide-accent-3);
  color: var(--slide-muted);
}
</style>
