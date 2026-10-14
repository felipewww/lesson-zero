<script setup lang="ts">
import { computed } from 'vue'
import Slide from '../deck/Slide.vue'
import Icon, { type IconName } from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passos: 1 = "mas se destacar..."; 2 = antes; 3 = hoje; 4 = o diferencial
const { step } = useSteps()

// A "régua" sobe conforme a história avança
const level = computed(() => [22, 48, 52, 66, 88][Math.min(step.value, 4)])

const today: { icon: IconName; label: string }[] = [
  { icon: 'book-open', label: 'cursos baratos' },
  { icon: 'file-text', label: 'documentação' },
  { icon: 'users', label: 'comunidades' },
  { icon: 'sparkles', label: 'IA para ajudar' },
]

const edge = ['aplicar', 'investigar', 'construir', 'explicar suas decisões']
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="content">
        <header class="head">
          <p v-reveal:fade class="kicker">a régua está mais alta</p>
          <h1 v-reveal:blur="200" class="title">Nunca foi tão fácil <em>começar</em>.</h1>
          <p v-step class="but">Mas isso não significa que seja fácil <strong>se destacar</strong>.</p>
        </header>

        <div class="compare">
          <article v-step:right class="era era--before">
            <span class="era__label">antes</span>
            <p class="era__text">Acesso mais difícil a conhecimento, exemplos e ferramentas.</p>
            <div class="era__icons" aria-hidden="true">
              <Icon name="lock" /><Icon name="book-open" /><Icon name="wrench" />
            </div>
          </article>

          <article v-step:left class="era era--now">
            <span class="era__label">hoje</span>
            <ul class="chips">
              <li v-for="(item, i) in today" :key="item.label" :style="{ '--i': i }">
                <Icon :name="item.icon" />{{ item.label }}
              </li>
            </ul>
          </article>
        </div>

        <div v-step:zoom class="edge">
          <span class="edge__label">o diferencial</span>
          <p class="edge__words">
            <span>Saber</span>
            <strong v-for="(word, i) in edge" :key="word" :style="{ '--i': i }">{{ word }}</strong>
          </p>
        </div>
      </div>

      <div v-reveal:fade="300" class="ruler" aria-hidden="true">
        <div class="ruler__ticks" />
        <div class="ruler__fill" :style="{ '--level': `${level}%` }" />
        <div class="ruler__bar" :style="{ '--level': `${level}%` }">
          <span class="ruler__tag">a régua</span>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: clamp(24px, 4vw, 80px);
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(20px, 4.5vh, 56px);
}

.kicker {
  margin-bottom: 0.5em;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.title {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.title em,
.edge__words strong {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.but {
  margin-top: 0.5em;
  font-size: calc(var(--text-base) * 1.4);
  color: var(--slide-muted);
}

.but strong {
  color: var(--slide-fg);
}

/* ---------- antes × hoje ---------- */
.compare {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: clamp(12px, 2vw, 32px);
}

.era {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  padding: clamp(16px, 2vw, 36px);
  border-radius: 22px;
  font-size: var(--text-base);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out);
}

.era__label {
  font-family: var(--slide-font-mono);
  font-size: 0.65em;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.era--before {
  background: rgb(255 255 255 / 0.03);
  border: 1px dashed rgb(255 255 255 / 0.15);
  color: var(--slide-muted);
  filter: grayscale(1);
}

.era__text {
  line-height: 1.3;
}

.era__icons {
  display: flex;
  gap: 0.6em;
  font-size: 1.3em;
  opacity: 0.5;
}

.era--now {
  background: rgb(56 189 248 / 0.07);
  border: 1px solid rgb(56 189 248 / 0.35);
  box-shadow: 0 20px 60px -30px var(--slide-accent);
}

.era--now .era__label {
  color: var(--slide-accent);
}

.chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6em;
}

.chips li {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.45em 0.9em;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.06);
  border: 1px solid rgb(255 255 255 / 0.1);
  font-size: 0.9em;
  opacity: 0;
  scale: 0.8;
  transition:
    opacity 0.4s,
    scale 0.5s var(--ease-out);
}

.chips li :deep(.icon) {
  color: var(--slide-accent);
}

.era--now[data-step-shown] .chips li {
  opacity: 1;
  scale: 1;
  transition-delay: calc(300ms + var(--i) * 140ms);
}

/* ---------- o diferencial ---------- */
.edge {
  padding: clamp(16px, 2vw, 36px);
  border-radius: 22px;
  background: linear-gradient(135deg, rgb(56 189 248 / 0.12), rgb(167 139 250 / 0.12));
  border: 1px solid rgb(167 139 250 / 0.4);
}

.edge__label {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.65);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slide-accent-2);
}

.edge__words {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25em 0.6em;
  margin-top: 0.3em;
  font-size: calc(var(--text-base) * 1.6);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.edge__words strong {
  opacity: 0;
  translate: 0 12px;
  transition:
    opacity 0.5s,
    translate 0.5s var(--ease-out);
}

.edge__words strong:not(:last-child)::after {
  content: ',';
  color: var(--slide-fg);
}

.edge[data-step-shown] .edge__words strong {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(300ms + var(--i) * 180ms);
}

/* ---------- régua vertical ---------- */
.ruler {
  position: relative;
  width: clamp(64px, 7vw, 140px);
  margin-block: 4vh;
}

.ruler__fill {
  position: absolute;
  left: 45%;
  right: 0;
  bottom: 0;
  height: var(--level);
  border-radius: 10px 10px 0 0;
  background: linear-gradient(to top, transparent, rgb(56 189 248 / 0.18));
  transition: height 1s var(--ease-out);
}

.ruler__ticks {
  position: absolute;
  inset: 0 auto 0 0;
  width: 40%;
  background: repeating-linear-gradient(to top, rgb(255 255 255 / 0.25) 0 2px, transparent 2px 5%);
  mask-image: linear-gradient(to top, #000, transparent);
}

.ruler__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: var(--level);
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--slide-accent), var(--slide-accent-3));
  box-shadow: 0 0 24px var(--slide-accent);
  transition: bottom 1s var(--ease-out);
}

.ruler__tag {
  position: absolute;
  right: 0;
  bottom: 10px;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.62);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--slide-accent);
}

@media (max-aspect-ratio: 1 / 1) {
  .compare {
    grid-template-columns: 1fr;
  }
}
</style>
