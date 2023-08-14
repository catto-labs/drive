import {
  onMount, type Component,
  createSignal,
  Show,
  For,
} from "solid-js";

import { A, Title } from "solid-start";
import { Motion, Presence } from "@motionone/solid";

import IconStarOutline from "~icons/mdi/star-outline";
import IconAccountMultipleOutline from "~icons/mdi/account-multiple-outline";
import IconDownload from "~icons/mdi/download";
import IconDotsHorizontal from "~icons/mdi/dots-horizontal";
import IconContentCopy from "~icons/mdi/content-copy";
import IconFolderOutline from "~icons/mdi/folder-outline";
import IconArrowULeftTop from "~icons/mdi/arrow-u-left-top";
import cattoDriveBox from "@/assets/icon/box.png";
import cattoDriveCatto from "@/assets/icon/catto.png";
import SpinnerRingResize from "~icons/svg-spinners/ring-resize";

import { getFileIcon } from "@/utils/getFileIcons";
import { relativeTime } from "@/utils/relativeTime";

import { DropdownMenu } from "@kobalte/core";

import {
  downloadUploadedFile,
  getUploadedFileURL,
} from "@/utils/files";

import { setLayoutLoading } from "../dashboard";

import { auth } from "@/stores/auth";
import type { SharedData } from "@/types/api";

