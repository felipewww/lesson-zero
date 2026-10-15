<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'

// Passo 1: NÃO!; passo 2: imagem que muita gente tem × vida real; passo 3: o que um programador também faz
const activities: { text: string; icon: IconName }[] = [
  { text: 'Conversa com pessoas', icon: 'message' },
  { text: 'Descobre problemas', icon: 'search' },
  { text: 'Imagina soluções', icon: 'lightbulb' },
  { text: 'Trabalha em equipe', icon: 'users' },
  { text: 'Testa suas ideias', icon: 'flask' },
]

// Equipe ao redor do quadro (posições no viewBox 200x140)
const team = [
  { x: 40, color: 'var(--slide-accent)' },
  { x: 80, color: 'var(--slide-accent-2)' },
  { x: 120, color: 'var(--slide-accent-3)' },
  { x: 160, color: 'var(--slide-accent)' },
]
</script>

<template>
  <Slide>
    <div class="stage">
      <header class="head">
        <h1 v-reveal:blur class="title">O programador fica o dia inteiro escrevendo código?</h1>
        <span v-step:zoom class="no">NÃO!</span>
      </header>

      <div v-step class="compare">
        <figure class="panel panel--myth">
          <svg viewBox="0 0 200 140" aria-hidden="true">
            <rect x="0" y="0" width="200" height="140" rx="14" class="myth__room" />
            <rect x="58" y="34" width="84" height="54" rx="6" class="myth__screen" />
            <g class="myth__code">
              <rect x="66" y="42" width="40" height="4" rx="2" />
              <rect x="72" y="51" width="52" height="4" rx="2" />
              <rect x="72" y="60" width="30" height="4" rx="2" />
              <rect x="66" y="69" width="46" height="4" rx="2" />
              <rect x="72" y="78" width="36" height="4" rx="2" />
            </g>
            <rect x="92" y="88" width="16" height="10" class="myth__stand" />
            <rect x="30" y="98" width="140" height="6" rx="3" class="myth__desk" />
            <circle cx="100" cy="104" r="15" class="myth__head" />
            <path d="M72 140 Q72 112 100 112 Q128 112 128 140 Z" class="myth__hoodie" />
            <text x="150" y="30" class="myth__zzz">z z z</text>
          </svg>
          <figcaption>o que muita gente imagina</figcaption>
        </figure>

        <figure class="panel panel--real">
          <svg viewBox="0 0 200 140" aria-hidden="true">
            <rect x="30" y="12" width="140" height="58" rx="8" class="real__board" />
            <rect x="42" y="22" width="22" height="18" rx="3" class="note note--1" />
            <rect x="72" y="26" width="22" height="18" rx="3" class="note note--2" />
            <rect x="102" y="20" width="22" height="18" rx="3" class="note note--3" />
            <rect x="132" y="28" width="22" height="18" rx="3" class="note note--4" />
            <path d="M64 31 L72 35 M94 35 L102 29 M124 29 L132 37" class="real__links" />
            <g v-for="(p, i) in team" :key="i" class="person" :style="{ '--c': p.color, '--i': i }">
              <circle :cx="p.x" cy="96" r="10" class="person__head" />
              <path :d="`M${p.x - 15} 140 Q${p.x - 15} 110 ${p.x} 110 Q${p.x + 15} 110 ${p.x + 15} 140 Z`" class="person__body" />
            </g>
            <g class="bubble bubble--a">
              <rect x="46" y="66" width="22" height="14" rx="5" />
              <circle cx="52" cy="73" r="1.6" class="bubble__dot" />
              <circle cx="57" cy="73" r="1.6" class="bubble__dot" />
              <circle cx="62" cy="73" r="1.6" class="bubble__dot" />
            </g>
            <g class="bubble bubble--b">
              <rect x="126" y="66" width="22" height="14" rx="5" />
              <path d="M133 73 l3 3 l6 -6" class="bubble__check" />
            </g>
          </svg>
          <figcaption>na vida real</figcaption>
        </figure>
      </div>

      <ul v-step class="activities">
        <li v-for="(a, i) in activities" :key="a.text" class="activity" :style="{ '--i': i }">
          <span class="activity__icon"><Icon :name="a.icon" /></span>
          <span>{{ a.text }}</span>
        </li>
      </ul>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(16px, 4vh, 48px);
}

.head {
  position: relative;
  padding-right: 4em;
}

