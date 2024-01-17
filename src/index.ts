import { tokenize } from "./tokenize";

export default function run(code: string) {
  console.log(code);

  let tokens = tokenize(code);
  console.log({ tokens });
}
