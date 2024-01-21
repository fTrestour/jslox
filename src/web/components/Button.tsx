import type { PropsWithChildren } from "@kitajs/html";

export function Button(props: PropsWithChildren<{ class?: string }>) {
  return (
    <button
      type="submit"
      class={
        props.class +
        " w-fit p-2 pl-6 before:left-0 relative before:absolute before:content-[' '] before:top-0 before:h-full before:w-1 hocus:before:w-full before:bg-yellow focus:outline-none before:transition-all before:duration-200 group border-yellow border-4 border-l-0"
      }
    >
      <span class="relative text-yellow group-hocus:text-background pr-4  before:transition-all before:duration-200">
        {props.children}
      </span>
    </button>
  );
}
