import { readFile } from 'fs'
import GlossaParser from './parser'
import { Lexer } from 'chevrotain'
import { tokens, tokenValues } from './tokens'
import { debugTokenizer } from './tools/debug'

const glossaLexer = new Lexer(tokenValues)

readFile(process.argv[2], 'utf8', (err, text) => {
  if (err) throw err

  const parser = new GlossaParser()
  const lexerResult = glossaLexer.tokenize(text)
  debugTokenizer(text, lexerResult, true)

  // "input" is a setter which will reset the parser's state.
  parser.input = lexerResult.tokens

  console.log(parser.script())

  if (parser.errors.length > 0) {
    parser.errors.forEach((err) => {
      console.error('>> error')
      console.error(err.message)
      console.error(err.token)
    })
    throw new Error(parser.errors.toString())
  }
})
