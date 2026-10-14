import type { Directive } from 'vue'

/**
 * v-reveal: anima a entrada de um elemento quando o slide aparece.
 *
 *   <h2 v-reveal>sobe (padrão)</h2>
 *   <p v-reveal="200">sobe com 200ms de atraso</p>
 *   <img v-reveal:zoom="400" />
 *
 * Direções: up, down, left, right, zoom, fade, blur
 */
export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade' | 'blur'

export const vReveal: Directive<HTMLElement, number | undefined, string, RevealDirection> = {
  beforeMount(el, binding) {
    // data-* em vez de classes: o Vue reescreve `class` quando há :class no elemento
    el.dataset.reveal = binding.arg ?? 'up'
    el.style.setProperty('--reveal-delay', `${binding.value ?? 0}ms`)
  },
}

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: typeof vReveal
  }
}
