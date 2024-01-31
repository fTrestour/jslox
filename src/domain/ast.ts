export abstract class AstNode<T> {
  constructor(public type: string, public token: T) {}
}

export class Program<T> extends AstNode<T> {
  constructor(token: T, public declarations: Declaration<T>[]) {
    super("PROGRAM", token);
  }
}

export abstract class Declaration<T> extends AstNode<T> {}

export class ClassDeclaration<T> extends Declaration<T> {
  constructor(
    token: T,
    public name: T,
    public inheritance: T | null,
    public fns: Function<T>[]
  ) {
    super("CLASS_DECLARATION", token);
  }
}

export class Function<T> extends AstNode<T> {
  constructor(
    token: T,
    public name: T,
    public parameters: Parameter<T>[],
    public body: Block<T>
  ) {
    super("FUNCTION", token);
  }
}

export class Parameter<T> extends AstNode<T> {
  constructor(token: T) {
    super("PARAMETER", token);
  }
}

export class FunctionDeclaration<T> extends Declaration<T> {
  constructor(token: T, public fn: Function<T>) {
    super("FUNCTION_DECLARATION", token);
  }
}

export class VariableDeclaration<T> extends Declaration<T> {
  constructor(
    token: T,
    public identifier: T,
    public expression: Expression<T> | null
  ) {
    super("VARIABLE_DECLARATION", token);
  }
}

export abstract class Statement<T> extends AstNode<T> {}

export class ExpressionStatement<T> extends Statement<T> {
  constructor(token: T, public expression: Expression<T>) {
    super("EXPRESSION_STATEMENT", token);
  }
}

export class WhileStatement<T> extends Statement<T> {
  constructor(
    token: T,
    public condition: Expression<T>,
    public body: Statement<T>
  ) {
    super("WHILE_STATEMENT", token);
  }
}

export class IfStatement<T> extends Statement<T> {
  constructor(
    token: T,
    public condition: Expression<T>,
    public thenBody: Statement<T>,
    public elseBody: Statement<T> | null
  ) {
    super("IF_STATEMENT", token);
  }
}

export class PrintStatement<T> extends Statement<T> {
  constructor(token: T, public expression: Expression<T>) {
    super("PRINT_STATEMENT", token);
  }
}

export class ReturnStatement<T> extends Statement<T> {
  constructor(token: T, public expression: Expression<T> | null) {
    super("RETURN_STATEMENT", token);
  }
}

export class Block<T> extends Statement<T> {
  constructor(token: T, public declarations: Declaration<T>[]) {
    super("BLOCK", token);
  }
}

export class Expression<T> extends AstNode<T> {}

export class Literal<T> extends Expression<T> {
  constructor(token: T, public value: string | number | boolean | null) {
    super("LITERAL", token);
  }
}

export class Assignment<T> extends Expression<T> {
  constructor(
    token: T,
    public identifier: T,
    public assignment: Expression<T>,
    public call: Expression<T> | null
  ) {
    super("ASSIGNMENT", token);
  }
}

export class Call<T> extends Expression<T> {
  constructor(
    public token: T,
    public name: Primary<T>,
    public args: Argument<T>[]
  ) {
    super("CALL", token);
  }
}

export class Access<T> extends Expression<T> {
  constructor(token: T, public name: Primary<T>, public identifier: T) {
    super("ACCESS", token);
  }
}

export class Argument<T> extends AstNode<T> {
  constructor(token: T, public arg: Expression<T>) {
    super("ARGUMENT", token);
  }
}

export class BinaryOperator<T> extends Expression<T> {
  constructor(
    type: string,
    token: T,
    public left: Expression<T>,
    public right: Expression<T>
  ) {
    super(type, token);
  }
}

export class UnaryOperator<T> extends Expression<T> {
  constructor(type: string, token: T, public operand: Expression<T>) {
    super(type, token);
  }
}

export class Primary<T> extends Expression<T> {
  public value!: T;
  constructor(type: string, token: T) {
    super(type, token);
    this.value = token;
  }
}

export class Boolean<T> extends Primary<T> {
  constructor(token: T) {
    super("BOOLEAN", token);
  }
}

export class Number<T> extends Primary<T> {
  constructor(token: T) {
    super("NUMBER", token);
  }
}

export class String<T> extends Primary<T> {
  constructor(token: T) {
    super("STRING", token);
  }
}

export class Identifier<T> extends Primary<T> {
  constructor(token: T) {
    super("IDENTIFIER", token);
  }
}

export class Nil<T> extends Primary<T> {
  constructor(token: T) {
    super("NIL", token);
  }
}

export class This<T> extends Primary<T> {
  constructor(token: T) {
    super("THIS", token);
  }
}

export class Super<T> extends Primary<T> {
  constructor(token: T, value: T) {
    super("SUPER", token);
    this.value = value;
  }
}
