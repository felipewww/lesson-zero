<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos: 1 = "SIM!" e a IA cria o jogo; 2 = alguém testa e acha um problema; 3 = a diferença (frase em destaque)
const { step } = useSteps()
const BUG = 2
const KEY = 3
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-open': step >= 1, 'is-bug': step >= BUG, 'is-key': step >= KEY }">
      <header class="head">
        <h1 v-reveal:blur class="question">A IA consegue criar jogos e aplicativos?</h1>
        <span v-step:zoom="1" class="yes">SIM!</span>
      </header>

      <div class="flow">
        <!-- 1. a pessoa descreve -->
        <div v-step:left="1" class="person">
          <span class="avatar"><Icon name="user" /></span>
          <p class="bubble">Cria um jogo de pular plataformas!</p>
        </div>

        <!-- 2. a IA gera -->
        <div v-step:zoom="1" class="ai">
          <span class="ai__badge"><Icon name="sparkles" /> IA</span>
          <div class="screen" aria-hidden="true">
            <span class="block b1" />
            <span class="block b2" />
            <span class="block b3" />
            <span class="wall" />
            <span class="hero"><i /><i /></span>
            <span class="bug">bug!</span>
          </div>
          <span class="ready"><Icon name="check" /> pronto!</span>
        </div>

        <!-- 3. ao testar, alguém percebe o problema -->
        <div v-step:right="BUG" class="person person--tester">
          <span class="avatar avatar--alt"><Icon name="user" /></span>
          <p class="bubble bubble--alert">Ué… ele atravessou a parede!</p>
        </div>
      </div>

      <p v-step:blur="KEY" class="key">
        <span class="key__a">Mas tem uma diferença:</span>
        <span class="key__b">Criar alguma coisa <em>não significa entender</em> se ela funciona bem.</span>
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
  gap: clamp(20px, 5vh, 64px);
}

/* ---------- pergunta: enorme no início, sobe no passo 1 ---------- */
.head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.2em 0.6em;
  text-align: center;
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.question {
  font-size: var(--text-hero);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-wrap: balance;
  transition: font-size 0.8s var(--ease-out);
}

.is-open .question {
  font-size: calc(var(--text-title) * 0.85);
}

.yes {
  font-size: var(--text-title);
  font-weight: 900;
  color: var(--slide-bg);
  background: var(--slide-accent-2);
  padding: 0.05em 0.4em;
  border-radius: 0.3em;
  rotate: -6deg;
}

.stage:not(.is-open) .yes {
  display: none;
}

