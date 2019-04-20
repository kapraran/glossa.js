import * as path from 'path'
import * as fs from 'fs'
import GlossaParser from '../parser'
import { createSyntaxDiagramsCode } from 'chevrotain'

const filename = 'generated_diagrams.html'

// extract the serialized grammar
const parserInstance = new GlossaParser()
const serializedGrammar = parserInstance.getSerializedGastProductions()

// create the HTML code
const htmlCode = createSyntaxDiagramsCode(serializedGrammar)

// save the HTML code into a file
const outFilepath = path.resolve(process.cwd(), filename)
fs.writeFileSync(outFilepath, htmlCode)
