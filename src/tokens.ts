import { createToken, TokenType, Lexer, ITokenConfig } from 'chevrotain'

export const tokenMap: { [k: string]: TokenType } = {}

/**
 *
 *
 */
function _addToken(config: ITokenConfig): void {
  tokenMap[config.name] = createToken(config)
}

_addToken({
  name: 'Comment',
  pattern: /\!.*(\r\n|\r|\n)/,
  group: Lexer.SKIPPED
})

_addToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED
})

_addToken({
  name: 'StringVal',
  pattern: /("(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"|'(:?[^\\'\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*')/
})

_addToken({
  name: 'RealVal',
  pattern: /(0|[1-9]\d*)(\.\d+)([eE][+-]?\d+)?/
})

_addToken({
  name: 'IntegerVal',
  pattern: /(0|[1-9]\d*)/,
  longer_alt: tokenMap.RealVal
})

_addToken({ name: 'BooleanVal', pattern: /ΑΛΗΘΗΣ|ΨΕΥΔΗΣ/ })

// keywords
_addToken({
  name: 'Program',
  pattern: /ΠΡΟΓΡΑΜΜΑ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'End',
  pattern: /ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Variables',
  pattern: /ΜΕΤΑΒΛΗΤΕΣ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'DeclTypeSpecifier',
  pattern: /ΑΚΕΡΑΙΕΣ|ΠΡΑΓΜΑΤΙΚΕΣ|ΧΑΡΑΚΤΗΡΕΣ|ΛΟΓΙΚΕΣ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'DeclRetTypeSpecifier',
  pattern: /ΑΚΕΡΑΙΑ|ΠΡΑΓΜΑΤΙΚΗ|ΧΑΡΑΚΤΗΡΑΣ|ΛΟΓΙΚΗ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Constants',
  pattern: /ΣΤΑΘΕΡΕΣ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Read',
  pattern: /ΔΙΑΒΑΣΕ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Write',
  pattern: /ΓΡΑΨΕ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Not',
  pattern: /ΟΧΙ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'And',
  pattern: /ΚΑΙ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Or',
  pattern: /Ή/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'If',
  pattern: /ΑΝ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Then',
  pattern: /ΤΟΤΕ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'ElseIf',
  pattern: /ΑΛΛΙΩΣ_ΑΝ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Else',
  pattern: /ΑΛΛΙΩΣ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'EndIf',
  pattern: /ΤΕΛΟΣ_ΑΝ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Select',
  pattern: /ΕΠΙΛΕΞΕ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Case',
  pattern: /ΠΕΡΙΠΤΩΣΗ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'EndSelect',
  pattern: /ΤΕΛΟΣ_ΕΠΙΛΟΓΩΝ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'For',
  pattern: /ΓΙΑ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'From',
  pattern: /ΑΠΟ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'While',
  pattern: /ΟΣΟ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Repeat',
  pattern: /ΕΠΑΝΑΛΑΒΕ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'StartRepeat',
  pattern: /ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Start',
  pattern: /ΑΡΧΗ/,
  longer_alt: tokenMap.StartRepeat
})

_addToken({
  name: 'DoUntil',
  pattern: /ΜΕΧΡΙΣ_ΟΤΟΥ /,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Until',
  pattern: /ΜΕΧΡΙ/,
  longer_alt: tokenMap.DoUntil
})

_addToken({
  name: 'EndRepeat',
  pattern: /ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Step',
  pattern: /ΜΕ\s+ΒΗΜΑ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Procedure',
  pattern: /ΔΙΑΔΙΚΑΣΙΑ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'EndProcedure',
  pattern: /ΤΕΛΟΣ_ΔΙΑΔΙΚΑΣΙΑΣ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Function',
  pattern: /ΣΥΝΑΡΤΗΣΗ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'EndFunc',
  pattern: /ΤΕΛΟΣ_ΣΥΝΑΡΤΗΣΗΣ/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Call',
  pattern: /ΚΑΛΕΣΕ/,
  longer_alt: tokenMap.Identifier
})

_addToken({ name: 'Colon', pattern: /:/ })
_addToken({ name: 'Comma', pattern: /,/ })
_addToken({ name: 'LSquare', pattern: /\[/ })
_addToken({ name: 'RSquare', pattern: /]/ })
_addToken({ name: 'LParen', pattern: /\(/ })
_addToken({ name: 'RParen', pattern: /\)/ })
_addToken({ name: 'Equal', pattern: /=/ })
_addToken({ name: 'AssignOp', pattern: /<\-\-/ })
_addToken({ name: 'DbDots', pattern: /\.\./ })

_addToken({
  name: 'RelOp',
  pattern: /(<>|<=|>=|<|>)/
})

_addToken({
  name: 'Plus',
  pattern: /\+/
})

_addToken({
  name: 'Minus',
  pattern: /\-/
})

_addToken({
  name: 'MulOp',
  pattern: /(\*|\/|\^|DIV|MOD)/,
  longer_alt: tokenMap.Identifier
})

_addToken({
  name: 'Identifier',
  pattern: /[_a-zA-Z\u0370-\u03ff\u1f00-\u1fff]([_a-zA-Z\u0370-\u03ff\u1f00-\u1fff]|\d)*/
})

export const tokenList = Object.keys(tokenMap).map((key) => tokenMap[key])
