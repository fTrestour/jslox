import {
  Program,
  type AstNode,
  Expression,
  Assignment,
  Declaration,
  ClassDeclaration,
  Function,
  Parameter,
  FunctionDeclaration,
  Block,
  VariableDeclaration,
  Statement,
  ExpressionStatement,
  WhileStatement,
  Boolean,
  Literal,
  IfStatement,
  PrintStatement,
  Number,
  String,
  ReturnStatement,
  Call,
  Primary,
  BinaryOperator,
  UnaryOperator,
  Argument,
  Access,
  Nil,
  This,
  Identifier,
  Super,
} from "./ast";
import type { Token } from "./tokenize";

export function parse<T extends Token = Token>(tokens: T[]) {
  const { ast } = parseProgram(tokens);
  return ast!;
}

export type Ast<T extends Token = Token> = {
  type: string;
  token: T;
  [key: string]: any;
};

type ParseFunctionResult<T extends Token = Token> = {
  ast: AstNode<T> | null;
  rest: Token[];
};

type NewParsingFunctionResult<T extends Token, N extends AstNode<T>> = {
  ast: N | null;
  rest: T[];
};

// program        → declaration* EOF ;
function parseProgram<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Program<T>> {
  const { declarations, rest } = parseDeclarations(tokens);

  if (rest[0].type !== "EOF") throw new Error("Expected EOF");

  return {
    ast: new Program(tokens[0], declarations),
    rest,
  };
}

function parseDeclarations<T extends Token>(tokens: T[]) {
  let rest = tokens;

  let declarations = new Array<Declaration<T>>();
  while (true) {
    const { ast: newAst, rest: newRest } = parseDeclaration(rest);

    if (newAst === null) {
      break;
    }

    declarations.push(newAst);
    rest = newRest;
  }

  return { declarations, rest };
}

// declaration    → classDecl
//                | funDecl
//                | varDecl
//                | statement ;
function parseDeclaration<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Declaration<T>> {
  const classAst = parseClassDeclaration(tokens);
  if (classAst.ast !== null) {
    return classAst;
  }

  const functionAst = parseFunctionDeclaration(tokens);
  if (functionAst.ast !== null) {
    return functionAst;
  }

  const variableAst = parseVariableDeclaration(tokens);
  if (variableAst.ast !== null) {
    return variableAst;
  }

  return parseStatement(tokens);
}

// classDecl      → "class" IDENTIFIER ( "<" IDENTIFIER )?
//                  "{" function* "}" ;
function parseClassDeclaration<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, ClassDeclaration<T>> {
  let [classToken, name, ...rest] = tokens;

  if (classToken.type !== "CLASS") {
    return { ast: null, rest: tokens };
  }

  let inheritance: T | null = null;
  if (rest[0].type === "LESS" && rest[1].type === "IDENTIFIER") {
    inheritance = rest[1];
    rest = rest.slice(2);
  }

  if (rest[0].type !== "LEFT_BRACE") {
    throw new Error("Expected left brace");
  }

  rest = rest.slice(1);
  let functions = new Array<Function<T>>();
  while (rest[0].type !== "RIGHT_BRACE") {
    const { ast: newAst, rest: newRest } = parseFunction(rest);

    if (newAst !== null) {
      functions.push(newAst);
    }

    rest = newRest;
  }
  rest = rest.slice(1);

  return {
    ast: new ClassDeclaration(classToken, name, inheritance, functions),
    rest,
  };
}

// funDecl        → "fun" function ;
function parseFunctionDeclaration<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, FunctionDeclaration<T>> {
  if (tokens[0].type !== "FUN") {
    return { ast: null, rest: tokens };
  }

  const { ast: functionAst, rest } = parseFunction(tokens.slice(1));

  if (functionAst === null) {
    throw new Error("Expected function declaration");
  }

  return {
    ast: new FunctionDeclaration(tokens[0], functionAst),
    rest,
  };
}

// varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;
function parseVariableDeclaration<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, VariableDeclaration<T>> {
  let [varToken, identifier, ...rest] = tokens;

  if (varToken.type !== "VAR") {
    return { ast: null, rest: tokens };
  }

  let expression: Expression<T> | null = null;
  if (rest[0].type === "EQUAL") {
    const { ast: newAst, rest: newRest } = parseExpression(rest.slice(1));
    if (newAst === null) {
      throw new Error("Expected expression");
    }

    rest = newRest;
    expression = newAst;
  }

  if (rest[0].type !== "SEMICOLON") {
    throw new Error("Expected semicolon");
  }
  rest = rest.slice(1);

  return {
    ast: new VariableDeclaration(varToken, identifier, expression),
    rest,
  };
}

