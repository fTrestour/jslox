import type { PropsWithChildren } from "@kitajs/html";
import type { Token } from "../domain/tokenize";

export function App(props: PropsWithChildren<{ class?: string }>) {
  return (
    <html lang="en">
      <head>
        <title>JSLox</title>
        <link href="./public/output.css" rel="stylesheet"></link>
      </head>
      <body class="">
        <form action="" method="post">
          <div class="flex flex-col h-screen bg-gray-800 text-white">
            <header class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h1 class="text-2xl font-bold">JSLox</h1>
              <div class="flex items-center gap-4">
                <button
                  type="submit"
                  class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-white border-white"
                >
                  Show Tokens
                </button>
              </div>
            </header>
            <main class="flex flex-1 overflow-hidden">{props.children}</main>
          </div>
        </form>
      </body>
    </html>
  );
}

export function CodeInput(
  props: PropsWithChildren<{ source?: string; class?: string }>
) {
  return (
    <div class={props.class + " p-6"}>
      <h2 class="text-lg font-semibold mb-4">Input Code</h2>
      <textarea
        class="flex w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[500px] bg-gray-700 text-white border-gray-600"
        placeholder="Enter your code here..."
        name="source"
      >
        {props.source}
      </textarea>
    </div>
  );
}

export function CodeViewer(
  props: PropsWithChildren<{ source: string; tokens: Token[]; class?: string }>
) {
  const breakpoints = props.tokens.reduce(
    (acc, token) => [...acc, token.startIndex, token.endIndex],
    new Array<number>()
  );

  let previousBreakpoint: number | null = null;
  let spans = new Array<string>();
  for (const breakpoint of breakpoints) {
    if (previousBreakpoint === null) {
      previousBreakpoint = breakpoint;
      continue;
    } else {
      spans.push(props.source.slice(previousBreakpoint, breakpoint));
      previousBreakpoint = breakpoint;
    }
  }

  return (
    <div class={props.class + " p-6"}>
      <h2 class="text-lg font-semibold mb-4">Input Code</h2>
      <pre class="w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[500px] bg-gray-700 text-white border-gray-600">
        {spans.map((span) => (
          <span class="hover:bg-gray-600 hover:border-gray-600 rounded-md border-4 border-transparent">
            {span}
          </span>
        ))}
      </pre>
    </div>
  );
}

export function TokensViewer(
  props: PropsWithChildren<{ source: string; tokens: Token[]; class?: string }>
) {
  return (
    <div class={props.class + " p-6 pt-0"}>
      <h2 class="text-lg font-semibold pb-4 pt-6 sticky top-0 bg-gray-800">
        Tokens
      </h2>
      <div class="flex flex-col space-y-4">
        {props.tokens.map((token) => (
          <TokenViewer
            source={props.source.slice(token.startIndex, token.endIndex)}
            token={token}
          />
        ))}
      </div>
    </div>
  );
}
function TokenViewer(
  props: PropsWithChildren<{ source: string; token: Token }>
) {
  return (
    <div
      class="border border-gray-700 p-4 rounded-md bg-gray-700"
      id={props.token.startIndex}
    >
      <p class="font-mono">{props.source}</p>
      <p class="text-sm text-gray-400">Details</p>
      <pre class="text-sm text-gray-400">
        {JSON.stringify(props.token, null, 2)}
      </pre>
    </div>
  );
}
