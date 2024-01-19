import type { Token } from "./tokenize";

export function parse(tokens: Token[]) {
  const { ast } = parseProgram(tokens);
  return ast!;
}

export type Ast = {
  type: string;
  [key: string]: any;
};

type ParseFunctionResult = {
  ast: Ast | null;
  rest: Token[];
};

// program        → declaration* EOF ;
function parseProgram(tokens: Token[]): ParseFunctionResult {
  const { declarations, rest } = parseDeclarations(tokens);

  if (rest[0].type !== "EOF") throw new Error("Expected EOF");

  return { ast: { type: "PROGRAM" as const, declarations }, rest };
}

function parseDeclarations(tokens: Token[]) {
  let rest = tokens;

  let declarations = new Array<ParseFunctionResult["ast"]>();
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
function parseDeclaration(tokens: Token[]): ParseFunctionResult {
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
function parseClassDeclaration(tokens: Token[]): ParseFunctionResult {
  let [classToken, name, ...rest] = tokens;

  if (classToken.type !== "CLASS") {
    return { ast: null, rest: tokens };
  }

  let inheritance: Token | null = null;
  if (rest[0].type === "LESS" && rest[1].type === "IDENTIFIER") {
    inheritance = rest[1];
    rest = rest.slice(2);
  }

  if (rest[0].type !== "LEFT_BRACE") {
    throw new Error("Expected left brace");
  }

  let functions: any[] = [];
  while (rest[0].type !== "RIGHT_BRACE") {
    const { ast: newAst, rest: newRest } = parseFunction(rest);

    if (newAst === null) {
      throw new Error("Expected function declaration");
    }

    functions.push(newAst);
    rest = newRest;
  }
  rest = rest.slice(1);

  if (rest[0].type !== "SEMICOLON") {
    throw new Error("Expected semicolon");
  }
  rest = rest.slice(1);

  return {
    ast: {
      type: "CLASS_DECLARATION" as const,
      data: { name, inheritance, functions },
    },
    rest,
  };
}

// funDecl        → "fun" function ;
function parseFunctionDeclaration(tokens: Token[]): ParseFunctionResult {
  if (tokens[0].type !== "FUN") {
    return { ast: null, rest: tokens };
  }

  const { ast: functionAst, rest } = parseFunction(tokens.slice(1));

  return {
    ast: { type: "FUNCTION_DECLARATION" as const, function: functionAst },
    rest,
  };
}

// varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;
function parseVariableDeclaration(tokens: Token[]): ParseFunctionResult {
  let [varToken, identifier, ...rest] = tokens;

  if (varToken.type !== "VAR") {
    return { ast: null, rest: tokens };
  }

  let expression: any = null;
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
    ast: {
      type: "VARIABLE_DECLARATION" as const,
      data: { identifier, expression },
    },
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
function parseStatement(tokens: Token[]): ParseFunctionResult {
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
function parseExpressionStatement(tokens: Token[]): ParseFunctionResult {
  const { ast: expression, rest } = parseExpression(tokens);

  if (expression === null) {
    return { ast: null, rest: tokens };
  }

  if (rest[0].type !== "SEMICOLON") {
    throw new Error("Expected semicolon");
  }

  return {
    ast: { type: "EXPRESSION_STATEMENT" as const, expression },
    rest: rest.slice(1),
  };
}

// forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
//                            expression? ";"
//                            expression? ")" statement ;
function parseForStatement(tokens: Token[]): ParseFunctionResult {
  let [forToken, leftParen, ...rest] = tokens;

  if (forToken.type !== "FOR") {
    return { ast: null, rest: tokens };
  }

  if (leftParen.type !== "LEFT_PAREN") {
    throw new Error("Expected left paren");
  }

  let initialisation: ReturnType<
    typeof parseVariableDeclaration | typeof parseExpressionStatement
  >["ast"];
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

  return {
    ast: {
      type: "BLOCK" as const,
      declarations: [
        initialisation,
        {
          type: "WHILE_STATEMENT" as const,
          condition,
          body: { type: "BLOCK" as const, declarations: [body, increment] },
        },
      ],
    },
    rest: newRest,
  };
}

// ifStmt         → "if" "(" expression ")" statement
//                  ( "else" statement )? ;
function parseIfStatement(tokens: Token[]): ParseFunctionResult {
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

  let elseStatement: any = null;
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
    ast: {
      type: "IF_STATEMENT" as const,
      condition,
      thenStatement,
      elseStatement,
    },
    rest,
  };
}

// printStmt      → "print" expression ";" ;
function parsePrintStatement(tokens: Token[]): ParseFunctionResult {
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
    ast: { type: "PRINT_STATEMENT" as const, expression },
    rest: rest.slice(1),
  };
}

// returnStmt     → "return" expression? ";" ;
function parseReturnStatement(tokens: Token[]): ParseFunctionResult {
  if (tokens[0].type !== "RETURN") {
    return { ast: null, rest: tokens };
  }

  let { ast: expression, rest } = parseExpression(tokens.slice(1));

  if (rest[0].type !== "SEMICOLON") {
    throw new Error("Expected semicolon");
  }

  return {
    ast: { type: "RETURN_STATEMENT" as const, expression },
    rest: rest.slice(1),
  };
}

// whileStmt      → "while" "(" expression ")" statement ;
function parseWhileStatement(tokens: Token[]): ParseFunctionResult {
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

  return {
    ast: {
      type: "WHILE_STATEMENT" as const,
      condition,
      body,
    },
    rest: newRest,
  };
}

// block          → "{" declaration* "}" ;
function parseBlock(tokens: Token[]): ParseFunctionResult {
  if (tokens[0].type !== "LEFT_BRACE") {
    return { ast: null, rest: tokens };
  }

  let { declarations, rest } = parseDeclarations(tokens.slice(1));

  if (rest[0].type !== "RIGHT_BRACE") {
    throw new Error("Expected semicolon");
  }

  return {
    ast: { type: "BLOCK" as const, declarations },
    rest: rest.slice(1),
  };
}

// expression     → assignment ;
function parseExpression(tokens: Token[]): ParseFunctionResult {
  return parseAssignment(tokens);
}

// assignment     → ( call "." )? IDENTIFIER "=" assignment
//                | logic_or ;
function parseAssignment(tokens: Token[]): ParseFunctionResult {
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
        ast: {
          type: "ASSIGNMENT" as const,
          data: { call, identifier, assignment },
        },
        rest,
      };
    }
  } catch (e) {}

  return parseLogicOr(tokens);
}

