import type { PropsWithChildren } from "@kitajs/html";

export function App(props: PropsWithChildren<{ class?: string }>) {
  return (
    <html lang="en">
      <head>
        <title>Lox analyzer</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="./public/output.css" rel="stylesheet"></link>
        <link rel="icon" type="image/x-icon" href="./public/favicon.ico"></link>
      </head>
      <body class="flex flex-col min-h-screen h-screen bg-background text-yellow p-8">
        <header class="mx-auto lg:mx-0 border-8 border-pink max-w-[510px] mb-8">
          <h1 class="border-b-8 border-pink font-bold text-5xl p-2 text-pink">
            Lox Analyzer.
          </h1>
          <p class="text-2xl text-right p-2 bg-pink text-dark">
            Tokenize and parse Lox code
          </p>
        </header>
        <main class={props.class + " h-full lg:overflow-clip"}>
          {props.children}
        </main>
      </body>
    </html>
  );
}
