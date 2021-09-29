import { createToken, TokenType, Lexer, ITokenConfig } from 'chevrotain'
import { TokenName } from './TokenName'

export const tokenMap: Record<string, TokenType> = {}

/**
 *
 *
 */
function _addToken(config: ITokenConfig): void {
  tokenMap[config.name] = createToken(config)
}

_addToken({
  name: TokenName.Comment,
  pattern: /\!.*(\r\n|\r|\n)/,
  group: Lexer.SKIPPED,
})

_addToken({
  name: TokenName.WhiteSpace,
  pattern: /\s+/,
  group: Lexer.SKIPPED,
})

_addToken({
  name: TokenName.StringVal,
  pattern:
    /("(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"|'(:?[^\\'\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*')/,
})

_addToken({
  name: TokenName.RealVal,
  pattern: /(0|[1-9]\d*)(\.\d+)([eE][+-]?\d+)?/,
})

_addToken({
  name: TokenName.IntegerVal,
  pattern: /(0|[1-9]\d*)/,
  longer_alt: tokenMap.RealVal,
})

_addToken({ name: TokenName.BooleanVal, pattern: /ΑΛΗΘΗΣ|ΨΕΥΔΗΣ/ })

// keywords
_addToken({
  name: TokenName.Program,
  pattern: /ΠΡΟΓΡΑΜΜΑ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.End,
  pattern: /ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Variables,
  pattern: /ΜΕΤΑΒΛΗΤΕΣ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.DeclTypeSpecifier,
  pattern: /ΑΚΕΡΑΙΕΣ|ΠΡΑΓΜΑΤΙΚΕΣ|ΧΑΡΑΚΤΗΡΕΣ|ΛΟΓΙΚΕΣ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.DeclRetTypeSpecifier,
  pattern: /ΑΚΕΡΑΙΑ|ΠΡΑΓΜΑΤΙΚΗ|ΧΑΡΑΚΤΗΡΑΣ|ΛΟΓΙΚΗ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Constants,
  pattern: /ΣΤΑΘΕΡΕΣ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Read,
  pattern: /ΔΙΑΒΑΣΕ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Write,
  pattern: /ΓΡΑΨΕ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Not,
  pattern: /ΟΧΙ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.And,
  pattern: /ΚΑΙ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Or,
  pattern: /Ή/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.If,
  pattern: /ΑΝ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Then,
  pattern: /ΤΟΤΕ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.ElseIf,
  pattern: /ΑΛΛΙΩΣ_ΑΝ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Else,
  pattern: /ΑΛΛΙΩΣ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.EndIf,
  pattern: /ΤΕΛΟΣ_ΑΝ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Select,
  pattern: /ΕΠΙΛΕΞΕ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Case,
  pattern: /ΠΕΡΙΠΤΩΣΗ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.EndSelect,
  pattern: /ΤΕΛΟΣ_ΕΠΙΛΟΓΩΝ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.For,
  pattern: /ΓΙΑ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.From,
  pattern: /ΑΠΟ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.While,
  pattern: /ΟΣΟ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Repeat,
  pattern: /ΕΠΑΝΑΛΑΒΕ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.StartRepeat,
  pattern: /ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Start,
  pattern: /ΑΡΧΗ/,
  longer_alt: tokenMap.StartRepeat,
})

_addToken({
  name: TokenName.DoUntil,
  pattern: /ΜΕΧΡΙΣ_ΟΤΟΥ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Until,
  pattern: /ΜΕΧΡΙ/,
  longer_alt: tokenMap.DoUntil,
})

_addToken({
  name: TokenName.EndRepeat,
  pattern: /ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Step,
  pattern: /ΜΕ\s+ΒΗΜΑ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Procedure,
  pattern: /ΔΙΑΔΙΚΑΣΙΑ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.EndProcedure,
  pattern: /ΤΕΛΟΣ_ΔΙΑΔΙΚΑΣΙΑΣ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Function,
  pattern: /ΣΥΝΑΡΤΗΣΗ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.EndFunc,
  pattern: /ΤΕΛΟΣ_ΣΥΝΑΡΤΗΣΗΣ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Call,
  pattern: /ΚΑΛΕΣΕ/,
  longer_alt: tokenMap.Identifier,
})

_addToken({ name: TokenName.Colon, pattern: /:/ })
_addToken({ name: TokenName.Comma, pattern: /,/ })
_addToken({ name: TokenName.LSquare, pattern: /\[/ })
_addToken({ name: TokenName.RSquare, pattern: /]/ })
_addToken({ name: TokenName.LParen, pattern: /\(/ })
_addToken({ name: TokenName.RParen, pattern: /\)/ })
_addToken({ name: TokenName.Equal, pattern: /=/ })
_addToken({ name: TokenName.AssignOp, pattern: /<\-\-/ })
_addToken({ name: TokenName.DbDots, pattern: /\.\./ })

_addToken({
  name: TokenName.RelOp,
  pattern: /(<>|<=|>=|<|>)/,
})

_addToken({
  name: TokenName.Plus,
  pattern: /\+/,
})

_addToken({
  name: TokenName.Minus,
  pattern: /\-/,
})

_addToken({
  name: TokenName.MulOp,
  pattern: /(\*|\/|\^|DIV|MOD)/,
  longer_alt: tokenMap.Identifier,
})

_addToken({
  name: TokenName.Identifier,
  pattern:
    /[_a-zA-Z\u0370-\u03ff\u1f00-\u1fff]([_a-zA-Z\u0370-\u03ff\u1f00-\u1fff]|\d)*/,
})

export const tokenList = Object.keys(tokenMap).map((key) => tokenMap[key])
