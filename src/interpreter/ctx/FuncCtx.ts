import SymbolTable from '../SymbolTable'

export default class FuncCtx {
  public static functionsTable: SymbolTable<FuncCtx>

  public parentCall: FuncCtx | undefined
  public name: string
  public parserCtx: any

  constructor(name: string, parentCall?: FuncCtx) {
    this.name = name
    this.parentCall = parentCall
  }

  execute() {}
}
