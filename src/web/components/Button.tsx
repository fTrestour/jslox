import type { PropsWithChildren } from "@kitajs/html";

export function Button({
  children,
  class: _class,
  ...props
}: PropsWithChildren<{
  direction: "backward" | "forward";
}> &
  JSX.HtmlButtonTag) {
  return (
    <button
      {...props}
      class={
        _class +
        " pl-6 before:left-0 w-fit h-fit p-2 relative before:absolute before:content-[' '] before:top-0 before:h-full before:w-1 hocus:before:w-full before:bg-yellow focus:outline-none before:transition-all before:duration-200 group border-yellow border-4 border-l-0"
      }
    >
      <span class="relative text-yellow group-hocus:text-background pr-4  before:transition-all before:duration-200">
        {children}
      </span>
    </button>
  );
}

export function Link(
  props: PropsWithChildren<{
    direction: "backward" | "forward";
    href: string;
    class?: string;
  }>
) {
  const test =
    props.direction === "backward"
      ? "pr-6 before:right-0 border-r-0"
      : "pl-6 before:left-0 border-l-0";

  const test2 = props.direction === "backward" ? "pl-4" : "pr-4";
  return (
    <a
      href={props.href}
      class={
        props.class +
        " w-fit h-fit p-2 relative before:absolute before:content-[' '] before:top-0 before:h-full before:w-1 hocus:before:w-full before:bg-yellow focus:outline-none before:transition-all before:duration-200 group border-yellow border-4 " +
        test
      }
    >
      <span
        class={
          "relative text-yellow group-hocus:text-background before:transition-all before:duration-200 " +
          test2
        }
      >
        {props.children}
      </span>
    </a>
  );
}
