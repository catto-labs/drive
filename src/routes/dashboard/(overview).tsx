import {
  type Component,
  onMount,
  createSignal,
  createEffect,
  Show,
  For,
} from "solid-js";
import { A, Title, useNavigate } from "solid-start";
import { auth, logOutUser } from "@/stores/auth";

import IconPower from "~icons/mdi/power";
import IconDotsHorizontalCircleOutline from "~icons/mdi/dots-horizontal-circle-outline";
import IconStarOutline from "~icons/mdi/star-outline";
import IconShareVariantOutline from "~icons/mdi/share-variant-outline";
import IconChevronRight from "~icons/mdi/chevron-right";
import IconCheck from "~icons/mdi/check";
import IconFileUploadOutline from "~icons/mdi/file-upload-outline";
import IconPlus from "~icons/mdi/plus"
import IconFolderAccountOutine from "~icons/mdi/folder-account-outline"
import IconAccountMultipleOutline from "~icons/mdi/account-multiple-outline"
import IconTrashCanOutline from "~icons/mdi/trash-can-outline"

import cattoDriveLogo from "@/assets/icon/logo.png"

import FullscreenLoader from "@/components/FullscreenLoader";

import { DropdownMenu } from "@kobalte/core";

import { createFileImporter, makeFileUpload } from "@/utils/files";

async function downloadFile(url: string, filename: string) {
  try {
    // Fetch the file
    const response = await fetch(url);

    // Check if the request was successful
    if (response.status !== 200) {
      throw new Error(
        `Unable to download file. HTTP status: ${response.status}`
      );
    }

    // Get the Blob data
    const blob = await response.blob();

    // Create a download link
    const downloadLink = document.createElement("a");
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
    console.error("Error downloading the file:", (error as Error).message);
  }
}

