import VariableDefinition from '../definitions/VariableDefinition'

type ValueReference = {
  value: any
}

export default class VarCtx {
  public readonly definition: VariableDefinition
  private _reference: ValueReference

  constructor(definition: VariableDefinition, value?: ValueReference) {
    this.definition = definition
    this._reference = value || { value: undefined }
  }

  set value(value: any) {
    if (this.definition.isConstant)
      throw new Error('Cannot set value to a constant')
    this._reference.value = value
  }

  get value(): any {
    return this._reference.value
  }

  set reference(reference: ValueReference) {
    // TODO check compatibility
    this._reference = reference
  }

  get reference(): ValueReference {
    return this._reference
  }
}
