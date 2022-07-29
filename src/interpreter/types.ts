export enum VarType {
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
