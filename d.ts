import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface ScriptCstNode extends CstNode {
  name: "script";
  children: ScriptCstChildren;
}

export type ScriptCstChildren = {
  program: ProgramCstNode[];
  procedure?: ProcedureCstNode[];
  func?: FuncCstNode[];
};

export interface ProgramCstNode extends CstNode {
  name: "program";
  children: ProgramCstChildren;
}

export type ProgramCstChildren = {
  Program: IToken[];
  Identifier: IToken[];
  constDeclList?: ConstDeclListCstNode[];
  varDeclaration?: VarDeclarationCstNode[];
  programBody: ProgramBodyCstNode[];
};

export interface ProgramBodyCstNode extends CstNode {
  name: "programBody";
  children: ProgramBodyCstChildren;
}

export type ProgramBodyCstChildren = {
  Start: IToken[];
  statement: StatementCstNode[];
  End: IToken[];
  Identifier: IToken[];
};

export interface VarDeclarationCstNode extends CstNode {
  name: "varDeclaration";
  children: VarDeclarationCstChildren;
}

export type VarDeclarationCstChildren = {
  Variables: IToken[];
  typedVarDeclList: TypedVarDeclListCstNode[];
};

export interface TypedVarDeclListCstNode extends CstNode {
  name: "typedVarDeclList";
  children: TypedVarDeclListCstChildren;
}

export type TypedVarDeclListCstChildren = {
  DeclTypeSpecifier: IToken[];
  Colon: IToken[];
  value: ValueCstNode[];
  Comma?: IToken[];
};

export interface ValueCstNode extends CstNode {
  name: "value";
  children: ValueCstChildren;
}

export type ValueCstChildren = {
  Identifier: (IToken)[];
  LSquare?: IToken[];
  IntegerVal?: IToken[];
  RSquare?: IToken[];
};

export interface ConstDeclListCstNode extends CstNode {
  name: "constDeclList";
  children: ConstDeclListCstChildren;
}

export type ConstDeclListCstChildren = {
  Constants: IToken[];
  constDecl: ConstDeclCstNode[];
};

export interface ConstDeclCstNode extends CstNode {
  name: "constDecl";
  children: ConstDeclCstChildren;
}

export type ConstDeclCstChildren = {
  Identifier: IToken[];
  Equal: IToken[];
  constVal: ConstValCstNode[];
};

export interface ConstValCstNode extends CstNode {
  name: "constVal";
  children: ConstValCstChildren;
}

export type ConstValCstChildren = {
  IntegerVal?: IToken[];
  RealVal?: IToken[];
  StringVal?: IToken[];
  BooleanVal?: IToken[];
};

export interface StatementCstNode extends CstNode {
  name: "statement";
  children: StatementCstChildren;
}

export type StatementCstChildren = {
  readStmt?: ReadStmtCstNode[];
  writeStmt?: WriteStmtCstNode[];
  assignStmt?: AssignStmtCstNode[];
  ifStmt?: IfStmtCstNode[];
  selectStmt?: SelectStmtCstNode[];
  forStmt?: ForStmtCstNode[];
  whileStmt?: WhileStmtCstNode[];
  doUntilStmt?: DoUntilStmtCstNode[];
  procedureCallStmt?: ProcedureCallStmtCstNode[];
};

export interface ReadStmtCstNode extends CstNode {
  name: "readStmt";
  children: ReadStmtCstChildren;
}

export type ReadStmtCstChildren = {
  Read: IToken[];
  mutable: MutableCstNode[];
  Comma?: IToken[];
};

export interface ExpressionCstNode extends CstNode {
  name: "expression";
  children: ExpressionCstChildren;
}

export type ExpressionCstChildren = {
  andExpression: AndExpressionCstNode[];
  Or?: IToken[];
  expression?: ExpressionCstNode[];
};

export interface AndExpressionCstNode extends CstNode {
  name: "andExpression";
  children: AndExpressionCstChildren;
}

