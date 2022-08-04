import {
  AndExpressionCstChildren,
  ArgsCstChildren,
  AssignStmtCstChildren,
  CaseStmtCstChildren,
  ConstDeclCstChildren,
  ConstDeclListCstChildren,
  DoUntilStmtCstChildren,
  ElseIfStmtCstChildren,
  ElseStmtCstChildren,
  ExpressionCstChildren,
  FactorCstChildren,
  ForStmtCstChildren,
  FuncBodyCstChildren,
  FuncCallCstChildren,
  FuncCstChildren,
  IfStmtCstChildren,
  ImmutableCstChildren,
  MutableCstChildren,
  ProcedureBodyCstChildren,
  ProcedureCstChildren,
  ProgramBodyCstChildren,
  ProgramCstChildren,
  ReadStmtCstChildren,
  RelExpressionCstChildren,
  ScriptCstChildren,
  SelectStmtCstChildren,
  StatementCstChildren,
  StringConcatCstChildren,
  SumExpressionCstChildren,
  TermCstChildren,
  TypedVarDeclListCstChildren,
  UnaryExpressionCstChildren,
  UnaryRelExpressionCstChildren,
  ValueCstChildren,
  VarConstDeclBlockCstChildren,
  VarDeclarationCstChildren,
  WhileStmtCstChildren,
  WriteStmtCstChildren,
} from '../../d'
import GlossaParser from '../parser'
import {
  deriveValAndTypeFromConstVal,
  isBoolean,
  isNumber,
  mapDeclTypeToVarType,
  parseBoolean,
  parseString,
  SymbolData,
  VarType,
} from './types'
import * as readline from 'readline'
import SymbolTable from './SymbolTable'

const rl = readline.createInterface({
  input: process.stdin, //or fileStream
  output: process.stdout,
})
const it = rl[Symbol.asyncIterator]()

const parser = new GlossaParser()
const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

class GlossaInterpreter extends BaseCstVisitor {
  private symbols: SymbolTable<SymbolData>

  constructor() {
    super()
    this.validateVisitor()

    this.symbols = new SymbolTable()
  }

  async script(ctx: ScriptCstChildren) {
    try {
      // await this.visit(ctx.program)

      if (ctx.procedure) {
        for (const pCtx of ctx.procedure) {
          await this.visit(pCtx)
        }
      }

      if (ctx.func) {
        for (const pCtx of ctx.func) {
          await this.visit(pCtx)
        }
      }
    } catch (error) {
      console.error(error)
      rl.close()
    }
  }

  async program(ctx: ProgramCstChildren) {
    const programName: string = ctx.Identifier[0].image
    console.log(`Program name is "${programName}"`)

    if (ctx.varConstDeclBlock) this.visit(ctx.varConstDeclBlock)

    if (ctx.programBody) await this.visit(ctx.programBody)
  }

  async varConstDeclBlock(ctx: VarConstDeclBlockCstChildren) {
    if (ctx.constDeclList && ctx.constDeclList.length > 1)
      return console.error('Too many Const blocks')

    if (ctx.varDeclaration && ctx.varDeclaration.length > 1)
      return console.error('Too many Var blocks')

    if (ctx.constDeclList) this.visit(ctx.constDeclList)

    if (ctx.varDeclaration) this.visit(ctx.varDeclaration)
  }

  async programBody(ctx: ProgramBodyCstChildren) {
    for (const statementCtx of ctx.statement) {
      await this.visit(statementCtx)
    }
  }

  varDeclaration(ctx: VarDeclarationCstChildren) {
    // TODO check for duplicate blocks of same type
    ctx.typedVarDeclList.forEach((ctx) => this.visit(ctx))
  }

  typedVarDeclList(ctx: TypedVarDeclListCstChildren) {
    const type = mapDeclTypeToVarType(ctx.DeclTypeSpecifier[0].image)

    const symbols = ctx.value
      .map((ctx) => this.visit(ctx))
      .map((value) => ({
        ...value,
        type,
        isConstant: false,
      })) as SymbolData[]

    symbols.forEach((symbol) => this.symbols.set(symbol.name, symbol))
  }

  value(ctx: ValueCstChildren): Partial<SymbolData> {
    const name = ctx.Identifier[0].image
    const isArray = ctx.LSquare !== undefined && ctx.LSquare.length > 0
    const size = isArray ? parseInt(ctx.IntegerVal![0].image, 10) : 0

    return {
      name,
      isArray,
      size,
      value: isArray ? new Array(size).fill(undefined) : undefined,
    }
  }

  constDeclList(ctx: ConstDeclListCstChildren) {
    const symbols = ctx.constDecl.map((ctx) => this.visit(ctx)) as SymbolData[]

    symbols.forEach((symbol) => this.symbols.set(symbol.name, symbol))
  }

