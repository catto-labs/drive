import { type Component, onMount, createSignal, Show, For } from "solid-js";
import { Title, useNavigate } from "solid-start";
import { auth, logOutUser } from "@/stores/auth";

import IconPower from "~icons/mdi/power";
import IconDotsHorizontalCircleOutline from "~icons/mdi/dots-horizontal-circle-outline";
import IconStarOutline from "~icons/mdi/star-outline";
import IconShareVariantOutline from "~icons/mdi/share-variant-outline";

import { createFileUpload } from "@/utils/files";

async function downloadFile(url: string, filename: string) {
  try {
    // Fetch the file
    const response = await fetch(url);
    
    // Check if the request was successful
    if (response.status !== 200) {
      throw new Error(`Unable to download file. HTTP status: ${response.status}`);
    }

    // Get the Blob data
    const blob = await response.blob();

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(downloadLink.href);
      document.body.removeChild(downloadLink);
    }, 100);
  } catch (error) {
    console.error('Error downloading the file:', (error as Error).message);
  }
}


const Page: Component = () => {
  const [files, setFiles] = createSignal<any[] | null>(null);
  const navigate = useNavigate();

  onMount(async () => {
    const response = await fetch("/api/files", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${auth.session!.access_token}`
      }
    });

    const json = await response.json();
    setFiles(json.data as any[]);
  })

  const fileUploadHandler = async (files: FileList) => {
    const formData = new FormData();

    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("/api/files", {
        method: "PUT",
        body: formData,
        headers: {
          "Authorization": `Bearer ${auth.session!.access_token}`
        }
      });

      const json = await response.json();
      const new_uploads = json.data.new_uploads as any[];
      setFiles(files => files ? [...files, ...new_uploads] : new_uploads);
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Title>Dashboard - Drive</Title>

      <div class="backdrop-blur-xl w-screen h-screen relative flex overflow-hidden">
        <div class="bg-text opacity-50 w-1/5 p-4 shrink-0" />

        <div class="flex flex-col h-full bg-text border-l border-subtext0 w-4/5 z-20">
          <header class="shrink-0 sticky top-0 bg-subtext1 border-b border-subtext0 w-full h-1/12 flex flex-row justify-between shadow-sm">
            <h1 class="border-base font-semibold h-full justify-center flex flex-col ml-4">
              My Files
            </h1>
            <div class="flex flex-row gap-x-2 mr-4 items-center">
              <button
                type="button"
                title="Share the selected items items"
                class="hover:text-surface0 text-surface2 hover:text-surface0 transition  hover:bg-subtext0 p-1.5 h-fit rounded-lg"
              >
                <IconShareVariantOutline class="text-xl" />
                {/* this should change to a filled star when a file is starred */}
              </button>
              <button
                type="button"
                title="Toggle favorite"
                class="hover:text-surface0 text-surface2 hover:text-surface0 transition  hover:bg-subtext0 p-1.5 h-fit rounded-lg"
              >
                <IconStarOutline class="text-xl" />
                {/* this should change to a filled star when a file is starred */}
              </button>
              <button
                type="button"
                title="Perform tasks with the selected items"
                class="hover:text-surface0 text-surface2 hover:text-surface0 transition  hover:bg-subtext0 p-1.5 h-fit rounded-lg"
              >
                <IconDotsHorizontalCircleOutline class="text-xl" />
              </button>
              <input
                type="search"
                placeholder="Search..."
                name="search"
                autofocus
                class="py-1 px-4 rounded-xl w-64 mx-4 bg-subtext1 transition border-2 border-overlay2 hover:bg-subtext0 focus-border-subtext1 text-surface0 placeholder-text-surface2"
              />
              <button
                type="button"
                onClick={async () => {
                  await logOutUser();
                  navigate("/");
                }}
                title="Logs you out of catto drive"
                class="hover:text-surface0 text-surface2 hover:text-surface0 transition  hover:bg-subtext0 p-1.5 h-fit rounded-lg"
              >
                <IconPower class="text-xl" />
              </button>
            </div>
          </header>

          <main class="overflow-auto">
            <section class="p-4 h-[200px] flex flex-col gap-1 items-center justify-center">
              <button class="text-2xl font-medium text-crust bg-text hover:bg-subtext0 border border-crust px-4 py-2 rounded-md duration-150"
                type="button"
                onClick={() => createFileUpload(fileUploadHandler)}
              >
                Upload a file !
              </button>
              <p class="text-sm opacity-50">You'll see it's cool</p>

            </section>
            <section class="flex flex-wrap gap-4 p-4">
              <Show when={files()} fallback={
                <p>Loading files...</p>
              }>
                <For each={files()!}>
                  {file => (
                    <div class="max-w-60 h-auto rounded-md p-2 flex flex-col gap-1 border border-crust hover:bg-subtext0">
                      <p class="text-sm">{file.file_name}</p>
                      <button type="button"
                        onClick={async () => {
                          const response = await fetch("/api/file/" + file.id, {
                            method: "GET",
                            headers: {
                              "Authorization": `Bearer ${auth.session!.access_token}`
                            }
                          });
                      
                          const json = await response.json();
                          const url = json.data.url;

                          // find something better ?
                          downloadFile(url, file.file_name);
                        }}
                      >
                        Download
                      </button>
                    </div>
                  )}
                </For>
              </Show>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Page;
