<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import jnj from '../../assets/logos/jnj.svg'
import flash from '../../assets/logos/flash.svg'
import hitss from '../../assets/logos/hitss.png'
import beedoo from '../../assets/logos/beedoo.png'

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
          Software Engineer <strong>Sênior</strong>
        </p>
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