// logic_or       → logic_and ( "or" logic_and )* ;
function parseLogicOr(tokens: Token[]): ParseFunctionResult {
  let result = parseLogicAnd(tokens) as any;

  while (result.rest[0].type === "OR") {
    const { ast: logicAnd, rest: newNewRest } = parseLogicAnd(
      result.rest.slice(1)
    );

    result = {
      ast: { type: "OR" as const, left: result.ast, right: logicAnd },
      rest: newNewRest,
    };
  }

  return result;
}

// logic_and      → equality ( "and" equality )* ;
function parseLogicAnd(tokens: Token[]): ParseFunctionResult {
  let result = parseEquality(tokens) as any;

  while (result.rest[0].type === "AND") {
    const { ast: logicAnd, rest: newNewRest } = parseEquality(
      result.rest.slice(1)
    );

    result = {
      ast: { type: "AND" as const, left: result.ast, right: logicAnd },
      rest: newNewRest,
    };
  }

  return result;
}

// equality       → comparison ( ( "!=" | "==" ) comparison )* ;
function parseEquality(tokens: Token[]): ParseFunctionResult {
  let result = parseComparison(tokens) as any;

  while (
    result.rest[0].type === "BANG_EQUAL" ||
    result.rest[0].type === "EQUAL_EQUAL"
  ) {
    const { ast: comparison, rest: newNewRest } = parseComparison(
      result.rest.slice(1)
    );

    result = {
      ast: { type: result.rest[0].type, left: result.ast, right: comparison },
      rest: newNewRest,
    };
  }

  return result;
}

// comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
function parseComparison(tokens: Token[]): ParseFunctionResult {
  let result = parseTerm(tokens) as any;

  while (
    result.rest[0].type === "LESS" ||
    result.rest[0].type === "LESS_EQUAL" ||
    result.rest[0].type === "GREATER" ||
    result.rest[0].type === "GREATER_EQUAL"
  ) {
    const { ast: term, rest: newNewRest } = parseTerm(result.rest.slice(1));

    result = {
      ast: { type: result.rest[0].type, left: result.ast, right: term },
      rest: newNewRest,
    };
  }

  return result;
}

// term           → factor ( ( "-" | "+" ) factor )* ;
function parseTerm(tokens: Token[]): ParseFunctionResult {
  let result = parseFactor(tokens) as any;

  while (result.rest[0].type === "MINUS" || result.rest[0].type === "PLUS") {
    const { ast: factor, rest: newNewRest } = parseFactor(result.rest.slice(1));

    result = {
      ast: { type: result.rest[0].type, left: result.ast, right: factor },
      rest: newNewRest,
    };
  }

  return result;
}

// factor         → unary ( ( "/" | "*" ) unary )* ;
function parseFactor(tokens: Token[]): ParseFunctionResult {
  let result = parseUnary(tokens) as any;

  while (result.rest[0].type === "SLASH" || result.rest[0].type === "STAR") {
    const { ast: unary, rest: newNewRest } = parseUnary(result.rest.slice(1));

    result = {
      ast: { type: result.rest[0].type, left: result.ast, right: unary },
      rest: newNewRest,
    };
  }

  return result;
}

