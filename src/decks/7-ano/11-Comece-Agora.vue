<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'
import openai from '../../assets/logos/openai.svg'
import claude from '../../assets/logos/claude.svg'
import javascript from '../../assets/logos/javascript.svg'
import python from '../../assets/logos/python.svg'
import youtube from '../../assets/logos/youtube.svg'

// Passos: 1 = "Pode começar agora!"; 2 = IAs; 3 = linguagens;
// 4 = receita (IA + YouTube + dedicação); 5 = o resultado (divertido + cérebro)
const { step } = useSteps()
const RECIPE = 4

const groups = [
  {
    label: 'IA para te ajudar',
    tools: [
      { name: 'Codex', logo: openai, text: 'Escreve e explica código junto com você.', color: 'var(--slide-accent)' },
      { name: 'Claude', logo: claude, text: 'Tira dúvidas e te ensina passo a passo.', color: 'var(--slide-accent-3)' },
    ],
  },
  {
    label: 'Linguagens para programar',
    tools: [
      { name: 'JavaScript', logo: javascript, text: 'A linguagem dos sites e jogos na web.', color: 'var(--slide-accent-2)' },
      { name: 'Python', logo: python, text: 'Fácil de ler, ótima para começar.', color: 'var(--slide-accent)' },
    ],
  },
]

const ingredients: { name: string; icon?: IconName; logo?: string; color: string }[] = [
  { name: 'IA', icon: 'sparkles', color: 'var(--slide-accent)' },
  { name: 'vídeos no YouTube', logo: youtube, color: 'var(--slide-accent-3)' },
  { name: 'dedicação', icon: 'target', color: 'var(--slide-accent-2)' },
]
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-recipe': step >= RECIPE }">
      <header class="head">
        <h1 v-reveal:blur class="title">Você não precisa esperar ficar adulto.</h1>
        <p v-step:zoom class="now"><span>Pode começar <em>agora!</em></span></p>
      </header>

      <div class="groups">
        <section v-for="(g, gi) in groups" :key="g.label" v-step="gi + 2" class="group">
          <span class="group__label">{{ g.label }}</span>
          <div class="tools">
            <article
              v-for="(t, ti) in g.tools"
              :key="t.name"
              class="tool"
              :class="{ 'is-current': step === gi + 2 }"
              :style="{ '--c': t.color, '--i': ti }"
            >
              <span class="tool__logo"><img :src="t.logo" :alt="t.name" /></span>
              <h2 class="tool__name">{{ t.name }}</h2>
              <p class="tool__text">{{ t.text }}</p>
            </article>
          </div>
        </section>
      </div>

      <!-- receita: IA + YouTube + dedicação = diversão + cérebro se desenvolvendo -->
      <div v-step="RECIPE" class="recipe">
        <div class="recipe__row">
          <template v-for="(ing, i) in ingredients" :key="ing.name">
            <span v-if="i" class="recipe__op" :style="{ '--i': i }">+</span>
            <span class="ingredient" :style="{ '--c': ing.color, '--i': i }">
              <span class="ingredient__icon">
                <img v-if="ing.logo" :src="ing.logo" alt="" />
                <Icon v-else :name="ing.icon!" />
              </span>
              {{ ing.name }}
            </span>
          </template>
        </div>

        <div v-step="RECIPE + 1" class="result">
          <span class="result__eq">=</span>
          <div class="result__cards">
            <span class="outcome outcome--fun">
              <span class="outcome__icon"><Icon name="gamepad" /></span>
              <span>muito <strong>divertido</strong></span>
            </span>
            <span class="outcome__and">e ainda</span>
            <span class="outcome outcome--brain">
              <span class="outcome__icon"><Icon name="brain" /></span>
              <span>seu <strong>cérebro</strong> se desenvolve</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(20px, 4.5vh, 56px);
}

.head {
  text-align: center;
}

.title {
  font-size: calc(var(--text-title) * 0.85);
  line-height: 1.08;
  font-weight: 700;
  color: var(--slide-muted);
  text-wrap: balance;
}

