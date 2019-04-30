import { resolve } from 'path'
import { writeFileSync } from 'fs'
import { createSyntaxDiagramsCode } from 'chevrotain'
import GlossaParser from '../parser'

const filename = 'generated-diagrams.html'

// extract the serialized grammar
const parserInstance = new GlossaParser()
const serializedGrammar = parserInstance.getSerializedGastProductions()

// create the HTML code
const htmlCode = createSyntaxDiagramsCode(serializedGrammar)

// save the HTML code into a file
const outFilepath = resolve(process.cwd(), filename)
writeFileSync(outFilepath, htmlCode)