// unary          → ( "!" | "-" ) unary | call ;
function parseUnary(tokens: Token[]): ParseFunctionResult {
  if (tokens[0].type === "BANG" || tokens[0].type === "MINUS") {
    const { ast: unary, rest } = parseUnary(tokens.slice(1));

    return {
      ast: { type: tokens[0].type, unary },
      rest,
    };
  }

  return parseCall(tokens);
}

// call           → primary ( "(" arguments? ")" | "." IDENTIFIER )* ;
function parseCall(tokens: Token[]): ParseFunctionResult {
  let result = parsePrimary(tokens);

  if (result.ast === null) {
    return { ast: null, rest: tokens };
  }

  while (
    result.rest[0].type === "LEFT_PAREN" ||
    result.rest[0].type === "DOT"
  ) {
    if (result.rest[0].type === "LEFT_PAREN") {
      const { ast: argumentsAst, rest: newNewRest } = parseArguments(
        result.rest.slice(1)
      );

      if (newNewRest[0].type !== "RIGHT_PAREN") {
        throw new Error("Expected right paren");
      }

      result = {
        ast: {
          type: "CALL" as const,
          callee: result.ast,
          arguments: argumentsAst,
        },
        rest: newNewRest.slice(1),
      };
    } else {
      if (result.rest[1].type !== "IDENTIFIER") {
        throw new Error("Expected identifier");
      }

      result = {
        ast: {
          type: "ACCESS" as const,
          object: result.ast,
          propriety: result.rest[1],
        },
        rest: result.rest.slice(2),
      };
    }
  }

  return result;
}

// primary        → "true" | "false" | "nil" | "this"
//                | NUMBER | STRING | IDENTIFIER | "(" expression ")"
//                | "super" "." IDENTIFIER ;
function parsePrimary(tokens: Token[]): ParseFunctionResult {
  switch (tokens[0].type) {
    case "TRUE":
      return { ast: { type: "TRUE" as const }, rest: tokens.slice(1) };
    case "FALSE":
      return { ast: { type: "FALSE" as const }, rest: tokens.slice(1) };
    case "NIL":
      return { ast: { type: "NIL" as const }, rest: tokens.slice(1) };
    case "THIS":
      return { ast: { type: "THIS" as const }, rest: tokens.slice(1) };
    case "NUMBER":
      return {
        ast: { type: "NUMBER" as const, value: tokens[0].value },
        rest: tokens.slice(1),
      };
    case "STRING":
      return {
        ast: { type: "STRING" as const, value: tokens[0].value },
        rest: tokens.slice(1),
      };
    case "IDENTIFIER":
      return {
        ast: { type: "IDENTIFIER" as const, value: tokens[0].value },
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
        ast: { type: "SUPER" as const, propriety: tokens[2].value },
        rest: tokens.slice(3),
      };
    default:
      return { ast: null, rest: tokens };
  }
}

// function       → IDENTIFIER "(" parameters? ")" block ;
function parseFunction(tokens: Token[]): ParseFunctionResult {
  if (tokens[0].type !== "IDENTIFIER") {
    return { ast: null, rest: tokens };
  }

  if (tokens[1].type !== "LEFT_PAREN") {
    throw new Error("Expected left paren");
  }

  const { ast: parameters, rest: newRest } = parseParameters(tokens.slice(2));

  if (newRest[0].type !== "RIGHT_PAREN") {
    throw new Error("Expected right paren");
  }

  const { ast: body, rest: newNewRest } = parseBlock(newRest.slice(1));

  return {
    ast: {
      type: "FUNCTION" as const,
      parameters,
      body,
    },
    rest: newNewRest,
  };
}

// parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
function parseParameters(tokens: Token[]): ParseFunctionResult {
  if (tokens[0].type !== "IDENTIFIER") {
    return { ast: null, rest: tokens };
  }

  let result = {
    ast: { type: "PARAMETERS", identifiers: new Array() },
    rest: tokens.slice(1),
  };
  while (result.rest[0].type === "COMMA") {
    if (result.rest[1].type !== "IDENTIFIER") {
      throw new Error("Expected identifier");
    }

    result.ast.identifiers.push(result.rest[1]);
    result.rest = result.rest.slice(2);
  }

  return result;
}

// arguments      → expression ( "," expression )* ;
function parseArguments(tokens: Token[]): ParseFunctionResult {
  let result = parseExpression(tokens);

  while (result.rest[0].type === "COMMA") {
    const { ast: expression, rest: newNewRest } = parseExpression(
      result.rest.slice(1)
    );

    result = {
      ast: {
        type: "ARGUMENTS" as const,
        arguments: [
          ...(result.ast && "arguments" in result.ast
            ? result.ast.arguments
            : [result.ast]),
          expression,
        ],
      },
      rest: newNewRest,
    };
  }

  return result;
}