.now {
  margin-top: 0.15em;
  font-size: var(--text-hero);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.now em {
  font-style: normal;
  display: inline-block;
  padding-bottom: 0.08em;
  background: linear-gradient(110deg, var(--slide-accent), var(--slide-accent-2) 60%, var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.now[data-step-shown] em {
  animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s backwards;
}

@keyframes pop {
  from {
    scale: 0.6;
    rotate: -6deg;
  }
}

/* ---------- ferramentas: dois grupos lado a lado ---------- */
.groups {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(16px, 3vw, 56px);
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

@media (max-aspect-ratio: 1 / 1) {
  .groups {
    grid-template-columns: 1fr;
  }
}

.group__label {
  display: block;
  margin-bottom: 0.7em;
  font-size: calc(var(--text-base) * 0.75);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  color: var(--slide-muted);
}

.tools {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(10px, 1.4vw, 24px);
}

.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45em;
  padding: clamp(16px, 2vw, 32px) clamp(12px, 1.4vw, 24px);
  border-radius: 26px;
  text-align: center;
  background: color-mix(in srgb, var(--slide-fg) 4%, transparent);
  border: 2px solid color-mix(in srgb, var(--slide-fg) 8%, transparent);
  transition:
    border-color 0.4s,
    background 0.4s,
    box-shadow 0.4s,
    opacity 0.5s var(--ease-out),
    translate 0.5s var(--ease-out);
}

/* os dois cartões do grupo entram um depois do outro */
.group:not([data-step-shown]) .tool {
  opacity: 0;
  translate: 0 24px;
}

.group[data-step-shown] .tool {
  transition-delay: calc(var(--i) * 180ms), calc(var(--i) * 180ms), calc(var(--i) * 180ms), calc(var(--i) * 180ms),
    calc(var(--i) * 180ms);
}

.tool.is-current {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  box-shadow: 0 24px 60px -28px var(--c);
}

.tool__logo {
  position: relative;
  width: clamp(64px, 10vh, 110px);
  height: clamp(64px, 10vh, 110px);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 10px 30px -12px var(--c);
}

.tool__logo img {
  position: absolute;
  inset: 16%;
  width: 68%;
  height: 68%;
  object-fit: contain;
}

.tool__name {
  margin-top: 0.3em;
  font-size: calc(var(--text-base) * 1.25);
  font-weight: 800;
}

.tool__text {
  font-size: calc(var(--text-base) * 0.85);
  line-height: 1.3;
  color: var(--slide-muted);
  text-wrap: balance;
}

/* ---------- receita: toma a tela nos dois últimos passos ---------- */
.head {
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.is-recipe .head,
.is-recipe .groups {
  filter: blur(6px);
  opacity: 0.12;
}

.recipe {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 5vh, 56px);
  padding: 0 4vw;
  pointer-events: none;
}

.recipe__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5em 0.6em;
  font-size: calc(var(--text-title) * 0.62);
  font-weight: 800;
}

.ingredient {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.35em 0.75em 0.35em 0.4em;
  border-radius: 999px;
  white-space: nowrap;
  color: var(--slide-fg);
  background: color-mix(in srgb, var(--c) 14%, transparent);
  border: 2px solid color-mix(in srgb, var(--c) 55%, transparent);
}

.ingredient__icon {
  display: grid;
  place-items: center;
  width: 1.4em;
  height: 1.4em;
  border-radius: 50%;
  color: var(--c);
  background: color-mix(in srgb, var(--slide-bg) 60%, transparent);
}

.ingredient__icon img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.ingredient__icon :deep(.icon) {
  width: 75%;
  height: 75%;
}

.recipe__op {
  color: var(--slide-muted);
}

.ingredient,
.recipe__op {
  opacity: 0;
  scale: 0.7;
  transition:
    opacity 0.5s var(--ease-out),
    scale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.recipe[data-step-shown] .ingredient,
.recipe[data-step-shown] .recipe__op {
  opacity: 1;
  scale: 1;
  transition-delay: calc(250ms + var(--i) * 350ms);
}

/* resultado */
.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
}

.result__eq {
  font-size: calc(var(--text-title) * 0.8);
  font-weight: 900;
  line-height: 1;
  color: var(--slide-muted);
}

.result__cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35em;
  font-size: calc(var(--text-title) * 0.62);
  font-weight: 700;
}

.outcome {
  --c: var(--slide-accent-2);
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.45em 0.9em 0.45em 0.5em;
  border-radius: 24px;
  background: color-mix(in srgb, var(--c) 16%, transparent);
  border: 2px solid var(--c);
  box-shadow: 0 20px 60px -20px var(--c);
}

.outcome--brain {
  --c: var(--slide-accent);
}

.outcome strong {
  color: var(--c);
}

.outcome__icon {
  display: grid;
  place-items: center;
  width: 1.5em;
  height: 1.5em;
  border-radius: 0.4em;
  color: var(--slide-bg);
  background: var(--c);
}

.outcome__icon :deep(.icon) {
  width: 70%;
  height: 70%;
}

.outcome__and {
  font-size: 0.6em;
  color: var(--slide-muted);
}

.result[data-step-shown] .outcome--brain .outcome__icon {
  animation: pulse 1.6s ease-in-out 0.8s infinite;
}

@keyframes pulse {
  50% {
    scale: 1.15;
    box-shadow: 0 0 30px var(--c);
  }
}
</style>
