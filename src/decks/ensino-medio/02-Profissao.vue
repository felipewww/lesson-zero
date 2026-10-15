<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'

/**
 * Uma compra atravessando o sistema, em ciclo:
 * site → API → (banco, pagamento, fila) → fila → e-mail → resposta volta ao site.
 * Posições no viewBox 640x360; tempos em segundos dentro de um ciclo de CYCLE.
 */
const CYCLE = 4.8
const ENTRANCE = 1.6 // o diagrama se monta antes dos pulsos começarem

const nodes: Record<string, { label: string; sub: string; icon: IconName; x: number; y: number; color: string }> = {
  web: { label: 'Site / App', sub: 'onde você clica', icon: 'monitor', x: 70, y: 180, color: 'var(--slide-accent)' },
  api: { label: 'API', sub: 'regras do negócio', icon: 'server', x: 250, y: 180, color: 'var(--slide-accent-2)' },
  db: { label: 'Banco de dados', sub: 'guarda o pedido', icon: 'database', x: 440, y: 60, color: 'var(--slide-accent-3)' },
  pay: { label: 'Pagamento', sub: 'serviço externo', icon: 'credit-card', x: 440, y: 180, color: '#34d399' },
  queue: { label: 'Fila', sub: 'tarefas para depois', icon: 'layers', x: 440, y: 300, color: '#fbbf24' },
  mail: { label: 'E-mail', sub: '"pedido confirmado"', icon: 'message', x: 590, y: 300, color: 'var(--slide-accent)' },
}

// Cada ligação: de onde para onde, quando o pulso sai e quanto demora (s)
const links: { from: string; to: string; start: number; dur: number; back?: boolean }[] = [
  { from: 'web', to: 'api', start: 0, dur: 0.8 },
  { from: 'api', to: 'db', start: 0.9, dur: 0.8 },
  { from: 'api', to: 'pay', start: 0.9, dur: 0.8 },
  { from: 'api', to: 'queue', start: 0.9, dur: 0.8 },
  { from: 'queue', to: 'mail', start: 1.9, dur: 0.7 },
  { from: 'api', to: 'web', start: 2.8, dur: 0.8, back: true },
]

const pathOf = (l: { from: string; to: string }) => {
  const a = nodes[l.from]
  const b = nodes[l.to]
  return `M${a.x} ${a.y} L${b.x} ${b.y}`
}

// keyTimes de 0..1 dentro do ciclo: parado, viaja, parado
const motion = (l: { start: number; dur: number }) => {
  const t0 = l.start / CYCLE
  const t1 = (l.start + l.dur) / CYCLE
  return { keyTimes: `0;${t0.toFixed(3)};${t1.toFixed(3)};1`, keyPoints: '0;0;1;1' }
}
const fade = (l: { start: number; dur: number }) => {
  const t0 = l.start / CYCLE
  const t1 = (l.start + l.dur) / CYCLE
  return `0;${t0.toFixed(3)};${(t0 + 0.01).toFixed(3)};${t1.toFixed(3)};${Math.min(t1 + 0.01, 1).toFixed(3)};1`
}

// Quando cada sistema "recebe" algo (para acender no momento certo)
const arrival = (id: string) => {
  const l = links.find((x) => x.to === id)
  return l ? l.start + l.dur : 0
}
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="text">
        <h1 v-reveal:blur class="title">Engenharia de software é <em>muito mais</em> do que escrever código.</h1>
        <p v-reveal="250" class="subtitle">
          É construir <strong>sistemas</strong>: peças conectadas para atingir um <strong>resultado final</strong>.
        </p>
      </div>

      <div v-reveal:zoom="300" class="visual" :style="{ '--cycle': `${CYCLE}s`, '--entrance': `${ENTRANCE}s` }">
        <svg class="wires" viewBox="0 0 640 360" aria-hidden="true">
          <!-- ligações (se desenham na entrada) -->
          <path
            v-for="(l, i) in links.filter((x) => !x.back)"
            :key="`w-${i}`"
            class="wire"
            :d="pathOf(l)"
            pathLength="1"
            :style="{ '--i': i, '--c': nodes[l.to].color }"
          />

          <!-- pulsos: cada um viaja na sua vez dentro do ciclo -->
          <g v-for="(l, i) in links" :key="`p-${i}`" :style="{ '--c': l.back ? nodes.web.color : nodes[l.to].color }">
            <circle class="pulse" :class="{ 'pulse--back': l.back }" r="8" opacity="0">
              <animateMotion
                :path="pathOf(l)"
                :dur="`${CYCLE}s`"
                :begin="`${ENTRANCE}s`"
                repeatCount="indefinite"
                calcMode="linear"
                :keyTimes="motion(l).keyTimes"
                :keyPoints="motion(l).keyPoints"
              />
              <animate
                attributeName="opacity"
                :dur="`${CYCLE}s`"
                :begin="`${ENTRANCE}s`"
                repeatCount="indefinite"
                values="0;0;1;1;0;0"
                :keyTimes="fade(l)"
              />
            </circle>
          </g>
        </svg>

        <div
          v-for="(node, id, i) in nodes"
          :key="id"
          class="node"
          :style="{
            left: `${(node.x / 640) * 100}%`,
            top: `${(node.y / 360) * 100}%`,
            '--i': i,
            '--c': node.color,
            '--hit': `${arrival(id as string)}s`,
          }"
          :class="{ 'is-target': arrival(id as string) > 0 }"
        >
          <span class="node__icon"><Icon :name="node.icon" /></span>
          <span class="node__label">{{ node.label }}</span>
          <span class="node__sub">{{ node.sub }}</span>
        </div>

        <!-- o resultado final: aparece quando a resposta volta ao site -->
        <span
          class="outcome"
          :style="{ left: `${(nodes.web.x / 640) * 100}%`, top: `${(nodes.web.y / 360) * 100}%`, '--hit': `${arrival('web')}s` }"
        >
          ✓ compra concluída
        </span>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.5fr);
  align-items: center;
  gap: clamp(32px, 5vw, 120px);
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    align-content: center;
  }
}

