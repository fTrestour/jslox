import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { tokenize } from "../domain/tokenize";
import staticPlugin from "@elysiajs/static";
import { TokensViewer } from "./components/TokensViewer";
import { CodeViewer } from "./components/CodeViewer";
import { CodeInput } from "./components/CodeInput";
import { App } from "./components/App";
import { randomUUID } from "crypto";

new Elysia()
  .use(html())
  .use(staticPlugin())
  .get(
    "/",
    (req) => {
      const source =
        req.query.source ??
        `
// A function that prints hello world
fun sayHello() {
  print "hello world";
}

sayHello();
      `;

      return (
        <App>
          <CodeInput class="w-full" source={source} />
        </App>
      );
    },
    { query: t.Object({ source: t.Optional(t.String()) }) }
  )
  .post(
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
  )
  .listen(3000);
