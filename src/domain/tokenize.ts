type TokenType =
  | "NUMBER"
  | "STRING"
  | "IDENTIFIER"
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "LEFT_BRACE"
  | "RIGHT_BRACE"
  | "COMMA"
  | "DOT"
  | "MINUS"
  | "PLUS"
  | "SEMICOLON"
  | "SLASH"
  | "BANG"
  | "BANG_EQUAL"
  | "EQUAL"
  | "EQUAL_EQUAL"
  | "GREATER"
  | "GREATER_EQUAL"
  | "LESS"
  | "LESS_EQUAL"
  | "STAR"
  | "AND"
  | "CLASS"
  | "ELSE"
  | "FALSE"
  | "FOR"
  | "FUN"
  | "IF"
  | "NIL"
  | "OR"
  | "PRINT"
  | "RETURN"
  | "SUPER"
  | "THIS"
  | "TRUE"
  | "VAR"
  | "WHILE"
  | "EOF";

export interface Token {
  type: TokenType;
  value: string;
}

export function tokenize(code: string): Token[] {
  if (code.length === 0) {
    return [{ type: "EOF", value: "" }];
  }

  const char = code.slice(0, 1);
  let rest = code.slice(1).trim();

  let newToken!: Token | null;

  switch (char) {
    case "(":
      newToken = { type: "LEFT_PAREN", value: char };
      break;

    case ")":
      newToken = { type: "RIGHT_PAREN", value: char };
      break;
    case "{":
      newToken = { type: "LEFT_BRACE", value: char };
      break;
    case "}":
      newToken = { type: "RIGHT_BRACE", value: char };
      break;
    case ",":
      newToken = { type: "COMMA", value: char };
      break;
    case ".":
      newToken = { type: "DOT", value: char };
      break;
    case "-":
      newToken = { type: "MINUS", value: char };
      break;
    case "+":
      newToken = { type: "PLUS", value: char };
      break;
    case ";":
      newToken = { type: "SEMICOLON", value: char };
      break;
    case "*":
      newToken = { type: "STAR", value: char };
      break;
    case "!":
      if (rest[0] === "=") {
        newToken = { type: "BANG_EQUAL", value: char + rest[0] };
        rest = rest.slice(1);
      } else {
        newToken = { type: "BANG", value: char };
      }
      break;
    case "=":
      if (rest[0] === "=") {
        newToken = { type: "EQUAL_EQUAL", value: char + rest[0] };
        rest = rest.slice(1);
      } else {
        newToken = { type: "EQUAL", value: char };
      }
      break;
    case "<":
      if (rest[0] === "=") {
        newToken = { type: "LESS_EQUAL", value: char + rest[0] };
        rest = rest.slice(1);
      } else {
        newToken = { type: "LESS", value: char };
      }
      break;
    case ">":
      if (rest[0] === "=") {
        newToken = { type: "GREATER_EQUAL", value: char + rest[0] };
        rest = rest.slice(1);
      } else {
        newToken = { type: "GREATER", value: char };
      }
      break;
    case "/":
      if (rest[0] === "/") {
        const endOfLine = rest.indexOf("\n");
        if (endOfLine === -1) {
          rest = "";
        } else {
          rest = rest.slice(endOfLine + 1);
        }
        newToken = null;
      } else {
        newToken = { type: "SLASH", value: char };
      }
      break;
    case '"':
      let endOfString = rest.indexOf('"');
      newToken = {
        type: "STRING",
        value: rest.slice(0, endOfString),
      };
      rest = rest.slice(endOfString + 1);
      break;
    default:
      if (char.match(/[0-9]/) !== null) {
        let match = rest.match(/^[0-9]*(.[0-9]+)?/);
        if (match) {
          let number = char + match[0];
          newToken = {
            type: "NUMBER",
            value: number,
          };
          rest = rest.slice(match[0].length);
        }
      } else if (char.match(/[a-zA-Z_]/) !== null) {
        let match = rest.match(/^[a-zA-Z0-9_]*/);
        if (match) {
          let identifier = char + match[0];

          switch (identifier) {
            case "and":
              newToken = { type: "AND", value: identifier };
              break;
            case "class":
              newToken = { type: "CLASS", value: identifier };
              break;
            case "else":
              newToken = { type: "ELSE", value: identifier };
              break;
            case "false":
              newToken = { type: "FALSE", value: identifier };
              break;
            case "for":
              newToken = { type: "FOR", value: identifier };
              break;
            case "fun":
              newToken = { type: "FUN", value: identifier };
              break;
            case "if":
              newToken = { type: "IF", value: identifier };
              break;
            case "nil":
              newToken = { type: "NIL", value: identifier };
              break;
            case "or":
              newToken = { type: "OR", value: identifier };
              break;
            case "print":
              newToken = { type: "PRINT", value: identifier };
              break;
            case "return":
              newToken = { type: "RETURN", value: identifier };
              break;
            case "super":
              newToken = { type: "SUPER", value: identifier };
              break;
            case "this":
              newToken = { type: "THIS", value: identifier };
              break;
            case "true":
              newToken = { type: "TRUE", value: identifier };
              break;
            case "var":
              newToken = { type: "VAR", value: identifier };
              break;
            case "while":
              newToken = { type: "WHILE", value: identifier };
              break;
            default:
              newToken = { type: "IDENTIFIER", value: identifier };
              break;
          }
          rest = rest.slice(match[0].length);
        }
      } else {
        newToken = null;
      }
  }

  if (newToken === null) {
    return tokenize(rest);
  } else {
    return [newToken, ...tokenize(rest)];
  }
}