// statement      → exprStmt
//                | forStmt
//                | ifStmt
//                | printStmt
//                | returnStmt
//                | whileStmt
//                | block ;
function parseStatement<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Statement<T>> {
  const expressionAst = parseExpressionStatement(tokens);
  if (expressionAst.ast !== null) {
    return expressionAst;
  }

  const forStmtAst = parseForStatement(tokens);
  if (forStmtAst.ast !== null) {
    return forStmtAst;
  }

  const ifStmtAst = parseIfStatement(tokens);
  if (ifStmtAst.ast !== null) {
    return ifStmtAst;
  }

  const printStmtAst = parsePrintStatement(tokens);
  if (printStmtAst.ast !== null) {
    return printStmtAst;
  }

  const returnStmtAst = parseReturnStatement(tokens);
  if (returnStmtAst.ast !== null) {
    return returnStmtAst;
  }

  const whileStmtAst = parseWhileStatement(tokens);
  if (whileStmtAst.ast !== null) {
    return whileStmtAst;
  }

  return parseBlock(tokens);
}

// exprStmt       → expression ";" ;
function parseExpressionStatement<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, ExpressionStatement<T>> {
  const { ast: expression, rest } = parseExpression(tokens);

  if (expression === null) {
    return { ast: null, rest: tokens };
  }

  if (rest[0].type !== "SEMICOLON") {
    throw new Error("Expected semicolon");
  }

  return {
    ast: new ExpressionStatement(tokens[0], expression),
    rest: rest.slice(1),
  };
}

// forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
//                            expression? ";"
//                            expression? ")" statement ;
function parseForStatement<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Block<T>> {
  let [forToken, leftParen, ...rest] = tokens;

  if (forToken.type !== "FOR") {
    return { ast: null, rest: tokens };
  }

  if (leftParen.type !== "LEFT_PAREN") {
    throw new Error("Expected left paren");
  }

  let initialisation: Statement<T> | null;
  const varDeclaration = parseVariableDeclaration(rest);
  const expressionStatement = parseExpressionStatement(rest);
  if (varDeclaration.ast !== null) {
    initialisation = varDeclaration.ast;
    rest = varDeclaration.rest;
  } else if (expressionStatement.ast !== null) {
    initialisation = expressionStatement.ast;
    rest = expressionStatement.rest;
  } else if (rest[0].type === "SEMICOLON") {
    initialisation = null;
    rest = rest.slice(1);
  } else {
    throw new Error("Expected variable declaration or expression statement");
  }

  const conditionAst = parseExpression(rest);
  if (conditionAst.rest[0].type !== "SEMICOLON") {
    throw new Error("Expected semicolon");
  }
  const condition = conditionAst.ast;
  rest = conditionAst.rest.slice(1);

  const incrementAst = parseExpression(conditionAst.rest.slice(1));
  if (incrementAst.rest[0].type !== "RIGHT_PAREN") {
    throw new Error("Expected right paren");
  }
  const increment = incrementAst.ast;
  rest = incrementAst.rest.slice(1);

  const { ast: body, rest: newRest } = parseStatement(rest);

  if (body === null) {
    throw new Error("Expected statement");
  }

  let declarations = new Array<Declaration<T>>();
  if (initialisation !== null) {
    declarations.push(initialisation);
  }
  declarations.push(
    new WhileStatement(
      forToken,
      condition ?? new Literal(forToken, true),
      new Block(forToken, increment === null ? [body] : [body, increment])
    )
  );

  return {
    ast: new Block(forToken, declarations),
    rest: newRest,
  };
}

// ifStmt         → "if" "(" expression ")" statement
//                  ( "else" statement )? ;
function parseIfStatement<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, IfStatement<T>> {
  if (tokens[0].type !== "IF") {
    return { ast: null, rest: tokens };
  }

  if (tokens[1].type !== "LEFT_PAREN") {
    throw new Error("Expected left paren");
  }

  let { ast: condition, rest } = parseExpression(tokens.slice(2));
  if (condition === null) {
    throw new Error("Expected expression");
  }

  if (rest[0].type !== "RIGHT_PAREN") {
    throw new Error("Expected right paren");
  }

  const { ast: thenStatement, rest: newRest } = parseStatement(rest.slice(1));
  if (thenStatement === null) {
    throw new Error("Expected statement");
  }
  rest = newRest;

  let elseStatement: Statement<T> | null = null;
  if (rest[0].type === "ELSE") {
    const { ast: elseStatement, rest: newNewRest } = parseStatement(
      rest.slice(1)
    );
    if (elseStatement === null) {
      throw new Error("Expected statement");
    }
    rest = newNewRest;
  }

  return {
    ast: new IfStatement<T>(tokens[0], condition, thenStatement, elseStatement),
    rest,
  };
}

