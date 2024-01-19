import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { tokenize } from "../domain/tokenize";
import { parse } from "../domain/parse";
import staticPlugin from "@elysiajs/static";
import { App, AstViewer, CodeInput, Title, TokensViewer } from "./components";

new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/", () => (
    <App>
      <Title />
      <CodeInput />
    </App>
  ))
  .post(
    "/",
    (req) => {
      const source = req.body.source;
      const tokens = tokenize(source);

      return (
        <App class="w-full flex flex-col">
          <Title />
          <div class="flex flex-col">
            <CodeInput source={source} />
            <TokensViewer class="w-full" source={source} tokens={tokens} />
          </div>
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
