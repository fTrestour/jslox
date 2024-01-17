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
  | "EOF";

interface Token {
  type: TokenType;
  value: string;
}

export function tokenize(code: string): Token[] {
  if (code.length === 0) {
    return [];
  }

  const char = code.slice(0, 1);
  console.log({ char });
  let rest = code.slice(1).trim();
  console.log({ rest });

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
        let endOfLine = rest.indexOf("\n");
        rest = rest.slice(endOfLine);
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
          newToken = {
            type: "IDENTIFIER",
            value: identifier,
          };
          rest = rest.slice(match[0].length);
        }
      } else {
        newToken = null;
      }
  }

  console.log({ newToken });

  if (newToken === null) {
    return tokenize(rest);
  } else {
    return [newToken, ...tokenize(rest)];
  }
}
