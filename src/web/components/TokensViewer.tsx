import type { PropsWithChildren } from "@kitajs/html";

import { TokenViewer } from "./TokenViewer";
import { codeCss, type TokenWithId } from "../utils";
import type { Result } from "neverthrow";
import type { LexicalError } from "../../domain/errors";

export function TokensViewer(
  props: PropsWithChildren<{
    source: string;
    tokens: Result<TokenWithId[], LexicalError>;
    class?: string;
  }>
) {
  if (props.tokens.isErr()) {
    console.error(props.tokens.error);

    return (
      <p class={codeCss + " text-red-400"}>{props.tokens.error.toString()}</p>
    );
  }

  return (
    <div class="flex-grow flex flex-col space-y-4 overflow-auto">
      {props.tokens.value.map((token) => (
        <TokenViewer
          source={props.source.slice(token.startIndex, token.endIndex)}
          token={token}
        />
      ))}
    </div>
  );
}
