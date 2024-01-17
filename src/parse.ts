import { Token } from "./tokenize";

export function parse(tokens: Token[]) {
  const { ast, rest } = parseProgram(tokens);
  return ast;
}

// program        → declaration* EOF ;
function parseProgram(tokens: Token[]) {
  const { ast, rest } = parseDeclarations(tokens);

  if (rest.length === 0 || rest[0].type !== "EOF")
    throw new Error("Expected EOF");

  return { ast, rest };
}

function parseDeclarations(tokens: Token[]) {
  let ast: any;
  let rest = tokens;
  while (ast !== null) {
    const { ast: newAst, rest: newRest } = parseDeclaration(rest);
    console.log(newAst);
    ast = newAst;
    rest = newRest;
  }

  return { ast, rest };
}

// declaration    → classDecl
//                | funDecl
//                | varDecl
//                | statement ;
function parseDeclaration(tokens: Token[]) {
  return parseVariableDeclaration(tokens); //FIXME
}

// classDecl      → "class" IDENTIFIER ( "<" IDENTIFIER )?
//                  "{" function* "}" ;
function parseClassDeclaration(tokens: Token[]) {
  throw new Error("Function not implemented.");
}

// funDecl        → "fun" function ;
function parseFunctionDeclaration(tokens: Token[]) {
  throw new Error("Function not implemented.");
}

// varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;
function parseVariableDeclaration(tokens: Token[]) {
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
    ast: { type: "VARIABLE_DECLARATION", data: { identifier, expression } },
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
function parseStatement(tokens: Token[]) {
  throw new Error("Function not implemented.");
}

// exprStmt       → expression ";" ;
// forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
//                            expression? ";"
//                            expression? ")" statement ;
// ifStmt         → "if" "(" expression ")" statement
//                  ( "else" statement )? ;
// printStmt      → "print" expression ";" ;
// returnStmt     → "return" expression? ";" ;
// whileStmt      → "while" "(" expression ")" statement ;
// block          → "{" declaration* "}" ;

// expression     → assignment ;
function parseExpression(tokens: Token[]) {
  // throw new Error("Function not implemented.");
  return { ast: { type: "FOO" }, rest: tokens.slice(1) }; //FIXME
}

// assignment     → ( call "." )? IDENTIFIER "=" assignment
//                | logic_or ;

// logic_or       → logic_and ( "or" logic_and )* ;
// logic_and      → equality ( "and" equality )* ;
// equality       → comparison ( ( "!=" | "==" ) comparison )* ;
// comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
// term           → factor ( ( "-" | "+" ) factor )* ;
// factor         → unary ( ( "/" | "*" ) unary )* ;

// unary          → ( "!" | "-" ) unary | call ;
// call           → primary ( "(" arguments? ")" | "." IDENTIFIER )* ;
// primary        → "true" | "false" | "nil" | "this"
//                | NUMBER | STRING | IDENTIFIER | "(" expression ")"
//                | "super" "." IDENTIFIER ;

// function       → IDENTIFIER "(" parameters? ")" block ;
// parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
// arguments      → expression ( "," expression )* ;