  constDecl(ctx: ConstDeclCstChildren) {
    const [type, value] = deriveValAndTypeFromConstVal(ctx.constVal[0])
    const name = ctx.Identifier[0].image

    return {
      type,
      name,
      isArray: false,
      size: 0,
      value,
      isConstant: true,
    }
  }

  constVal(ctx) {}

  async statement(ctx: StatementCstChildren) {
    if (ctx.readStmt) await this.visit(ctx.readStmt)
    if (ctx.writeStmt) await this.visit(ctx.writeStmt)
    if (ctx.assignStmt) this.visit(ctx.assignStmt)
    if (ctx.ifStmt) this.visit(ctx.ifStmt)
    if (ctx.forStmt) this.visit(ctx.forStmt)
    if (ctx.whileStmt) await this.visit(ctx.whileStmt)
    if (ctx.doUntilStmt) await this.visit(ctx.doUntilStmt)
  }

  async readStmt(ctx: ReadStmtCstChildren) {
    const mutables = ctx.mutable.map((ctx) => this.visit(ctx))

    for (const [symbol, index] of mutables) {
      const readVal = await it.next()

      console.log('read value of ', readVal)
      symbol.value = readVal.value
    }
  }

  expression(ctx: ExpressionCstChildren) {
    const val = this.visit(ctx.andExpression)
    if (!ctx.Or) return val

    const exprVal = this.visit(ctx.expression!)

    if (!isBoolean(val) || !isBoolean(exprVal))
      throw new Error('Not boolean in Or expr')

    return val || exprVal
  }

  andExpression(ctx: AndExpressionCstChildren) {
    const val = this.visit(ctx.unaryRelExpression)
    if (!ctx.And) return val

    const andExprVal = this.visit(ctx.andExpression!)

    if (!isBoolean(val) || !isBoolean(andExprVal))
      throw new Error('Not boolean in And expr')

    return val && andExprVal
  }

  unaryRelExpression(ctx: UnaryRelExpressionCstChildren) {
    const val = this.visit(ctx.relExpression!)

    if (ctx.Not && !isBoolean(val)) throw new Error('Not boolean in Not expr')

    return ctx.Not ? !val : val
  }

  funcCall(ctx: FuncCallCstChildren) {
    const argValues = this.visit(ctx.args)
  }

  relExpression(ctx: RelExpressionCstChildren) {
    const sumExpVal = this.visit(ctx.sumExpression[0])

    if (ctx.Equal) {
      const rightVal = this.visit(ctx.sumExpression[1])
      return sumExpVal === rightVal
    }

    if (ctx.RelOp) {
      const op = ctx.RelOp[0].image
      const rightVal = this.visit(ctx.sumExpression[1])

      if (op === '<') return sumExpVal < rightVal
      if (op === '>') return sumExpVal > rightVal
      if (op === '<=') return sumExpVal <= rightVal
      if (op === '>=') return sumExpVal >= rightVal
      if (op === '<>') return sumExpVal !== rightVal
    }

    return sumExpVal
  }

  sumExpression(ctx: SumExpressionCstChildren) {
    const termValue = this.visit(ctx.term)

    if (ctx.Plus || ctx.Minus) {
      const sumExpressionValue = this.visit(ctx.sumExpression!)

      if (!isNumber(termValue) || !isNumber(sumExpressionValue))
        throw new Error('Not a number')

      return termValue + (ctx.Minus ? -sumExpressionValue : sumExpressionValue)
    }

    return termValue
  }

  intOrRange(ctx) {}

  term(ctx: TermCstChildren) {
    const unaryExpressionVal = this.visit(ctx.unaryExpression)
    if (ctx.MulOp) {
      const termValue = this.visit(ctx.term!)

      if (ctx.MulOp[0].image === '*') return unaryExpressionVal * termValue
      if (ctx.MulOp[0].image === '/') return unaryExpressionVal / termValue
    }

    return unaryExpressionVal
  }

  unaryExpression(ctx: UnaryExpressionCstChildren) {
    if (ctx.factor) return this.visit(ctx.factor)

    return -this.visit(ctx.unaryExpression!)
  }

  factor(ctx: FactorCstChildren) {
    if (ctx.immutable) return this.visit(ctx.immutable)

    const [symbol, index] = this.visit(ctx.mutable!)

    return index > -1 ? symbol.value[index] : symbol.value
  }

  mutable(ctx: MutableCstChildren) {
    const symbolName = ctx.Identifier[0].image
    const symbol = this.symbols.get(symbolName)

    if (symbol === undefined) throw new Error(`Symbol not found ${symbolName}`)

    if (ctx.LSquare && !symbol.isArray) throw new Error('Its not an array')

    return [symbol, ctx.expression ? this.visit(ctx.expression!) : -1]
  }

