<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { COMMAND_LABEL, robotProgram, type RobotCommand } from './robotProgram'

// Passo 1: as regras; passo 2: o painel onde o apresentador registra os comandos da turma
const rules: { text: string; icon: IconName }[] = [
  { text: 'O robô só executa comandos.', icon: 'bot' },
  { text: 'Um comando por vez.', icon: 'clock' },
  { text: 'Os comandos precisam ser claros.', icon: 'eye' },
  { text: 'O robô não adivinha nada.', icon: 'x' },
]

const buttons: { cmd: RobotCommand; arrow: string }[] = [
  { cmd: 'forward', arrow: '↑' },
  { cmd: 'left', arrow: '↺' },
  { cmd: 'right', arrow: '↻' },
  { cmd: 'grab', arrow: '✋' },
]

function add(cmd: RobotCommand) {
  robotProgram.commands.push(cmd)
}

function undo() {
  robotProgram.commands.pop()
}

function clear() {
  robotProgram.commands.splice(0)
}
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="brief">
        <span v-reveal:zoom class="badge">desafio</span>
        <h1 v-reveal:blur="150" class="title">Programe um <em>robô humano</em></h1>
        <p v-reveal="350" class="goal">
          <span class="goal__icon"><Icon name="target" /></span>
          <span>Fazer o robô chegar até um objeto na sala.</span>
        </p>

        <ol v-step class="rules">
          <li v-for="(r, i) in rules" :key="r.text" class="rule" :style="{ '--i': i }">
            <span class="rule__n">{{ i + 1 }}</span>
            <Icon :name="r.icon" class="rule__icon" />
            <span>{{ r.text }}</span>
          </li>
        </ol>
      </div>

      <section v-step:left class="panel" aria-label="Programa da turma">
        <header class="panel__head">
          <span class="panel__title">programa da turma</span>
          <span class="panel__count">{{ robotProgram.commands.length }} comandos</span>
        </header>

        <ol class="program">
          <TransitionGroup name="cmd">
            <li v-for="(cmd, i) in robotProgram.commands" :key="`${i}-${cmd}`" class="program__item" :class="`is-${cmd}`">
              <span class="program__n">{{ i + 1 }}</span>
              {{ COMMAND_LABEL[cmd] }}
            </li>
          </TransitionGroup>
          <li v-if="!robotProgram.commands.length" class="program__empty">Quais comandos o robô deve seguir?</li>
        </ol>

        <div class="buttons">
          <button
            v-for="b in buttons"
            :key="b.cmd"
            class="btn"
            :class="`is-${b.cmd}`"
            @mousedown.prevent
            @click="add(b.cmd)"
          >
            <span class="btn__arrow">{{ b.arrow }}</span>
            {{ COMMAND_LABEL[b.cmd] }}
          </button>
        </div>

        <div class="tools">
          <button class="tool" :disabled="!robotProgram.commands.length" @mousedown.prevent @click="undo">
            apagar último
          </button>
          <button class="tool" :disabled="!robotProgram.commands.length" @mousedown.prevent @click="clear">
            limpar tudo
          </button>
        </div>
      </section>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: clamp(24px, 4vw, 96px);
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    align-content: center;
  }
}

.badge {
  display: inline-block;
  padding: 0.35em 1em;
  border-radius: 999px;
  font-size: calc(var(--text-base) * 0.75);
  font-weight: 800;
  letter-spacing: 0.16em;
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
  text-wrap: balance;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.goal {
  display: flex;
  align-items: center;
  gap: 0.6em;
  margin-top: 0.8em;
  font-size: calc(var(--text-base) * 1.1);
  color: var(--slide-muted);
}

.goal__icon {
  display: grid;
  place-items: center;
  width: 1.8em;
  height: 1.8em;
  border-radius: 50%;
  color: var(--slide-accent-3);
  background: color-mix(in srgb, var(--slide-accent-3) 18%, transparent);
}

/* ---------- regras ---------- */
.rules {
  list-style: none;
  display: grid;
  gap: 0.6em;
  margin-top: 4vh;
}

.rule {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.6em 1em;
  border-radius: 16px;
  font-size: var(--text-base);
  font-weight: 600;
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.08);
  opacity: 0;
  translate: -20px 0;
  transition:
    opacity 0.5s var(--ease-out),
    translate 0.5s var(--ease-out);
}

