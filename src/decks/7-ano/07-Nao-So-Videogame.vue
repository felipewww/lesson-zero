<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import { useSteps } from '../../deck/steps'

// Passos 1..5: uma criação por vez, cada uma com sua pequena animação
const { step } = useSteps()

const things = [
  { id: 'game', label: 'Jogos', color: 'var(--slide-accent)' },
  { id: 'app', label: 'Aplicativos', color: 'var(--slide-accent-2)' },
  { id: 'site', label: 'Sites', color: 'var(--slide-accent-3)' },
  { id: 'robot', label: 'Robôs', color: 'var(--slide-accent)' },
  { id: 'ai', label: 'Inteligência Artificial', color: 'var(--slide-accent-2)' },
]
</script>

<template>
  <Slide>
    <div class="stage">
      <header class="head">
        <h1 v-reveal:blur class="title">Programação <em>não é só</em> videogame</h1>
        <p v-reveal="250" class="lead">Você pode criar quase qualquer coisa digital.</p>
      </header>

      <div class="grid">
        <article
          v-for="(t, i) in things"
          :key="t.id"
          v-step:zoom
          class="card"
          :class="[`card--${t.id}`, { 'is-current': step === i + 1 }]"
          :style="{ '--c': t.color }"
        >
          <div class="art" aria-hidden="true">
            <!-- Jogos: personagem pulando um obstáculo -->
            <svg v-if="t.id === 'game'" viewBox="0 0 120 90">
              <rect x="6" y="72" width="108" height="6" rx="3" class="soft" />
              <rect x="64" y="58" width="14" height="14" rx="3" class="warn" />
              <g class="jumper">
                <rect x="22" y="48" width="20" height="24" rx="8" class="main" />
                <circle cx="29" cy="57" r="2.4" class="ink" />
                <circle cx="36" cy="57" r="2.4" class="ink" />
              </g>
            </svg>

            <!-- Aplicativos: celular com mensagens chegando -->
            <svg v-else-if="t.id === 'app'" viewBox="0 0 120 90">
              <rect x="38" y="4" width="44" height="82" rx="9" class="frame" />
              <rect x="44" y="16" width="26" height="9" rx="4.5" class="bubble b1" />
              <rect x="50" y="30" width="26" height="9" rx="4.5" class="bubble b2 main" />
              <rect x="44" y="44" width="22" height="9" rx="4.5" class="bubble b3" />
              <rect x="54" y="58" width="22" height="9" rx="4.5" class="bubble b4 main" />
            </svg>

            <!-- Sites: janela de navegador carregando blocos -->
            <svg v-else-if="t.id === 'site'" viewBox="0 0 120 90">
              <rect x="8" y="8" width="104" height="74" rx="8" class="frame" />
              <circle cx="18" cy="17" r="2.5" class="main" />
              <circle cx="26" cy="17" r="2.5" class="warn" />
              <circle cx="34" cy="17" r="2.5" class="soft" />
              <rect x="16" y="28" width="88" height="14" rx="4" class="block k1" />
              <rect x="16" y="47" width="40" height="27" rx="4" class="block k2 main" />
              <rect x="62" y="47" width="42" height="11" rx="4" class="block k3" />
              <rect x="62" y="63" width="30" height="11" rx="4" class="block k4" />
            </svg>

            <!-- Robôs: robô acenando e piscando -->
            <svg v-else-if="t.id === 'robot'" viewBox="0 0 120 90">
              <line x1="60" y1="6" x2="60" y2="16" class="line" />
              <circle cx="60" cy="6" r="4" class="warn antenna" />
              <rect x="38" y="16" width="44" height="32" rx="10" class="main" />
              <rect x="47" y="27" width="8" height="8" rx="4" class="ink eye" />
              <rect x="65" y="27" width="8" height="8" rx="4" class="ink eye" />
              <rect x="44" y="52" width="32" height="30" rx="8" class="frame" />
              <rect x="80" y="54" width="8" height="22" rx="4" class="main arm" />
              <rect x="32" y="54" width="8" height="22" rx="4" class="main" />
            </svg>

            <!-- IA: brilho no centro com ideias orbitando -->
            <svg v-else viewBox="0 0 120 90">
              <circle cx="60" cy="45" r="30" class="ring" />
              <path
                class="main spark"
                d="M60 27 L65 40 L78 45 L65 50 L60 63 L55 50 L42 45 L55 40 Z"
              />
              <g class="orbit">
                <circle cx="60" cy="15" r="5" class="warn" />
                <circle cx="90" cy="45" r="4" class="soft" />
                <circle cx="30" cy="45" r="4" class="pink" />
              </g>
            </svg>
          </div>
          <span class="card__label">{{ t.label }}</span>
        </article>
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
  letter-spacing: -0.02em;
}

