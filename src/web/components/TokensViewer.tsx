import type { PropsWithChildren } from "@kitajs/html";

import { TokenViewer } from "./TokenViewer";
import type { TokenWithId } from "./utils";
import { Button } from "./Button";

export function TokensViewer(
  props: PropsWithChildren<{
    source: string;
    tokens: TokenWithId[];
    class?: string;
  }>
) {
  return (
    <div class={props.class + " flex flex-col"}>
      <h2 class="text-lg font-bold pb-4">Tokens</h2>
      <div class="flex-grow flex flex-col space-y-4 overflow-auto">
        {props.tokens.map((token) => (
          <TokenViewer
            source={props.source.slice(token.startIndex, token.endIndex)}
            token={token}
          />
        ))}
      </div>
      <form
        method="post"
        action="/parsed"
        class=" mt-6 w-full flex justify-end"
      >
        <input type="hidden" name="source" value={props.source} />
        <Button direction="forward">Parse</Button>
      </form>
    </div>
  );
}
