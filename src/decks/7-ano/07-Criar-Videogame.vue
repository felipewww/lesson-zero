<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import { useSteps } from '../../deck/steps'
import { gameRules } from './gameRules'

// Passos 1..3: uma pergunta por vez; cada uma tem um campo para escrever a regra que a turma decidir
const { step } = useSteps()

const questions: { key: keyof typeof gameRules; text: string; color: string; glyph: string }[] = [
  { key: 'points', text: 'Como o jogador ganha pontos?', color: 'var(--slide-accent-2)', glyph: '★' },
  { key: 'enemy', text: 'O que acontece quando encosta em um inimigo?', color: 'var(--slide-accent-3)', glyph: '!' },
  { key: 'end', text: 'Como o jogador vence ou perde?', color: 'var(--slide-accent)', glyph: '⚑' },
]

// Enter ou Esc tira o foco do campo para as setas voltarem a navegar
function release(e: KeyboardEvent) {
  ;(e.target as HTMLElement).blur()
}
</script>

<template>
  <Slide>
    <div class="layout">
      <header class="head">
        <span v-reveal:zoom class="badge">desafio</span>
        <h1 v-reveal:blur="150" class="title">Vocês são os <em>criadores</em> do jogo!</h1>
        <p v-reveal="350" class="lead">Pegue as moedas. Fuja dos inimigos.</p>
      </header>

      <div v-reveal:zoom="450" class="scene" aria-hidden="true">
        <svg viewBox="0 0 400 240">
          <!-- chão e plataformas -->
          <rect class="ground" x="0" y="200" width="400" height="40" rx="6" />
          <rect class="platform" x="70" y="140" width="90" height="14" rx="7" />
          <rect class="platform" x="240" y="105" width="100" height="14" rx="7" />

          <!-- moedas -->
          <g v-for="(c, i) in [[115, 118], [290, 82], [200, 175], [355, 175]]" :key="i" class="coin" :style="{ '--i': i }">
            <g :transform="`translate(${c[0]} ${c[1]})`">
              <ellipse class="coin__body" rx="9" ry="9" />
              <text class="coin__mark" y="4" text-anchor="middle">$</text>
            </g>
          </g>

          <!-- inimigo patrulhando -->
          <g class="enemy">
            <g transform="translate(250 184)">
              <path class="enemy__body" d="M-16 16 L-16 0 Q-16 -16 0 -16 Q16 -16 16 0 L16 16 L10 10 L5 16 L0 10 L-5 16 L-10 10 Z" />
              <circle cx="-6" cy="-3" r="4" fill="#fff" />
              <circle cx="6" cy="-3" r="4" fill="#fff" />
              <circle class="enemy__eye" cx="-5" cy="-2" r="2" />
              <circle class="enemy__eye" cx="7" cy="-2" r="2" />
            </g>
          </g>

          <!-- personagem pulando -->
          <g class="hero">
            <g transform="translate(60 182)">
              <rect class="hero__body" x="-15" y="-18" width="30" height="34" rx="12" />
              <circle cx="-5" cy="-6" r="3.5" fill="#fff" />
              <circle cx="6" cy="-6" r="3.5" fill="#fff" />
              <circle cx="-4" cy="-5" r="1.8" fill="#0c0a20" />
              <circle cx="7" cy="-5" r="1.8" fill="#0c0a20" />
              <path d="M-4 4 Q1 8 6 4" stroke="#0c0a20" stroke-width="2" fill="none" stroke-linecap="round" />
            </g>
          </g>

          <!-- placar -->
          <g class="hud">
            <rect x="10" y="10" width="92" height="26" rx="13" />
            <text x="24" y="28">★ 0 pts</text>
          </g>
        </svg>
      </div>

      <ol class="questions">
        <li
          v-for="(q, i) in questions"
          :key="q.key"
          v-step:left
          class="q"
          :class="{ 'is-current': step === i + 1 }"
          :style="{ '--c': q.color }"
        >
          <span class="q__glyph">{{ q.glyph }}</span>
          <div class="q__body">
            <p class="q__text">{{ q.text }}</p>
            <input
              v-model="gameRules[q.key]"
              class="q__input"
              type="text"
              placeholder="a turma decide…"
              @keydown.enter="release"
              @keydown.esc="release"
            />
          </div>
        </li>
      </ol>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  column-gap: clamp(24px, 4vw, 80px);
  row-gap: clamp(16px, 3vh, 40px);
  align-items: center;
}

.head {
  grid-column: 1 / -1;
}

