import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { tokenize } from "../domain/tokenize";
import staticPlugin from "@elysiajs/static";
import { App, CodeInput, CodeViewer, TokensViewer } from "./components";

new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/", () => (
    <App>
      <CodeInput class="w-full" />
    </App>
  ))
  .post(
    "/",
    (req) => {
      const source = req.body.source;
      const tokens = tokenize(source);

      return (
        <App>
          <CodeViewer
            class="w-1/2 border-r border-gray-700"
            source={source}
            tokens={tokens}
          />
          <TokensViewer
            class="w-1/2 overflow-auto"
            source={source}
            tokens={tokens}
          />
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
