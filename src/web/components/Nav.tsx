import type { PropsWithChildren } from "@kitajs/html";

export function Nav(props: PropsWithChildren<{ title: string }>) {
  return (
    <div class="flex items-center gap-4">
      <h3 class="text-lg font-bold">{props.title}</h3>
      {props.children}
    </div>
  );
}
