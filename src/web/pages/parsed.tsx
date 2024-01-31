import Elysia, { t } from "elysia";
import { parse } from "../../domain/parse";
import { tokenize } from "../../domain/tokenize";
import { App } from "../components/App";
import { Html } from "@kitajs/html";
import { CodeViewer } from "../components/CodeViewer";
import { TokensViewer } from "../components/TokensViewer";
import { randomUUID } from "crypto";
import { Link } from "../components/Button";
import { Nav } from "../components/Nav";
import { ASTViewer } from "./ASTViewer";
import type { TokenWithId } from "../utils";
import { Result } from "neverthrow";

export default new Elysia().get(
  "/parsed",
  (req) => {
    // decodeURIComponent is not enough
    // https://stackoverflow.com/a/16587536
    const source = decodeURIComponent(req.query.source.replace(/\+/g, "%20"));

    const tokens = tokenize(source).map((tokens) =>
      tokens.map(
        (token) =>
          ({
            ...token,
            id: randomUUID(),
          } as TokenWithId)
      )
    );

    const parsed = tokens.andThen(
      Result.fromThrowable(
        parse<TokenWithId>,
        (err) => new Error("parse error", { cause: err })
      )
    );

    return (
      <App class="grid gap-6 h-auto lg:grid-rows-layout lg:grid-cols-3 auto-rows-auto">
        <Nav title="Source" class="lg:row-start-1">
          <Link
            direction="backward"
            href={`/?source=${encodeURIComponent(source)}`}
          >
            Edit
          </Link>
        </Nav>
        <CodeViewer
          source={source}
          tokens={tokens.unwrapOr([])}
          class="lg:row-start-2 lg:col-start-1"
        />

        <Nav title="Tokens" class="lg:row-start-1" />
        <TokensViewer
          source={source}
          tokens={tokens}
          class="lg:row-start-2 lg:col-start-2"
        />

        <Nav title="AST" class="lg:row-start-1" />
        <ASTViewer parsed={parsed} class="lg:row-start-2 lg:col-start-3" />
      </App>
    );
  },
  {
    query: t.Object({
      source: t.String(),
    }),
  }
);
