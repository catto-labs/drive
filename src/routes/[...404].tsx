import {
  type Component,
} from "solid-js";
import { A } from "solid-start";

import Header from "@/components/landing/Header";

const Page: Component = () => {

  return (
    <div
      class="h-screen w-screen relative text-sm"
    >
      <Header />
      <main
        class="border-2 border-surface0 bg-base/80 rounded-lg shadow-xl w-96 h-fit p-4 m-auto transition-all absolute left-0 right-0 top-0 bottom-0 backdrop-blur-lg"
      >
        <div class="flex flex-col gap-1">
          <h1 class="text-xl font-semibold text-[#0f0f0f]">
            Error 404: Where are you going?
          </h1>
          <span class="text-text">I can't find the page you're looking for!</span>
          <span class="text-text">Why don't we go back home instead, shall we?</span>

          <A
            href="/"
            class=" underline decoration-dotted hover:decoration-solid text-lavender mt-4 w-full text-center"
          >
            Navigate back to home
          </A>
        </div>
      </main>
    </div>
  );
};

export default Page;