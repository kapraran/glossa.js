import { tokens, tokenValues } from './tokens'
import { Parser, TokenType } from 'chevrotain'

class GlossaParser extends Parser {
    constructor() {
        super(tokenValues)
        this.performSelfAnalysis()
    }

    public script = this.RULE('script', () => {
        this.SUBRULE(this.program)
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.procedure) },
                { ALT: () => this.SUBRULE(this.func) }
            ])
        })
    })

    public program = this.RULE('program', () => {
        this.CONSUME(tokens.Program)
        this.CONSUME(tokens.Identifier)
        this.OPTION(() => {
            this.AT_LEAST_ONE(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.constDeclList) },
                    { ALT: () => this.SUBRULE(this.varDeclaration) }
                ])
            })
        })
        this.SUBRULE(this.programBody)
    })

    private programBody = this.RULE('programBody', () => {
        this.CONSUME(tokens.Start)
        this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
        this.CONSUME(tokens.End)
        this.CONSUME(tokens.Identifier)
    })

    private varDeclaration = this.RULE('varDeclaration', () => {
        this.CONSUME(tokens.Variables)
        this.AT_LEAST_ONE(() => this.SUBRULE(this.typedVarDeclList))
    })

    private typedVarDeclList = this.RULE('typedVarDeclList', () => {
        this.CONSUME(tokens.DeclTypeSpecifier)
        this.CONSUME(tokens.Colon)
        this.AT_LEAST_ONE_SEP({
            SEP: tokens.Comma,
            DEF: () => this.SUBRULE(this.value)
        })
    })

    private value = this.RULE('value', () => {
        this.CONSUME(tokens.Identifier)
        this.OPTION(() => {
            this.CONSUME(tokens.LSquare)
            this.CONSUME(tokens.IntegerVal)
            this.CONSUME(tokens.RSquare)
        })
    })

    private constDeclList = this.RULE('constDeclList', () => {
        this.CONSUME(tokens.Constants)
        this.AT_LEAST_ONE(() => this.SUBRULE(this.constDecl))
    })

    private constDecl = this.RULE('constDecl', () => {
        this.CONSUME(tokens.Identifier)
        this.CONSUME(tokens.Equal)
        this.SUBRULE(this.constVal)
    })

    private constVal = this.RULE('constVal', () => {
        this.OR([
            { ALT: () => this.CONSUME(tokens.IntegerVal) },
            { ALT: () => this.CONSUME(tokens.RealVal) },
            { ALT: () => this.CONSUME(tokens.StringVal) },
            { ALT: () => this.CONSUME(tokens.BooleanVal) }
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
            { ALT: () => this.SUBRULE(this.procedureCallStmt) }
        ])
    })

    private readStmt = this.RULE('readStmt', () => {
        this.CONSUME(tokens.Read)
        this.AT_LEAST_ONE_SEP({
            SEP: tokens.Comma,
            DEF: () => this.CONSUME(tokens.Identifier)
        })
    })

    private expression = this.RULE('expression', () => {
        this.SUBRULE2(this.andExpression)
        this.MANY(() => {
            this.CONSUME(tokens.Or)
            this.SUBRULE(this.expression)
        })
    })

    private andExpression = this.RULE('andExpression', () => {
        this.SUBRULE2(this.unaryRelExpression)
        this.MANY(() => {
            this.CONSUME(tokens.And)
            this.SUBRULE(this.andExpression)
        })
    })

    private unaryRelExpression = this.RULE('unaryRelExpression', () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(tokens.Not)
                    this.SUBRULE(this.relExpression)
                }
            },
            { ALT: () => this.SUBRULE2(this.relExpression) }
        ])
    })

    private relExpression = this.RULE('relExpression', () => {
        this.SUBRULE2(this.sumExpression)
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(tokens.Equal) },
                { ALT: () => this.CONSUME(tokens.RelOp) }
            ])
            this.SUBRULE(this.sumExpression)
        })
    })

    private sumExpression = this.RULE('sumExpression', () => {
        this.SUBRULE2(this.term)
        this.MANY(() => {
            // this.CONSUME(tokens.SumOp)
            this.OR([
                { ALT: () => this.CONSUME(tokens.Plus) },
                { ALT: () => this.CONSUME(tokens.Minus) }
            ])
            this.SUBRULE(this.sumExpression)
        })
    })

    private IntOrRange = this.RULE('IntOrRange', () => {
        this.CONSUME(tokens.IntegerVal)
        this.OPTION(() => {
            this.CONSUME(tokens.DbDots)
            this.CONSUME1(tokens.IntegerVal)
        })
    })

    private term = this.RULE('term', () => {
        this.SUBRULE(this.unaryExpression)
        this.MANY(() => {
            this.CONSUME(tokens.MulOp)
            this.SUBRULE(this.term)
        })
    })

    private unaryExpression = this.RULE('unaryExpression', () => {
        this.OR([
            {
                ALT: () => {
                    // this.CONSUME(tokens.UnaryOp)
                    this.CONSUME(tokens.Minus)
                    this.SUBRULE(this.unaryExpression)
                }
            },
            { ALT: () => this.SUBRULE2(this.factor) }
        ])
    })

    private factor = this.RULE('factor', () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.immutable) },
            { ALT: () => this.SUBRULE(this.mutable) }
        ])
    })

    private mutable = this.RULE('mutable', () => {
        this.CONSUME(tokens.Identifier)
        this.OPTION(() => {
            this.CONSUME(tokens.LSquare)
            this.SUBRULE(this.expression)
            this.CONSUME(tokens.RSquare)
        })
    })

    private immutable = this.RULE('immutable', () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME(tokens.LParen)
                    this.SUBRULE(this.expression)
                    this.CONSUME(tokens.RParen)
                }
            },
            {
                ALT: () => {
                    this.CONSUME(tokens.Identifier)
                    this.SUBRULE(this.args)
                }
            },
            { ALT: () => this.CONSUME(tokens.IntegerVal) },
            { ALT: () => this.CONSUME(tokens.RealVal) },
            { ALT: () => this.CONSUME(tokens.StringVal) },
            { ALT: () => this.CONSUME(tokens.BooleanVal) }
        ])
    })

    private assignStmt = this.RULE('assignStmt', () => {
        this.SUBRULE(this.mutable)
        this.CONSUME(tokens.AssignOp)
        this.SUBRULE2(this.expression)
    })

    private writeStmt = this.RULE('writeStmt', () => {
        this.CONSUME(tokens.Write)
        this.AT_LEAST_ONE_SEP({
            SEP: tokens.Comma,
            DEF: () => this.SUBRULE(this.expression)
        })
    })

    private ifStmt = this.RULE('ifStmt', () => {
        this.CONSUME(tokens.If)
        // TODO some way to force conditional
        this.SUBRULE(this.expression)
        this.CONSUME(tokens.Then)
        this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
        this.MANY(() => this.SUBRULE(this.elseIfStmt))
        this.OPTION(() => {
            this.CONSUME(tokens.Else)
            this.AT_LEAST_ONE1(() => this.SUBRULE1(this.statement))
        })
        this.CONSUME(tokens.EndIf)
    })

    private elseIfStmt = this.RULE('elseIfStmt', () => {
        this.CONSUME(tokens.ElseIf)
        this.SUBRULE(this.expression)
        this.CONSUME(tokens.Then)
        this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    })

    private selectStmt = this.RULE('selectStmt', () => {
        this.CONSUME(tokens.Select)
        this.SUBRULE(this.expression)
        this.MANY(() => this.SUBRULE(this.caseStmt))
        this.OPTION(() => {
            this.CONSUME1(tokens.Select)
            this.CONSUME1(tokens.Else)
            this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
        })
        this.CONSUME2(tokens.EndSelect)
    })

    private caseStmt = this.RULE('caseStmt', () => {
        this.CONSUME(tokens.Case)
        this.AT_LEAST_ONE_SEP({
            SEP: tokens.Comma,
            DEF: () => this.SUBRULE(this.IntOrRange)
        })
        this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
    })

    private forStmt = this.RULE('forStmt', () => {
        this.CONSUME(tokens.For)
        this.CONSUME(tokens.Identifier)
        this.CONSUME(tokens.From)
        this.SUBRULE(this.expression)
        this.CONSUME(tokens.Until)
        this.SUBRULE1(this.expression)
        this.OPTION(() => {
            this.CONSUME(tokens.Step)
            this.SUBRULE2(this.expression)
        })
        this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
        this.CONSUME(tokens.EndRepeat)
    })

    private whileStmt = this.RULE('whileStmt', () => {
        this.CONSUME(tokens.While)
        this.SUBRULE(this.expression)
        this.CONSUME(tokens.Repeat)
        this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
        this.CONSUME(tokens.EndRepeat)
    })

    private doUntilStmt = this.RULE('doUntilStmt', () => {
        this.CONSUME(tokens.StartRepeat)
        this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
        this.CONSUME(tokens.DoUntil)
        this.SUBRULE(this.expression)
    })

    private procedure = this.RULE('procedure', () => {
        this.CONSUME(tokens.Procedure)
        this.CONSUME(tokens.Identifier)
        this.SUBRULE(this.parameters)
        this.OPTION(() => {
            this.AT_LEAST_ONE(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.constDeclList) },
                    { ALT: () => this.SUBRULE(this.varDeclaration) }
                ])
            })
        })
        this.SUBRULE(this.procedureBody)
    })

    private func = this.RULE('func', () => {
        this.CONSUME(tokens.Function)
        this.CONSUME(tokens.Identifier)
        this.SUBRULE(this.parameters)
        this.CONSUME(tokens.Colon)
        this.CONSUME(tokens.DeclRetTypeSpecifier)
        this.OPTION(() => {
            this.AT_LEAST_ONE(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.constDeclList) },
                    { ALT: () => this.SUBRULE(this.varDeclaration) }
                ])
            })
        })
        this.SUBRULE(this.funcBody)
    })

    private parameters = this.RULE('parameters', () => {
        this.CONSUME(tokens.LParen)
        this.MANY_SEP({
            SEP: tokens.Comma,
            DEF: () => this.CONSUME(tokens.Identifier)
        })
        this.CONSUME(tokens.RParen)
    })

    private procedureBody = this.RULE('procedureBody', () => {
        this.CONSUME(tokens.Start)
        this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
        this.CONSUME(tokens.EndProcedure)
    })

    private procedureCallStmt = this.RULE('procedureCallStmt', () => {
        this.CONSUME(tokens.Call)
        this.CONSUME(tokens.Identifier)
        this.SUBRULE(this.args)
    })

    private args = this.RULE('args', () => {
        this.CONSUME(tokens.LParen)
        this.MANY_SEP({
            SEP: tokens.Comma,
            DEF: () => this.SUBRULE(this.expression)
        })
        this.CONSUME(tokens.RParen)
    })

    private funcBody = this.RULE('funcBody', () => {
        this.CONSUME(tokens.Start)
        this.AT_LEAST_ONE(() => this.SUBRULE(this.statement))
        this.CONSUME(tokens.EndFunc)
    })

    private stringConcat = this.RULE('stringConcat', () => {
        this.AT_LEAST_ONE_SEP({
            SEP: tokens.Comma,
            DEF: () => {
                this.OR([
                    { ALT: () => this.CONSUME(tokens.StringVal) },
                    { ALT: () => this.CONSUME(tokens.Identifier) }
                ])
            }
        })
    })
}

export default GlossaParser
