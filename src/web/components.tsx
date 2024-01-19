import type { PropsWithChildren } from "@kitajs/html";
import type { Token } from "../domain/tokenize";
import type { Ast } from "../domain/parse";

export function App(props: PropsWithChildren<{ class?: string }>) {
  return (
    <html lang="en">
      <head>
        <title>JSLox</title>
        <link href="./public/output.css" rel="stylesheet"></link>
      </head>
      <body class={props.class}>{props.children}</body>
    </html>
  );
}

export function Title() {
  return <h1 class="text-3xl">JSLox</h1>;
}

export function CodeInput(
  props: PropsWithChildren<{ source?: string; class?: string }>
) {
  return (
    <form class={props.class + " flex flex-col h-full"} action="" method="post">
      <textarea class="h-96" name="source">
        {props.source}
      </textarea>
      <button class="h-10" type="submit">
        Parse
      </button>
    </form>
  );
}

export function TokensViewer(
  props: PropsWithChildren<{ tokens: Token[]; class?: string }>
) {
  return <pre class={props.class}>{JSON.stringify(props.tokens, null, 2)}</pre>;
}

export function AstViewer(
  props: PropsWithChildren<{ ast: Ast; class?: string }>
) {
  return <pre class={props.class}>{JSON.stringify(props.ast, null, 2)}</pre>;
}
