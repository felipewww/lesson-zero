<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Continua o slide 04: o sistema de correção de provas foi lançado... e a vida real começa.
// Passos 1..5: um acontecimento por vez na linha do tempo (o atual fica em destaque)
const { step } = useSteps()

const events: {
  version: string
  kind: string
  icon: IconName
  color: string
  what: string
  diff: [string, string]
}[] = [
  {
    version: 'v1.1',
    kind: 'bug',
    icon: 'bug',
    color: 'var(--slide-accent-3)',
    what: 'Resposta "b" contou como errada.',
    diff: ["'b' ≠ 'B'", "'b' vira 'B'"],
  },
  {
    version: 'v1.2',
    kind: 'regra nova',
    icon: 'file-text',
    color: '#fbbf24',
    what: 'A escola anulou a questão 3.',
    diff: ['total = 5 questões', 'total = 4 questões'],
  },
  {
    version: 'v2.0',
    kind: 'crescimento',
    icon: 'trending-up',
    color: 'var(--slide-accent)',
    what: 'Agora são 2.000 alunos. Ficou lento.',
    diff: ['1 por vez', 'em paralelo + fila'],
  },
  {
    version: 'v2.1',
    kind: 'segurança',
    icon: 'shield',
    color: 'var(--slide-accent-2)',
    what: 'Alguém tentou mudar a própria nota.',
    diff: ['qualquer um edita', 'só o professor edita'],
  },
  {
    version: 'v2.2',
    kind: 'atualização',
    icon: 'refresh',
    color: '#34d399',
    what: 'Uma biblioteca usada parou de funcionar.',
    diff: ['versão antiga', 'versão nova + testes'],
  },
]
</script>

<template>
  <Slide>
    <div class="stage">
      <header class="head">
        <h1 v-reveal:blur class="title">Software nunca está <em>pronto</em>.</h1>
        <p v-reveal="250" class="subtitle">O sistema de correção foi lançado. E agora?</p>
      </header>

      <div class="timeline">
        <span class="timeline__line" />
        <span class="timeline__fill" :style="{ '--p': step / events.length }" />

        <!-- lançamento -->
        <div v-reveal:zoom="450" class="launch">
          <span class="launch__dot"><Icon name="rocket" /></span>
          <span class="launch__v">v1.0</span>
          <span class="launch__label">lançou!</span>
        </div>

        <article
          v-for="(e, i) in events"
          :key="e.version"
          v-step:zoom
          class="event"
          :class="[i % 2 ? 'event--down' : 'event--up', { 'is-current': step === i + 1 }]"
          :style="{ '--c': e.color, '--x': `${((i + 1) / (events.length + 0.4)) * 100}%` }"
        >
          <span class="event__dot" />
          <span class="event__v">{{ e.version }}</span>

          <div class="card">
            <span class="card__kind"><Icon :name="e.icon" /> {{ e.kind }}</span>
            <p class="card__what">{{ e.what }}</p>
            <div class="diff">
              <span class="diff__old">− {{ e.diff[0] }}</span>
              <span class="diff__new">+ {{ e.diff[1] }}</span>
            </div>
          </div>
        </article>
      </div>

      <p class="closing" :class="{ 'is-shown': step >= events.length }">
        <span>Corrigir, adaptar e melhorar também é <em>engenharia de software</em>.</span>
      </p>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(6px, 1.2vh, 16px);
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
  margin-top: 0.4em;
  font-size: calc(var(--text-base) * 1.05);
  color: var(--slide-muted);
}

/* ---------- linha do tempo horizontal, cartões alternando em cima/embaixo ---------- */
.timeline {
  --h: clamp(400px, 64vh, 680px);
  position: relative;
  height: var(--h);
  font-size: var(--text-base);
}

.timeline__line,
.timeline__fill {
  position: absolute;
  top: 50%;
  left: 2%;
  height: 4px;
  border-radius: 2px;
  translate: 0 -50%;
}

.timeline__line {
  right: 0;
  background: repeating-linear-gradient(90deg, rgb(255 255 255 / 0.18) 0 10px, transparent 10px 18px);
}