.title {
  font-size: calc(var(--text-title) * 0.85);
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

.subtitle {
  margin-top: 1em;
  max-width: 28em;
  font-size: calc(var(--text-base) * 1.05);
  color: var(--slide-muted);
}

/* ---------- diagrama: uma compra atravessando o sistema ---------- */
.visual {
  position: relative;
  width: 100%;
  aspect-ratio: 640 / 360;
  max-height: 78vh;
  margin-inline: auto;
  padding: 0 4% ; /* folga para os rótulos das pontas */
}

.wires {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.wire {
  fill: none;
  stroke: var(--c);
  stroke-width: 2.5;
  stroke-opacity: 0.5;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 0.7s var(--ease-out) forwards;
  animation-delay: calc(0.5s + var(--i) * 0.15s);
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

.pulse {
  fill: var(--c);
  filter: drop-shadow(0 0 6px var(--c)) drop-shadow(0 0 12px var(--c));
}

/* a resposta que volta ao site é um pouco maior e branca por dentro */
.pulse--back {
  stroke: var(--slide-fg);
  stroke-width: 2;
}

.node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  translate: -50% -32%;
  font-size: calc(var(--text-base) * 0.78);
  text-align: center;
  white-space: nowrap;
  animation: node-in 0.6s var(--ease-out) backwards;
  animation-delay: calc(0.3s + var(--i) * 0.12s);
}

@keyframes node-in {
  from {
    opacity: 0;
    scale: 0.6;
  }
}

.node__icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 3.4em;
  height: 3.4em;
  border-radius: 1em;
  font-size: 1.25em;
  color: var(--c);
  background: color-mix(in srgb, var(--slide-bg) 85%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 55%, transparent);
  box-shadow: 0 0 26px -8px var(--c);
}

.node__icon :deep(.icon) {
  width: 1.45em;
  height: 1.45em;
}

/* anel que pisca quando o pulso chega neste sistema */
.node.is-target .node__icon::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  border: 2px solid var(--c);
  opacity: 0;
  animation: ping var(--cycle) linear infinite;
  animation-delay: calc(var(--entrance) + var(--hit) - 0.05s);
}

@keyframes ping {
  0% {
    opacity: 0.95;
    scale: 1;
  }
  12% {
    opacity: 0;
    scale: 1.45;
  }
  100% {
    opacity: 0;
    scale: 1.45;
  }
}

.node__label {
  margin-top: 0.55em;
  font-weight: 700;
  color: var(--slide-fg);
}

.node__sub {
  font-size: 0.82em;
  color: var(--slide-muted);
}

.subtitle strong {
  color: var(--slide-fg);
}

/* selo do resultado final, sincronizado com a volta da resposta */
.outcome {
  position: absolute;
  translate: -50% -240%;
  padding: 0.35em 0.9em;
  border-radius: 999px;
  white-space: nowrap;
  font-size: calc(var(--text-base) * 0.72);
  font-weight: 700;
  color: #052e1b;
  background: #34d399;
  box-shadow: 0 10px 30px -8px #34d399;
  opacity: 0;
  animation: outcome var(--cycle) var(--ease-out) infinite;
  animation-delay: calc(var(--entrance) + var(--hit) - 0.05s);
}

@keyframes outcome {
  0% {
    opacity: 0;
    translate: -50% -200%;
    scale: 0.8;
  }
  6%,
  22% {
    opacity: 1;
    translate: -50% -240%;
    scale: 1;
  }
  30%,
  100% {
    opacity: 0;
    translate: -50% -260%;
    scale: 1;
  }
}

@media (max-aspect-ratio: 1 / 1) {
  .node {
    font-size: calc(var(--text-base) * 0.72);
  }
}
</style>