.rules[data-step-shown] .rule {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(var(--i) * 160ms);
}

.rule__n {
  display: grid;
  place-items: center;
  width: 1.6em;
  height: 1.6em;
  border-radius: 50%;
  font-size: 0.8em;
  font-weight: 800;
  color: var(--slide-bg);
  background: var(--slide-accent);
}

.rule__icon {
  color: var(--slide-accent);
}

/* ---------- painel ---------- */
.panel {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: clamp(16px, 2vw, 32px);
  border-radius: 26px;
  font-size: var(--text-base);
  background: color-mix(in srgb, var(--slide-bg) 70%, transparent);
  border: 1px solid rgb(255 255 255 / 0.12);
  box-shadow: 0 30px 80px -30px color-mix(in srgb, var(--slide-accent) 60%, transparent);
  backdrop-filter: blur(10px);
}

.panel__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.panel__title {
  font-size: 0.75em;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slide-accent);
}

.panel__count {
  font-size: 0.7em;
  color: var(--slide-muted);
  font-variant-numeric: tabular-nums;
}

.program {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.45em;
  min-height: 7.5em;
  max-height: 32vh;
  overflow: auto;
  padding: 0.8em;
  border-radius: 16px;
  background: rgb(0 0 0 / 0.25);
}

.program__item {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.3em 0.75em 0.3em 0.35em;
  border-radius: 10px;
  font-size: 0.72em;
  font-weight: 700;
  color: var(--slide-bg);
  background: var(--c, var(--slide-accent));
}

.program__n {
  display: grid;
  place-items: center;
  min-width: 1.5em;
  height: 1.5em;
  border-radius: 7px;
  font-size: 0.85em;
  background: rgb(255 255 255 / 0.45);
}

.program__empty {
  align-self: center;
  margin: auto;
  font-size: 0.75em;
  color: var(--slide-muted);
}

.is-forward { --c: var(--slide-accent); }
.is-left,
.is-right { --c: var(--slide-accent-2); }
.is-grab { --c: var(--slide-accent-3); }

.cmd-enter-active {
  transition:
    opacity 0.35s,
    scale 0.35s var(--ease-out);
}

.cmd-enter-from {
  opacity: 0;
  scale: 0.6;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5em;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.7em 0.9em;
  border: 0;
  border-radius: 14px;
  font: inherit;
  font-size: 0.8em;
  font-weight: 700;
  text-align: left;
  color: var(--slide-fg);
  background: color-mix(in srgb, var(--c) 18%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 50%, transparent);
  cursor: pointer;
  transition:
    background 0.2s,
    scale 0.15s;
}

.btn:hover {
  background: color-mix(in srgb, var(--c) 30%, transparent);
}

.btn:active {
  scale: 0.96;
}

.btn__arrow {
  display: grid;
  place-items: center;
  width: 1.6em;
  height: 1.6em;
  border-radius: 8px;
  color: var(--slide-bg);
  background: var(--c);
}

.tools {
  display: flex;
  justify-content: flex-end;
  gap: 0.6em;
}

.tool {
  padding: 0.35em 0.9em;
  border: 1px solid rgb(255 255 255 / 0.15);
  border-radius: 999px;
  font: inherit;
  font-size: 0.65em;
  color: var(--slide-muted);
  background: transparent;
  cursor: pointer;
}

.tool:hover:not(:disabled) {
  color: var(--slide-fg);
  border-color: var(--slide-accent-3);
}

.tool:disabled {
  opacity: 0.35;
  cursor: default;
}
</style>
