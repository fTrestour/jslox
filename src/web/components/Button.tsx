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
        " pl-2 before:left-0 w-fit h-fit p-1 relative before:absolute before:content-[' '] before:top-0 before:h-full before:w-0.5 hocus:before:w-full before:bg-yellow focus:outline-none before:transition-all before:duration-200 group border-yellow border-2 border-l-0"
      }
    >
      <span class="relative text-yellow group-hocus:text-background pr-1  before:transition-all before:duration-200">
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
      ? "pr-2 before:right-0 border-r-0"
      : "pl-2 before:left-0 border-l-0";

  const test2 = props.direction === "backward" ? "pl-1" : "pr-1";
  return (
    <a
      href={props.href}
      class={
        props.class +
        " w-fit h-fit p-1 relative before:absolute before:content-[' '] before:top-0 before:h-full before:w-0.5 hocus:before:w-full before:bg-yellow focus:outline-none before:transition-all before:duration-200 group border-yellow border-2 " +
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