  immutable(ctx: ImmutableCstChildren) {
    if (ctx.LParen && ctx.RParen) {
      return this.visit(ctx.expression!)
    }

    if (ctx.IntegerVal) return parseInt(ctx.IntegerVal[0].image, 10)
    if (ctx.RealVal) return parseFloat(ctx.RealVal[0].image)
    if (ctx.BooleanVal) return parseBoolean(ctx.BooleanVal[0].image)
    if (ctx.StringVal) return parseString(ctx.StringVal[0].image)

    // TODO .Identifier / args
  }

  assignStmt(ctx: AssignStmtCstChildren) {
    const [symbol, index] = this.visit(ctx.mutable) as [SymbolData, number]

    let value = this.visit(ctx.expression)

    if (symbol.isArray && !Array.isArray(value))
      throw new Error('ITS NOT ARRAY 1')
    if (!symbol.isArray && Array.isArray(value))
      throw new Error('ITS NOT ARRAY 2')
    if (symbol.isArray && symbol.size !== value?.length)
      throw new Error('NOT SAME SIZE ARRAY')

    index > -1
      ? (symbol.value[index] = value)
      : (symbol.value = symbol.isArray ? value.slice(0) : value)
    console.log(`The value of ${symbol.name} is ${symbol.value}`)
  }

  async writeStmt(ctx: WriteStmtCstChildren) {
    console.log(ctx.expression.map((ctx) => this.visit(ctx)).join(''))
  }

  ifStmt(ctx: IfStmtCstChildren) {
    if (this.visit(ctx.expression)) {
      ctx.statement.forEach((ctx) => this.visit(ctx))
      return
    }

    if (ctx.elseIfStmt) {
      for (const elseIfCtx of ctx.elseIfStmt) {
        if (this.visit(elseIfCtx)) return
      }
    }

    if (ctx.elseStmt) this.visit(ctx.elseStmt)

    // NEED TO MOVE ELSE TO ANOTHER RULE
  }

  elseStmt(ctx: ElseStmtCstChildren) {
    return ctx.statement.map((ctx) => this.visit(ctx))
  }

  elseIfStmt(ctx: ElseIfStmtCstChildren) {
    if (this.visit(ctx.expression)) {
      ctx.statement.forEach((ctx) => this.visit(ctx))
      return true
    }

    return false
  }

  async selectStmt(ctx: SelectStmtCstChildren) {
    const val = this.visit(ctx.expression)

    if (ctx.caseStmt) {
    }

    if (ctx.Else) {
      await this._forEach(ctx.statement!)
    }
  }

  caseStmt(ctx: CaseStmtCstChildren) {}

  forStmt(ctx: ForStmtCstChildren) {
    const from = this.visit(ctx.expression[0])
    const to = this.visit(ctx.expression[1])
    const step = ctx.Step ? this.visit(ctx.expression[2]) : 1

    const symbol = {
      type: VarType.INTEGER,
      name: ctx.Identifier[0].image,
      isArray: false,
      size: 0,
      isConstant: false,
      value: from,
    }

    // add symbol
    this.symbols.set(symbol.name, symbol)

    for (let i = from; i < to; i += step) {
      symbol.value = i
      ctx.statement.forEach((ctx) => this.visit(ctx))
    }

    // remove symbol
    this.symbols.delete(symbol.name)
  }

  async whileStmt(ctx: WhileStmtCstChildren) {
    while (this.visit(ctx.expression)) {
      // ctx.statement.forEach((ctx) => this.visit(ctx))
      await this._forEach(ctx.statement)
    }
  }

  async doUntilStmt(ctx: DoUntilStmtCstChildren) {
    let exprVal = true
    while (exprVal) {
      // ctx.statement.forEach((ctx) => this.visit(ctx))
      await this._forEach(ctx.statement)
      exprVal = this.visit(ctx.expression)
    }
  }

  procedure(ctx: ProcedureCstChildren) {
    console.log(`Procedure ${ctx.Identifier[0].image}`)
  }

  func(ctx: FuncCstChildren) {
    console.log(`Function ${ctx.Identifier[0].image}`)
  }

  parameters(ctx) {}

  async procedureBody(ctx: ProcedureBodyCstChildren) {
    return await this._forEach(ctx.statement)
  }

  procedureCallStmt(ctx) {}

  args(ctx: ArgsCstChildren) {
    return (ctx.expression || []).map((ctx) => this.visit(ctx))
  }

  async funcBody(ctx: FuncBodyCstChildren) {
    return await this._forEach(ctx.statement)
  }

  stringConcat(ctx: StringConcatCstChildren) {
    // TODO maybe not needed
  }

  async _forEach(manyCtx: any[]) {
    for (const ctx of manyCtx) {
      await this.visit(ctx)
    }
  }
}

export default GlossaInterpreter