export type AndExpressionCstChildren = {
  unaryRelExpression: UnaryRelExpressionCstNode[];
  And?: IToken[];
  andExpression?: AndExpressionCstNode[];
};

export interface UnaryRelExpressionCstNode extends CstNode {
  name: "unaryRelExpression";
  children: UnaryRelExpressionCstChildren;
}

export type UnaryRelExpressionCstChildren = {
  Not?: IToken[];
  relExpression?: (RelExpressionCstNode)[];
};

export interface RelExpressionCstNode extends CstNode {
  name: "relExpression";
  children: RelExpressionCstChildren;
}

export type RelExpressionCstChildren = {
  sumExpression: (SumExpressionCstNode)[];
  Equal?: IToken[];
  RelOp?: IToken[];
};

export interface SumExpressionCstNode extends CstNode {
  name: "sumExpression";
  children: SumExpressionCstChildren;
}

export type SumExpressionCstChildren = {
  term: TermCstNode[];
  Plus?: IToken[];
  Minus?: IToken[];
  sumExpression?: SumExpressionCstNode[];
};

export interface IntOrRangeCstNode extends CstNode {
  name: "intOrRange";
  children: IntOrRangeCstChildren;
}

export type IntOrRangeCstChildren = {
  IntegerVal: (IToken)[];
  DbDots?: IToken[];
};

export interface TermCstNode extends CstNode {
  name: "term";
  children: TermCstChildren;
}

export type TermCstChildren = {
  unaryExpression: UnaryExpressionCstNode[];
  MulOp?: IToken[];
  term?: TermCstNode[];
};

export interface UnaryExpressionCstNode extends CstNode {
  name: "unaryExpression";
  children: UnaryExpressionCstChildren;
}

export type UnaryExpressionCstChildren = {
  Minus?: IToken[];
  unaryExpression?: UnaryExpressionCstNode[];
  factor?: FactorCstNode[];
};

export interface FactorCstNode extends CstNode {
  name: "factor";
  children: FactorCstChildren;
}

export type FactorCstChildren = {
  immutable?: ImmutableCstNode[];
  mutable?: MutableCstNode[];
};

export interface MutableCstNode extends CstNode {
  name: "mutable";
  children: MutableCstChildren;
}

export type MutableCstChildren = {
  Identifier: IToken[];
  LSquare?: IToken[];
  expression?: ExpressionCstNode[];
  RSquare?: IToken[];
};

export interface ImmutableCstNode extends CstNode {
  name: "immutable";
  children: ImmutableCstChildren;
}

export type ImmutableCstChildren = {
  LParen?: IToken[];
  expression?: ExpressionCstNode[];
  RParen?: IToken[];
  funcCall?: FuncCallCstNode[];
  IntegerVal?: IToken[];
  RealVal?: IToken[];
  StringVal?: IToken[];
  BooleanVal?: IToken[];
};

export interface FuncCallCstNode extends CstNode {
  name: "funcCall";
  children: FuncCallCstChildren;
}

export type FuncCallCstChildren = {
  Identifier: IToken[];
  args: ArgsCstNode[];
};

export interface AssignStmtCstNode extends CstNode {
  name: "assignStmt";
  children: AssignStmtCstChildren;
}

export type AssignStmtCstChildren = {
  mutable: MutableCstNode[];
  AssignOp: IToken[];
  expression: ExpressionCstNode[];
};

export interface WriteStmtCstNode extends CstNode {
  name: "writeStmt";
  children: WriteStmtCstChildren;
}

export type WriteStmtCstChildren = {
  Write: IToken[];
  expression: ExpressionCstNode[];
  Comma?: IToken[];
};

export interface IfStmtCstNode extends CstNode {
  name: "ifStmt";
  children: IfStmtCstChildren;
}

export type IfStmtCstChildren = {
  If: IToken[];
  expression: ExpressionCstNode[];
  Then: IToken[];
  statement: StatementCstNode[];
  elseIfStmt?: ElseIfStmtCstNode[];
  elseStmt?: ElseStmtCstNode[];
  EndIf: IToken[];
};

