import type { PropsWithChildren } from "@kitajs/html";

import { TokenViewer } from "./TokenViewer";
import type { TokenWithId } from "../utils";

export function TokensViewer(
  props: PropsWithChildren<{
    source: string;
    tokens: TokenWithId[];
    class?: string;
  }>
) {
  return (
    <div class="flex-grow flex flex-col space-y-4 overflow-auto">
      {props.tokens.map((token) => (
        <TokenViewer
          source={props.source.slice(token.startIndex, token.endIndex)}
          token={token}
        />
      ))}
    </div>
  );
}
