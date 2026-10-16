<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos: 1 = "Mas alguém precisa decidir"; 2..7 = cada decisão técnica;
// 8 = avalanche de outras decisões; 9 = mensagem-chave
const { step } = useSteps()
const FIRST_QUESTION = 2
const AVALANCHE = 8
const KEY_MESSAGE = 9

// Termos entre [colchetes] viram "jargão" destacado em fonte de código
const questions: { area: string; icon: IconName; text: string; color: string }[] = [
  {
    area: 'banco de dados',
    icon: 'database',
    text: 'Transação [ACID] ou [consistência eventual]? E qual [nível de isolamento]?',
    color: 'var(--slide-accent-3)',
  },
  {
    area: 'infraestrutura',
    icon: 'cloud',
    text: '[ECS Fargate] ou [Lambda]? Vale o [cold start] para 10 mil acessos por minuto?',
    color: 'var(--slide-accent)',
  },
  {
    area: 'pagamentos',
    icon: 'credit-card',
    text: 'Como garantir [idempotência] se o [webhook] do pagamento chegar duas vezes?',
    color: '#34d399',
  },
  {
    area: 'mensageria',
    icon: 'layers',
    text: '[Kafka] ou [SQS]? E se a mensagem chegar [fora de ordem]?',
    color: '#fbbf24',
  },
  {
    area: 'escala',
    icon: 'trending-up',
    text: '[Sharding] por escola ou [réplicas de leitura] com [cache Redis]?',
    color: 'var(--slide-accent-2)',
  },
  {
    area: 'segurança',
    icon: 'shield',
    text: '[JWT] ou sessão? Onde guardar o [refresh token]? E a [LGPD]?',
    color: 'var(--slide-accent-3)',
  },
]

// Divide o texto em pedaços normais e pedaços de jargão
const parts = (text: string) =>
  text.split(/(\[[^\]]+\])/).filter(Boolean).map((t) => (t.startsWith('[') ? { jargon: true, t: t.slice(1, -1) } : { jargon: false, t }))

// Avalanche: tantas decisões que a tela enche
const MORE = [
  'CAP: consistência ou disponibilidade?',
  'REST, GraphQL ou gRPC?',
  'Monólito ou microsserviços?',
  'Saga ou two-phase commit?',
  'Lock otimista ou pessimista?',
  'Circuit breaker?',
  'Retry com backoff exponencial?',
  'Dead-letter queue?',
  'Event sourcing + CQRS?',
  'Postgres ou DynamoDB?',
  'Índice composto ou parcial?',
  'Query N+1 no ORM?',
  'Multi-AZ ou multirregião?',
  'Blue-green ou canary deploy?',
  'Rate limit por IP ou por usuário?',
  'SLO de 99,9% ou 99,99%?',
  'OpenTelemetry ou logs?',
  'Feature flag?',
  'Backpressure?',
  'Read-your-writes?',
  'Criptografar o CPF em repouso?',
  'Terraform ou CDK?',
  'Autoscaling por CPU ou por fila?',
  'Cache-aside ou write-through?',
]
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-avalanche': step === AVALANCHE, 'is-key': step >= KEY_MESSAGE }">
      <div class="chat">
        <p v-reveal="0" class="bubble bubble--me">Você pede para a IA construir um sistema.</p>
        <p v-reveal="500" class="bubble bubble--ai">
          <Icon name="check" class="bubble__check" /> Ela constrói.
        </p>
      </div>

      <h2 v-step class="decide">Mas alguém precisa <em>decidir</em>:</h2>

      <div class="grid">
        <article
          v-for="(q, i) in questions"
          :key="q.area"
          v-step:zoom
          class="card"
          :class="{ 'is-current': step === FIRST_QUESTION + i }"
          :style="{ '--c': q.color }"
        >
          <span class="card__area"><Icon :name="q.icon" /> {{ q.area }}</span>
          <p class="card__text">
            <template v-for="(part, j) in parts(q.text)" :key="j">
              <code v-if="part.jargon" class="jargon">{{ part.t }}</code>
              <template v-else>{{ part.t }}</template>
            </template>
          </p>
        </article>
      </div>

      <!-- avalanche: as decisões continuam chegando -->
      <div v-step:fade="AVALANCHE" class="avalanche" aria-hidden="true">
        <span v-for="(m, i) in MORE" :key="m" class="more" :style="{ '--i': i }">{{ m }}</span>
        <span class="more more--end" :style="{ '--i': MORE.length }">…e mais centenas de decisões.</span>
      </div>

      <p v-step:blur="KEY_MESSAGE" class="key">
        <span>Saber <em>quais perguntas fazer</em> é tão importante quanto saber <span class="nowrap">respondê-las.</span></span>
      </p>
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
  gap: clamp(16px, 3.5vh, 48px);
}

