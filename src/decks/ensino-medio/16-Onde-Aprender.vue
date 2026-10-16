<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon from '../../components/Icon.vue'
import udemy from '../../assets/logos/udemy.svg'
import coursera from '../../assets/logos/coursera.svg'

// Passos: 1 = Udemy; 2 = Coursera; 3 = dica final
const places = [
  {
    name: 'Udemy',
    logo: udemy,
    color: 'var(--slide-accent-2)',
    price: '~R$ 30',
    priceNote: 'em promoções',
    what: 'Cursos completos e práticos, do zero ao avançado.',
    perks: ['acesso para sempre', 'muitos em português'],
  },
  {
    name: 'Coursera',
    logo: coursera,
    color: 'var(--slide-accent)',
    price: 'grátis',
    priceNote: 'para assistir',
    what: 'Cursos de universidades e empresas como Stanford, Google e IBM.',
    perks: ['certificado é pago', 'existe bolsa (auxílio)'],
  },
]
</script>

<template>
  <Slide>
    <div class="stage">
      <header>
        <p v-reveal:fade class="kicker">onde estudar</p>
        <h1 v-reveal:blur="150" class="title">Aprender pode custar <em>quase nada</em>.</h1>
      </header>

      <div class="places">
        <article
          v-for="(p, i) in places"
          :key="p.name"
          v-step="i + 1"
          class="place"
          :style="{ '--c': p.color }"
        >
          <div class="place__logo"><img :src="p.logo" :alt="p.name" /></div>

          <div class="place__price">
            <strong>{{ p.price }}</strong>
            <span>{{ p.priceNote }}</span>
          </div>

          <p class="place__what">{{ p.what }}</p>

          <ul class="place__perks">
            <li v-for="perk in p.perks" :key="perk"><Icon name="check" /> {{ perk }}</li>
          </ul>
        </article>
      </div>

      <p v-step="3" class="tip">
        <Icon name="lightbulb" class="tip__icon" />
        <span>O mais caro é o seu <strong>tempo</strong>: escolha <strong>um</strong> curso e termine antes de começar outro.</span>
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
  gap: clamp(20px, 4.5vh, 56px);
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slide-accent);
}

.title {
  margin-top: 0.3em;
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

/* ---------- os dois lugares ---------- */
.places {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2.5vw, 48px);
}

@media (max-aspect-ratio: 1 / 1) {
  .places {
    grid-template-columns: 1fr;
  }
}

.place {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  padding: clamp(18px, 2.2vw, 40px);
  border-radius: 24px;
  font-size: var(--text-base);
  background: color-mix(in srgb, var(--c) 7%, rgb(10 15 30 / 0.6));
  border: 1px solid color-mix(in srgb, var(--c) 40%, transparent);
  box-shadow: 0 30px 70px -36px var(--c);
}

.place__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(150px, 14vw, 240px);
  height: clamp(56px, 8vh, 88px);
  padding: 0 1em;
  border-radius: 16px;
  background: #fff;
}

/* caixas do mesmo tamanho; cada logo se ajusta dentro dela */
.place__logo img {
  max-width: 100%;
  max-height: 50%;
  object-fit: contain;
}

/* etiqueta de preço no canto, entra com "pop" depois do cartão */
.place__price {
  position: absolute;
  top: clamp(18px, 2.2vw, 40px);
  right: clamp(18px, 2.2vw, 40px);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1;
  rotate: 4deg;
  opacity: 0;
  scale: 0.5;
  transition:
    opacity 0.4s var(--ease-out),
    scale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.place[data-step-shown] .place__price {
  opacity: 1;
  scale: 1;
  transition-delay: 450ms;
}

.place__price strong {
  padding: 0.25em 0.5em;
  border-radius: 12px;
  font-size: 1.5em;
  font-weight: 800;
  color: var(--slide-bg);
  background: var(--c);
  box-shadow: 0 10px 30px -8px var(--c);
}

.place__price span {
  margin-top: 0.35em;
  font-size: 0.7em;
  color: var(--slide-muted);
}

.place__what {
  margin-top: 0.4em;
  font-size: 1.05em;
  font-weight: 700;
  line-height: 1.3;
  text-wrap: balance;
}

.place__perks {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}

.place__perks li {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.3em 0.8em;
  border-radius: 999px;
  font-size: 0.75em;
  color: var(--slide-muted);
  background: rgb(255 255 255 / 0.06);
}

.place__perks :deep(.icon) {
  color: var(--c);
}

/* ---------- dica ---------- */
.tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  font-size: calc(var(--text-base) * 1.1);
  color: var(--slide-muted);
  text-align: center;
}

.tip > span {
  text-wrap: balance;
}

.tip strong {
  color: var(--slide-fg);
}

.tip__icon {
  flex-shrink: 0;
  font-size: 1.5em;
  color: #fbbf24;
}
</style>
