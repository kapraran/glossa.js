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

  script(ctx) {
    this.visit(ctx.program)
  }

  program(ctx) {
    const programName: string = ctx.Identifier[0].image
    console.log(`Program name is "${programName}"`)

    if (ctx.constDeclList && ctx.constDeclList.length > 1)
      return console.error('Too many Const blocks')

    if (ctx.constDeclList) this.visit(ctx.constDeclList)

    if (ctx.varDeclaration && ctx.varDeclaration.length > 1)
      return console.error('Too many Var blocks')

    if (ctx.varDeclaration) this.visit(ctx.varDeclaration)

    console.log(this.symbols)
  }

  programBody(ctx) {}

  varDeclaration(ctx) {
    // TODO check for duplicate blocks of same type
    ctx.typedVarDeclList.forEach((ctx) => this.visit(ctx))
  }

  typedVarDeclList(ctx) {
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

  value(ctx) {
    const name = ctx.Identifier[0].image
    const isArray = ctx.LSquare !== undefined && ctx.LSquare.length > 0
    const size = isArray ? parseInt(ctx.IntegerVal[0].image, 10) : 0

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

  constDecl(ctx) {
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

  statement(ctx) {}

  readStmt(ctx) {}

  expression(ctx) {}

  andExpression(ctx) {}

  unaryRelExpression(ctx) {}

  relExpression(ctx) {}

  sumExpression(ctx) {}

  intOrRange(ctx) {}

  term(ctx) {}

  unaryExpression(ctx) {}

  factor(ctx) {}

  mutable(ctx) {}

  immutable(ctx) {}

  assignStmt(ctx) {}

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
