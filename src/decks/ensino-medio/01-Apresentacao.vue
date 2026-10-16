<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import jnj from '../../assets/logos/jnj.svg'
import flash from '../../assets/logos/flash.svg'
import hitss from '../../assets/logos/hitss.png'
import beedoo from '../../assets/logos/beedoo.png'
import unicid from '../../assets/logos/unicid.png'
import fiap from '../../assets/logos/fiap.svg'

const previous = [
  { name: 'Flash', logo: flash },
  { name: 'Hitss', logo: hitss },
  { name: 'Beedoo', logo: beedoo },
]
</script>

<template>
  <Slide>
    <div class="intro">
      <div class="who">
        <p v-reveal:fade class="prompt"><span class="prompt__sign">&gt;</span> whoami<span class="caret" /></p>
        <h1 v-reveal:blur="250" class="name">Felipe<br />Barreiros</h1>
        <p v-reveal="500" class="role">
          Engenheiro de Software <strong>Sênior</strong>
        </p>

        <div class="stats">
          <p v-reveal="700" class="stat">
            <strong class="stat__n">22</strong>
            <span class="stat__label">anos em<br />tecnologia</span>
          </p>
          <p v-reveal="850" class="stat">
            <strong class="stat__n">15</strong>
            <span class="stat__label">anos em desenvolvimento<br />de software</span>
          </p>
        </div>

        <ul class="edu">
          <li v-reveal="1000" class="edu__item">
            <span class="edu__logo"><img :src="unicid" alt="UNICID" /></span>
            <span class="edu__text">
              <span class="edu__level">graduação</span>
              <strong>Ciência de Dados</strong>
            </span>
          </li>
          <li v-reveal="1150" class="edu__item">
            <span class="edu__logo"><img :src="fiap" alt="FIAP" /></span>
            <span class="edu__text">
              <span class="edu__level edu__level--pos">pós-graduação</span>
              <strong>Inteligência Artificial</strong>
            </span>
          </li>
        </ul>
      </div>

      <div v-step:zoom class="card">
        <section class="card__now">
          <span class="card__label">hoje</span>
          <img :src="jnj" alt="Johnson & Johnson" class="logo logo--main" />
        </section>

        <section class="card__before">
          <span class="card__label">já passei por</span>
          <div class="card__logos">
            <img
              v-for="(company, i) in previous"
              :key="company.name"
              :src="company.logo"
              :alt="company.name"
              class="logo"
              :style="{ '--i': i }"
            />
          </div>
        </section>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.intro {
  height: 100%;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: clamp(32px, 6vw, 140px);
}

@media (max-aspect-ratio: 1 / 1) {
  .intro {
    grid-template-columns: 1fr;
    align-content: center;
  }
}

/* ---------- quem sou ---------- */
.prompt {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.9);
  color: var(--slide-muted);
}

.prompt__sign {
  color: var(--slide-accent);
}

.caret {
  display: inline-block;
  width: 0.55em;
  height: 1.1em;
  margin-left: 0.2em;
  vertical-align: text-bottom;
  background: var(--slide-accent);
  animation: blink 1.1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.name {
  margin: 0.25em 0 0.3em;
  font-size: var(--text-hero);
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(120deg, var(--slide-fg) 35%, var(--slide-accent) 75%, var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.role {
  font-size: calc(var(--text-base) * 1.3);
  color: var(--slide-muted);
}

.role strong {
  color: var(--slide-fg);
}

/* ---------- números e formação ---------- */
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6em 1.8em;
  margin-top: 1.1em;
  font-size: var(--text-base);
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.45em;
}

.stat__n {
  font-size: 2.2em;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  text-shadow: 0 0 24px color-mix(in srgb, var(--slide-accent) 45%, transparent);
}

.stat__label {
  font-size: 0.72em;
  line-height: 1.2;
  color: var(--slide-muted);
}

.edu {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7em 1.4em;
  margin-top: 1.2em;
  font-size: calc(var(--text-base) * 0.85);
}

.edu__item {
  display: flex;
  align-items: center;
  gap: 0.7em;
}

/* logo da instituição em caixa branca, mesmo tamanho para as duas */
.edu__logo {
  display: grid;
  place-items: center;
  width: 5.2em;
  height: 2.6em;
  padding: 0.35em 0.5em;
  border-radius: 10px;
  background: #fff;
}

.edu__logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.edu__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2em;
  line-height: 1.15;
}

.edu__text strong {
  color: var(--slide-fg);
  font-weight: 700;
}

/* destaque para "graduação" e "pós-graduação" */
.edu__level {
  padding: 0.15em 0.6em;
  border-radius: 999px;
  font-family: var(--slide-font-mono);
  font-size: 0.68em;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--slide-bg);
  background: var(--slide-accent);
}

.edu__level--pos {
  background: var(--slide-accent-2);
}

/* ---------- card de empresas ---------- */
.card {
  display: flex;
  flex-direction: column;
  border-radius: clamp(20px, 2vw, 36px);
  background: #fff;
  color: #111;
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.4),
    0 30px 80px -20px rgb(56 189 248 / 0.35),
    0 20px 60px -30px rgb(167 139 250 / 0.5);
  overflow: hidden;
}

.card__now,
.card__before {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vh, 28px);
  padding: clamp(20px, 3vw, 56px);
}

.card__before {
  background: #f4f5f7;
}

.card__label {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.55);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b7280;
}

.card__logos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  gap: clamp(16px, 3vw, 56px);
}

.logo {
  width: 100%;
  height: clamp(28px, 5vh, 64px);
  object-fit: contain;
  object-position: left center;
}

.logo--main {
  height: clamp(48px, 10vh, 120px);
}

/* Logos anteriores entram em sequência depois do card */
.card .card__logos .logo {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out);
}

.card[data-step-shown] .card__logos .logo {
  opacity: 1;
  transform: none;
  transition-delay: calc(350ms + var(--i) * 140ms);
}
</style>
