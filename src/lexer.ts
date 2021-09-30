import { Lexer } from 'chevrotain'
import { tokenList } from './tokens'

export const glossaLexer = new Lexer(tokenList, {
  ensureOptimizations: true,
})