export interface ElseStmtCstNode extends CstNode {
  name: "elseStmt";
  children: ElseStmtCstChildren;
}

export type ElseStmtCstChildren = {
  Else: IToken[];
  statement: StatementCstNode[];
};

export interface ElseIfStmtCstNode extends CstNode {
  name: "elseIfStmt";
  children: ElseIfStmtCstChildren;
}

export type ElseIfStmtCstChildren = {
  ElseIf: IToken[];
  expression: ExpressionCstNode[];
  Then: IToken[];
  statement: StatementCstNode[];
};

export interface SelectStmtCstNode extends CstNode {
  name: "selectStmt";
  children: SelectStmtCstChildren;
}

export type SelectStmtCstChildren = {
  Select: (IToken)[];
  expression: ExpressionCstNode[];
  caseStmt?: CaseStmtCstNode[];
  Else?: IToken[];
  statement?: StatementCstNode[];
  EndSelect: IToken[];
};

export interface CaseStmtCstNode extends CstNode {
  name: "caseStmt";
  children: CaseStmtCstChildren;
}

export type CaseStmtCstChildren = {
  Case: IToken[];
  intOrRange: IntOrRangeCstNode[];
  Comma?: IToken[];
  statement: StatementCstNode[];
};

export interface ForStmtCstNode extends CstNode {
  name: "forStmt";
  children: ForStmtCstChildren;
}

export type ForStmtCstChildren = {
  For: IToken[];
  Identifier: IToken[];
  From: IToken[];
  expression: (ExpressionCstNode)[];
  Until: IToken[];
  Step?: IToken[];
  statement: StatementCstNode[];
  EndRepeat: IToken[];
};

export interface WhileStmtCstNode extends CstNode {
  name: "whileStmt";
  children: WhileStmtCstChildren;
}

export type WhileStmtCstChildren = {
  While: IToken[];
  expression: ExpressionCstNode[];
  Repeat: IToken[];
  statement: StatementCstNode[];
  EndRepeat: IToken[];
};

export interface DoUntilStmtCstNode extends CstNode {
  name: "doUntilStmt";
  children: DoUntilStmtCstChildren;
}

export type DoUntilStmtCstChildren = {
  StartRepeat: IToken[];
  statement: StatementCstNode[];
  DoUntil: IToken[];
  expression: ExpressionCstNode[];
};

export interface ProcedureCstNode extends CstNode {
  name: "procedure";
  children: ProcedureCstChildren;
}

export type ProcedureCstChildren = {
  Procedure: IToken[];
  Identifier: IToken[];
  parameters: ParametersCstNode[];
  constDeclList?: ConstDeclListCstNode[];
  varDeclaration?: VarDeclarationCstNode[];
  procedureBody: ProcedureBodyCstNode[];
};

export interface FuncCstNode extends CstNode {
  name: "func";
  children: FuncCstChildren;
}

export type FuncCstChildren = {
  Function: IToken[];
  Identifier: IToken[];
  parameters: ParametersCstNode[];
  Colon: IToken[];
  DeclRetTypeSpecifier: IToken[];
  constDeclList?: ConstDeclListCstNode[];
  varDeclaration?: VarDeclarationCstNode[];
  funcBody: FuncBodyCstNode[];
};

export interface ParametersCstNode extends CstNode {
  name: "parameters";
  children: ParametersCstChildren;
}

export type ParametersCstChildren = {
  LParen: IToken[];
  Identifier?: IToken[];
  Comma?: IToken[];
  RParen: IToken[];
};

export interface ProcedureBodyCstNode extends CstNode {
  name: "procedureBody";
  children: ProcedureBodyCstChildren;
}

export type ProcedureBodyCstChildren = {
  Start: IToken[];
  statement: StatementCstNode[];
  EndProcedure: IToken[];
};

export interface ProcedureCallStmtCstNode extends CstNode {
  name: "procedureCallStmt";
  children: ProcedureCallStmtCstChildren;
}

export type ProcedureCallStmtCstChildren = {
  Call: IToken[];
  Identifier: IToken[];
  args: ArgsCstNode[];
};