.title {
  font-size: calc(var(--text-title) * 0.85);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.no {
  position: absolute;
  right: 0;
  top: 50%;
  translate: 0 -50%;
  padding: 0.1em 0.4em;
  border: 0.08em solid var(--slide-accent-3);
  border-radius: 0.18em;
  font-size: calc(var(--text-title) * 1.05);
  font-weight: 900;
  line-height: 1;
  color: var(--slide-accent-3);
  rotate: -10deg;
  text-shadow: 0 0 30px color-mix(in srgb, var(--slide-accent-3) 60%, transparent);
}

/* carimbo: entra grande e "bate" na tela */
.no[data-step-shown] {
  animation: stamp 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) both;
}

@keyframes stamp {
  from {
    scale: 2.2;
    opacity: 0;
  }
}

/* ---------- comparação ---------- */
.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(16px, 3vw, 56px);
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;
  font-size: var(--text-base);
}

.panel svg {
  width: 100%;
  max-height: 40vh;
}

.panel figcaption {
  font-weight: 700;
  color: var(--slide-muted);
}

.panel--real figcaption {
  color: var(--slide-accent);
}

/* imagem estereotipada: escura, sozinho, apagada */
.panel--myth {
  filter: grayscale(0.6);
  opacity: 0.75;
}

.myth__room { fill: rgb(0 0 0 / 0.45); }
.myth__screen { fill: color-mix(in srgb, var(--slide-accent) 22%, var(--slide-bg)); stroke: var(--slide-accent); stroke-width: 1; }
.myth__code rect { fill: var(--slide-accent); opacity: 0.7; animation: blinkline 2.4s infinite; }
.myth__code rect:nth-child(2) { animation-delay: 0.3s; }
.myth__code rect:nth-child(3) { animation-delay: 0.6s; }
.myth__code rect:nth-child(4) { animation-delay: 0.9s; }
.myth__code rect:nth-child(5) { animation-delay: 1.2s; }
.myth__stand,
.myth__desk { fill: rgb(255 255 255 / 0.15); }
.myth__head { fill: #334155; }
.myth__hoodie { fill: #1e293b; }
.myth__zzz { font-size: 12px; font-weight: 700; fill: var(--slide-muted); animation: zzz 3s ease-in-out infinite; }

@keyframes blinkline {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.25; }
}

@keyframes zzz {
  0%, 100% { translate: 0 0; opacity: 0.3; }
  50% { translate: 0 -6px; opacity: 1; }
}

/* vida real: equipe colorida em volta do quadro */
.real__board { fill: rgb(255 255 255 / 0.08); stroke: rgb(255 255 255 / 0.2); stroke-width: 1; }
.real__links { stroke: var(--slide-muted); stroke-width: 1.2; stroke-dasharray: 2 2; fill: none; }
.note { animation: note 3.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.note--1 { fill: var(--slide-accent-2); }
.note--2 { fill: var(--slide-accent); animation-delay: 0.4s; }
.note--3 { fill: var(--slide-accent-3); animation-delay: 0.8s; }
.note--4 { fill: var(--slide-accent-2); animation-delay: 1.2s; }

@keyframes note {
  0%, 100% { rotate: 0deg; }
  50% { rotate: 4deg; }
}

.person__head { fill: var(--c); }
.person__body { fill: color-mix(in srgb, var(--c) 55%, var(--slide-bg)); }
.person { animation: nod 2.8s ease-in-out infinite; animation-delay: calc(var(--i) * -0.7s); }

@keyframes nod {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -2px; }
}

.bubble rect { fill: var(--slide-fg); }
.bubble__dot { fill: var(--slide-bg); }
.bubble__check { fill: none; stroke: var(--slide-bg); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.bubble { animation: talk 3s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom; }
.bubble--b { animation-delay: 1.5s; }

@keyframes talk {
  0%, 100% { opacity: 0; scale: 0.6; }
  20%, 45% { opacity: 1; scale: 1; }
  60% { opacity: 0; scale: 0.8; }
}

/* ---------- o que também faz ---------- */
.activities {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6em;
}

.activity {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  padding: 0.55em 1.1em 0.55em 0.6em;
  border-radius: 999px;
  font-size: calc(var(--text-base) * 0.9);
  font-weight: 700;
  background: rgb(255 255 255 / 0.06);
  border: 1px solid rgb(255 255 255 / 0.12);
  opacity: 0;
  translate: 0 14px;
  transition:
    opacity 0.5s var(--ease-out),
    translate 0.5s var(--ease-out);
}

.activities[data-step-shown] .activity {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(var(--i) * 150ms);
}

.activity__icon {
  display: grid;
  place-items: center;
  width: 1.8em;
  height: 1.8em;
  border-radius: 50%;
  color: var(--slide-bg);
  background: var(--slide-accent);
}

.activity:nth-child(2n) .activity__icon { background: var(--slide-accent-2); }
.activity:nth-child(3n) .activity__icon { background: var(--slide-accent-3); }
</style>