/* ---------- conversa com a IA ---------- */
.chat {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8em;
  font-size: calc(var(--text-base) * 0.85);
}

.bubble {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.6em 1.1em;
  border-radius: 1.2em;
}

.bubble--me {
  background: rgb(255 255 255 / 0.08);
  border: 1px solid rgb(255 255 255 / 0.12);
  border-bottom-left-radius: 0.3em;
}

.bubble--ai {
  background: rgb(52 211 153 / 0.12);
  border: 1px solid rgb(52 211 153 / 0.35);
  border-bottom-right-radius: 0.3em;
  color: #6ee7b7;
  font-weight: 700;
}

.bubble__check {
  font-size: 1.2em;
}

.decide {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.decide em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- decisões técnicas ---------- */
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(10px, 1.3vw, 22px);
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out),
    scale 0.8s var(--ease-out);
}

@media (max-aspect-ratio: 1 / 1) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  padding: clamp(14px, 1.5vw, 26px);
  border-radius: 18px;
  background: rgb(10 15 30 / 0.65);
  border: 1px solid rgb(255 255 255 / 0.08);
  font-size: calc(var(--text-base) * 0.95);
  line-height: 1.45;
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s,
    box-shadow 0.4s,
    translate 0.4s var(--ease-out);
}

.card__area {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  font-family: var(--slide-font-mono);
  font-size: 0.7em;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c);
}

.card__area :deep(.icon) {
  width: 1.4em;
  height: 1.4em;
}

.card__text {
  font-weight: 600;
  text-wrap: pretty;
}

.jargon {
  padding: 0.05em 0.35em;
  border-radius: 6px;
  font-size: 0.9em;
  font-weight: 700;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 14%, transparent);
  white-space: nowrap;
}

.card.is-current {
  translate: 0 -6px;
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 9%, rgb(10 15 30 / 0.8));
  box-shadow: 0 20px 50px -20px var(--c);
}

/* ---------- avalanche ---------- */
.is-avalanche .chat,
.is-avalanche .decide,
.is-avalanche .grid {
  filter: blur(5px);
  opacity: 0.25;
}

.avalanche {
  position: absolute;
  inset: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  gap: 0.6em 0.7em;
  padding: 4vh 3vw;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.78);
  pointer-events: none;
}

.more {
  padding: 0.4em 0.8em;
  border-radius: 10px;
  color: var(--slide-fg);
  background: rgb(10 15 30 / 0.85);
  border: 1px solid rgb(255 255 255 / 0.14);
  box-shadow: 0 10px 30px -14px rgb(0 0 0 / 0.8);
  opacity: 0;
  scale: 0.6;
  rotate: calc((var(--i) * 37 % 9 - 4) * 1deg);
  transition:
    opacity 0.35s var(--ease-out),
    scale 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.more--end {
  font-family: var(--slide-font);
  font-weight: 800;
  color: var(--slide-bg);
  background: var(--slide-accent-2);
  border-color: transparent;
  rotate: 0deg;
}

.avalanche[data-step-shown] .more {
  opacity: 1;
  scale: 1;
  transition-delay: calc(var(--i) * 70ms);
}

/* ---------- mensagem-chave: tudo recua e ela toma a tela ---------- */
.chat,
.decide {
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.is-key .chat,
.is-key .decide,
.is-key .grid,
.is-key .avalanche {
  filter: blur(6px);
  opacity: 0.18;
}

.is-key .grid {
  scale: 0.96;
}

.key {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 0 6vw;
  text-align: center;
  font-size: calc(var(--text-title) * 0.95);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.key > span {
  text-wrap: balance;
}

.nowrap {
  white-space: nowrap;
}

.key em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
