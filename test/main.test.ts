import GlossaParser from '../src/parser'

describe('Parser', function() {
    it('should parse example1.glossa with no errors', done => {
        const parser = GlossaParser.createFromFile('./test/glossa/example1.glossa')
        const cst = parser.script()

        if (parser.errors.length > 0)
            throw new Error(parser.errors.toString())

        done()
    })

    it('should parse example2.glossa with no errors', done => {
        const parser = GlossaParser.createFromFile('./test/glossa/example2.glossa')
        const cst = parser.script()

        if (parser.errors.length > 0)
            throw new Error(parser.errors.toString())

        done()
    })

    it('should parse example3.glossa with no errors', done => {
        const parser = GlossaParser.createFromFile('./test/glossa/example3.glossa')
        const cst = parser.script()

        if (parser.errors.length > 0)
            throw new Error(parser.errors.toString())

        done()
    })
});
