import IconPlus from "~icons/mdi/plus";
import Header from "@/components/landing/Header";

export default function Home() {
  return (
    <main class="h-screen w-screen relative text-sm">
      <Header />
      <div class="bg-text border border-subtext0 rounded-lg shadow-xl w-96 h-fit p-4 m-auto absolute left-0 right-0 top-0 bottom-0">
        <div class="flex gap-x-3 py-16 justify-center">
          <div class="flex flex-row gap-x-6">
            <div class="rounded-full p-2 aspect-square m-auto bg-sapphire">
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
      </div>
    </main>
  );
}