type ConstructorOptions = {
  isReadOnly?: boolean
  isTemporary?: boolean
}

export default class VarCtx {
  public name: string
  public type: string
  public value: any

  public isReadOnly: boolean
  public isTemporary: boolean

  private static tempID = 0

  constructor(
    name: string,
    type: string,
    { isReadOnly, isTemporary }: ConstructorOptions = {}
  ) {
    this.name = name
    this.type = type

    this.isReadOnly = isReadOnly || false
    this.isTemporary = isTemporary || false
  }

  setValue(value: any) {
    if (this.isReadOnly) throw new Error('Cannot set value to a constant')
    this.value = value
    return true
  }

  public static CreateTemp(type: string) {
    const tempVarName = `tmpVar-${this.tempID++}`
    const tempVar = new VarCtx(tempVarName, type)
    return tempVar
  }
}
