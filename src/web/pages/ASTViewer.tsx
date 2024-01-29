import { type Ast } from "../../domain/parse";
import { codeCss, type TokenWithId } from "../utils";
import { type PropsWithChildren } from "@kitajs/html";
import { NodeViewer } from "../components/NodeViewer";
import type { Result } from "neverthrow";

export function ASTViewer(
  props: PropsWithChildren<{
    parsed: Result<Ast<TokenWithId>, Error>;
    class?: string;
  }>
) {
  if (props.parsed.isErr())
    return <div class={codeCss + " overflow-auto grow " + props.class}></div>;

  return (
    <div class={codeCss + " overflow-auto grow " + props.class}>
      <NodeViewer node={props.parsed.value} />
    </div>
  );
}
