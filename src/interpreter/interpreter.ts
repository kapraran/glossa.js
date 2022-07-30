import {
  AndExpressionCstChildren,
  AssignStmtCstChildren,
  ConstDeclCstChildren,
  ConstDeclListCstChildren,
  ExpressionCstChildren,
  FactorCstChildren,
  ForStmtCstChildren,
  IfStmtCstChildren,
  ImmutableCstChildren,
  MutableCstChildren,
  ProgramBodyCstChildren,
  ProgramCstChildren,
  ReadStmtCstChildren,
  RelExpressionCstChildren,
  ScriptCstChildren,
  StatementCstChildren,
  SumExpressionCstChildren,
  TermCstChildren,
  TypedVarDeclListCstChildren,
  UnaryExpressionCstChildren,
  UnaryRelExpressionCstChildren,
  ValueCstChildren,
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

const rl = readline.createInterface({
  input: process.stdin, //or fileStream
  output: process.stdout,
})
const it = rl[Symbol.asyncIterator]()

const parser = new GlossaParser()
const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

class GlossaInterpreter extends BaseCstVisitor {
  private symbols: SymbolData[]

  constructor() {
    super()
    this.validateVisitor()

    this.symbols = []
  }

  async script(ctx: ScriptCstChildren) {
    try {
      await this.visit(ctx.program)
    } catch (error) {
      console.error(error)
      rl.close()
    }
  }

  async program(ctx: ProgramCstChildren) {
    const programName: string = ctx.Identifier[0].image
    console.log(`Program name is "${programName}"`)

    if (ctx.constDeclList && ctx.constDeclList.length > 1)
      return console.error('Too many Const blocks')

    if (ctx.varDeclaration && ctx.varDeclaration.length > 1)
      return console.error('Too many Var blocks')

    if (ctx.constDeclList) this.visit(ctx.constDeclList)

    if (ctx.varDeclaration) this.visit(ctx.varDeclaration)

    if (ctx.programBody) await this.visit(ctx.programBody)

    // console.log(this.symbols)
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

    this.symbols.push(...symbols)
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

    this.symbols.push(...symbols)
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
    if (ctx.forStmt) this.visit(ctx.forStmt)
    if (ctx.whileStmt) this.visit(ctx.whileStmt)
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

  relExpression(ctx: RelExpressionCstChildren) {
    const sumExpVal = this.visit(ctx.sumExpression[0])

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
    const symbol = this.symbols.find(
      (symbol) => ctx.Identifier[0].image === symbol.name
    )

    if (symbol === undefined)
      throw new Error(`Symbol not found ${ctx.Identifier[0].image}`)

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
    const val = this.visit(ctx.expression)

    // NEED TO MOVE ELSE TO ANOTHER RULE
  }

  elseIfStmt(ctx) {}

  selectStmt(ctx) {}

  caseStmt(ctx) {}

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
    this.symbols.push(symbol)

    for (let i = from; i < to; i += step) {
      symbol.value = i
      ctx.statement.forEach((ctx) => this.visit(ctx))
    }

    // remove symbol
    this.symbols = this.symbols.filter((curSymbol) => curSymbol !== symbol)
  }

  whileStmt(ctx: WhileStmtCstChildren) {
    while (this.visit(ctx.expression)) {
      ctx.statement.forEach((ctx) => this.visit(ctx))
    }
  }

  doUntilStmt(ctx) {}

  procedure(ctx) {}

  func(ctx) {}

  parameters(ctx) {}

  procedureBody(ctx) {}

  procedureCallStmt(ctx) {}

  args(ctx) {}

  funcBody(ctx) {}

  stringConcat(ctx) {}
}

export default GlossaInterpreter
