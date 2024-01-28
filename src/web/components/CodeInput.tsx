import type { PropsWithChildren } from "@kitajs/html";
import { codeCss } from "./utils";

export function CodeInput(props: PropsWithChildren<{ source: string }>) {
  return (
    <textarea
      class={
        codeCss + " flex-grow w-full outline-none  placeholder:text-inherit"
      }
      name="source"
    >
      {props.source}
    </textarea>
  );
}
