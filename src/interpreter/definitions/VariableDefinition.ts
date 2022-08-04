import { VarType } from '../types'

type Options = {
  type?: VarType
  arraySize?: number[]
  isArray?: boolean
  isConstant?: boolean
}

export default class VariableDefinition {
  name: string
  type: VarType
  arraySize: number[]

  isArray: boolean
  isConstant: boolean

  constructor(
    name: string,
    { type, arraySize, isArray, isConstant }: Options = {}
  ) {
    this.name = name
    this.type = type || VarType.INVALID
    this.arraySize = arraySize || []
    this.isArray = isArray || false
    this.isConstant = isConstant || false
  }
}
