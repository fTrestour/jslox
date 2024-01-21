import type { PropsWithChildren } from "@kitajs/html";
import { Button } from "./Button";
import { codeCss } from "./utils";

export function CodeInput(
  props: PropsWithChildren<{ source?: string; class?: string }>
) {
  return (
    <div class={props.class + " flex flex-col"}>
      <h2 class="text-lg font-semibold mb-4">Input Code</h2>
      <form class="flex-grow flex flex-col" action="" method="post">
        <textarea
          class={
            codeCss + " flex-grow w-full outline-none  placeholder:text-inherit"
          }
          placeholder="Enter your code here..."
          name="source"
        >
          {props.source}
        </textarea>
        <Button class="mt-6 ml-auto">Tokenize</Button>
      </form>
    </div>
  );
}
