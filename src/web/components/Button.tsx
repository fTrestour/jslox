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
        " px-4 py-2 before:left-0 w-fit relative before:absolute before:content-[' '] before:top-0 before:h-full before:w-0.5 hocus:before:w-full before:bg-yellow focus:outline-none before:transition-all before:duration-200 group border-yellow border-2 border-l-0 h-12"
      }
    >
      <span class="relative text-yellow group-hocus:text-background">
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
  const aCss =
    props.direction === "backward"
      ? "before:right-0 border-r-0"
      : "before:left-0 border-l-0";

  return (
    <a
      href={props.href}
      class={
        props.class +
        " w-fit h-12 px-4 py-2 flex relative items-center before:absolute before:content-[' '] before:top-0 before:h-full before:w-0.5 hocus:before:w-full before:bg-yellow focus:outline-none before:transition-all before:duration-200 group border-yellow border-2 " +
        aCss
      }
    >
      <span class={"relative text-yellow group-hocus:text-background"}>
        {props.children}
      </span>
    </a>
  );
}
