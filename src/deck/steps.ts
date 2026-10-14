import { computed, inject, type Directive, type InjectionKey, type Ref } from 'vue'
import type { RevealDirection } from './reveal'

/**
 * Passos dentro de um slide. → mostra o próximo passo, ← volta o anterior;
 * só muda de slide quando acabam os passos.
 *
 *   <li v-step>aparece no passo 1</li>
 *   <li v-step>aparece no passo 2 (sem número = próximo na ordem)</li>
 *   <img v-step:zoom="2" />   aparece junto com o passo 2
 *
 * Direções: up (padrão), down, left, right, zoom, fade, blur
 */
export const vStep: Directive<HTMLElement, number | undefined, string, RevealDirection> = {
  beforeMount(el, binding) {
    // data-* em vez de classes: o Vue reescreve `class` quando há :class no elemento
    el.dataset.stepFx = binding.arg ?? 'up'
    el.dataset.step = binding.value == null ? '' : String(binding.value)
  },
}

export interface StepsContext {
  index: Ref<number>
  step: Ref<number>
  declare: (slide: number, count: number) => void
}

export const stepsKey: InjectionKey<StepsContext> = Symbol('steps')

/**
 * Passo atual do slide, para lógica própria (destacar item, trocar gráfico...).
 * Passe `count` se o slide tiver passos que não usam v-step.
 *
 *   const { step } = useSteps()      // step.value: 0 = nenhum passo exibido
 *   const { step } = useSteps(4)     // garante 4 passos neste slide
 */
export function useSteps(count?: number) {
  const ctx = inject(stepsKey)
  if (!ctx) throw new Error('useSteps() deve ser usado dentro de um slide')

  const slide = ctx.index.value
  if (count) ctx.declare(slide, count)

  // Congela o valor quando o slide deixa de ser o atual (durante a transição de saída)
  let last = 0
  const step = computed(() => {
    if (ctx.index.value === slide) last = ctx.step.value
    return last
  })

  return { step }
}

declare module 'vue' {
  interface GlobalDirectives {
    vStep: typeof vStep
  }
}
