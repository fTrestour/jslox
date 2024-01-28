import type { PropsWithChildren } from "@kitajs/html";
import { codeCss, type TokenWithId } from "../utils";

export function CodeViewer(
  props: PropsWithChildren<{
    source: string;
    tokens: TokenWithId[];
    class?: string;
  }>
) {
  let previousBreakpoint = 0;
  let spans = new Array<{ value: string; id: number | null }>();
  for (const token of props.tokens) {
    spans.push({
      value: props.source.slice(previousBreakpoint, token.startIndex),
      id: null,
    });
    spans.push({
      value: props.source.slice(token.startIndex, token.endIndex),
      id: token.startIndex,
    });
    previousBreakpoint = token.endIndex;
  }

  return (
    <pre class={codeCss + " flex-grow w-full overflow-auto"}>
      {spans.map((span) =>
        span.id !== null ? (
          <span
            class="target:border-yellow hover:border-light rounded-md border-2 p-0.5 border-transparent"
            id={span.id}
          >
            {span.value}
          </span>
        ) : (
          <span>{span.value}</span>
        )
      )}
    </pre>
  );
}
