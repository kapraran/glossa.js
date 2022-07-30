import {
  AndExpressionCstChildren,
  AssignStmtCstChildren,
  ConstDeclCstChildren,
  ExpressionCstChildren,
  FactorCstChildren,
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
  private symbols: any[]

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

    const values = ctx.value
      .map((ctx) => this.visit(ctx))
      .map((value) => ({
        ...value,
        type,
        isConstant: false,
      }))

    this.symbols.push(...values)
  }

  value(ctx: ValueCstChildren) {
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

  constDeclList(ctx) {
    const values = ctx.constDecl.map((ctx) => this.visit(ctx))

    this.symbols.push(...values)
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
    if (ctx.assignStmt) this.visit(ctx.assignStmt)
    if (ctx.readStmt) await this.visit(ctx.readStmt)
    if (ctx.writeStmt) this.visit(ctx.writeStmt)
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

  writeStmt(ctx: WriteStmtCstChildren) {
    console.log(ctx.expression.map((ctx) => this.visit(ctx)).join(''))
  }

  ifStmt(ctx) {}

  elseIfStmt(ctx) {}

  selectStmt(ctx) {}

  caseStmt(ctx) {}

  forStmt(ctx) {}

  whileStmt(ctx) {}

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