export interface ArgsCstNode extends CstNode {
  name: "args";
  children: ArgsCstChildren;
}

export type ArgsCstChildren = {
  LParen: IToken[];
  expression?: ExpressionCstNode[];
  Comma?: IToken[];
  RParen: IToken[];
};

export interface FuncBodyCstNode extends CstNode {
  name: "funcBody";
  children: FuncBodyCstChildren;
}

export type FuncBodyCstChildren = {
  Start: IToken[];
  statement: StatementCstNode[];
  EndFunc: IToken[];
};

export interface StringConcatCstNode extends CstNode {
  name: "stringConcat";
  children: StringConcatCstChildren;
}

export type StringConcatCstChildren = {
  StringVal?: IToken[];
  Identifier?: IToken[];
  Comma?: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  script(children: ScriptCstChildren, param?: IN): OUT;
  program(children: ProgramCstChildren, param?: IN): OUT;
  programBody(children: ProgramBodyCstChildren, param?: IN): OUT;
  varDeclaration(children: VarDeclarationCstChildren, param?: IN): OUT;
  typedVarDeclList(children: TypedVarDeclListCstChildren, param?: IN): OUT;
  value(children: ValueCstChildren, param?: IN): OUT;
  constDeclList(children: ConstDeclListCstChildren, param?: IN): OUT;
  constDecl(children: ConstDeclCstChildren, param?: IN): OUT;
  constVal(children: ConstValCstChildren, param?: IN): OUT;
  statement(children: StatementCstChildren, param?: IN): OUT;
  readStmt(children: ReadStmtCstChildren, param?: IN): OUT;
  expression(children: ExpressionCstChildren, param?: IN): OUT;
  andExpression(children: AndExpressionCstChildren, param?: IN): OUT;
  unaryRelExpression(children: UnaryRelExpressionCstChildren, param?: IN): OUT;
  relExpression(children: RelExpressionCstChildren, param?: IN): OUT;
  sumExpression(children: SumExpressionCstChildren, param?: IN): OUT;
  intOrRange(children: IntOrRangeCstChildren, param?: IN): OUT;
  term(children: TermCstChildren, param?: IN): OUT;
  unaryExpression(children: UnaryExpressionCstChildren, param?: IN): OUT;
  factor(children: FactorCstChildren, param?: IN): OUT;
  mutable(children: MutableCstChildren, param?: IN): OUT;
  immutable(children: ImmutableCstChildren, param?: IN): OUT;
  funcCall(children: FuncCallCstChildren, param?: IN): OUT;
  assignStmt(children: AssignStmtCstChildren, param?: IN): OUT;
  writeStmt(children: WriteStmtCstChildren, param?: IN): OUT;
  ifStmt(children: IfStmtCstChildren, param?: IN): OUT;
  elseStmt(children: ElseStmtCstChildren, param?: IN): OUT;
  elseIfStmt(children: ElseIfStmtCstChildren, param?: IN): OUT;
  selectStmt(children: SelectStmtCstChildren, param?: IN): OUT;
  caseStmt(children: CaseStmtCstChildren, param?: IN): OUT;
  forStmt(children: ForStmtCstChildren, param?: IN): OUT;
  whileStmt(children: WhileStmtCstChildren, param?: IN): OUT;
  doUntilStmt(children: DoUntilStmtCstChildren, param?: IN): OUT;
  procedure(children: ProcedureCstChildren, param?: IN): OUT;
  func(children: FuncCstChildren, param?: IN): OUT;
  parameters(children: ParametersCstChildren, param?: IN): OUT;
  procedureBody(children: ProcedureBodyCstChildren, param?: IN): OUT;
  procedureCallStmt(children: ProcedureCallStmtCstChildren, param?: IN): OUT;
  args(children: ArgsCstChildren, param?: IN): OUT;
  funcBody(children: FuncBodyCstChildren, param?: IN): OUT;
  stringConcat(children: StringConcatCstChildren, param?: IN): OUT;
}