.title em {
  font-style: normal;
  color: var(--slide-accent-3);
}

.lead {
  margin-top: 0.4em;
  font-size: calc(var(--text-base) * 1.2);
  color: var(--slide-muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(12px, 1.6vw, 28px);
}

@media (max-aspect-ratio: 1 / 1) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .art {
    aspect-ratio: 4 / 3;
  }
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9em;
  padding: clamp(14px, 1.6vw, 28px) clamp(10px, 1vw, 18px);
  border-radius: 26px;
  background: rgb(255 255 255 / 0.04);
  border: 2px solid rgb(255 255 255 / 0.08);
  font-size: calc(var(--text-base) * 1.15);
  text-align: center;
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s,
    box-shadow 0.4s;
}

.card.is-current {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  box-shadow: 0 24px 60px -24px var(--c);
}

.art {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 18px;
  background: color-mix(in srgb, var(--c) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.art svg {
  width: 90%;
  height: 90%;
  overflow: visible;
}

.card__label {
  font-weight: 800;
  line-height: 1.15;
  text-wrap: balance;
}

/* ---------- cores das ilustrações ---------- */
.main { fill: var(--c); }
.warn { fill: var(--slide-accent-2); }
.pink { fill: var(--slide-accent-3); }
.soft { fill: color-mix(in srgb, var(--slide-fg) 35%, transparent); }
.ink { fill: var(--slide-bg); }
.frame {
  fill: color-mix(in srgb, var(--slide-fg) 8%, transparent);
  stroke: color-mix(in srgb, var(--slide-fg) 40%, transparent);
  stroke-width: 2;
}
.line {
  stroke: color-mix(in srgb, var(--slide-fg) 50%, transparent);
  stroke-width: 2;
}
.ring {
  fill: none;
  stroke: color-mix(in srgb, var(--c) 40%, transparent);
  stroke-width: 2;
  stroke-dasharray: 4 6;
}

/* ---------- animações de cada ilustração ---------- */
.jumper {
  animation: jump 1.3s cubic-bezier(0.3, 0, 0.3, 1) infinite;
}

@keyframes jump {
  0%, 100% { translate: 0 0; }
  40% { translate: 30px -34px; }
  70% { translate: 62px 0; }
  85% { translate: 62px 0; opacity: 1; }
  86% { translate: 0 0; opacity: 0; }
  95% { opacity: 1; }
}

.bubble {
  fill: color-mix(in srgb, var(--slide-fg) 30%, transparent);
  animation: msg 3.2s ease-out infinite;
}

.bubble.main { fill: var(--c); }
.b2 { animation-delay: 0.4s; }
.b3 { animation-delay: 0.8s; }
.b4 { animation-delay: 1.2s; }

@keyframes msg {
  0% { opacity: 0; translate: 0 6px; }
  12%, 80% { opacity: 1; translate: 0 0; }
  100% { opacity: 0; }
}

.block {
  fill: color-mix(in srgb, var(--slide-fg) 22%, transparent);
  animation: load 3s ease-in-out infinite;
}

.block.main { fill: var(--c); }
.k2 { animation-delay: 0.3s; }
.k3 { animation-delay: 0.6s; }
.k4 { animation-delay: 0.9s; }

@keyframes load {
  0%, 100% { opacity: 0.25; }
  30%, 70% { opacity: 1; }
}

.eye {
  transform-box: fill-box;
  transform-origin: center;
  animation: blink 3s infinite;
}

@keyframes blink {
  0%, 92%, 100% { scale: 1 1; }
  95% { scale: 1 0.1; }
}

.arm {
  transform-box: fill-box;
  transform-origin: 50% 10%;
  animation: wave 1.4s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { rotate: 200deg; }
  50% { rotate: 150deg; }
}

.antenna {
  animation: glow 1.2s ease-in-out infinite alternate;
}

@keyframes glow {
  to { opacity: 0.3; }
}

.spark {
  transform-box: fill-box;
  transform-origin: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  50% { scale: 1.2; }
}

.orbit {
  transform-origin: 60px 45px;
  animation: orbit 6s linear infinite;
}

@keyframes orbit {
  to { rotate: 360deg; }
}
</style>
