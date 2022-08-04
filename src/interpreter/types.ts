export enum VarType {
  INVALID,
  INTEGER,
  FLOAT,
  STRING,
  BOOLEAN,
}

export const declTypeToVarType = {
  ΑΚΕΡΑΙΕΣ: VarType.INTEGER,
  ΠΡΑΓΜΑΤΙΚΕΣ: VarType.FLOAT,
  ΧΑΡΑΚΤΗΡΕΣ: VarType.STRING,
  ΛΟΓΙΚΕΣ: VarType.BOOLEAN,
}

export function mapDeclTypeToVarType(declType: string): VarType {
  return declTypeToVarType[declType] || VarType.STRING
}

export function deriveValAndTypeFromConstVal(ctx): [VarType, any] {
  const valCtx = ctx.children

  if (valCtx.IntegerVal) {
    return [VarType.INTEGER, parseInt(valCtx.IntegerVal[0].image, 10)]
  }

  if (valCtx.RealVal) {
    return [VarType.FLOAT, parseFloat(valCtx.RealVal[0].image)]
  }

  if (valCtx.StringVal) {
    return [VarType.STRING, valCtx.StringVal[0].image]
  }

  if (valCtx.BooleanVal) {
    return [VarType.BOOLEAN, valCtx.BooleanVal[0].image]
  }

  return [VarType.STRING, '']
}

export type SymbolData = {
  type: VarType
  name: string
  value: any
  isArray: boolean
  size: number
  isConstant: boolean
}

export function isNumber(n: any): boolean {
  return isInteger(n) || isFloat(n)
}
export function isInteger(n: any): boolean {
  return typeof n === 'number' && Number.isInteger(n)
}

export function isFloat(n: any): boolean {
  return typeof n === 'number' && !Number.isInteger(n)
}

export function isString(n: any): boolean {
  return typeof n === 'string'
}

export function isBoolean(n: any): boolean {
  return typeof n === 'boolean'
}

export function parseString(stringLike: string): string {
  return stringLike.substring(1, stringLike.length - 1)
}

export function parseBoolean(boolLike: string): boolean {
  return boolLike === 'ΑΛΗΘΗΣ'
}
