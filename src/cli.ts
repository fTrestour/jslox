import path from "path";

import run from "./domain";

const file = path.join(".", Bun.argv[2]);
const code = await Bun.file(file).text();
try {
  run(code);
} catch (e) {
  console.error(e);
}
