import { type Ast } from "../../domain/parse";
import { codeCss } from "../utils";
import { type PropsWithChildren } from "@kitajs/html";
import { NodeViewer } from "../components/NodeViewer";

export function ASTViewer(props: PropsWithChildren<{ parsed: Ast }>) {
  return (
    <div class={codeCss + " overflow-auto grow"}>
      <NodeViewer node={props.parsed} />
    </div>
  );
}
