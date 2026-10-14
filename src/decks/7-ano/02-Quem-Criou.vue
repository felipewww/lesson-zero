<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import { useSteps } from '../../deck/steps'
import minecraft from '../../assets/logos/minecraft-cube.svg'
import roblox from '../../assets/logos/roblox.svg'
import youtube from '../../assets/logos/youtube.svg'
import whatsapp from '../../assets/logos/whatsapp.svg'
import uber from '../../assets/logos/uber.svg'

// Passos 1..5: um app por vez; 6: a revelação
const { step } = useSteps()
const REVEAL = 6

const apps = [
  { name: 'Minecraft', logo: minecraft, tilt: -6 },
  { name: 'Roblox', logo: roblox, tilt: 4 },
  { name: 'YouTube', logo: youtube, tilt: -3 },
  { name: 'WhatsApp', logo: whatsapp, tilt: 5 },
  { name: 'Apps de transporte', logo: uber, tilt: -4 },
]
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-reveal': step >= REVEAL }">
      <h1 v-reveal:blur class="title">O que tudo isso tem <em>em comum</em>?</h1>

      <div class="apps">
        <figure
          v-for="(app, i) in apps"
          :key="app.name"
          v-step:zoom
          class="app"
          :class="{ 'is-current': step === i + 1 }"
          :style="{ '--tilt': `${app.tilt}deg`, '--i': i }"
        >
          <span class="app__tile"><img :src="app.logo" :alt="app.name" /></span>
          <figcaption>{{ app.name }}</figcaption>
        </figure>
      </div>

      <p v-step:up="REVEAL" class="answer">
        <span>
          Tudo isso existe porque <em class="hl">pessoas</em> transformaram <em class="hl">ideias</em> em
          <em class="hl">software</em>.
        </span>
      </p>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(28px, 7vh, 90px);
  text-align: center;
}

.title {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.title em,
.answer .hl {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- apps ---------- */
.apps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(16px, 3.5vw, 64px);
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7em;
  font-size: var(--text-base);
}

.app__tile {
  --size: clamp(84px, 12.5vw, 220px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size);
  height: var(--size);
  padding: 16%;
  border-radius: 24%;
  background: #fff;
  rotate: var(--tilt);
  box-shadow:
    0 24px 50px -20px color-mix(in srgb, var(--slide-accent) 60%, transparent),
    0 0 0 1px rgb(255 255 255 / 0.4);
  animation: float 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.7s);
  transition:
    box-shadow 0.4s,
    scale 0.5s var(--ease-out);
}

.app__tile img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -10px;
  }
}

.app.is-current .app__tile {
  scale: 1.08;
  box-shadow:
    0 30px 60px -16px var(--slide-accent-2),
    0 0 0 3px var(--slide-accent-2);
}

.app figcaption {
  font-size: 0.8em;
  font-weight: 600;
  color: var(--slide-muted);
}

/* na revelação os apps ficam menores e alinhados, dando palco à frase */
.is-reveal .app__tile {
  scale: 0.82;
  rotate: 0deg;
  transition:
    scale 0.7s var(--ease-out),
    rotate 0.7s var(--ease-out);
}

/* ---------- revelação ---------- */
.answer {
  max-width: 22em;
  font-size: calc(var(--text-title) * 0.72);
  line-height: 1.15;
  font-weight: 800;
}

.answer > span {
  text-wrap: balance;
}
</style>
