import { type PropsWithChildren } from "@kitajs/html";

export function LeafViewer(
  props: PropsWithChildren<{ key: string; value: any }>
) {
  const value = props.value ?? "null";

  return (
    <p class="peer hover:text-yellow">
      {props.key} : <span class="text-green">{value}</span>
    </p>
  );
}
