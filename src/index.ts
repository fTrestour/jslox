import { parse } from "./parse";
import { tokenize } from "./tokenize";

export default function run(code: string) {
  console.log(code);

  const tokens = tokenize(code);
  console.log(tokens);

  const ast = parse(tokens);
  console.log(ast);
}
