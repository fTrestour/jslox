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

export default new Elysia().get(
  "/parsed",
  (req) => {
    // decodeURIComponent is not enough
    // https://stackoverflow.com/a/16587536
    const source = decodeURIComponent(req.query.source.replace(/\+/g, "%20"));

    const tokens = tokenize(source)
      ._unsafeUnwrap()
      .map((token) => ({
        ...token,
        id: randomUUID(),
      }));

    const parsed = parse(tokens);

    return (
      <App class="grid gap-6 h-auto auto-rows-auto">
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
          tokens={tokens}
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
