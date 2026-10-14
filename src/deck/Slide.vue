<script setup lang="ts">
/**
 * Moldura padrão de um slide. Todo slide em src/slides/ deve usar este
 * componente como raiz. Ocupa 100% da largura e altura da tela; título e
 * subtítulo entram animados. Para animar o conteúdo, use v-reveal.
 *
 * layout:
 *  - "default": título no topo + conteúdo abaixo
 *  - "center":  tudo centralizado (capas, frases de impacto)
 *  - "full":    sem padding, para imagens/vídeos/canvas ocupando tudo
 *
 * background: opcional. Sem ele, o slide é transparente e mostra o fundo
 * animado do deck.
 */
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    layout?: 'default' | 'center' | 'full'
    background?: string
  }>(),
  { layout: 'default' },
)
</script>

<template>
  <section class="slide" :class="`slide--${layout}`" :style="background ? { background } : undefined">
    <header v-if="title || subtitle || $slots.header" class="slide__header">
      <slot name="header">
        <h1 v-if="title" v-reveal:blur class="slide__title">{{ title }}</h1>
        <p v-if="subtitle" v-reveal="150" class="slide__subtitle">{{ subtitle }}</p>
      </slot>
    </header>

    <div class="slide__content">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="slide__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.slide {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 4vh, 64px);
  padding: var(--slide-padding);
  color: var(--slide-fg);
  font-size: var(--text-base);
  line-height: 1.45;
  overflow: hidden;
}

.slide__title {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(120deg, var(--slide-fg) 30%, var(--slide-accent) 70%, var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.slide__subtitle {
  margin-top: 0.5em;
  font-size: calc(var(--text-base) * 1.2);
  color: var(--slide-muted);
}

.slide__content {
  flex: 1;
  min-height: 0;
}

.slide__footer {
  font-size: calc(var(--text-base) * 0.7);
  color: var(--slide-muted);
}

.slide--center {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.slide--center .slide__content {
  flex: 0 0 auto;
}

.slide--center .slide__title {
  font-size: var(--text-hero);
}

.slide--full {
  padding: 0;
  gap: 0;
}
</style>
