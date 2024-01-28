import type { PropsWithChildren } from "@kitajs/html";

export function App(props: PropsWithChildren<{ class?: string }>) {
  return (
    <html lang="en">
      <head>
        <title>Lox analyzer</title>
        <link href="./public/output.css" rel="stylesheet"></link>
        <link rel="icon" type="image/x-icon" href="./public/favicon.ico"></link>
      </head>
      <body class="">
        <div class="flex flex-col h-screen bg-background text-yellow p-8">
          <header class="flex flex-col items-start justify-between text-pink border-pink border-8 w-[510px] mb-8">
            <h1 class="text-5xl w-full p-2 font-bold border-b-8 border-pink">
              Lox analyzer.
            </h1>
            <h2 class="text-2xl w-full p-2 bg-pink border-pink text-background">
              Tokenize and parse Lox code
            </h2>
          </header>
          <main class={props.class + " h-full overflow-clip"}>
            {props.children}
          </main>
        </div>
      </body>
    </html>
  );
}
