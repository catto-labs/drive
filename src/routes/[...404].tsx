import {
  type Component,
} from "solid-js";
import { A } from "solid-start";

import Header from "@/components/landing/Header";

const Page: Component = () => {

  return (
    <div
      class="relative h-screen w-screen text-sm"
    >
      <Header />
      <main
        class="absolute bottom-0 left-0 right-0 top-0 m-auto h-fit w-96 border-2 border-surface0 rounded-lg bg-base/80 p-4 shadow-xl backdrop-blur-lg transition-all"
      >
        <div class="flex flex-col gap-1">
          <h1 class="text-xl font-semibold text-[#0f0f0f]">
            Error 404: Where are you going?
          </h1>
          <span class="text-text">I can't find the page you're looking for!</span>
          <span class="text-text">Why don't we go back home instead, shall we?</span>

          <A
            href="/"
            class="mt-4 w-full text-center text-lavender underline decoration-dotted hover:decoration-solid"
          >
            Navigate back to home
          </A>
        </div>
      </main>
    </div>
  );
};

export default Page;