// printStmt      → "print" expression ";" ;
function parsePrintStatement<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, PrintStatement<T>> {
  if (tokens[0].type !== "PRINT") {
    return { ast: null, rest: tokens };
  }

  let { ast: expression, rest } = parseExpression(tokens.slice(1));
  if (expression === null) {
    throw new Error("Expected expression");
  }

  if (rest[0].type !== "SEMICOLON") {
    throw new Error("Expected semicolon");
  }

  return {
    ast: new PrintStatement(tokens[0], expression),
    rest: rest.slice(1),
  };
}

// returnStmt     → "return" expression? ";" ;
function parseReturnStatement<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, ReturnStatement<T>> {
  if (tokens[0].type !== "RETURN") {
    return { ast: null, rest: tokens };
  }

  let { ast: expression, rest } = parseExpression(tokens.slice(1));

  if (rest[0].type !== "SEMICOLON") {
    throw new Error("Expected semicolon");
  }

  return {
    ast: new ReturnStatement(tokens[0], expression),
    rest: rest.slice(1),
  };
}

// whileStmt      → "while" "(" expression ")" statement ;
function parseWhileStatement<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, WhileStatement<T>> {
  if (tokens[0].type !== "WHILE") {
    return { ast: null, rest: tokens };
  }

  if (tokens[1].type !== "LEFT_PAREN") {
    throw new Error("Expected left paren");
  }

  let { ast: condition, rest } = parseExpression(tokens.slice(1));
  if (condition === null) {
    throw new Error("Expected expression");
  }

  if (rest[0].type !== "RIGHT_PAREN") {
    throw new Error("Expected right paren");
  }

  let { ast: body, rest: newRest } = parseStatement(rest.slice(1));
  if (body === null) {
    throw new Error("Expected statement");
  }

  return {
    ast: new WhileStatement(tokens[0], condition, body),
    rest: newRest,
  };
}

// block          → "{" declaration* "}" ;
function parseBlock<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Block<T>> {
  if (tokens[0].type !== "LEFT_BRACE") {
    return { ast: null, rest: tokens };
  }

  let { declarations, rest } = parseDeclarations(tokens.slice(1));

  if (rest[0].type !== "RIGHT_BRACE") {
    throw new Error("Expected semicolon");
  }

  return {
    ast: new Block(tokens[0], declarations),
    rest: rest.slice(1),
  };
}

// expression     → assignment ;
function parseExpression<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  return parseAssignment(tokens);
}

// assignment     → ( call "." )? IDENTIFIER "=" assignment
//                | logic_or ;
function parseAssignment<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  try {
    let rest = tokens;

    let { ast: call, rest: newRest } = parseCall(tokens);

    if (call !== null) {
      if (rest[0].type !== "DOT") {
        call = null;
        rest = tokens;
      } else {
        rest = newRest.slice(1);
      }
    }

    if (rest[0].type !== "IDENTIFIER") {
      throw new Error("Expected identifier");
    }
    let identifier = rest[0];

    if (rest[1].type !== "EQUAL") {
      throw new Error("Expected equal");
    }
    rest = rest.slice(2);

    const { ast: assignment, rest: newNewRest } = parseAssignment(rest);
    rest = newNewRest;

    if (assignment !== null) {
      return {
        ast: new Assignment(tokens[0], identifier, assignment, call),
        rest,
      };
    }
  } catch (e) {}

  return parseLogicOr(tokens);
}

// logic_or       → logic_and ( "or" logic_and )* ;
function parseLogicOr<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  let result = parseLogicAnd(tokens);
  if (result.ast === null) {
    return { ast: null, rest: tokens };
  }

  while (result.rest[0].type === "OR") {
    const { ast: logicAnd, rest: newNewRest } = parseLogicAnd(
      result.rest.slice(1)
    );
    if (logicAnd === null) {
      throw new Error("Expected logic and");
    }

    result = {
      ast: new BinaryOperator("OR", result.rest[0], result.ast!, logicAnd),
      rest: newNewRest,
    };
  }

  return result;
}

