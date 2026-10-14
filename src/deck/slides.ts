import type { Component } from 'vue'

export interface DeckInfo {
  /** Identificador usado na URL: #/<id>/<slide>/<passo> */
  id: string
  title: string
  audience: string
  /** Texto curto opcional, ex.: "em construção" */
  status?: string
  /** Variáveis CSS que substituem as de src/style.css só nesta apresentação */
  theme?: Record<string, string>
  slides: Component[]
}

/**
 * Ordena os slides de um import.meta.glob pelo nome do arquivo.
 * Use prefixo numérico: 01-Capa.vue, 02-Agenda.vue, 10-...
 */
export function sortSlides(modules: Record<string, { default: Component }>): Component[] {
  return Object.keys(modules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => modules[path].default)
}
