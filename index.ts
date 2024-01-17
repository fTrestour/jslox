import { tokenize } from "./tokenize";

let code = `// Your first Lox program!
print "Hello, world!";`;
console.log({ code });

let tokens = tokenize(code);
console.log({ tokens });