// logic_and      → equality ( "and" equality )* ;
function parseLogicAnd<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  let result = parseEquality(tokens);
  if (result.ast === null) {
    return { ast: null, rest: tokens };
  }

  while (result.rest[0].type === "AND") {
    const { ast: equality, rest: newNewRest } = parseEquality(
      result.rest.slice(1)
    );
    if (equality === null) {
      throw new Error("Expected equality");
    }

    result = {
      ast: new BinaryOperator("AND", result.rest[0], result.ast!, equality),
      rest: newNewRest,
    };
  }

  return result;
}

// equality       → comparison ( ( "!=" | "==" ) comparison )* ;
function parseEquality<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  let result = parseComparison(tokens);
  if (result.ast === null) {
    return { ast: null, rest: tokens };
  }

  while (
    result.rest[0].type === "BANG_EQUAL" ||
    result.rest[0].type === "EQUAL_EQUAL"
  ) {
    const { ast: comparison, rest: newNewRest } = parseComparison(
      result.rest.slice(1)
    );
    if (comparison === null) {
      throw new Error("Expected comparison");
    }

    result = {
      ast: new BinaryOperator(
        result.rest[0].type,
        result.rest[0],
        result.ast!,
        comparison
      ),
      rest: newNewRest,
    };
  }

  return result;
}

// comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
function parseComparison<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  let result = parseTerm(tokens);
  if (result.ast === null) {
    return { ast: null, rest: tokens };
  }

  while (
    result.rest[0].type === "LESS" ||
    result.rest[0].type === "LESS_EQUAL" ||
    result.rest[0].type === "GREATER" ||
    result.rest[0].type === "GREATER_EQUAL"
  ) {
    const { ast: term, rest: newNewRest } = parseTerm(result.rest.slice(1));
    if (term === null) {
      throw new Error("Expected term");
    }

    result = {
      ast: new BinaryOperator(
        result.rest[0].type,
        result.rest[0],
        result.ast!,
        term
      ),
      rest: newNewRest,
    };
  }

  return result;
}

// term           → factor ( ( "-" | "+" ) factor )* ;
function parseTerm<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  let result = parseFactor(tokens);
  if (result.ast === null) {
    return { ast: null, rest: tokens };
  }

  while (result.rest[0].type === "MINUS" || result.rest[0].type === "PLUS") {
    const { ast: factor, rest: newNewRest } = parseFactor(result.rest.slice(1));
    if (factor === null) {
      throw new Error("Expected factor");
    }

    result = {
      ast: new BinaryOperator(
        result.rest[0].type,
        result.rest[0],
        result.ast!,
        factor
      ),
      rest: newNewRest,
    };
  }

  return result;
}

// factor         → unary ( ( "/" | "*" ) unary )* ;
function parseFactor<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  let result = parseUnary(tokens);
  if (result.ast === null) {
    return { ast: null, rest: tokens };
  }

  while (result.rest[0].type === "SLASH" || result.rest[0].type === "STAR") {
    const { ast: unary, rest: newNewRest } = parseUnary(result.rest.slice(1));
    if (unary === null) {
      throw new Error("Expected unary");
    }

    result = {
      ast: new BinaryOperator(
        result.rest[0].type,
        result.rest[0],
        result.ast!,
        unary
      ),
      rest: newNewRest,
    };
  }

  return result;
}

// unary          → ( "!" | "-" ) unary | call ;
function parseUnary<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  if (tokens[0].type === "BANG" || tokens[0].type === "MINUS") {
    const { ast: unary, rest } = parseUnary(tokens.slice(1));

    if (unary === null) {
      throw new Error("Expected unary");
    }

    return {
      ast: new UnaryOperator(tokens[0].type, tokens[0], unary),
      rest,
    };
  }

  return parseCall(tokens);
}

// call           → primary ( "(" arguments? ")" | "." IDENTIFIER )* ;
function parseCall<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Expression<T>> {
  let result = parsePrimary(tokens);

  if (result.ast === null) {
    return { ast: null, rest: tokens };
  }

  while (
    result.rest[0].type === "LEFT_PAREN" ||
    result.rest[0].type === "DOT"
  ) {
    if (result.rest[0].type === "LEFT_PAREN") {
      const { args, rest: newNewRest } = parseArguments(result.rest.slice(1));

      if (newNewRest[0].type !== "RIGHT_PAREN") {
        throw new Error("Expected right paren");
      }

      result = {
        ast: new Call(result.rest[0], result.ast!, args),
        rest: newNewRest.slice(1),
      };
    } else {
      if (result.rest[1].type !== "IDENTIFIER") {
        throw new Error("Expected identifier");
      }

      result = {
        ast: new Access(result.rest[0], result.ast!, result.rest[1]),
        rest: result.rest.slice(2),
      };
    }
  }

  return result;
}

