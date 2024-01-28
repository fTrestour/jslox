import type { PropsWithChildren } from "@kitajs/html";
import { codeCss, type TokenWithId } from "../utils";

export function TokenViewer(
  props: PropsWithChildren<{ source: string; token: TokenWithId }>
) {
  const { id, startIndex, ...token } = props.token;
  return (
    <a
      class={
        codeCss +
        " hocus:border-yellow focus:outline-none border-2 border-transparent text-light text-sm flex flex-row gap-4"
      }
      href={`#${startIndex}`}
      id={id}
    >
      <p class="font-mono text-yellow text-m font-medium">{token.type}</p>
      <p class="ml-auto">
        value : <span class="text-green">{props.source}</span>
      </p>
    </a>
  );
}
