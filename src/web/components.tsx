import type { PropsWithChildren } from "@kitajs/html";
import type { Token } from "../domain/tokenize";

type TokenWithId = Token & { id: string };

export function App(props: PropsWithChildren<{ class?: string }>) {
  return (
    <html lang="en">
      <head>
        <title>Lox analyzer</title>
        <link href="./public/output.css" rel="stylesheet"></link>
      </head>
      <body class="">
        <div class="flex flex-col h-screen bg-gray-800 text-white">
          <header class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h1 class="text-2xl font-bold">Lox analyzer</h1>
          </header>
          <main class="flex flex-1 overflow-clip">{props.children}</main>
        </div>
      </body>
    </html>
  );
}

export function CodeInput(
  props: PropsWithChildren<{ source?: string; class?: string }>
) {
  return (
    <div class={props.class + " p-6 flex flex-col"}>
      <h2 class="text-lg font-semibold mb-4">Input Code</h2>
      <form class="flex-grow flex flex-col" action="" method="post">
        <textarea
          class="flex-grow w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[500px] bg-gray-700 text-white border-gray-600 font-mono"
          placeholder="Enter your code here..."
          name="source"
        >
          {props.source}
        </textarea>
        <button
          type="submit"
          class="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-white border-white w-fit"
        >
          Analyze
        </button>
      </form>
    </div>
  );
}

export function CodeViewer(
  props: PropsWithChildren<{
    source: string;
    tokens: TokenWithId[];
    class?: string;
  }>
) {
  let previousBreakpoint = 0;
  let spans = new Array<{ value: string; tokenId: string | null }>();
  for (const token of props.tokens) {
    spans.push({
      value: props.source.slice(previousBreakpoint, token.startIndex),
      tokenId: null,
    });
    spans.push({
      value: props.source.slice(token.startIndex, token.endIndex),
      tokenId: token.id,
    });
    previousBreakpoint = token.endIndex;
  }

  return (
    <div class={props.class + " p-6 flex flex-col"}>
      <h2 class="text-lg font-semibold mb-4">Input Code</h2>
      <pre class="flex-grow w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[500px] bg-gray-700 text-white border-gray-600">
        {spans.map((span) =>
          span.tokenId !== null ? (
            <a href={`#${span.tokenId}`}>
              <span class="hover:bg-gray-600 hover:border-gray-600 rounded-md border-4 border-transparent">
                {span.value}
              </span>
            </a>
          ) : (
            <span>{span.value}</span>
          )
        )}
      </pre>
    </div>
  );
}

export function TokensViewer(
  props: PropsWithChildren<{
    source: string;
    tokens: TokenWithId[];
    class?: string;
  }>
) {
  return (
    <div class={props.class + " py-6 flex flex-col"}>
      <h2 class="text-lg font-semibold pb-4 px-6">Tokens</h2>
      <div class="flex-grow flex flex-col space-y-4 px-6 overflow-auto">
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
  props: PropsWithChildren<{ source: string; token: TokenWithId }>
) {
  const { id, ...token } = props.token;
  return (
    <div
      class="border border-gray-700 p-4 rounded-md bg-gray-700 target:bg-gray-500"
      id={id}
    >
      <p class="font-mono">{props.source}</p>
      <p class="text-sm text-gray-400">Details</p>
      <pre class="text-sm text-gray-400">{JSON.stringify(token, null, 2)}</pre>
    </div>
  );
}