// primary        → "true" | "false" | "nil" | "this"
//                | NUMBER | STRING | IDENTIFIER | "(" expression ")"
//                | "super" "." IDENTIFIER ;
function parsePrimary<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Primary<T>> {
  switch (tokens[0].type) {
    case "TRUE":
      return {
        ast: new Boolean<T>(tokens[0]),
        rest: tokens.slice(1),
      };
    case "FALSE":
      return {
        ast: new Boolean<T>(tokens[0]),
        rest: tokens.slice(1),
      };
    case "NIL":
      return {
        ast: new Nil<T>(tokens[0]),
        rest: tokens.slice(1),
      };
    case "THIS":
      return {
        ast: new This<T>(tokens[0]),
        rest: tokens.slice(1),
      };
    case "NUMBER":
      return {
        ast: new Number<T>(tokens[0]),
        rest: tokens.slice(1),
      };
    case "STRING":
      return {
        ast: new String<T>(tokens[0]),
        rest: tokens.slice(1),
      };
    case "IDENTIFIER":
      return {
        ast: new Identifier<T>(tokens[0]),
        rest: tokens.slice(1),
      };
    case "LEFT_PAREN":
      const { ast, rest } = parseExpression(tokens.slice(1));

      if (rest[0].type !== "RIGHT_PAREN") {
        throw new Error("Expected right paren");
      }

      return { ast, rest: rest.slice(1) };
    case "SUPER":
      if (tokens[1].type !== "DOT") {
        throw new Error("Expected dot");
      }

      if (tokens[2].type !== "IDENTIFIER") {
        throw new Error("Expected identifier");
      }

      return {
        ast: new Super(tokens[0], tokens[2]),
        rest: tokens.slice(3),
      };
    default:
      return { ast: null, rest: tokens };
  }
}

// function       → IDENTIFIER "(" parameters? ")" block ;
function parseFunction<T extends Token>(
  tokens: T[]
): NewParsingFunctionResult<T, Function<T>> {
  if (tokens[0].type !== "IDENTIFIER") {
    return { ast: null, rest: tokens };
  }

  if (tokens[1].type !== "LEFT_PAREN") {
    throw new Error("Expected left paren");
  }

  const { parameters, rest: newRest } = parseParameters(tokens.slice(2));

  if (newRest[0].type !== "RIGHT_PAREN") {
    throw new Error("Expected right paren");
  }

  const { ast: body, rest: newNewRest } = parseBlock(newRest.slice(1));
  if (body === null) {
    throw new Error("Expected block");
  }

  return {
    ast: new Function(tokens[0], tokens[0], parameters, body),
    rest: newNewRest,
  };
}

// parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
function parseParameters<T extends Token>(
  tokens: T[]
): { parameters: Parameter<T>[]; rest: T[] } {
  if (tokens[0].type !== "IDENTIFIER") {
    return { parameters: [], rest: tokens };
  }

  let result = {
    parameters: new Array<Parameter<T>>(),
    rest: tokens.slice(1),
  };
  while (result.rest[0].type === "COMMA") {
    if (result.rest[1].type !== "IDENTIFIER") {
      throw new Error("Expected identifier");
    }

    result.parameters.push(new Parameter(result.rest[1]));
    result.rest = result.rest.slice(2);
  }

  return result;
}

// arguments      → expression ( "," expression )* ;
function parseArguments<T extends Token>(
  tokens: T[]
): { args: Argument<T>[]; rest: T[] } {
  let args = new Array<Argument<T>>();
  let rest = tokens;

  let expression = parseExpression(rest);
  if (expression.ast === null) {
    return { args, rest };
  }
  args.push(new Argument(tokens[0], expression.ast));
  rest = expression.rest;

  while (expression.rest[0].type === "COMMA") {
    const { ast, rest: newRest } = parseExpression(expression.rest.slice(1));

    if (ast === null) {
      throw new Error("Expected expression");
    }

    args.push(new Argument(tokens[0], expression.ast));
    rest = newRest;
  }

  return { args, rest };
}
