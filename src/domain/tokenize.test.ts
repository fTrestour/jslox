import { expect, describe, it } from "bun:test";
import { tokenize } from "./tokenize";

describe("tokenize", () => {
  it("works", () => {
    expect(
      tokenize(`// Your first Lox program!
    print "Hello, world!";`)
    ).toBe([
      {
        type: "IDENTIFIER",
        value: "print",
      },
      {
        type: "STRING",
        value: "Hello, world!",
      },
      {
        type: "SEMICOLON",
        value: ";",
      },
    ]);
  });
});
