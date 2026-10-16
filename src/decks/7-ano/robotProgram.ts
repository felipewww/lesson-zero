import { reactive } from 'vue'

/**
 * Programa do "robô humano": os comandos que a turma dita no slide 13
 * ficam aqui e viram blocos executados pelo robozinho no slide 14.
 */
export type RobotCommand = 'forward' | 'right' | 'left' | 'grab'

export const COMMAND_LABEL: Record<RobotCommand, string> = {
  forward: 'Avance 1 passo',
  right: 'Vire à direita',
  left: 'Vire à esquerda',
  grab: 'Pegue o objeto',
}

export const robotProgram = reactive<{ commands: RobotCommand[] }>({ commands: [] })

/** Exemplo do roteiro, usado quando a turma não registrou nada. */
export const EXAMPLE_PROGRAM: RobotCommand[] = ['forward', 'forward', 'right', 'forward', 'grab']