.timeline__fill {
  width: calc(var(--p) * 84%);
  background: linear-gradient(90deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  box-shadow: 0 0 14px rgb(56 189 248 / 0.5);
  transition: width 0.7s var(--ease-out);
}

.launch {
  position: absolute;
  top: 50%;
  left: 2%;
  display: flex;
  flex-direction: column;
  align-items: center;
  translate: -20% -50%;
}

.launch__dot {
  display: grid;
  place-items: center;
  width: 2.6em;
  height: 2.6em;
  border-radius: 50%;
  color: var(--slide-bg);
  background: var(--slide-accent);
  box-shadow: 0 0 30px -4px var(--slide-accent);
}

.launch__dot :deep(.icon) {
  width: 1.3em;
  height: 1.3em;
}

.launch__v,
.launch__label {
  position: absolute;
  white-space: nowrap;
  font-weight: 800;
}

.launch__v {
  bottom: calc(100% + 0.4em);
  font-family: var(--slide-font-mono);
  font-size: 0.75em;
  color: var(--slide-accent);
}

.launch__label {
  top: calc(100% + 0.4em);
  font-size: 0.75em;
  color: var(--slide-muted);
}

.event {
  position: absolute;
  top: 50%;
  left: calc(4% + var(--x) * 0.92);
  width: 0;
}

.event__dot {
  position: absolute;
  left: 0;
  top: 0;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  translate: -50% -50%;
  background: var(--slide-bg);
  border: 3px solid var(--c);
  box-shadow: 0 0 14px -2px var(--c);
}

.event__v {
  position: absolute;
  left: 0;
  translate: -50% 0;
  font-family: var(--slide-font-mono);
  font-size: 0.7em;
  font-weight: 700;
  color: var(--c);
  white-space: nowrap;
}

.event--up .event__v { top: 0.9em; }
.event--down .event__v { bottom: 0.9em; }

/* conector vertical entre o ponto e o cartão */
.event::before {
  content: '';
  position: absolute;
  left: -1px;
  width: 2px;
  height: 2.2em;
  background: color-mix(in srgb, var(--c) 60%, transparent);
}

.event--up::before { bottom: 0.5em; }
.event--down::before { top: 0.5em; }

.card {
  position: absolute;
  left: 0;
  width: clamp(200px, 18.5vw, 330px);
  translate: -50% 0;
  padding: 0.8em 0.9em;
  border-radius: 16px;
  background: rgb(15 23 42 / 0.85);
  border: 1px solid color-mix(in srgb, var(--c) 35%, transparent);
  box-shadow: 0 20px 40px -24px var(--c);
  transition:
    border-color 0.4s,
    box-shadow 0.4s,
    background 0.4s,
    scale 0.4s var(--ease-out);
}

.event--up .card { bottom: 2.7em; }
.event--down .card { top: 2.7em; }

.event.is-current .card {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, rgb(15 23 42 / 0.92));
  box-shadow: 0 24px 50px -18px var(--c);
  scale: 1.05;
}

.card__kind {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  font-family: var(--slide-font-mono);
  font-size: 0.62em;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c);
}

.card__kind :deep(.icon) {
  width: 1.3em;
  height: 1.3em;
}

.card__what {
  margin-top: 0.35em;
  font-size: 0.84em;
  font-weight: 700;
  line-height: 1.25;
  text-wrap: balance;
}

.diff {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  margin-top: 0.55em;
  padding: 0.4em 0.55em;
  border-radius: 8px;
  font-family: var(--slide-font-mono);
  font-size: 0.62em;
  background: rgb(0 0 0 / 0.3);
}

.diff__old {
  color: #fca5a5;
  text-decoration: line-through;
  text-decoration-color: rgb(252 165 165 / 0.5);
}

.diff__new {
  color: #6ee7b7;
}

/* ---------- fechamento: entra junto com o último acontecimento ---------- */
.closing {
  text-align: center;
  font-size: calc(var(--text-base) * 1.2);
  font-weight: 700;
  opacity: 0;
  translate: 0 12px;
  transition:
    opacity 0.6s var(--ease-out) 0.6s,
    translate 0.6s var(--ease-out) 0.6s;
}

.closing.is-shown {
  opacity: 1;
  translate: 0 0;
}

.closing > span {
  text-wrap: balance;
}

.closing em {
  font-style: normal;
  color: var(--slide-accent);
}

/* ---------- tela vertical: linha do tempo de cima para baixo ---------- */
@media (max-aspect-ratio: 1 / 1) {
  .timeline {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    padding-left: 2.4em;
  }

  .timeline__line,
  .timeline__fill {
    top: 0;
    bottom: 0;
    left: 0.9em;
    width: 4px;
    height: auto;
    translate: 0 0;
  }

  .timeline__line {
    background: repeating-linear-gradient(180deg, rgb(255 255 255 / 0.18) 0 10px, transparent 10px 18px);
  }

  .timeline__fill {
    bottom: auto;
    height: calc(var(--p) * 100%);
  }

  .launch,
  .event {
    position: relative;
    top: auto;
    left: auto;
    width: auto;
    translate: none;
  }

  .launch {
    flex-direction: row;
    gap: 0.6em;
    margin-left: -2.4em;
  }

  .launch__v,
  .launch__label {
    position: static;
  }

  .event__dot {
    left: -1.55em;
    top: 1.2em;
  }

  .event__v,
  .event::before {
    display: none;
  }

  .card,
  .event--up .card,
  .event--down .card {
    position: relative;
    top: auto;
    bottom: auto;
    width: auto;
    translate: none;
  }
}
</style>