const Page: Component = () => {
  const [view, setView] = createSignal<string>("name");

  const [currentWorkspaceId, setCurrentWorkspaceId] = createSignal(auth.profile!.root_workspace_id);
  const [files, setFiles] = createSignal<any[] | null>(null);
  const navigate = useNavigate();

  onMount(async () => {
    const response = await fetch(`/api/files?workspace_id=${currentWorkspaceId()}`, {
      method: "GET",
      headers: { authorization: auth.profile!.api_token }
    });

    const json = await response.json();
    setFiles(json.data as any[]);
  });

  const fileUploadHandler = async (files: FileList) => {
    try {
      const new_uploads = await makeFileUpload(files, {
        workspace_id: currentWorkspaceId(),
        private: true
      });

      setFiles((files) => (files ? [...files, ...new_uploads] : new_uploads));
    } catch (error) {
      console.error(error);
    }
  };

  createEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Title>Dashboard - Drive</Title>

      <Show
        when={files()}
        fallback={
          <FullscreenLoader
            message="Please wait, our cats are finding your files !"
          />
        }
      >
        <div class="backdrop-blur-xl w-screen h-screen relative flex overflow-hidden">
          <div class="text-text bg-surface0 opacity-80 w-1/5 p-4 shrink-0">
            <div class="flex flex-row gap-3 mb-4">
              <img src={cattoDriveLogo} class="w-10 h-10" />
              <span class="text-lg"><span class="font-bold text-2xl">Drive </span>by catto labs</span>
            </div>
            <button 
              onClick={() => createFileImporter(fileUploadHandler)} 
              class="mb-4 pl-2 pr-4 py-2 flex flex-row gap-1 text-crust bg-lavender hover:bg-[#5f72d9] transition rounded-md"
            >
              <IconPlus class="h-6 w-6" />
              <span>Upload</span>
            </button>
            <div class="flex flex-col gap-0.5">
              <A href="/dashboard" class="py-2 pl-0.1 flex flex-row items-center gap-2 hover:bg-surface1 transition rounded-md">
                <IconFolderAccountOutine class="w-6 h-6" />
                <span>My workspace</span>
              </A>
              <A href="/dashboard/shared" class="py-2 pl-0.1 flex flex-row items-center gap-2 hover:bg-surface1 transition rounded-md">
                <IconAccountMultipleOutline class="w-6 h-6" />
                <span>Shared with me</span>
              </A>
              <A href="/dashboard/favorites" class="py-2 pl-0.1 flex flex-row items-center gap-2 hover:bg-surface1 transition rounded-md">
                <IconStarOutline class="w-6 h-6" />
                <span>Favorites</span>
              </A>
              <A href="/dashboard/trash" class="py-2 pl-0.1 flex flex-row items-center gap-2 hover:bg-surface1 transition rounded-md">
                <IconTrashCanOutline class="w-6 h-6" />
                <span>Recycle bin</span>
              </A>
            </div>
          </div>

          <div class="flex flex-col h-full bg-surface0 border-l border-surface2 w-4/5 z-20">
            <header class="shrink-0 sticky top-0 bg-surface1 border-b border-surface2 w-full h-1/12 flex flex-row justify-between shadow-sm">
              <h1 class="border-base font-semibold h-full justify-center flex flex-col ml-4">
                My Files
              </h1>
              <div class="flex flex-row gap-x-2 mr-4 items-center">
                {/*<button
                  type="button"
                  title="Upload a file"
                  onClick={() => createFileUpload(fileUploadHandler)}
                  class="hover:text-text text-subtext1 transition hover:bg-surface2 p-1.5 h-fit rounded-lg"
                >
                  <IconFileUploadOutline class="text-xl" />
                </button>
                */}
                {/* <button
                type="button"
                title="Upload a folder"
                class="hover:text-text text-subtext1 transition hover:bg-surface2 p-1.5 h-fit rounded-lg"
              >
                <IconFolderUploadOutline class="text-xl" />
              </button> */}
                <button
                  type="button"
                  title="Share the selected items"
                  class="hover:text-text text-subtext1 transition hover:bg-surface2 p-1.5 h-fit ml-4 rounded-lg"
                >
                  <IconShareVariantOutline class="text-xl" />
                </button>
                <button
                  type="button"
                  title="Toggle favorite"
                  class="hover:text-text text-subtext1 transition hover:bg-surface2 p-1.5 h-fit rounded-lg"
                >
                  <IconStarOutline class="text-xl" />
                  {/* this should change to a filled star when a file is starred */}
                </button>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <button
                      type="button"
                      title="Perform tasks with the selected items"
                      class="hover:text-text text-subtext1 transition hover:bg-surface2 p-1.5 h-fit rounded-lg"
                    >
                      <IconDotsHorizontalCircleOutline class="text-xl" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content class="overview-dropdown-content bg-surface0 border border-surface2 p-2 flex flex-col w-68 bg-opacity-50 gap-y-1 backdrop-blur-md rounded-lg text-sm">
                      <DropdownMenu.Item class="px-4 py-1 hover:bg-lavender rounded-md w-full flex justify-between">
                        New Folder <span class="text-subtext1">⌘ N</span>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item class="px-4 py-1 hover:bg-lavender rounded-md">
                        Open in New Tab
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator class="border border-overlay0 my-1 opacity-50 border-dashed" />
                      <DropdownMenu.Item class="px-4 py-1 hover:bg-lavender rounded-md w-full flex justify-between">
                        <div class="inline-flex ">
                          Quick Look{" "}
                          <blockquote class="ml-1">My Files</blockquote>
                        </div>{" "}
                        <span class="text-subtext1">Space</span>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item class="px-4 py-1 hover:bg-lavender rounded-md">
                        Get Info
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator class="border border-overlay0 my-1 opacity-50 border-dashed" />
                      <DropdownMenu.Item class="px-4 py-1 hover:bg-lavender rounded-md w-full flex justify-between">
                        Use Groups
                      </DropdownMenu.Item>
                      <DropdownMenu.Sub overlap gutter={4} shift={-8}>
                        <DropdownMenu.SubTrigger class="px-4 py-1 hover:bg-lavender hover:bg-opacity-50 rounded-md flex justify-between w-full overview-dropdown-submenu">
                          Sort By...
                          <IconChevronRight class="text-subtext1 text-lg my-auto" />
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.SubContent class="overview-dropdown-content bg-surface0 border border-surface2 p-2 bg-opacity-50 gap-y-1 backdrop-blur-md rounded-lg text-sm">
                            <DropdownMenu.RadioGroup
                              value={view()}
                              onChange={setView}
                              class="flex flex-col w-40 text-sm"
                            >
                              <DropdownMenu.RadioItem
                                class="inline-flex pr-4 pl-5 py-1 hover:bg-lavender rounded-md"
                                value="name"
                              >
                                <DropdownMenu.ItemIndicator class="-ml-4 my-auto">
                                  <IconCheck />
                                </DropdownMenu.ItemIndicator>
                                <p class="ml-1">Name</p>
                              </DropdownMenu.RadioItem>
                              <DropdownMenu.RadioItem
                                class="inline-flex pr-4 pl-5 py-1 hover:bg-lavender rounded-md"
                                value="date-modified"
                              >
                                <DropdownMenu.ItemIndicator class="-ml-4 my-auto">
                                  <IconCheck />
                                </DropdownMenu.ItemIndicator>
                                <p class="ml-1">Date modified</p>
                              </DropdownMenu.RadioItem>
                              <DropdownMenu.RadioItem
                                class="inline-flex pr-4 pl-5 py-1 hover:bg-lavender rounded-md"
                                value="kind"
                              >
                                <DropdownMenu.ItemIndicator class="-ml-4 my-auto">
                                  <IconCheck />
                                </DropdownMenu.ItemIndicator>
                                <p class="ml-1">Kind</p>
                              </DropdownMenu.RadioItem>
                              <DropdownMenu.RadioItem
                                class="inline-flex pr-4 pl-5 py-1 hover:bg-lavender rounded-md"
                                value="size"
                              >
                                <DropdownMenu.ItemIndicator class="-ml-4 my-auto">
                                  <IconCheck />
                                </DropdownMenu.ItemIndicator>
                                <p class="ml-1">Size</p>
                              </DropdownMenu.RadioItem>
                            </DropdownMenu.RadioGroup>
                          </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Sub>
                      <DropdownMenu.Item class="px-4 py-1 hover:bg-lavender rounded-md">
                        Show View Options
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
                <input
                  type="search"
                  placeholder="Search..."
                  name="search"
                  autofocus
                  class="py-1 px-4 rounded-xl w-84 mx-4 bg-surface2 transition border-2 border-overlay0 hover:bg-overlay0 text-text placeholder-text-subtext1"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await logOutUser();
                    navigate("/");
                  }}
                  title="Logs you out of catto drive"
                  class="hover:text-text text-subtext1 transition hover:bg-surface2 p-1.5 h-fit rounded-lg"
                >
                  <IconPower class="text-xl" />
                </button>
              </div>
            </header>

            <main class="overflow-auto">
              <section class="flex flex-wrap gap-4 p-4">
                <For each={files()!}>
                  {(file) => (
                    <div class="max-w-60 h-auto rounded-md p-2 flex flex-col gap-1 border border-text hover:bg-subtext0">
                      <p class="text-sm">{file.name}</p>
                      <button
                        type="button"
                        onClick={async () => {
                          const response = await fetch("/api/file/" + file.id, {
                            method: "GET",
                            headers: { authorization: auth.profile!.api_token }
                          });

                          const json = await response.json();
                          const url = json.data.url;

                          downloadFile(url, file.name);
                        }}
                      >
                        Download
                      </button>
                    </div>
                  )}
                </For>
              </section>
            </main>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Page;
