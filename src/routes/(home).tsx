import {
  type Component,
  Show,
  Switch,
  Match,
  createSignal,
  batch,
  For,
} from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "solid-start";

import Header from "@/components/landing/Header";
import {
  createFileImporter,
  getUploadedFileURL,
  makeFileUpload,
} from "@/utils/files";

import IconPlus from "~icons/mdi/plus";
import { auth } from "@/stores/auth";
import type { UploadedFile } from "@/types/api";

const Page: Component = () => {
  interface MainState {
    view: "main";
    dragging: boolean;
  }
  interface UploadingState {
    view: "uploading";
    uploads: null;
    private: boolean;
    workspace_id: string;
  }
  interface UploadedState {
    view: "uploaded";
    uploads: UploadedFile[];
  }

  const [filesToUpload, setFilesToUpload] = createSignal<
    FileList | Array<File>
  >([]);
  const [state, setState] = createStore<
    MainState | UploadingState | UploadedState
  >({
    view: "main",
    dragging: false,
  });

  const handleUploadedFiles = (files: FileList | Array<File>) =>
    batch(() => {
      setFilesToUpload(files);
      setState({ view: "uploading", uploads: null });
    });

  return (
    <div
      class="h-screen w-screen relative text-sm"
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
      <main
        class=" border-2  rounded-lg shadow-xl w-96 h-fit p-4 m-auto transition-all absolute left-0 right-0 top-0 bottom-0 backdrop-blur-lg"
        classList={{
          "border-surface0 bg-base/80": !(
            state.view === "main" && state.dragging
          ),
          "border-lavender bg-base/80": state.view === "main" && state.dragging,
        }}
      >
        <Switch>
          <Match when={state.view === "main"}>
            <section class="flex gap-x-3 py-16 pl-6 justify-start transition-all">
              <div class="flex flex-row gap-x-6">
                <button
                  type="button"
                  class="rounded-full p-2 aspect-square m-auto bg-lavender cursor-pointer hover:bg-[#5f72d9] transition-colors duration-200"
                  onClick={() => createFileImporter(handleUploadedFiles)}
                >
                  <IconPlus class="text-4xl text-mantle" />
                </button>

                <div class="flex flex-col gap-1">
                  <h1 class="text-xl font-semibold text-[#0f0f0f]">
                    {!(state as MainState).dragging
                      ? "Drop it like it's hot."
                      : "Ready for blast off!"}
                  </h1>
                  <Show
                    when={!(state as MainState).dragging}
                    fallback={
                      <p class="text-subtext1">
                        Drop the files to upload them!
                      </p>
                    }
                  >
                    <span class="text-text">Upload files by dragging them here</span>
                    <span class="text-subtext1">
                      or 
                      <button
                        type="button"
                        class="underline-dotted underline hover:underline-solid hover:underline-lavender hover:text-lavender"
                        onClick={() => createFileImporter(handleUploadedFiles)}
                      >
                        select some files yourself.
                      </button>
                    </span>
                  </Show>
                </div>
              </div>
            </section>
          </Match>
          <Match when={state.view === "uploading"}>
            <form
              class="flex flex-col gap-2"
              onSubmit={async (event) => {
                event.preventDefault();
                const uploads = await makeFileUpload(filesToUpload(), {
                  private: (state as UploadingState).private,
                });

                setState({ view: "uploaded", uploads });
              }}
            >
              <h2 class="text-xl font-semibold text-text text-ellipsis overflow-hidden">
                Do you want to upload{" "}
                {filesToUpload().length === 1
                  ? `the file "${filesToUpload()[0].name}"`
                  : `the ${filesToUpload().length} selected files`}
                ?
              </h2>

              <Show
                when={auth.session && auth.profile}
                fallback={
                  <p class="text-subtext0">
                    Since you're not logged in, the uploads will be
                    public. We recommend you to <A href="/auth/login" class="underline underline-dotted">log in</A> to have full control over your uploads.
                  </p>
                }
              >
                <label class="flex items-center gap-2 my-2">
                  Set private?
                  <input
                    type="checkbox"
                    checked={(state as UploadingState).private}
                    onChange={(event) =>
                      setState({ private: event.currentTarget.checked })
                    }
                  />
                </label>
              </Show>

              <button type="submit" class="px-3 py-1.5 rounded bg-lavender hover:bg-[#5f72d9] text-base">
                Send to the catto! (Upload)
              </button>

              <button
                type="button"
                class="px-2 py-1 rounded border border-surface2 text-subtext1 hover:bg-surface2"
                onClick={() =>
                  batch(() => {
                    setState({ view: "main", dragging: false });
                    setFilesToUpload([]);
                  })
                }
              >
                Oh no, please go back {" "}  𖦹´ ᯅ `𖦹
              </button>
            </form>
          </Match>
          <Match when={state.view === "uploaded"}>
            <section>
              <h2 class="text-2xl font-semibold text-text">We did it! ⋆ ˚｡⋆୨୧˚</h2>
              <p class="text-subtext0 mb-1">Our cats uploaded those files just for you! ପ(๑•ᴗ•๑)ଓ They are now ready to be accessed by you or other users.</p>

              <p class="font-medium text-lg text-text">Here's an overview of all uploaded files:</p>
              <div class="flex flex-col gap-2">
                <For each={(state as UploadedState).uploads}>
                  {(upload) => (
                    <div class="flex flex-col w-full">
                      <div class="flex flex-row items-baseline w-full justify-between">
                        <p class="text-[15px] text-[#0e0e0e]">{upload.name}</p>
                        <p class="text-sm ml-1 px-4 py-1 rounded-xl bg-sapphire text-crust">{upload.private ? "Private" : "Public"}</p>
                      </div>

                      <Show when={!upload.private}>
                        <button
                          type="button"
                          class="mt-1 bg-lavender text-crust px-2 py-1 rounded"
                          onClick={async () => {
                            const url = getUploadedFileURL(upload);
                            await navigator.clipboard.writeText(url.href);
                          }}
                        >
                          Copy public sharing link
                        </button>
                      </Show>
                    </div>
                  )}
                </For>
              </div>
              <button onClick={() => batch(() => {
                setState({ view: "main", dragging: false });
                setFilesToUpload([]);
              })}
                class="w-full mt-4 px-4 py-2 rounded border border-lavender text-text hover:bg-lavender hover:text-crust"
              >
                Go back & upload more files (*ᴗ͈ˬᴗ͈)ꕤ*.ﾟ
              </button>
            </section>
          </Match>
        </Switch>
      </main>
    </div>
  );
};

export default Page;
