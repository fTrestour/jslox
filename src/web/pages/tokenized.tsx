import { randomUUID } from "crypto";
import Elysia, { t } from "elysia";
import { tokenize } from "../../domain/tokenize";
import { App } from "../components/App";
import { CodeViewer } from "../components/CodeViewer";
import { TokensViewer } from "../components/TokensViewer";

export default new Elysia().post(
  "/tokenized",
  (req) => {
    const source = req.body.source;
    const tokens = tokenize(source).map((token) => ({
      ...token,
      id: randomUUID(),
    }));

    return (
      <App>
        <CodeViewer class="w-1/2" source={source} tokens={tokens} />
        <TokensViewer class="w-1/2" source={source} tokens={tokens} />
      </App>
    );
  },
  {
    body: t.Object({
      source: t.String(),
    }),
  }
);
