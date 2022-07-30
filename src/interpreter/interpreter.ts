import {
  AndExpressionCstChildren,
  AndExpressionCstNode,
  AssignStmtCstChildren,
  AssignStmtCstNode,
  ConstDeclCstChildren,
  ExpressionCstChildren,
  ExpressionCstNode,
  FactorCstChildren,
  FactorCstNode,
  ImmutableCstChildren,
  ImmutableCstNode,
  MutableCstChildren,
  MutableCstNode,
  ProgramBodyCstChildren,
  ProgramBodyCstNode,
  ProgramCstChildren,
  ProgramCstNode,
  RelExpressionCstChildren,
  RelExpressionCstNode,
  ScriptCstChildren,
  ScriptCstNode,
  StatementCstChildren,
  StatementCstNode,
  SumExpressionCstChildren,
  SumExpressionCstNode,
  TermCstChildren,
  TermCstNode,
  TypedVarDeclListCstChildren,
  UnaryExpressionCstChildren,
  UnaryExpressionCstNode,
  UnaryRelExpressionCstChildren,
  UnaryRelExpressionCstNode,
  ValueCstChildren,
  VarDeclarationCstChildren,
} from '../../d'
import GlossaParser from '../parser'
import { deriveValAndTypeFromConstVal, mapDeclTypeToVarType } from './types'

const parser = new GlossaParser()
const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

class GlossaInterpreter extends BaseCstVisitor {
  private symbols: any[]

  constructor() {
    super()
    this.validateVisitor()

    this.symbols = []
  }

  script(ctx: ScriptCstChildren) {
    this.visit(ctx.program)
  }

  program(ctx: ProgramCstChildren) {
    const programName: string = ctx.Identifier[0].image
    console.log(`Program name is "${programName}"`)

    if (ctx.constDeclList && ctx.constDeclList.length > 1)
      return console.error('Too many Const blocks')

    if (ctx.constDeclList) this.visit(ctx.constDeclList)

    if (ctx.varDeclaration && ctx.varDeclaration.length > 1)
      return console.error('Too many Var blocks')

    if (ctx.varDeclaration) this.visit(ctx.varDeclaration)

    if (ctx.programBody) this.visit(ctx.programBody)

    // console.log(this.symbols)
  }

  programBody(ctx: ProgramBodyCstChildren) {
    ctx.statement.forEach((ctx: StatementCstNode) => this.visit(ctx))
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
      value: undefined,
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

  statement(ctx: StatementCstChildren) {
    if (ctx.assignStmt) this.visit(ctx.assignStmt)
  }

  readStmt(ctx) {}

  expression(ctx: ExpressionCstChildren) {
    return this.visit(ctx.andExpression)
  }

  andExpression(ctx: AndExpressionCstChildren) {
    return this.visit(ctx.unaryRelExpression)
  }

  unaryRelExpression(ctx: UnaryRelExpressionCstChildren) {
    if (ctx.Not) {
      // TODO
    }

    return this.visit(ctx.relExpression!)
  }

  relExpression(ctx: RelExpressionCstChildren) {
    const sumExpVal = this.visit(ctx.sumExpression[0])

    return sumExpVal
  }

  sumExpression(ctx: SumExpressionCstChildren) {
    const termValue = this.visit(ctx.term)

    if (ctx.Plus) return termValue + this.visit(ctx.sumExpression!)
    if (ctx.Minus) return termValue - this.visit(ctx.sumExpression!)

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
    return this.visit(ctx.immutable ?? ctx.mutable!)
  }

  mutable(ctx: MutableCstChildren) {}

  immutable(ctx: ImmutableCstChildren) {
    if (ctx.LParen && ctx.RParen) {
      return this.visit(ctx.expression!)
    }

    if (ctx.IntegerVal) return parseInt(ctx.IntegerVal[0].image, 10)
    if (ctx.RealVal) return parseFloat(ctx.RealVal[0].image)

    // TODO
  }

  assignStmt(ctx: AssignStmtCstChildren) {
    const symbolName = ctx.mutable[0].children.Identifier[0].image
    const symbol = this.symbols.find((symbol) => symbol.name === symbolName)
    console.log(symbolName)
    console.log(symbol)

    const value = this.visit(ctx.expression)

    console.log(`The value of ${symbolName} is ${value}`)
    symbol.value = value
  }

  writeStmt(ctx) {}

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
