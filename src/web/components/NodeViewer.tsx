import { type PropsWithChildren } from "@kitajs/html";
import { LeafViewer } from "./LeafViewer";

export function NodeViewer(
  props: PropsWithChildren<{
    node: { type: string };
    class?: string;
  }>
) {
  const { type, ...node } = props.node;
  const children = typeof node === "object" ? Object.entries(node) : null;

  return (
    <div class={"p-1 mt-2  text-light text-sm flex flex-col gap-1 w-fit"}>
      <p class="font-mono text-yellow text-m font-medium">{type}</p>
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
