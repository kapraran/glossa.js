import { VarType } from '../types'

const TEMP_VAR_PREFIX = '$tempVar__'

type ConstructorOptions = {
  isConstant?: boolean
}

export default class VarCtx {
  public name: string
  public type: VarType

  public isConstant: boolean

  private static tempID = 0

  constructor(
    name: string,
    type: VarType,
    { isConstant }: ConstructorOptions = {}
  ) {
    this.name = name
    this.type = type

    this.isConstant = isConstant || false
  }

  get isTemporary(): boolean {
    return this.name.startsWith(TEMP_VAR_PREFIX)
  }

  set value(value: any) {
    if (this.isConstant) throw new Error('Cannot set value to a constant')
    this.value = value
  }

  public static CreateTemporary(type: VarType) {
    const tempVarName = `${TEMP_VAR_PREFIX}${this.tempID++}`
    const tempVar = new VarCtx(tempVarName, type)
    return tempVar
  }
}
