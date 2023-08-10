import IconPlus from "~icons/mdi/plus";
import Header from "@/components/landing/Header";
import { Ref, Show, createSignal, onMount } from "solid-js";


export default function Home() {
  const [dropzoneVisible, setDropzoneVisible] = createSignal(false);

  let dropZone: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;

  const handleFiles = (files: any) => {
    console.log(files);
  }

  function allowDrag(e: any) {
    if (true) {  // Test that the item being dragged is a valid one
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
    }
  } 

  window.addEventListener('dragenter', function(e) {
    console.log("yeet")
    setDropzoneVisible(true);
  });

  onMount(() => {
    if (!dropZone) return;

    //@ts-ignore
    dropZone.addEventListener('dragenter', allowDrag);
    //@ts-ignore
    dropZone.addEventListener('dragover', allowDrag);

    //@ts-ignore
    dropZone.addEventListener('dragleave', () => {
      console.log("pog");
      setDropzoneVisible(false);
    })
    //@ts-ignore
    dropZone.addEventListener('drop', handleDrop);
  });

  const handleDrop = (e: any) => {
    e.preventDefault();
    console.log("naisu");
    console.log(e);
  }

  return (
    <div>
      <Show when={dropzoneVisible()}>
        <div id="dropzone" ref={dropZone} class="dropzone fixed top-0 left-0 z-10 w-full h-screen bg-lavender">file upload overlay?</div>
      </Show>
      <main class="h-screen w-screen relative text-sm">
        <Header />
        <div class="bg-base/30 border border-surface0 rounded-lg shadow-xl w-96 h-fit p-4 m-auto absolute left-0 right-0 top-0 bottom-0 backdrop-blur-lg">
          <form method="post" action="" enctype="multipart/form-data" class="flex gap-x-3 py-16 pl-8 justify-start">
            <div class="flex flex-row gap-x-6">
              <input type="file" id="fileElem" multiple accept="image/*" onChange={files => handleFiles(files)} class="hidden" />
              <label for="fileElem" class="rounded-full p-2 aspect-square m-auto bg-lavender cursor-pointer hover:bg-[#5f72d9] transition-colors duration-200">
                <IconPlus class="text-4xl text-mantle" />
              </label>
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
          </form>
        </div>
      </main>
    </div>
  );
}


