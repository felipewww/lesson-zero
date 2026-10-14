<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passo 1: o código "vira" um sistema conectado
const { step } = useSteps(1)

const code = [
  '<span class="k">function</span> <span class="f">pedir</span>(pizza) {',
  '  <span class="k">return</span> api.<span class="f">post</span>(<span class="s">\'/pedidos\'</span>, pizza)',
  '}',
]

// Posições no viewBox 400x300 do diagrama
const nodes: { label: string; icon: IconName; x: number; y: number; color: string }[] = [
  { label: 'Usuários', icon: 'users', x: 56, y: 56, color: 'var(--slide-accent)' },
  { label: 'Nuvem', icon: 'cloud', x: 344, y: 56, color: 'var(--slide-accent-2)' },
  { label: 'Banco de dados', icon: 'database', x: 56, y: 244, color: 'var(--slide-accent-3)' },
  { label: 'Serviços', icon: 'plug', x: 344, y: 244, color: '#34d399' },
]
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="text">
        <h1 v-reveal:blur class="title">Programar é <em>muito mais</em> do que escrever código.</h1>
        <p v-reveal="250" class="subtitle">
          O que um engenheiro de software realmente faz, como começar e o que muda com a IA.
        </p>
      </div>

      <div v-reveal:zoom="400" class="visual" :class="{ 'is-system': step >= 1 }">
        <svg class="wires" viewBox="0 0 400 300" aria-hidden="true">
          <g v-for="(node, i) in nodes" :key="node.label" :style="{ '--i': i, '--c': node.color }">
            <path class="wire" :d="`M200 150 L${node.x} ${node.y}`" pathLength="1" />
            <circle class="pulse" r="3">
              <animateMotion
                :path="i % 2 ? `M200 150 L${node.x} ${node.y}` : `M${node.x} ${node.y} L200 150`"
                :dur="`${1.6 + i * 0.3}s`"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        <div
          v-for="(node, i) in nodes"
          :key="node.label"
          class="node"
          :style="{ left: `${(node.x / 400) * 100}%`, top: `${(node.y / 300) * 100}%`, '--i': i, '--c': node.color }"
        >
          <span class="node__icon"><Icon :name="node.icon" /></span>
          <span class="node__label">{{ node.label }}</span>
        </div>

        <pre class="code"><code><span v-for="(line, i) in code" :key="i" class="code__line" :style="{ '--i': i }" v-html="line" /></code></pre>

        <div class="core">
          <Icon name="code" />
          <span>seu sistema</span>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
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

.subtitle {
  margin-top: 1em;
  max-width: 28em;
  font-size: calc(var(--text-base) * 1.05);
  color: var(--slide-muted);
}

/* ---------- diagrama ---------- */
.visual {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 70vh;
  margin-inline: auto;
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
  stroke-width: 1.5;
  stroke-opacity: 0.5;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.9s var(--ease-out);
}

.pulse {
  fill: var(--c);
  opacity: 0;
  transition: opacity 0.4s;
  filter: drop-shadow(0 0 4px var(--c));
}

.is-system .wire {
  stroke-dashoffset: 0;
  transition-delay: calc(300ms + var(--i) * 120ms);
}

.is-system .pulse {
  opacity: 1;
  transition-delay: calc(1000ms + var(--i) * 120ms);
}

.node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
  translate: -50% -50%;
  font-size: calc(var(--text-base) * 0.6);
  color: var(--slide-fg);
  opacity: 0;
  scale: 0.6;
  transition:
    opacity 0.6s var(--ease-out),
    scale 0.6s var(--ease-out);
}

.node__icon {
  display: grid;
  place-items: center;
  width: 3.6em;
  height: 3.6em;
  border-radius: 1em;
  font-size: 1.3em;
  color: var(--c);
  background: rgb(15 23 42 / 0.8);
  border: 1px solid color-mix(in srgb, var(--c) 50%, transparent);
  box-shadow: 0 0 30px -6px var(--c);
}

.node__icon :deep(.icon) {
  width: 1.5em;
  height: 1.5em;
}

.is-system .node {
  opacity: 1;
  scale: 1;
  transition-delay: calc(700ms + var(--i) * 120ms);
}

/* código: no início ocupa o centro; no passo 1 encolhe e dá lugar ao núcleo */
.code {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  width: 100%;
  padding: 1.2em 1.4em;
  border-radius: 18px;
  background: rgb(2 6 23 / 0.85);
  border: 1px solid rgb(255 255 255 / 0.1);
  box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.6);
  font-size: calc(var(--text-base) * 0.82);
  line-height: 1.7;
  white-space: pre;
  transition:
    opacity 0.6s var(--ease-out),
    scale 0.7s var(--ease-out),
    filter 0.6s;
}

.code__line {
  display: block;
  animation: type-in 0.5s var(--ease-out) both;
  animation-delay: calc(700ms + var(--i) * 280ms);
}

@keyframes type-in {
  from {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
  }
  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

.code :deep(.k) { color: var(--slide-accent-2); }
.code :deep(.f) { color: var(--slide-accent); }
.code :deep(.s) { color: #34d399; }

.is-system .code {
  opacity: 0;
  scale: 0.3;
  filter: blur(6px);
  pointer-events: none;
}

.core {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3em;
  padding: 1.1em 1.4em;
  border-radius: 1.2em;
  font-size: calc(var(--text-base) * 0.7);
  font-weight: 700;
  color: var(--slide-fg);
  background: linear-gradient(135deg, rgb(56 189 248 / 0.25), rgb(167 139 250 / 0.25));
  border: 1px solid rgb(255 255 255 / 0.2);
  backdrop-filter: blur(8px);
  box-shadow: 0 0 60px -10px var(--slide-accent);
  opacity: 0;
  scale: 1.6;
  transition:
    opacity 0.6s var(--ease-out),
    scale 0.7s var(--ease-out);
}

.core :deep(.icon) {
  width: 1.8em;
  height: 1.8em;
  color: var(--slide-accent);
}

.is-system .core {
  opacity: 1;
  scale: 1;
  transition-delay: 200ms;
}
</style>
