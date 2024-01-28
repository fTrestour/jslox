import Elysia, { t } from "elysia";
import { parse } from "../../domain/parse";
import { tokenize } from "../../domain/tokenize";
import { App } from "../components/App";
import { codeCss } from "../components/utils";
import { Html, type PropsWithChildren } from "@kitajs/html";
import { CodeViewer } from "../components/CodeViewer";
import { TokensViewer } from "../components/TokensViewer";
import { randomUUID } from "crypto";

export default new Elysia().post(
  "/parsed",
  (req) => {
    const source = req.body.source;
    const tokens = tokenize(source).map((token) => ({
      ...token,
      id: randomUUID(),
    }));
    const parsed = parse(tokens);

    return (
      <App>
        <CodeViewer class="w-1/3" source={source} tokens={tokens} />
        <TokensViewer class="w-1/3" source={source} tokens={tokens} />
        <div class="w-1/3 flex flex-col">
          <h2 class="text-lg font-bold pb-4">AST</h2>
          <div class={codeCss + " overflow-auto grow"}>
            <NodeViewer node={parsed} />
          </div>
        </div>
      </App>
    );
  },
  {
    body: t.Object({
      source: t.String(),
    }),
  }
);

function NodeViewer(
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

function LeafViewer(props: PropsWithChildren<{ key: string; value: any }>) {
  const value = props.value ?? "null";

  return (
    <p class="peer hover:text-yellow">
      {props.key} : <span class="text-green">{value}</span>
    </p>
  );
}
