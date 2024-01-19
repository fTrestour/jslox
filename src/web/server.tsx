import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { tokenize } from "../domain/tokenize";
import { parse } from "../domain/parse";
import staticPlugin from "@elysiajs/static";

new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/", () => (
    <html lang="en">
      <head>
        <title>JSLox</title>
        <link href="./public/output.css" rel="stylesheet"></link>
      </head>
      <body>
        <h1>JSLox</h1>
        <form action="" method="post">
          <textarea name="source"></textarea>
          <button type="submit">Parse</button>
        </form>
      </body>
    </html>
  ))
  .listen(3000);