const SharedPage: Component = () => {
  const [content, setContent] = createSignal<SharedData | null>(null);

  const getWorkspaceName = (name: string) => {
    if (name === "../") {
      return "Go back to parent folder";
    }

    if (name.startsWith("./")) {
      return name.substring(2);
    }

    return name;
  };

  onMount(async () => {
    setLayoutLoading(true);

    const response = await fetch("/api/share", {
      headers: {
        authorization: auth.profile!.api_token,
      }
    });

    const json = await response.json();
    setContent(json.data as SharedData);
    setLayoutLoading(false);
  });

  return (
    <>
      <Title>Shared - Drive</Title>

      <main class="relative h-full overflow-hidden">
        <Presence exitBeforeEnter>
          <Show when={content()}
            fallback={
              <Motion.section class="absolute inset-0 z-20 h-full flex flex-col items-center justify-center bg-base"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <img src={cattoDriveBox} class="absolute z-10 mx-auto my-auto w-48" />

                <img
                  src={cattoDriveCatto}
                  class="absolute mx-auto my-auto w-41 transition-all transition-duration-500 -mt-48"
                />

                <div class="mt-56 text-center">
                  <div class="mt-1 inline-flex gap-x-2">
                    <SpinnerRingResize class="my-auto text-text" />

                    <h1 class="my-auto text-lg font-semibold text-text">
                      Loading...
                    </h1>
                  </div>
                  <p class="text-subtext0">
                    Our cats are gathering your shared files!
                  </p>
                </div>
              </Motion.section>
            }
          >
            <section class="block h-full overflow-y-auto py-3 md:p-4">
              <div class="hidden h-auto w-full flex-row items-center justify-between gap-1 px-2 pb-1 pl-10 text-sm text-subtext0 md:flex">
                <div class="flex flex-row">
                  <span class="w-100 lg:w-142">Name</span>
                  <span>Date added</span>
                </div>
                <span>Actions</span>
              </div>
              <div class="flex flex-col gap-y-3 md:gap-y-0">
                <For each={content()!.shared_workspaces}>
                  {(workspace) => (
                    <A href={`/dashboard/${workspace.id}`} class="h-auto w-full flex flex-row items-center justify-between gap-1 border-surface2 p-2 px-4 md:border-b hover:bg-surface0/50 md:px-2">
                      <div class="flex flex-row gap-x-2 truncate text-ellipsis">
                        <Show
                          when={workspace.name === "../"}
                          fallback={
                            <IconFolderOutline class="min-w-6 text-lg text-text" />
                          }
                        >
                          <IconArrowULeftTop class="mb-0.5 min-w-6 text-lg text-text" />
                        </Show>
                        <p class="mt-0.5 truncate text-ellipsis text-sm text-[#0f0f0f] lg:w-122 md:w-80">
                          {getWorkspaceName(workspace.name)}
                        </p>
                      </div>

                      <div class="w-16 flex flex-row gap-1">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <button
                              type="button"
                              title="Actions"
                              class="rounded-md p-1 transition-colors hover:bg-surface1 ui-expanded:bg-surface1"
                            >
                              <IconDotsHorizontal class="text-lg text-text" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content class="overview-dropdown-content min-w-[120px] flex flex-col gap-y-1 border border-surface2 rounded-lg bg-base/50 p-2 text-sm backdrop-blur-md">
                              <DropdownMenu.Item class="flex flex-row items-center gap-2 rounded-md px-4 py-1 pl-2 pr-4 text-text hover:bg-lavender/30 hover:text-[rgb(46,48,66)]">
                                <IconStarOutline class="text-lg" />
                                      Favorite
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                class="flex flex-row items-center gap-2 rounded-md px-4 py-1 pl-2 pr-4 text-text hover:bg-lavender/30 hover:text-[rgb(46,48,66)]"
                                onSelect={() => navigator.clipboard.writeText(workspace.id)}
                              >
                                <IconContentCopy class="text-lg" />
                                      Copy workspace ID
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </A>
                  )}
                </For>
                <For each={content()!.shared_files}>
                  {(file) => (
                    <div class="h-auto w-full flex flex-row items-center justify-between gap-1 border-surface2 p-2 px-4 transition md:border-b hover:bg-surface0/50 md:px-2">
                      <div class="flex flex-row gap-x-2 truncate text-ellipsis">
                        <div class="my-auto">
                          {getFileIcon(file)}
                        </div>
                        <div class="flex flex-col truncate pr-4 md:flex-row">
                          <div class="flex flex-row gap-2 text-[#0f0f0f] lg:w-142 md:w-100">
                            <p class="mt-0.5 flex items-center gap-2 truncate text-ellipsis text-sm lg:w-122 md:w-80">
                              {file.name}
                              <Show when={!file.private}>
                                <IconAccountMultipleOutline class="text-text" />
                                {/* <span class="ml-2 bg-lavender text-base rounded px-1.5 py-0.5 font-medium text-xs">Public</span> */}
                              </Show>
                            </p>

                          </div>
                          <div class="flex-row gap-2 text-text">
                            <p class="mt-0.5 text-sm">
                              {relativeTime(file.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="w-16 flex flex-row gap-1">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <button
                              type="button"
                              title="Actions"
                              class="rounded-md p-1 hover:bg-surface1 ui-expanded:bg-surface1"
                            >
                              <IconDotsHorizontal class="text-lg text-text" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content class="overview-dropdown-content min-w-[120px] flex flex-col gap-y-1 border border-surface2 rounded-lg bg-base/50 p-2 text-sm backdrop-blur-md">
                              <DropdownMenu.Item
                                onClick={() => downloadUploadedFile(file)}
                                class="flex flex-row items-center gap-2 rounded-md py-1 pl-2 pr-4 text-text hover:bg-lavender/30 hover:text-[rgb(46,48,66)]"
                              >
                                <IconDownload class="text-lg" />
                                Download
                              </DropdownMenu.Item>
                              <DropdownMenu.Item class="flex flex-row items-center gap-2 rounded-md px-4 py-1 pl-2 pr-4 text-text hover:bg-lavender/30 hover:text-[rgb(46,48,66)]">
                                <IconStarOutline class="text-lg" />
                                Favorite
                              </DropdownMenu.Item>
                              <Show when={!file.private}>
                                <DropdownMenu.Item
                                  class="flex flex-row items-center gap-2 rounded-md px-4 py-1 pl-2 pr-4 text-text hover:bg-lavender/30 hover:text-[rgb(46,48,66)]"
                                  onSelect={() => {
                                    const url = getUploadedFileURL(file);
                                    navigator.clipboard.writeText(url.href);
                                  }}
                                >
                                  <IconContentCopy class="text-lg" />
                                  Copy public URL
                                </DropdownMenu.Item>
                              </Show>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </section>
          </Show>
        </Presence>
      </main>
    </>
  );
};

export default SharedPage;
