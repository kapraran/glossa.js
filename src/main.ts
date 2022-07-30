import { promises as fs, writeFileSync } from 'fs'
import GlossaParser from './parser'
import { debugTokenizer } from './tools/debug'
import GlossaInterpreter from './interpreter/interpreter'
import { glossaLexer } from './lexer'

import { program } from 'commander'
import { generateCstDts, Rule } from 'chevrotain'
import { resolve } from 'path'

program
  .version('0.0.1')
  .argument('<file>', 'glossa file to run')
  .option(
    '-d, --debug',
    'create a html file with the contents of the source file, tokenized visually'
  )
  .action(async (file, options) => {
    // read file contents
    let contents
    try {
      contents = await fs.readFile(file, 'utf-8')
    } catch (err) {
      console.error(err)
      process.exit(1)
    }

    const lexerResult = glossaLexer.tokenize(contents)
    const parser = new GlossaParser(lexerResult.tokens)

    if (options.debug) debugTokenizer(contents, lexerResult, true)

    // // "input" is a setter which will reset the parser's state.
    // parser.input = lexerResult.tokens

    const cst = parser.script()

    if (parser.errors.length > 0) {
      parser.errors.forEach((err) =>
        console.error(`ERROR: ${err.message}\n${JSON.stringify(err.token)}`)
      )

      throw new Error(parser.errors.toString())
    }

    // const productions: Record<string, Rule> = parser.getGAstProductions()
    // const dtsString = generateCstDts(productions)
    // const dtsPath = resolve(__dirname, '..', 'json_cst.d.ts')
    // writeFileSync(dtsPath, dtsString)

    const interpreter = new GlossaInterpreter()
    interpreter.visit(cst)
  })

program.parse(process.argv)
