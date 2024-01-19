import { Elysia } from "elysia";
import { html } from "@elysiajs/html";

new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/", () => (
    <html lang="en">
      <head>
        <title>Hello World</title>
        <link href="./public/output.css" rel="stylesheet"></link>
      </head>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  ))
  .listen(3000);
