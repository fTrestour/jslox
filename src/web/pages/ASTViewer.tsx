import { type Ast } from "../../domain/parse";
import { codeCss, type TokenWithId } from "../utils";
import { type PropsWithChildren } from "@kitajs/html";
import { NodeViewer } from "../components/NodeViewer";

export function ASTViewer(
  props: PropsWithChildren<{ parsed: Ast<TokenWithId>; class?: string }>
) {
  return (
    <div class={codeCss + " overflow-auto grow " + props.class}>
      <NodeViewer node={props.parsed} />
    </div>
  );
}
