<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos 1..4: um exemplo por vez (o atual fica em destaque)
const { step } = useSteps()

const examples: { text: string; icon: IconName; fx: string; color: string }[] = [
  { text: 'Fazer um personagem pular', icon: 'gamepad', fx: 'hop', color: 'var(--slide-accent)' },
  { text: 'Calcular uma nota da escola', icon: 'clipboard-check', fx: 'pop', color: 'var(--slide-accent-2)' },
  { text: 'Enviar uma mensagem', icon: 'message', fx: 'fly', color: 'var(--slide-accent-3)' },
  { text: 'Controlar um robô', icon: 'bot', fx: 'wave', color: 'var(--slide-accent)' },
]
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="text">
        <h1 v-reveal:blur class="title">
          Programar é <em>ensinar</em> um computador a fazer alguma coisa.
        </h1>

        <p v-reveal:fade="400" class="label">por exemplo</p>
        <ul class="examples">
          <li
            v-for="(ex, i) in examples"
            :key="ex.text"
            v-step:left
            class="example"
            :class="[`fx-${ex.fx}`, { 'is-current': step === i + 1 }]"
            :style="{ '--c': ex.color }"
          >
            <span class="example__icon"><Icon :name="ex.icon" /></span>
            {{ ex.text }}
          </li>
        </ul>
      </div>

      <!-- instrução viaja até o personagem, que obedece e pula -->
      <div v-reveal:zoom="300" class="scene" aria-hidden="true">
        <div class="command">Pule!</div>

        <svg class="bot" viewBox="0 0 120 150">
          <line x1="60" y1="8" x2="60" y2="26" class="bot__antenna" />
          <circle cx="60" cy="8" r="6" class="bot__tip" />
          <rect x="14" y="26" width="92" height="80" rx="26" class="bot__head" />
          <rect x="26" y="40" width="68" height="44" rx="16" class="bot__face" />
          <circle cx="46" cy="60" r="7" class="bot__eye" />
          <circle cx="74" cy="60" r="7" class="bot__eye" />
          <path d="M50 72 Q60 80 70 72" class="bot__smile" />
          <rect x="34" y="106" width="52" height="26" rx="10" class="bot__body" />
          <rect x="30" y="132" width="20" height="12" rx="6" class="bot__foot" />
          <rect x="70" y="132" width="20" height="12" rx="6" class="bot__foot" />
        </svg>

        <span class="ground" />
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
  gap: clamp(24px, 5vw, 120px);
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    align-content: center;
  }

  /* .layout na frente: esta regra vem antes da .scene base no arquivo */
  .layout .scene {
    width: min(100%, 30vh);
  }
}

.title {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.label {
  margin-top: 5vh;
  font-size: calc(var(--text-base) * 0.75);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

/* ---------- exemplos ---------- */
.examples {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(10px, 1.4vw, 22px);
  margin-top: 1.2vh;
}

.example {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.75em 1em;
  border-radius: 18px;
  font-size: calc(var(--text-base) * 1.08);
  font-weight: 600;
  line-height: 1.2;
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.1);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s;
}

.example.is-current {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent);
}

.example__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.2em;
  height: 2.2em;
  border-radius: 0.7em;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 16%, transparent);
}

.example__icon :deep(.icon) {
  width: 1.3em;
  height: 1.3em;
}

/* cada ícone faz a sua "ação" enquanto o exemplo está em destaque */
.example.is-current.fx-hop .example__icon :deep(.icon) { animation: hop 0.9s ease-in-out infinite; }
.example.is-current.fx-pop .example__icon :deep(.icon) { animation: pop 1.2s ease-in-out infinite; }
.example.is-current.fx-fly .example__icon :deep(.icon) { animation: fly 1.6s ease-in-out infinite; }
.example.is-current.fx-wave .example__icon :deep(.icon) { animation: wave 1.4s ease-in-out infinite; }

@keyframes hop {
  0%, 100% { translate: 0 0; }
  40% { translate: 0 -30%; }
}

@keyframes pop {
  0%, 100% { scale: 1; }
  50% { scale: 1.25; }
}

@keyframes fly {
  0% { translate: 0 0; opacity: 1; }
  60% { translate: 60% -60%; opacity: 0; }
  61% { translate: -60% 60%; opacity: 0; }
  100% { translate: 0 0; opacity: 1; }
}

@keyframes wave {
  0%, 100% { rotate: 0deg; }
  25% { rotate: -14deg; }
  75% { rotate: 14deg; }
}

/* ---------- cena: instrução → ação ---------- */
.scene {
  position: relative;
  width: min(100%, 72vh);
  max-width: 680px;
  aspect-ratio: 1;
  margin-inline: auto;
}

.command {
  position: absolute;
  left: 0;
  top: 18%;
  padding: 0.5em 1em;
  border-radius: 16px 16px 16px 4px;
  font-size: calc(var(--text-base) * 1.2);
  font-weight: 800;
  color: var(--slide-bg);
  background: var(--slide-accent-2);
  box-shadow: 0 16px 40px -14px var(--slide-accent-2);
  animation: send 3.2s var(--ease-out) infinite;
}

/* a instrução sai da esquerda, chega no personagem e some */
@keyframes send {
  0% { translate: 0 0; opacity: 0; scale: 0.8; }
  10% { opacity: 1; scale: 1; }
  32% { translate: 150% 60%; opacity: 1; scale: 1; }
  40% { translate: 165% 70%; opacity: 0; scale: 0.6; }
  100% { translate: 165% 70%; opacity: 0; }
}

.bot {
  position: absolute;
  left: 50%;
  bottom: 12%;
  width: 50%;
  translate: -20% 0;
  overflow: visible;
  animation: jump 3.2s infinite;
}

/* obedece: agacha, pula e cai — sincronizado com a chegada da instrução */
@keyframes jump {
  0%, 40% { transform: translateY(0) scale(1, 1); animation-timing-function: ease-out; }
  46% { transform: translateY(0) scale(1.1, 0.88); animation-timing-function: ease-out; }
  62% { transform: translateY(-48%) scale(0.95, 1.06); animation-timing-function: ease-in; }
  76% { transform: translateY(0) scale(1.08, 0.92); }
  84%, 100% { transform: translateY(0) scale(1, 1); }
}

.bot {
  transform-origin: 50% 100%;
}

.bot__antenna { stroke: var(--slide-muted); stroke-width: 4; stroke-linecap: round; }
.bot__tip { fill: var(--slide-accent-3); }
.bot__head { fill: var(--slide-accent); }
.bot__face { fill: var(--slide-bg); }
.bot__eye { fill: var(--slide-accent-2); }
.bot__smile { fill: none; stroke: var(--slide-accent-2); stroke-width: 4; stroke-linecap: round; }
.bot__body { fill: color-mix(in srgb, var(--slide-accent) 70%, var(--slide-bg)); }
.bot__foot { fill: var(--slide-accent-3); }

.ground {
  position: absolute;
  left: 22%;
  right: 8%;
  bottom: 10%;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--slide-accent) 45%, transparent), transparent);
}
</style>
