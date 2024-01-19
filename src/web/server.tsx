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
      const ast = parse(tokens);

      return (
        <App class="w-full flex flex-col">
          <Title />
          <div class="flex flex-row">
            <CodeInput class="w-1/3" source={source} />
            <TokensViewer class="w-1/3" tokens={tokens} />
            <AstViewer class="w-1/3" ast={ast} />
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
