import type { PropsWithChildren } from "@kitajs/html";
import { codeCss, type TokenWithId } from "./utils";

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
    <div class={props.class + " flex flex-col"}>
      <h2 class="text-lg font-semibold mb-4">Input Code</h2>
      <pre class={codeCss + " flex-grow w-full"}>
        {spans.map((span) =>
          span.tokenId !== null ? (
            <a href={`#${span.tokenId}`}>
              <span class="hover:bg-light hover:border-light rounded-md border-4 border-transparent">
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