import IconPlus from "~icons/mdi/plus";
import Header from "@/components/landing/Header";

export default function Home() {
  return (
    <main class="h-screen w-screen relative text-sm">
      <Header />
      <div class="bg-base/30 border border-surface0 rounded-lg shadow-xl w-96 h-fit p-4 m-auto absolute left-0 right-0 top-0 bottom-0 backdrop-blur-lg">
        <div class="flex gap-x-3 py-16 pl-8 justify-start">
          <div class="flex flex-row gap-x-6">
            <div class="rounded-full p-2 aspect-square m-auto bg-lavender cursor-pointer hover:bg-[#5f72d9] transition-colors duration-200">
              <IconPlus class="text-4xl text-mantle" />
            </div>
            <div class="flex flex-col gap-y-1">
              <h1 class="text-xl font-semibold text-text">
                Drop it like it's hot.
              </h1>
              <span class="text-subtext0">Or if you prefer...</span>
              <span class="text-subtext1">
                select some{" "}
                <button class="underline-dotted underline hover:underline-solid hover:underline-lavender hover:text-lavender">
                  files
                </button>{" "}
                or a{" "}
                <button class="underline-dotted underline hover:underline-solid hover:underline-lavender hover:text-lavender">
                  folder
                </button>
                .
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
