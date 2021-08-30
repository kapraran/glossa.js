import { tokenMap, tokenList } from './tokens'
import { Parser, Lexer, IToken } from 'chevrotain'
import { readFileSync } from 'fs'

class GlossaParser extends Parser {
  constructor(inputTokens: Array<IToken> | null = null) {
    super(tokenList)
    this.performSelfAnalysis()

    if (inputTokens != null) this.input = inputTokens
  }

  public script = this.RULE('script', () => {
    this.SUBRULE(this.program)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.procedure) },
        { ALT: () => this.SUBRULE(this.func) },
      ])
    })
  })

  private program = this.RULE('program', () => {
    this.CONSUME(tokenMap.Program)
    this.CONSUME(tokenMap.Identifier)
    this.OPTION(() => {
      this.AT_LEAST_ONE(() => {
        this.OR([
          { ALT: () => this.SUBRULE(this.constDeclList) },
          { ALT: () => this.SUBRULE(this.varDeclaration) },
        ])
      })
    })
    this.SUBRULE(this.programBody)
  })

  private programBody = this.RULE('programBody', () => {
    this.CONSUME(tokenMap.Start)
    this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    this.CONSUME(tokenMap.End)
    this.CONSUME(tokenMap.Identifier)
  })

  private varDeclaration = this.RULE('varDeclaration', () => {
    this.CONSUME(tokenMap.Variables)
    this.AT_LEAST_ONE(() => this.SUBRULE(this.typedVarDeclList))
  })

  private typedVarDeclList = this.RULE('typedVarDeclList', () => {
    this.CONSUME(tokenMap.DeclTypeSpecifier)
    this.CONSUME(tokenMap.Colon)
    this.AT_LEAST_ONE_SEP({
      SEP: tokenMap.Comma,
      DEF: () => this.SUBRULE(this.value),
    })
  })

  private value = this.RULE('value', () => {
    this.CONSUME(tokenMap.Identifier)
    this.OPTION(() => {
      this.CONSUME(tokenMap.LSquare)
      this.OR([
        { ALT: () => this.CONSUME(tokenMap.IntegerVal) },
        { ALT: () => this.CONSUME1(tokenMap.Identifier) },
      ])
      this.CONSUME(tokenMap.RSquare)
    })
  })

  private constDeclList = this.RULE('constDeclList', () => {
    this.CONSUME(tokenMap.Constants)
    this.AT_LEAST_ONE(() => this.SUBRULE(this.constDecl))
  })

  private constDecl = this.RULE('constDecl', () => {
    this.CONSUME(tokenMap.Identifier)
    this.CONSUME(tokenMap.Equal)
    this.SUBRULE(this.constVal)
  })

  private constVal = this.RULE('constVal', () => {
    this.OR([
      { ALT: () => this.CONSUME(tokenMap.IntegerVal) },
      { ALT: () => this.CONSUME(tokenMap.RealVal) },
      { ALT: () => this.CONSUME(tokenMap.StringVal) },
      { ALT: () => this.CONSUME(tokenMap.BooleanVal) },
    ])
  })

  private statement = this.RULE('statement', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.readStmt) },
      { ALT: () => this.SUBRULE(this.writeStmt) },
      { ALT: () => this.SUBRULE(this.assignStmt) },
      { ALT: () => this.SUBRULE(this.ifStmt) },
      { ALT: () => this.SUBRULE(this.selectStmt) },
      { ALT: () => this.SUBRULE(this.forStmt) },
      { ALT: () => this.SUBRULE(this.whileStmt) },
      { ALT: () => this.SUBRULE(this.doUntilStmt) },
      { ALT: () => this.SUBRULE(this.procedureCallStmt) },
    ])
  })

  private readStmt = this.RULE('readStmt', () => {
    this.CONSUME(tokenMap.Read)
    this.AT_LEAST_ONE_SEP({
      SEP: tokenMap.Comma,
      DEF: () => this.SUBRULE(this.mutable),
    })
  })

  private expression = this.RULE('expression', () => {
    this.SUBRULE(this.andExpression)
    this.MANY(() => {
      this.CONSUME(tokenMap.Or)
      this.SUBRULE(this.expression)
    })
  })

  private andExpression = this.RULE('andExpression', () => {
    this.SUBRULE(this.unaryRelExpression)
    this.MANY(() => {
      this.CONSUME(tokenMap.And)
      this.SUBRULE(this.andExpression)
    })
  })

  private unaryRelExpression = this.RULE('unaryRelExpression', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(tokenMap.Not)
          this.SUBRULE(this.relExpression)
        },
      },
      { ALT: () => this.SUBRULE2(this.relExpression) },
    ])
  })

  private relExpression = this.RULE('relExpression', () => {
    this.SUBRULE(this.sumExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(tokenMap.Equal) },
        { ALT: () => this.CONSUME(tokenMap.RelOp) },
      ])
      this.SUBRULE1(this.sumExpression)
    })
  })

  private sumExpression = this.RULE('sumExpression', () => {
    this.SUBRULE(this.term)
    this.MANY(() => {
      // this.CONSUME(tokenMap.SumOp)
      this.OR([
        { ALT: () => this.CONSUME(tokenMap.Plus) },
        { ALT: () => this.CONSUME(tokenMap.Minus) },
      ])
      this.SUBRULE(this.sumExpression)
    })
  })

  private intOrRange = this.RULE('intOrRange', () => {
    this.CONSUME(tokenMap.IntegerVal)
    this.OPTION(() => {
      this.CONSUME(tokenMap.DbDots)
      this.CONSUME1(tokenMap.IntegerVal)
    })
  })

  private term = this.RULE('term', () => {
    this.SUBRULE(this.unaryExpression)
    this.MANY(() => {
      this.CONSUME(tokenMap.MulOp)
      this.SUBRULE(this.term)
    })
  })

  private unaryExpression = this.RULE('unaryExpression', () => {
    this.OR([
      {
        ALT: () => {
          // this.CONSUME(tokenMap.UnaryOp)
          this.CONSUME(tokenMap.Minus)
          this.SUBRULE(this.unaryExpression)
        },
      },
      { ALT: () => this.SUBRULE2(this.factor) },
    ])
  })

  private factor = this.RULE('factor', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.immutable) },
      { ALT: () => this.SUBRULE(this.mutable) },
    ])
  })

  private mutable = this.RULE('mutable', () => {
    this.CONSUME(tokenMap.Identifier)
    this.OPTION(() => {
      this.CONSUME(tokenMap.LSquare)
      this.SUBRULE(this.expression)
      this.CONSUME(tokenMap.RSquare)
    })
  })

  private immutable = this.RULE('immutable', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(tokenMap.LParen)
          this.SUBRULE(this.expression)
          this.CONSUME(tokenMap.RParen)
        },
      },
      {
        ALT: () => {
          this.CONSUME(tokenMap.Identifier)
          this.SUBRULE(this.args)
        },
      },
      { ALT: () => this.CONSUME(tokenMap.IntegerVal) },
      { ALT: () => this.CONSUME(tokenMap.RealVal) },
      { ALT: () => this.CONSUME(tokenMap.StringVal) },
      { ALT: () => this.CONSUME(tokenMap.BooleanVal) },
    ])
  })

  private assignStmt = this.RULE('assignStmt', () => {
    this.SUBRULE(this.mutable)
    this.CONSUME(tokenMap.AssignOp)
    this.SUBRULE(this.expression)
  })

  private writeStmt = this.RULE('writeStmt', () => {
    this.CONSUME(tokenMap.Write)
    this.AT_LEAST_ONE_SEP({
      SEP: tokenMap.Comma,
      DEF: () => this.SUBRULE(this.expression),
    })
  })

  private ifStmt = this.RULE('ifStmt', () => {
    this.CONSUME(tokenMap.If)
    // TODO some way to force conditional
    this.SUBRULE(this.expression)
    this.CONSUME(tokenMap.Then)
    this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    this.MANY(() => this.SUBRULE(this.elseIfStmt))
    this.OPTION(() => {
      this.CONSUME(tokenMap.Else)
      this.AT_LEAST_ONE1(() => this.SUBRULE1(this.statement))
    })
    this.CONSUME(tokenMap.EndIf)
  })

  private elseIfStmt = this.RULE('elseIfStmt', () => {
    this.CONSUME(tokenMap.ElseIf)
    this.SUBRULE(this.expression)
    this.CONSUME(tokenMap.Then)
    this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
  })

  private selectStmt = this.RULE('selectStmt', () => {
    this.CONSUME(tokenMap.Select)
    this.SUBRULE(this.expression)
    this.MANY(() => this.SUBRULE(this.caseStmt))
    this.OPTION(() => {
      this.CONSUME1(tokenMap.Select)
      this.CONSUME(tokenMap.Else)
      this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    })
    this.CONSUME2(tokenMap.EndSelect)
  })

  private caseStmt = this.RULE('caseStmt', () => {
    this.CONSUME(tokenMap.Case)
    this.AT_LEAST_ONE_SEP({
      SEP: tokenMap.Comma,
      DEF: () => this.SUBRULE(this.intOrRange),
    })
    this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
  })

  private forStmt = this.RULE('forStmt', () => {
    this.CONSUME(tokenMap.For)
    this.CONSUME(tokenMap.Identifier)
    this.CONSUME(tokenMap.From)
    this.SUBRULE(this.expression)
    this.CONSUME(tokenMap.Until)
    this.SUBRULE1(this.expression)
    this.OPTION(() => {
      this.CONSUME(tokenMap.Step)
      this.SUBRULE2(this.expression)
    })
    this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    this.CONSUME(tokenMap.EndRepeat)
  })

  private whileStmt = this.RULE('whileStmt', () => {
    this.CONSUME(tokenMap.While)
    this.SUBRULE(this.expression)
    this.CONSUME(tokenMap.Repeat)
    this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    this.CONSUME(tokenMap.EndRepeat)
  })

  private doUntilStmt = this.RULE('doUntilStmt', () => {
    this.CONSUME(tokenMap.StartRepeat)
    this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    this.CONSUME(tokenMap.DoUntil)
    this.SUBRULE(this.expression)
  })

  private procedure = this.RULE('procedure', () => {
    this.CONSUME(tokenMap.Procedure)
    this.CONSUME(tokenMap.Identifier)
    this.SUBRULE(this.parameters)
    this.OPTION(() => {
      this.AT_LEAST_ONE(() => {
        this.OR([
          { ALT: () => this.SUBRULE(this.constDeclList) },
          { ALT: () => this.SUBRULE(this.varDeclaration) },
        ])
      })
    })
    this.SUBRULE(this.procedureBody)
  })

  private func = this.RULE('func', () => {
    this.CONSUME(tokenMap.Function)
    this.CONSUME(tokenMap.Identifier)
    this.SUBRULE(this.parameters)
    this.CONSUME(tokenMap.Colon)
    this.CONSUME(tokenMap.DeclRetTypeSpecifier)
    this.OPTION(() => {
      this.AT_LEAST_ONE(() => {
        this.OR([
          { ALT: () => this.SUBRULE(this.constDeclList) },
          { ALT: () => this.SUBRULE(this.varDeclaration) },
        ])
      })
    })
    this.SUBRULE(this.funcBody)
  })

  private parameters = this.RULE('parameters', () => {
    this.CONSUME(tokenMap.LParen)
    this.MANY_SEP({
      SEP: tokenMap.Comma,
      DEF: () => this.CONSUME(tokenMap.Identifier),
    })
    this.CONSUME(tokenMap.RParen)
  })

  private procedureBody = this.RULE('procedureBody', () => {
    this.CONSUME(tokenMap.Start)
    this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    this.CONSUME(tokenMap.EndProcedure)
  })

  private procedureCallStmt = this.RULE('procedureCallStmt', () => {
    this.CONSUME(tokenMap.Call)
    this.CONSUME(tokenMap.Identifier)
    this.SUBRULE(this.args)
  })

  private args = this.RULE('args', () => {
    this.CONSUME(tokenMap.LParen)
    this.MANY_SEP({
      SEP: tokenMap.Comma,
      DEF: () => this.SUBRULE(this.expression),
    })
    this.CONSUME(tokenMap.RParen)
  })

  private funcBody = this.RULE('funcBody', () => {
    this.CONSUME(tokenMap.Start)
    this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    this.CONSUME(tokenMap.EndFunc)
  })

  private stringConcat = this.RULE('stringConcat', () => {
    this.AT_LEAST_ONE_SEP({
      SEP: tokenMap.Comma,
      DEF: () => {
        this.OR([
          { ALT: () => this.CONSUME(tokenMap.StringVal) },
          { ALT: () => this.CONSUME(tokenMap.Identifier) },
        ])
      },
    })
  })

  /**
   * Creates a parser instance using the inputStr as the input
   *
   * @param inputStr
   */
  static createFromString(inputStr: string): GlossaParser {
    // tokenize input
    const glossaLexer = new Lexer(tokenList)
    const lexerResult = glossaLexer.tokenize(inputStr)

    return new GlossaParser(lexerResult.tokens)
  }

  /**
   * Creates a parser instance using the file contents as the input
   *
   * @param filepath
   */
  static createFromFile(filepath: string): GlossaParser {
    return GlossaParser.createFromString(readFileSync(filepath, 'utf8'))
  }
}

export default GlossaParser
