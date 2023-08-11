import { type Component, Show, Switch, Match, createSignal, batch, For } from "solid-js";
import { createStore } from "solid-js/store";

import Header from "@/components/landing/Header";
import { createFileImporter, makeFileUpload } from "@/utils/files";

import IconPlus from "~icons/mdi/plus";
import { auth } from "@/stores/auth";

const Page: Component = () => {
  interface MainState { view: "main", dragging: boolean }
  interface UploadingState { view: "uploading", uploads: null, private: boolean, workspace_id: string }
  interface UploadedState { view: "uploaded", uploads: any[] }
  
  const [filesToUpload, setFilesToUpload] = createSignal<FileList | Array<File>>([]);
  const [state, setState] = createStore<(
    | MainState
    | UploadingState
    | UploadedState
  )>({
    view: "main",
    dragging: false
  });

  const handleUploadedFiles = (files: FileList | Array<File>) => batch(() => {
    setFilesToUpload(files);
    setState({ view: "uploading", uploads: null });
  });

  return (
    <div class="h-screen w-screen relative text-sm"
      onDrop={(event) => {
        event.preventDefault();
        if (!event.dataTransfer) return;

        let files: Array<File> | FileList = [];

        // Use `DataTransferItemList` interface to access the file(s)
        if (event.dataTransfer.items) {
          [...event.dataTransfer.items].forEach((item) => {
            // If dropped items aren't files, reject them.
            if (item.kind === "file") {
              const file = item.getAsFile();
              if (!file) return;
              
              (files as Array<File>).push(file);
            }
          });
        }
        // Use `DataTransfer` interface to access the files.
        else {
          files = event.dataTransfer.files;
        }
        
        handleUploadedFiles(files);
        setState({ dragging: false });
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setState({ dragging: true });
      }}
      onDragLeave={(event) => {
        if (event.x === 0 && event.y === 0) {
          setState({ dragging: false });
        }
      }}
    >
      <Header />
      <main class=" border-2  rounded-lg shadow-xl w-96 h-fit p-4 m-auto absolute left-0 right-0 top-0 bottom-0 backdrop-blur-lg"
        classList={{
          "border-surface0 bg-base/40": !(state.view === "main" && state.dragging),
          "border-lavender bg-lavender/20": state.view === "main" && state.dragging
        }}
      >
        <Switch>
          <Match when={state.view === "main"}>
            <section class="flex gap-x-3 py-16 pl-8 justify-start">
              <div class="flex flex-row gap-x-6">
                <button type="button" class="rounded-full p-2 aspect-square m-auto bg-lavender cursor-pointer hover:bg-[#5f72d9] transition-colors duration-200"
                  onClick={() => createFileImporter(handleUploadedFiles)}
                >
                  <IconPlus class="text-4xl text-mantle" />
                </button>

                <div class="flex flex-col gap-1">
                  <h1 class="text-xl font-semibold text-text">
                    Drop it {!(state as MainState).dragging ? "like it's hot." : "!"}
                  </h1>
                  <Show when={!(state as MainState).dragging}
                    fallback={
                      <p class="text-subtext0">Drop the files to upload them!</p>
                    }
                  >
                    <span class="text-subtext0">Or if you prefer...</span>
                    <span class="text-subtext1">
                      select some{" "}
                      <button type="button" class="underline-dotted underline hover:underline-solid hover:underline-lavender hover:text-lavender"
                        onClick={() => createFileImporter(handleUploadedFiles)}
                      >
                        files
                      </button>{" "}
                      or a{" "}
                      <button type="button" class="underline-dotted underline hover:underline-solid hover:underline-lavender hover:text-lavender">
                        folder
                      </button>
                      .
                    </span>
                  </Show>
                </div>
              </div>
            </section>
          </Match>
          <Match when={state.view === "uploading"}>
            <form class="flex flex-col gap-4" onSubmit={async (event) => {
              event.preventDefault();
              const uploads = await makeFileUpload(filesToUpload(), {
                private: (state as UploadingState).private
              });

              setState({ view: "uploaded", uploads });
            }}>
              <h2 class="text-xl font-semibold text-text">
                Do you want to upload {filesToUpload().length === 1 ? "this file" : `those ${filesToUpload().length} files`} ?
              </h2>

              <Show when={auth.session && auth.profile}
                fallback={
                  <p>Since you're not logged in, the uploads will be always public.</p>
                }
              >
                <label class="flex gap-2">
                  Should be private ?
                  <input type="checkbox" checked={(state as UploadingState).private}
                    onChange={(event) => setState({ private: event.currentTarget.checked })}
                  />
                </label>
              </Show>

              <button type="submit"
                class="px-2 py-1 rounded bg-text text-base"
              >
                Send to the catto!
              </button>

              <button type="button"
                class="px-2 py-1 rounded border border-base text-base"
                onClick={() => batch(() => {
                  setState({ view: "main", dragging: false });
                  setFilesToUpload([]);
                })}
              >
                Finally, no
              </button>
            </form>
          </Match>
          <Match when={state.view === "uploaded"}>
            <section>
              <h2>Your files are ready!</h2>
              <p>Our cats uploaded those files just for you!</p>

              <For each={(state as UploadedState).uploads}>
                {upload => (
                  <div class="flex flex-col">
                    <p>{upload.name}</p>
                    <p class="text-sm">{upload.id}</p>
                  </div>
                )}
              </For>
            </section>
          </Match>
        </Switch>
      </main>
    </div>
  );
};

export default Page;
