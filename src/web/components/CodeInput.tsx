import type { PropsWithChildren } from "@kitajs/html";
import { Button } from "./Button";
import { codeCss } from "./utils";

export function CodeInput(
  props: PropsWithChildren<{ source: string; class?: string }>
) {
  return (
    <div class={props.class + " flex flex-col overflow-auto"}>
      <h2 class="text-lg font-semibold mb-4">Input Code</h2>
      <form class="flex-grow flex flex-col" action="tokenized" method="post">
        <textarea
          class={
            codeCss + " flex-grow w-full outline-none  placeholder:text-inherit"
          }
          name="source"
        >
          {props.source}
        </textarea>
        <Button class="mt-6 ml-auto" direction="forward">
          Tokenize
        </Button>
      </form>
    </div>
  );
}
