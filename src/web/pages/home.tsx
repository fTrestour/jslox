import { Elysia, t } from "elysia";
import { App } from "../components/App";
import { CodeInput } from "../components/CodeInput";
import { Button } from "../components/Button";
import { Nav } from "../components/Nav";

export default new Elysia().get(
  "/",
  (req) => {
    const defaultSource = `
// A function that prints hello world
fun sayHello() {
  print "hello world";
}

sayHello();`;

    const source = req.query.source ?? defaultSource;

    return (
      <App>
        <form
          class="w-full h-full flex flex-col overflow-auto gap-6"
          action="parsed"
          method="get"
        >
          <Nav title="Source">
            <Button type="submit" direction="forward">
              Parse
            </Button>
          </Nav>
          <CodeInput source={source} />
        </form>
      </App>
    );
  },
  { query: t.Object({ source: t.Optional(t.String()) }) }
);
