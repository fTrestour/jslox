import { Elysia, t } from "elysia";
import { App } from "../components/App";
import { CodeInput } from "../components/CodeInput";

export default new Elysia().get(
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
);
