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
      class="relative h-screen w-screen text-sm"
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
        class="absolute bottom-0 left-0 right-0 top-0 m-auto h-fit w-96 border-2 rounded-lg p-4 shadow-xl backdrop-blur-lg transition-all"
        classList={{
          "border-surface0 bg-base/80": !(
            state.view === "main" && state.dragging
          ),
          "border-lavender bg-base/80": state.view === "main" && state.dragging,
        }}
      >
        <Switch>
          <Match when={state.view === "main"}>
            <section class="flex justify-start gap-x-3 py-16 pl-6 transition-all">
              <div class="flex flex-row gap-x-6">
                <button
                  type="button"
                  class="m-auto aspect-square cursor-pointer rounded-full bg-lavender p-2 transition-colors duration-200 hover:bg-[#5f72d9]"
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
                        class="underline underline-dotted hover:text-lavender hover:underline-lavender hover:underline-solid"
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
              <h2 class="overflow-hidden text-ellipsis text-xl font-semibold text-text">
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
                <label class="my-2 flex items-center gap-2">
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

              <button type="submit" class="rounded bg-lavender px-3 py-1.5 text-base hover:bg-[#5f72d9]">
                Send to the catto! (Upload)
              </button>

              <button
                type="button"
                class="border border-surface2 rounded px-2 py-1 text-subtext1 hover:bg-surface2"
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
              <p class="mb-1 text-subtext0">Our cats uploaded those files just for you! ପ(๑•ᴗ•๑)ଓ They are now ready to be accessed by you or other users.</p>

              <p class="text-lg font-medium text-text">Here's an overview of all uploaded files:</p>
              <div class="flex flex-col gap-2">
                <For each={(state as UploadedState).uploads}>
                  {(upload) => (
                    <div class="w-full flex flex-col">
                      <div class="w-full flex flex-row items-baseline justify-between">
                        <p class="text-[15px] text-[#0e0e0e]">{upload.name}</p>
                        <p class="ml-1 rounded-xl bg-sapphire px-4 py-1 text-sm text-crust">{upload.private ? "Private" : "Public"}</p>
                      </div>

                      <Show when={!upload.private}>
                        <button
                          type="button"
                          class="mt-1 rounded bg-lavender px-2 py-1 text-crust"
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
              class="mt-4 w-full border border-lavender rounded px-4 py-2 text-text hover:bg-lavender hover:text-crust"
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
