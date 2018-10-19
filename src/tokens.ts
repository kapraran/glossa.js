import { createToken, TokenType, Lexer } from 'chevrotain'

export const tokens: { [k: string]: TokenType } = {}

tokens.Comment = createToken({
    name: 'Comment',
    pattern: /\!.*(\r\n|\r|\n)/,
    group: Lexer.SKIPPED
})

tokens.WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: Lexer.SKIPPED
})

tokens.StringVal = createToken({
    name: 'StringVal',
    pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
})

tokens.RealVal = createToken({
    name: 'RealVal',
    pattern: /(0|[1-9]\d*)(\.\d+)([eE][+-]?\d+)?/
})

tokens.IntegerVal = createToken({
    name: 'IntegerVal',
    pattern: /(0|[1-9]\d*)/,
    longer_alt: tokens.RealVal
})

tokens.BooleanVal = createToken({
    name: 'BooleanVal',
    pattern: /ΑΛΗΘΗΣ|ΨΕΥΔΗΣ/
})

// keywords
tokens.Program = createToken({
    name: 'Program',
    pattern: /ΠΡΟΓΡΑΜΜΑ/,
    longer_alt: tokens.Identifier
})

tokens.End = createToken({
    name: 'End',
    pattern: /ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ/,
    longer_alt: tokens.Identifier
})

tokens.Variables = createToken({
    name: 'Variables',
    pattern: /ΜΕΤΑΒΛΗΤΕΣ/,
    longer_alt: tokens.Identifier
})

tokens.DeclTypeSpecifier = createToken({
    name: 'DeclTypeSpecifier',
    pattern: /ΑΚΕΡΑΙΕΣ|ΠΡΑΓΜΑΤΙΚΕΣ|ΧΑΡΑΚΤΗΡΕΣ|ΛΟΓΙΚΕΣ/,
    longer_alt: tokens.Identifier
})

tokens.DeclRetTypeSpecifier = createToken({
    name: 'DeclRetTypeSpecifier',
    pattern: /ΑΚΕΡΑΙΑ|ΠΡΑΓΜΑΤΙΚΗ|ΧΑΡΑΚΤΗΡΑΣ|ΛΟΓΙΚΗ/,
    longer_alt: tokens.Identifier
})

tokens.Constants = createToken({
    name: 'Constants',
    pattern: /ΣΤΑΘΕΡΕΣ/,
    longer_alt: tokens.Identifier
})

tokens.Read = createToken({
    name: 'Read',
    pattern: /ΔΙΑΒΑΣΕ/,
    longer_alt: tokens.Identifier
})

tokens.Write = createToken({
    name: 'Write',
    pattern: /ΓΡΑΨΕ/,
    longer_alt: tokens.Identifier
})

tokens.Not = createToken({
    name: 'Not',
    pattern: /ΟΧΙ/,
    longer_alt: tokens.Identifier
})

tokens.And = createToken({
    name: 'And',
    pattern: /ΚΑΙ/,
    longer_alt: tokens.Identifier
})

tokens.Or = createToken({
    name: 'Or',
    pattern: /Ή/,
    longer_alt: tokens.Identifier
})

tokens.If = createToken({
    name: 'If',
    pattern: /ΑΝ/,
    longer_alt: tokens.Identifier
})

tokens.Then = createToken({
    name: 'Then',
    pattern: /ΤΟΤΕ/,
    longer_alt: tokens.Identifier
})

tokens.ElseIf = createToken({
    name: 'ElseIf',
    pattern: /ΑΛΛΙΩΣ_ΑΝ/,
    longer_alt: tokens.Identifier
})

tokens.Else = createToken({
    name: 'Else',
    pattern: /ΑΛΛΙΩΣ/,
    longer_alt: tokens.Identifier
})

tokens.EndIf = createToken({
    name: 'EndIf',
    pattern: /ΤΕΛΟΣ_ΑΝ/,
    longer_alt: tokens.Identifier
})

tokens.Select = createToken({
    name: 'Select',
    pattern: /ΕΠΙΛΕΞΕ/,
    longer_alt: tokens.Identifier
})

tokens.Case = createToken({
    name: 'Case',
    pattern: /ΠΕΡΙΠΤΩΣΗ/,
    longer_alt: tokens.Identifier
})

tokens.EndSelect = createToken({
    name: 'EndSelect',
    pattern: /ΤΕΛΟΣ_ΕΠΙΛΟΓΩΝ/,
    longer_alt: tokens.Identifier
})

