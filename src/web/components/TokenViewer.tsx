import type { PropsWithChildren } from "@kitajs/html";
import { codeCss, type TokenWithId } from "./utils";

export function TokenViewer(
  props: PropsWithChildren<{ source: string; token: TokenWithId }>
) {
  const { id, ...token } = props.token;
  return (
    <div
      class={
        codeCss +
        " target:border-yellow border-2 border-transparent text-light text-sm flex flex-row gap-4"
      }
      id={id}
    >
      <p class="font-mono text-yellow text-m font-medium">{props.source}</p>
      <p class="ml-auto">Type: {token.type}</p>|
      <p class="">
        Index range: [{token.startIndex}-{token.endIndex}]
      </p>
    </div>
  );
}
