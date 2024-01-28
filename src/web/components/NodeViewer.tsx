import { type PropsWithChildren } from "@kitajs/html";
import { LeafViewer } from "./LeafViewer";
import type { Ast } from "../../domain/parse";
import type { TokenWithId } from "../utils";

export function NodeViewer(
  props: PropsWithChildren<{
    node: Ast<TokenWithId>;
    class?: string;
  }>
) {
  const { type, token, ...node } = props.node;
  const children = typeof node === "object" ? Object.entries(node) : null;

  return (
    <div class={"p-1 mt-2  text-light text-sm flex flex-col gap-1 w-fit"}>
      <a
        class="font-mono text-yellow text-m font-medium hocus:underline focus:outline-none"
        href={`#${token.id}`}
      >
        {type}
      </a>
      {children !== null &&
        children.map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return (
              <div>
                <p class="peer hover:text-yellow">{key} :</p>
                <div
                  class="pl-2 border-l-2 border-dotted border-light peer-hover:border-yellow
                  peer-hover:border-solid"
                >
                  {Array.isArray(value) ? (
                    value.map((v) => <NodeViewer node={v as any} />)
                  ) : (
                    <NodeViewer node={value as any} />
                  )}
                </div>
              </div>
            );
          } else {
            return <LeafViewer key={key} value={value} />;
          }
        })}
    </div>
  );
}