/* ---------- pessoa → IA → teste ---------- */
.flow {
  display: grid;
  grid-template-columns: 1fr 1.3fr 1fr;
  align-items: center;
  gap: clamp(16px, 3vw, 56px);
  max-height: 0;
  transition:
    max-height 0.8s var(--ease-out),
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.is-open .flow {
  max-height: 60vh;
}

.person {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;
  font-size: var(--text-base);
  text-align: center;
}

.avatar {
  display: grid;
  place-items: center;
  width: 3em;
  height: 3em;
  border-radius: 50%;
  color: var(--slide-bg);
  background: var(--slide-accent);
}

.avatar--alt {
  background: var(--slide-accent-3);
}

.avatar :deep(.icon) {
  width: 1.6em;
  height: 1.6em;
}

.bubble {
  padding: 0.6em 1em;
  border-radius: 18px;
  font-weight: 600;
  line-height: 1.25;
  text-wrap: balance;
  background: rgb(255 255 255 / 0.07);
  border: 2px solid rgb(255 255 255 / 0.12);
}

.bubble--alert {
  border-color: var(--slide-accent-3);
  background: color-mix(in srgb, var(--slide-accent-3) 14%, transparent);
}

/* ---------- a "tela" do jogo gerado ---------- */
.ai {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7em;
  font-size: var(--text-base);
}

.ai__badge,
.ready {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.25em 0.8em;
  border-radius: 999px;
  font-size: 0.8em;
  font-weight: 800;
}

.ai__badge {
  color: var(--slide-bg);
  background: var(--slide-accent-2);
}

.ready {
  color: var(--slide-accent);
  border: 2px solid color-mix(in srgb, var(--slide-accent) 50%, transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.ai[data-step-shown] .ready {
  opacity: 1;
  transition-delay: 1.4s;
}

.screen {
  --u: clamp(18px, 3vh, 34px);
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, color-mix(in srgb, var(--slide-accent) 22%, var(--slide-bg)), var(--slide-bg));
  border: 3px solid color-mix(in srgb, var(--slide-fg) 25%, transparent);
}

.block {
  position: absolute;
  height: calc(var(--u) * 0.6);
  border-radius: 6px;
  background: color-mix(in srgb, var(--slide-accent) 60%, var(--slide-bg));
  opacity: 0;
  scale: 0.6;
  transition:
    opacity 0.4s,
    scale 0.4s var(--ease-out);
}

.b1 { left: 0; right: 0; bottom: 0; }
.b2 { left: 12%; width: 26%; bottom: 38%; }
.b3 { left: 46%; width: 22%; bottom: 60%; }

.wall {
  position: absolute;
  right: 18%;
  bottom: calc(var(--u) * 0.6);
  width: calc(var(--u) * 0.7);
  height: 46%;
  border-radius: 4px;
  background: var(--slide-accent-2);
  opacity: 0;
  transition: opacity 0.4s;
}

.hero {
  position: absolute;
  left: 8%;
  bottom: calc(var(--u) * 0.6);
  width: var(--u);
  height: calc(var(--u) * 1.15);
  border-radius: 40%;
  background: var(--slide-accent-3);
  display: flex;
  justify-content: center;
  gap: calc(var(--u) * 0.16);
  padding-top: calc(var(--u) * 0.3);
  opacity: 0;
  transition: opacity 0.4s;
}

.hero i {
  width: calc(var(--u) * 0.24);
  height: calc(var(--u) * 0.24);
  border-radius: 50%;
  background: #fff;
}

/* a IA monta a fase peça por peça */
.ai[data-step-shown] .block,
.ai[data-step-shown] .wall,
.ai[data-step-shown] .hero {
  opacity: 1;
  scale: 1;
}

.ai[data-step-shown] .b1 { transition-delay: 0.3s; }
.ai[data-step-shown] .b2 { transition-delay: 0.5s; }
.ai[data-step-shown] .b3 { transition-delay: 0.7s; }
.ai[data-step-shown] .wall { transition-delay: 0.9s; }
.ai[data-step-shown] .hero { transition-delay: 1.1s; }

/* passo 2: ao testar, o personagem atravessa a parede */
.is-bug .hero {
  animation: walk-through 2.6s linear infinite;
}

@keyframes walk-through {
  from { left: 8%; }
  to { left: 96%; }
}

.bug {
  position: absolute;
  right: 10%;
  top: 12%;
  padding: 0.15em 0.6em;
  border-radius: 999px;
  font-size: calc(var(--u) * 0.6);
  font-weight: 900;
  color: #fff;
  background: var(--slide-accent-3);
  opacity: 0;
  scale: 0.5;
  transition:
    opacity 0.3s,
    scale 0.4s var(--ease-out);
}

.is-bug .bug {
  opacity: 1;
  scale: 1;
  transition-delay: 0.9s;
  animation: wobble 0.6s ease-in-out 1.3s infinite alternate;
}

@keyframes wobble {
  to { rotate: 8deg; }
}

.is-bug .wall {
  box-shadow: 0 0 0 3px var(--slide-accent-3);
}

/* ---------- frase em destaque ---------- */
.is-key .head,
.is-key .flow {
  filter: blur(8px);
  opacity: 0.12;
}

.key {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  padding: 0 6vw;
  text-align: center;
  pointer-events: none;
}

.key__a {
  font-size: calc(var(--text-base) * 1.3);
  font-weight: 700;
  color: var(--slide-accent-2);
}

.key__b {
  max-width: 16em;
  font-size: var(--text-title);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.key__b em {
  font-style: normal;
  color: var(--slide-accent);
}

/* tela em pé: as duas pessoas lado a lado em cima, o jogo embaixo */
@media (max-aspect-ratio: 1 / 1) {
  .flow {
    grid-template-columns: 1fr 1fr;
  }

  .is-open .flow {
    max-height: 75vh;
  }

  .ai {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .person--tester {
    grid-column: 2;
    grid-row: 1;
  }
}
</style>
