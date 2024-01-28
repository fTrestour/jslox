import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";
import home from "./pages/home";
import parsed from "./pages/parsed";

new Elysia()
  .onError((err) => {
    console.error(err);
    return err;
  })
  .use(html())
  .use(staticPlugin())
  .use(home)
  .use(parsed)
  .listen(3000);
