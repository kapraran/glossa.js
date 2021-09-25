import { writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { ILexingResult } from 'chevrotain'

export const debugTokenizer = function (
  text: string,
  lexerResult: ILexingResult,
  toHTML: boolean = false
) {
  let htmlContents = ''
  let lines = 0
  let currentOffset = 0

  for (let token of lexerResult.tokens) {
    // console.log(token)

    if (toHTML) {
      if (token.startOffset > currentOffset)
        htmlContents += text.substr(
          currentOffset,
          token.startOffset - currentOffset
        )

      htmlContents += `<strong class="token-id-${token.tokenTypeIdx}">${token.image}</strong>`
      currentOffset =
        (token.endOffset || token.startOffset + token.image.length) + 1
      lines = token.endLine || lines
    }
  }

  if (toHTML) {
    const htmlTemplate = readFileSync(
      resolve(__dirname, '../../assets/tokenizer-template.html'),
      'utf8'
    )
    const editedHtml = htmlTemplate
      .replace('$HTML_CONTENTS', htmlContents)
      .replace('$LINES', lines.toString())

    writeFileSync(
      resolve(process.cwd(), 'tokenized-source.html'),
      editedHtml,
      'utf8'
    )
  }
}
