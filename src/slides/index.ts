import type { Component } from 'vue'

/**
 * Carrega automaticamente todo arquivo .vue desta pasta.
 * A ordem é a ordem alfabética do nome do arquivo, por isso use o
 * prefixo numérico: 01-Capa.vue, 02-Agenda.vue, 03-...
 */
const modules = import.meta.glob<{ default: Component }>('./*.vue', { eager: true })

export const slides: Component[] = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((path) => modules[path].default)
