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
  startIndex: number;
  endIndex: number;
}

export function tokenize(code: string, startIndex = 0): Token[] {
  if (code.length === 0) {
    return [{ type: "EOF", value: "", startIndex, endIndex: startIndex }];
  }

  let restIndex: number = startIndex;
  const range = (size = 1) => {
    restIndex += size;
    return {
      startIndex: startIndex,
      endIndex: restIndex,
    };
  };
  const char = code.slice(0, 1);
  let rest = code.slice(1);

  let newToken!: Token | null;

  switch (char) {
    case "(":
      newToken = {
        type: "LEFT_PAREN",
        value: char,
        ...range(),
      };
      break;

    case ")":
      newToken = { type: "RIGHT_PAREN", value: char, ...range() };
      break;
    case "{":
      newToken = { type: "LEFT_BRACE", value: char, ...range() };
      break;
    case "}":
      newToken = { type: "RIGHT_BRACE", value: char, ...range() };
      break;
    case ",":
      newToken = { type: "COMMA", value: char, ...range() };
      break;
    case ".":
      newToken = { type: "DOT", value: char, ...range() };
      break;
    case "-":
      newToken = { type: "MINUS", value: char, ...range() };
      break;
    case "+":
      newToken = { type: "PLUS", value: char, ...range() };
      break;
    case ";":
      newToken = { type: "SEMICOLON", value: char, ...range() };
      break;
    case "*":
      newToken = { type: "STAR", value: char, ...range() };
      break;
    case "!":
      if (rest[0] === "=") {
        newToken = { type: "BANG_EQUAL", value: char + rest[0], ...range(2) };
        rest = rest.slice(1);
      } else {
        newToken = { type: "BANG", value: char, ...range() };
      }
      break;
    case "=":
      if (rest[0] === "=") {
        newToken = { type: "EQUAL_EQUAL", value: char + rest[0], ...range(2) };
        rest = rest.slice(1);
      } else {
        newToken = { type: "EQUAL", value: char, ...range() };
      }
      break;
    case "<":
      if (rest[0] === "=") {
        newToken = { type: "LESS_EQUAL", value: char + rest[0], ...range(2) };
        rest = rest.slice(1);
      } else {
        newToken = { type: "LESS", value: char, ...range() };
      }
      break;
    case ">":
      if (rest[0] === "=") {
        newToken = {
          type: "GREATER_EQUAL",
          value: char + rest[0],
          ...range(2),
        };
        rest = rest.slice(1);
      } else {
        newToken = { type: "GREATER", value: char, ...range() };
      }
      break;
    case "/":
      if (rest[0] === "/") {
        const endOfLine = rest.indexOf("\n");
        if (endOfLine === -1) {
          restIndex += rest.length;
          rest = "";
        } else {
          restIndex += endOfLine + 2;
          rest = rest.slice(endOfLine + 1);
        }
        newToken = null;
      } else {
        newToken = { type: "SLASH", value: char, ...range() };
      }
      break;
    case '"':
      const endOfString = rest.indexOf('"');
      const value = rest.slice(0, endOfString);
      newToken = {
        type: "STRING",
        value: value,
        ...range(value.length + 2),
      };
      rest = rest.slice(endOfString + 1);
      break;
    default:
      if (char.match(/[0-9]/) !== null) {
        let match = rest.match(/^[0-9]*(.[0-9]+)?/);
        if (match) {
          newToken = {
            type: "NUMBER",
            value: char + match[0],
            ...range(2),
          };
          rest = rest.slice(match[0].length);
        }
      } else if (char.match(/[a-zA-Z_]/) !== null) {
        const match = rest.match(/^[a-zA-Z0-9_]*/);
        if (match) {
          const identifier = char + match[0];

          switch (identifier) {
            case "and":
              newToken = {
                type: "AND",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "class":
              newToken = {
                type: "CLASS",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "else":
              newToken = {
                type: "ELSE",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "false":
              newToken = {
                type: "FALSE",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "for":
              newToken = {
                type: "FOR",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "fun":
              newToken = {
                type: "FUN",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "if":
              newToken = {
                type: "IF",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "nil":
              newToken = {
                type: "NIL",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "or":
              newToken = {
                type: "OR",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "print":
              newToken = {
                type: "PRINT",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "return":
              newToken = {
                type: "RETURN",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "super":
              newToken = {
                type: "SUPER",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "this":
              newToken = {
                type: "THIS",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "true":
              newToken = {
                type: "TRUE",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "var":
              newToken = {
                type: "VAR",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            case "while":
              newToken = {
                type: "WHILE",
                value: identifier,
                ...range(identifier.length),
              };
              break;
            default:
              newToken = {
                type: "IDENTIFIER",
                value: identifier,
                ...range(identifier.length),
              };
              break;
          }
          rest = rest.slice(match[0].length);
        }
      } else {
        newToken = null;
        restIndex += 1;
      }
  }

  if (newToken === null) {
    return tokenize(rest, restIndex!);
  } else {
    return [newToken, ...tokenize(rest, restIndex!)];
  }
}
