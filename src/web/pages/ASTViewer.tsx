import { type Ast } from "../../domain/parse";
import { codeCss, type TokenWithId } from "../utils";
import { type PropsWithChildren } from "@kitajs/html";
import { NodeViewer } from "../components/NodeViewer";
import type { Result } from "neverthrow";
import { LexicalError } from "../../domain/errors";

export function ASTViewer(
  props: PropsWithChildren<{
    parsed: Result<Ast<TokenWithId>, Error>;
    class?: string;
  }>
) {
  if (props.parsed.isErr()) {
    if (props.parsed.error instanceof LexicalError) {
      return <div class={codeCss + " overflow-auto grow " + props.class}></div>;
    }

    console.error(props.parsed.error);

    return <p class={codeCss + " text-red-400"}>{props.parsed.error.cause}</p>;
  }

  return (
    <div class={codeCss + " overflow-auto grow " + props.class}>
      <NodeViewer node={props.parsed.value} />
    </div>
  );
}
