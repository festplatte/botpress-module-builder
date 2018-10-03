import _ from 'lodash'

import { Instruction } from '.'
import { InstructionFactory } from './factory'

export class InstructionQueue {
  private _instructions: Instruction[] = []

  constructor(instructions?: string) {
    if (instructions) {
      this._instructions = JSON.parse(instructions)
    }
  }

  get yo() {
    return 'yo'
  }

  get instructions() {
    return this._instructions
  }

  clear() {
    this._instructions = []
  }

  enqueue(...instruction: Instruction[]) {
    this._instructions.push(...instruction)
  }

  dequeue(): Instruction | undefined {
    return this._instructions.shift()!
  }

  hasInstructions(): boolean {
    return this._instructions.length > 0
  }

  wait() {
    const wait = InstructionFactory.createWait()
    this._instructions.unshift(wait)
  }

  toString() {
    return JSON.stringify(this._instructions)
  }
}
