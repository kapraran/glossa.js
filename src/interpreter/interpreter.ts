import GlossaParser from '../parser'

const parser = new GlossaParser()
const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

class GlossaInterpreter extends BaseCstVisitor {
  constructor() {
    super()
    this.validateVisitor()
  }

  script(ctx) {
    this.visit(ctx.program)
  }

  program(ctx) {
    const programName: string = ctx.Identifier[0].image
    console.log(`Program name is "${programName}"`)

    if (ctx.constDeclList && ctx.constDeclList.length > 1)
      return console.error('Too many Const blocks')

    if (ctx.varDeclaration && ctx.varDeclaration.length > 1)
      return console.error('Too many Var blocks')

    if (ctx.constDeclList) this.visit(ctx.constDeclList)
  }

  programBody(ctx) {}

  varDeclaration(ctx) {}

  typedVarDeclList(ctx) {}

  value(ctx) {}

  constDeclList(ctx) {
    for (let i = 0; i < ctx.constDecl.length; i++) this.visit(ctx.constDecl[i])
  }

  constDecl(ctx) {
    console.log(ctx.Identifier[0].image)
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