tokens.For = createToken({
    name: 'For',
    pattern: /ΓΙΑ/,
    longer_alt: tokens.Identifier
})

tokens.From = createToken({
    name: 'From',
    pattern: /ΑΠΟ/,
    longer_alt: tokens.Identifier
})

tokens.While = createToken({
    name: 'While',
    pattern: /ΟΣΟ/,
    longer_alt: tokens.Identifier
})

tokens.Repeat = createToken({
    name: 'Repeat',
    pattern: /ΕΠΑΝΑΛΑΒΕ/,
    longer_alt: tokens.Identifier
})

tokens.StartRepeat = createToken({
    name: 'StartRepeat',
    pattern: /ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ/,
    longer_alt: tokens.Identifier
})

tokens.Start = createToken({
    name: 'Start',
    pattern: /ΑΡΧΗ/,
    longer_alt: tokens.StartRepeat
})

tokens.DoUntil = createToken({
    name: 'DoUntil',
    pattern: /ΜΕΧΡΙΣ_ΟΤΟΥ /,
    longer_alt: tokens.Identifier
})

tokens.Until = createToken({
    name: 'Until',
    pattern: /ΜΕΧΡΙ/,
    longer_alt: tokens.DoUntil
})

tokens.EndRepeat = createToken({
    name: 'EndRepeat',
    pattern: /ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ/,
    longer_alt: tokens.Identifier
})

tokens.Step = createToken({
    name: 'Step',
    pattern: /ΜΕ\s+ΒΗΜΑ/,
    longer_alt: tokens.Identifier
})

tokens.Procedure = createToken({
    name: 'Procedure',
    pattern: /ΔΙΑΔΙΚΑΣΙΑ/,
    longer_alt: tokens.Identifier
})

tokens.EndProcedure = createToken({
    name: 'EndProcedure',
    pattern: /ΤΕΛΟΣ_ΔΙΑΔΙΚΑΣΙΑΣ/,
    longer_alt: tokens.Identifier
})

tokens.Function = createToken({
    name: 'Function',
    pattern: /ΣΥΝΑΡΤΗΣΗ/,
    longer_alt: tokens.Identifier
})

tokens.EndFunc = createToken({
    name: 'EndFunc',
    pattern: /ΤΕΛΟΣ_ΣΥΝΑΡΤΗΣΗΣ/,
    longer_alt: tokens.Identifier
})

tokens.Call = createToken({
    name: 'Call',
    pattern: /ΚΑΛΕΣΕ/,
    longer_alt: tokens.Identifier
})

tokens.Colon = createToken({ name: 'Colon', pattern: /:/ })
tokens.Comma = createToken({ name: 'Comma', pattern: /,/ })
tokens.LSquare = createToken({ name: 'LSquare', pattern: /\[/ })
tokens.RSquare = createToken({ name: 'RSquare', pattern: /]/ })
tokens.LParen = createToken({ name: 'LParen', pattern: /\(/ })
tokens.RParen = createToken({ name: 'RParen', pattern: /\)/ })
tokens.Equal = createToken({ name: 'Equal', pattern: /=/ })
tokens.AssignOp = createToken({ name: 'AssignOp', pattern: /<\-\-/ })
tokens.DbDots = createToken({ name: 'DbDots', pattern: /\.\./ })

tokens.RelOp = createToken({
    name: 'RelOp',
    pattern: /(<>|<=|>=|<|>)/
})

// tokens.RelOp = createToken({
//   name: "RelOp",
//   pattern: /(<=|<|>|>=|=|<>)/
// });

// tokens.SumOp = createToken({
//   name: "SumOp",
//   pattern: /(\+|\-)/
// });

tokens.Plus = createToken({
    name: 'Plus',
    pattern: /\+/
})

tokens.Minus = createToken({
    name: 'Minus',
    pattern: /\-/
})

tokens.MulOp = createToken({
    name: 'MulOp',
    pattern: /(\*|\/|DIV|MOD)/,
    longer_alt: tokens.Identifier
})

// tokens.UnaryOp = createToken({
//   name: "UnaryOp",
//   pattern: /\-/
// });

tokens.Identifier = createToken({
    name: 'Identifier',
    pattern: /[a-zA-Z\u0370-\u03ff\u1f00-\u1fff]([a-zA-Z\u0370-\u03ff\u1f00-\u1fff]|\d)*/
})

export const tokenValues = Object.keys(tokens).map(key => tokens[key])
