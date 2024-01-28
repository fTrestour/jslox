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

    const tokens = tokenize(source).map((token) => ({
      ...token,
      id: randomUUID(),
    }));

    const parsed = parse(tokens);

    return (
      <App class="grid grid-cols-3 gap-6">
        <Nav title="Source">
          <Link
            direction="backward"
            href={`/?source=${encodeURIComponent(source)}`}
          >
            Edit
          </Link>
        </Nav>

        <Nav title="Tokens" />
        <Nav title="AST" />
        <CodeViewer source={source} tokens={tokens} />
        <TokensViewer source={source} tokens={tokens} />
        <ASTViewer parsed={parsed} />
      </App>
    );
  },
  {
    query: t.Object({
      source: t.String(),
    }),
  }
);
