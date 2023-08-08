import IconPlus from "~icons/mdi/plus";
import IconAccount from "~icons/mdi/account";

import { A } from "solid-start";

export default function Home() {
  return (
    <main class="h-screen w-screen relative text-sm">
      <header class="bg-gradient-to-b bg-gradient-from-crust h-64 p-8 flex justify-end gap-x-4">
        <A
          href="https://github.com/catto-labs/drive"
          class="text-crust inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 px-4 py-2 rounded-md h-fit shadow-inner shadow-lg transform duration-150"
        >
          Command-line Client
        </A>
        <A
          href="/dashboard"
          class="text-crust mr-6 inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 px-4 py-2 rounded-md h-fit shadow-inner shadow-lg transform duration-150"
        >
          Dashboard
        </A>
        <A
          href="/"
          class="text-crust inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 pl-3 pr-4 py-2 rounded-md h-fit shadow-inner shadow-lg transform duration-150"
        >
          <IconAccount class="text-[16px] my-auto" />
          My Account
        </A>
      </header>
      <div class="bg-text border border-subtext0 rounded-lg shadow-xl w-fit h-fit p-4 m-auto absolute left-0 right-0 top-0 bottom-0">
        <div class="flex gap-x-3 py-16 pr-16">
          <div class="rounded-full p-2 h-fit w-fit aspect-square m-auto bg-sapphire">
            <IconPlus class="text-3xl text-mantle" />
          </div>
          <div class="flex flex-col gap-y-1">
            <h1 class="text-xl font-semibold text-crust">
              Drop it like it's hot.
            </h1>
            <span class="text-mantle">Or if you prefer...</span>
            <span class="text-mantle">
              select some{" "}
              <button class="underline-dotted underline hover:underline-solid">
                files
              </button>{" "}
              or a{" "}
              <button class="underline-dotted underline hover:underline-solid">
                folder
              </button>
              .
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

/*
<main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl">catto drive</h1>
      <A href="/dashboard">dashboard!</A>
    </main>
    */