.badge {
  display: inline-block;
  padding: 0.3em 0.9em;
  border-radius: 999px;
  font-size: calc(var(--text-base) * 0.7);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-bg);
  background: var(--slide-accent-2);
  rotate: -3deg;
}

.title {
  margin-top: 0.3em;
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.title em {
  font-style: normal;
  color: var(--slide-accent);
}

.lead {
  margin-top: 0.4em;
  font-size: calc(var(--text-base) * 1.05);
  color: var(--slide-muted);
}

/* ---------- cena do jogo ---------- */
.scene {
  align-self: stretch;
  display: flex;
  align-items: center;
  padding: clamp(10px, 1.5vw, 24px);
  border-radius: 28px;
  background:
    radial-gradient(circle at 80% 15%, color-mix(in srgb, var(--slide-accent-2) 25%, transparent), transparent 40%),
    linear-gradient(180deg, color-mix(in srgb, var(--slide-accent) 22%, var(--slide-bg)), var(--slide-bg));
  border: 2px solid color-mix(in srgb, var(--slide-accent) 35%, transparent);
  box-shadow: 0 30px 70px -30px var(--slide-accent);
}

.scene svg {
  width: 100%;
  max-height: 58vh;
}

.ground {
  fill: color-mix(in srgb, var(--slide-accent) 45%, var(--slide-bg));
}

.platform {
  fill: color-mix(in srgb, var(--slide-accent) 60%, var(--slide-bg));
}

.coin {
  animation: bob 1.6s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.4s);
}

.coin__body {
  fill: var(--slide-accent-2);
  stroke: color-mix(in srgb, var(--slide-accent-2) 60%, #000);
  stroke-width: 2;
  transform-box: fill-box;
  transform-origin: center;
  animation: spin 2.4s linear infinite;
}

.coin__mark {
  font-size: 11px;
  font-weight: 800;
  fill: color-mix(in srgb, var(--slide-accent-2) 40%, #000);
}

@keyframes bob {
  50% { translate: 0 -5px; }
}

@keyframes spin {
  0%, 100% { scale: 1 1; }
  50% { scale: 0.25 1; }
}

.enemy {
  animation: patrol 3.2s ease-in-out infinite alternate;
}

.enemy__body {
  fill: var(--slide-accent-3);
}

.enemy__eye {
  fill: var(--slide-bg);
}

@keyframes patrol {
  from { translate: -40px 0; }
  to { translate: 70px 0; }
}

.hero {
  animation: hop 1.4s cubic-bezier(0.3, 0, 0.3, 1) infinite;
}

.hero__body {
  fill: var(--slide-accent);
}

@keyframes hop {
  0%, 100% { translate: 0 0; }
  45% { translate: 30px -70px; }
  70% { translate: 40px 0; }
}

.hud rect {
  fill: color-mix(in srgb, var(--slide-bg) 80%, transparent);
}

.hud text {
  font-size: 13px;
  font-weight: 700;
  fill: var(--slide-accent-2);
}

/* ---------- perguntas com campo editável ---------- */
.questions {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vh, 24px);
}

.q {
  display: flex;
  align-items: flex-start;
  gap: 0.8em;
  padding: clamp(12px, 1.6vw, 24px);
  border-radius: 22px;
  background: rgb(255 255 255 / 0.04);
  border: 2px solid rgb(255 255 255 / 0.08);
  font-size: var(--text-base);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s;
}

.q.is-current {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
}

.q__glyph {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 2em;
  height: 2em;
  border-radius: 0.6em;
  font-weight: 800;
  color: var(--slide-bg);
  background: var(--c);
}

.q__body {
  flex: 1;
  min-width: 0;
}

.q__text {
  font-weight: 700;
  line-height: 1.25;
  text-wrap: balance;
}

.q__input {
  width: 100%;
  margin-top: 0.5em;
  padding: 0.45em 0.7em;
  border: 0;
  border-bottom: 2px dashed color-mix(in srgb, var(--c) 60%, transparent);
  border-radius: 8px 8px 0 0;
  background: rgb(255 255 255 / 0.04);
  color: var(--c);
  font: inherit;
  font-size: 0.95em;
  font-weight: 600;
  outline: none;
  transition: background 0.3s;
}

.q__input::placeholder {
  color: var(--slide-muted);
  font-weight: 400;
  opacity: 0.7;
}

.q__input:focus {
  background: rgb(255 255 255 / 0.09);
  border-bottom-style: solid;
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }

  .scene svg {
    max-height: 26vh;
  }
}
</style>
