import {
  type Component,
  onMount,
  createSignal,
  createEffect,
  Show,
  For,
  on,
  Match,
} from "solid-js";
import { A, Title, useNavigate } from "solid-start";
import { auth, logOutUser } from "@/stores/auth";

import IconDotsHorizontalCircleOutline from "~icons/mdi/dots-horizontal-circle-outline";
import IconStarOutline from "~icons/mdi/star-outline";
import IconShareVariantOutline from "~icons/mdi/share-variant-outline";
import IconChevronRight from "~icons/mdi/chevron-right";
import IconCheck from "~icons/mdi/check";
import IconPlus from "~icons/mdi/plus";
import IconFolderAccountOutline from "~icons/mdi/folder-account-outline";
import IconAccountMultipleOutline from "~icons/mdi/account-multiple-outline";
import IconTrashCanOutline from "~icons/mdi/trash-can-outline";
import IconAccount from "~icons/mdi/account";
import IconMenuDown from "~icons/mdi/menu-down";
import IconDownload from "~icons/mdi/download";
import IconDeleteOutline from "~icons/mdi/delete-outline";
import IconDotsHorizontal from "~icons/mdi/dots-horizontal";
import IconClose from "~icons/mdi/close";
import IconFolderOutline from "~icons/mdi/folder-outline";
import IconArrowULeftTop from "~icons/mdi/arrow-u-left-top";

import cattoDriveLogo from "@/assets/icon/logo.png";

import FullscreenLoader from "@/components/FullscreenLoader";

import { getFileIcon } from "@/utils/getFileIcons";
import { relativeTime } from "@/utils/relativeTime";

import { DropdownMenu, Dialog } from "@kobalte/core";

import { useParams } from "solid-start";

import { createModal } from "@/primitives/modal";

import {
  createFileImporter,
  downloadUploadedFile,
  getUploadedFileURL,
  makeFileUpload,
  removePermanentlyFile,
} from "@/utils/files";

import { getContentOfWorkspace, createWorkspace } from "@/utils/workspaces";

import type { UploadedFile, WorkspaceContent } from "@/types/api";
import { Switch } from "solid-js";

const Page: Component = () => {
  const [view, setView] = createSignal<string>("name");
  const params = useParams();

  const [workspaceContent, setWorkspaceContent] = createSignal<
    WorkspaceContent[] | null
  >(null);
  const navigate = useNavigate();

  createEffect(
    on(
      () => params.workspace_id,
      async (workspaceId: string) => {
        const workspace_content = await getContentOfWorkspace(workspaceId);
        setWorkspaceContent(workspace_content);
      }
    )
  );

  const fileUploadHandler = async (files: FileList) => {
    try {
      const uploaded = await makeFileUpload(files, {
        workspace_id: params.workspace_id,
        private: true,
      });

      const new_content: WorkspaceContent[] = uploaded.map((file) => ({
        type: "file",
        data: file,
      }));

      setWorkspaceContent((files) =>
        files ? [...files, ...new_content] : new_content
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getWorkspaceName = (name: string) => {
    if (name === "../") {
      return "Go back to parent folder";
    }

    if (name.startsWith("./")) {
      return name.substring(2);
    }

    return name;
  };

  createEffect(() => {
    window.scrollTo(0, 0);
  });

  const [openDeleteModal] = createModal<UploadedFile>(({ Description, CloseButton, data: file, close }) => (
    <>
      <div class="text-text flex justify-between">
        <h1 class="text-xl font-semibold my-auto">
          Delete file
        </h1>
        <CloseButton class="p-2 hover:bg-maroon/20 my-auto rounded-lg">
          <IconClose class="text-lg" />
        </CloseButton>
      </div>
      <Description class="text-subtext0">
        Are you sure you want to
        permanently delete this file? You
        won't be able to restore this from
        the trash bin later on.
      </Description>
      <form
        class="flex w-full justify-end gap-x-4 mt-2"
        onSubmit={async (event) => {
          event.preventDefault();
          await removePermanentlyFile(file!.id);

          setWorkspaceContent((prev) =>
            prev
              ? prev.filter(
                (item) =>
                  item.type === "workspace" ||
                  (item.type === "file" && item.data.id !== file!.id)
              )
              : []
          );
        }}
      >
        <CloseButton
          type="submit"
          class="py-2 px-4 border-surface1 bg-base/50 hover:bg-base border transition-all hover:border-lavender my-auto rounded-lg"
        >
          Yes
        </CloseButton>
        <CloseButton
          type="button"
          class="py-2 px-4 border-surface1 bg-base/50 hover:bg-base border transition-all hover:border-lavender my-auto rounded-lg"
        >
          No
        </CloseButton>
      </form>
    </>
  )
  );

  return (
    <>
      <Title>Dashboard - Drive</Title>

      <Show
        when={workspaceContent()}
        fallback={
          <FullscreenLoader message="Please wait, our cats are finding your files!" />
        }
      >
        <div class="md:backdrop-blur-xl w-screen h-screen relative flex overflow-hidden">
          <div class="text-text bg-surface0/80 min-w-64 w-1/5 shrink-0 md:block hidden">
            <header class="px-4 pt-6 pb-2 shrink-0 sticky top-0 w-full h-14 flex flex-row flex flex-row gap-[10px] items-center w-full">
              <img src={cattoDriveLogo} class="w-10 h-10 -ml-1 mt-1" />
              <span class="text-lg">
                <span class="font-bold text-2xl">Drive </span>
                <span class="mr-[10px] font-light text-[15px]">
                  by catto labs
                </span>
              </span>
            </header>
            <div class="p-4 ">
              <button
                onClick={() => createFileImporter(fileUploadHandler)}
                class="mb-4 pl-2 pr-4 py-2 flex flex-row gap-1 text-crust bg-lavender hover:bg-[#5f72d9] transition rounded-md"
              >
                <IconPlus class="h-6 w-6" />
                <span>Upload</span>
              </button>
              <div class="flex flex-col gap-0.5 text-text">
                <A
                  href={`/dashboard/${auth.profile!.root_workspace_id}`}
                  class="py-2 pl-2 pr-4 flex flex-row items-center gap-2 bg-gradient-to-r from-lavender/30 to-mauve/20 transition rounded-md"
                >
                  <IconFolderAccountOutline class="w-6 h-6" />
                  <span>My Workspace</span>
                </A>
                <A
                  href="/dashboard/shared"
                  class="py-2 pl-2 pr-4 flex flex-row items-center gap-2 hover:bg-gradient-to-r from-lavender/30 transition rounded-md"
                >
                  <IconAccountMultipleOutline class="w-6 h-6" />
                  <span>Shared</span>
                </A>
                <A
                  href="/dashboard/favorites"
                  class="py-2 pl-2 pr-4 flex flex-row items-center gap-2 hover:bg-gradient-to-r from-lavender/30 transition rounded-md"
                >
                  <IconStarOutline class="w-6 h-6" />
                  <span>Favorites</span>
                </A>
                <A
                  href="/dashboard/trash"
                  class="py-2 pl-2 pr-4 flex flex-row items-center gap-2 hover:bg-gradient-to-r from-lavender/30 transition rounded-md"
                >
                  <IconTrashCanOutline class="w-6 h-6" />
                  <span>Recycle Bin</span>
                </A>
              </div>
            </div>
          </div>

          <div class="flex flex-col h-full bg-base border-l border-surface2 w-full md:w-4/5 z-20">
            <header class="shrink-0 sticky top-0 bg-surface0 border-b border-surface1 w-full h-16 md:pl-0 pl-2 flex flex-row justify-between shadow-sm">
              <h1 class="md:flex hidden border-base font-semibold h-full justify-center flex-col ml-4 text-text">
                My Workspace
              </h1>
              <div class="flex flex-row gap-x-2 mr-4 w-full md:w-fit items-center">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <button
                      type="button"
                      title="Perform tasks with the selected items"
                      class="mr-2 md:block hidden hover:text-text text-subtext1 transition hover:bg-surface2 p-1.5 h-fit rounded-lg"
                    >
                      <IconDotsHorizontalCircleOutline class="text-xl" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content class="overview-dropdown-content bg-surface0 border border-surface2 p-2 flex flex-col w-68 bg-opacity-50 gap-y-1 backdrop-blur-md rounded-lg text-sm">
                      <DropdownMenu.Item
                        class="px-4 py-1 hover:bg-lavender/50 text-text hover:text-[rgb(46,48,66)] rounded-md w-full flex justify-between"
                        onSelect={async () => {
                          const workspace = await createWorkspace(
                            params.workspace_id
                          );
                          const item: WorkspaceContent = {
                            type: "workspace",
                            data: workspace,
                          };

                          setWorkspaceContent((prev) =>
                            prev ? [...prev, item] : [item]
                          );
                        }}
                      >
                        New Folder <span class="text-subtext1">⌘ N</span>
                      </DropdownMenu.Item>
                      <DropdownMenu.Sub overlap gutter={4} shift={-8}>
                        <DropdownMenu.SubTrigger class="px-4 py-1 hover:bg-lavender/50 text-text hover:text-[rgb(46,48,66)] rounded-md flex justify-between w-full overview-dropdown-submenu">
                          Sort By...
                          <IconChevronRight class="text-subtext1 text-lg my-auto" />
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.SubContent class="overview-dropdown-content bg-surface0 border text-text hover:text-[rgb(46,48,66)] border-surface2 p-2 bg-opacity-50 gap-y-1 backdrop-blur-md rounded-lg text-sm">
                            <DropdownMenu.RadioGroup
                              value={view()}
                              onChange={setView}
                              class="flex flex-col w-40 text-sm"
                            >
                              <DropdownMenu.RadioItem
                                class="inline-flex pr-4 pl-5 py-1 hover:bg-lavender/50 text-text hover:text-[rgb(46,48,66)] rounded-md"
                                value="name"
                              >
                                <DropdownMenu.ItemIndicator class="-ml-4 my-auto">
                                  <IconCheck />
                                </DropdownMenu.ItemIndicator>
                                <p class="ml-1">Name</p>
                              </DropdownMenu.RadioItem>
                              <DropdownMenu.RadioItem
                                class="inline-flex pr-4 pl-5 py-1 hover:bg-lavender/50 text-text hover:text-[rgb(46,48,66)] rounded-md"
                                value="date-modified"
                              >
                                <DropdownMenu.ItemIndicator class="-ml-4 my-auto">
                                  <IconCheck />
                                </DropdownMenu.ItemIndicator>
                                <p class="ml-1">Date modified</p>
                              </DropdownMenu.RadioItem>
                              <DropdownMenu.RadioItem
                                class="inline-flex pr-4 pl-5 py-1 hover:bg-lavender/50 text-text hover:text-[rgb(46,48,66)] rounded-md"
                                value="kind"
                              >
                                <DropdownMenu.ItemIndicator class="-ml-4 my-auto">
                                  <IconCheck />
                                </DropdownMenu.ItemIndicator>
                                <p class="ml-1">Kind</p>
                              </DropdownMenu.RadioItem>
                              <DropdownMenu.RadioItem
                                class="inline-flex pr-4 pl-5 py-1 hover:bg-lavender/50 text-text hover:text-[rgb(46,48,66)] rounded-md"
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
                      <DropdownMenu.Item class="px-4 py-1 hover:bg-lavender/50 text-text hover:text-[rgb(46,48,66)] rounded-md">
                        Workspace properties
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
                <input
                  type="search"
                  placeholder="Search..."
                  name="search"
                  autofocus
                  class="py-1 px-4 rounded-xl w-full md:w-84 bg-surface1 transition border-2 border-overlay0 hover:bg-overlay0 text-text placeholder-text-subtext1"
                />
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <button class="flex flex-row hover:text-text text-subtext1 transition hover:bg-surface2 p-1.5 h-fit rounded-lg">
                      <IconMenuDown class="text-xl" />
                      <IconAccount class="text-xl" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content class="overview-dropdown-content bg-surface0 border border-surface2 p-2 flex flex-col bg-opacity-50 gap-y-1 backdrop-blur-md rounded-lg text-sm">
                      <DropdownMenu.Item
                        onClick={async () => {
                          await logOutUser();
                          navigate("/");
                        }}
                        class="px-4 py-1 hover:bg-lavender text-text hover:text-[rgb(46,48,66)] rounded-md"
                      >
                        Sign out
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </header>

            <main class="overflow-auto">
              <section class="block md:p-4 pt-3">
                <div class="w-full h-auto pl-10 pb-1 px-2 md:flex hidden flex-row justify-between items-center gap-1 text-sm text-subtext0">
                  <div class="flex flex-row">
                    <span class="lg:w-142 w-100">Name</span>
                    <span>Date added</span>
                  </div>
                  <span>Actions</span>
                </div>
                <div class="flex flex-col gap-y-3 md:gap-y-0">
                  <For each={workspaceContent()!}>
                    {(content) => (
                      <Switch>
                        <Match when={content.type === "file" && content.data}>
                          {(file) => (
                            <div class="w-full h-auto p-2 px-4 md:px-2 flex flex-row justify-between items-center gap-1 md:border-b border-surface2 hover:bg-surface0/50">
                              <div class="flex flex-row gap-x-2 truncate text-ellipsis">
                                <div class="my-auto">
                                  {getFileIcon(file())}
                                </div>
                                <div class="flex flex-col md:flex-row truncate pr-4">
                                  <div class="flex flex-row gap-2 text-[#0f0f0f] lg:w-142 md:w-100">
                                    <p class="text-sm mt-0.5 lg:w-122 md:w-80 truncate text-ellipsis ">
                                      {file().name}
                                    </p>
                                  </div>
                                  <div class="flex-row gap-2 text-text">
                                    <p class="text-sm mt-0.5">
                                      {relativeTime(file().created_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div class="flex flex-row gap-1 w-16">
                                <button
                                  type="button"
                                  title="Share"
                                  class="p-1 hover:bg-surface1 rounded-md"
                                  onClick={async () => {
                                    const url = getUploadedFileURL(file());
                                    await navigator.clipboard.writeText(
                                      url.href
                                    );
                                  }}
                                >
                                  <IconShareVariantOutline class="text-lg text-text" />
                                </button>
                                <DropdownMenu.Root>
                                  <DropdownMenu.Trigger>
                                    <button
                                      type="button"
                                      title="Actions"
                                      class="p-1 hover:bg-surface1 rounded-md"
                                    >
                                      <IconDotsHorizontal class="text-lg text-text" />
                                    </button>
                                  </DropdownMenu.Trigger>
                                  <DropdownMenu.Portal>
                                    <DropdownMenu.Content class="overview-dropdown-content min-w-[120px] bg-base/50 border border-surface2 p-2 flex flex-col gap-y-1 backdrop-blur-md rounded-lg text-sm">
                                      <DropdownMenu.Item
                                        onClick={() =>
                                          downloadUploadedFile(file())
                                        }
                                        class="flex flex-row items-center gap-2 pl-2 pr-4 py-1 hover:bg-lavender/30 text-text hover:text-[rgb(46,48,66)] rounded-md"
                                      >
                                        <IconDownload class="text-lg" />
                                        Download
                                      </DropdownMenu.Item>
                                      <DropdownMenu.Item class="flex flex-row items-center gap-2 pl-2 pr-4 px-4 py-1 hover:bg-lavender/30 text-text hover:text-[rgb(46,48,66)] rounded-md">
                                        <IconStarOutline class="text-lg" />
                                        Favorite
                                      </DropdownMenu.Item>
                                      <DropdownMenu.Item
                                        class="flex flex-row items-center gap-2 pl-2 pr-4 py-1 hover:bg-maroon/20 text-maroon rounded-md"
                                        onSelect={() => openDeleteModal(file())}
                                      >
                                        <IconDeleteOutline class="text-lg" />
                                        Delete permanently
                                      </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                  </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                              </div>
                            </div>
                          )}
                        </Match>
                        <Match
                          when={content.type === "workspace" && content.data}
                        >
                          {(workspace) => (
                            <A
                              class="w-full h-auto py-3 md:px-2 px-4 flex flex-row justify-between text-text items-center gap-1 md:border-b border-surface2  hover:bg-surface0/50"
                              href={`/dashboard/${workspace().id}`}
                            >
                              <div class="flex flex-row gap-x-2 truncate text-ellipsis">
                                <Show
                                  when={workspace().name === "../"}
                                  fallback={
                                    <IconFolderOutline class="text-lg min-w-6" />
                                  }
                                >
                                  <IconArrowULeftTop class="text-lg mb-0.5 min-w-6" />
                                </Show>
                                <p class="text-sm mt-0.5 lg:w-122 md:w-80 truncate text-ellipsis text-[#0f0f0f]">
                                  {getWorkspaceName(workspace().name)}
                                </p>
                              </div>
                            </A>
                          )}
                        </Match>
                      </Switch>
                    )}
                  </For>
                </div>
              </section>
            </main>
          </div>

          <footer class="fixed z-20 bottom-0 shrink-0 bg-surface0/30 backdrop-blur-md border-t border-surface1 w-full h-16 flex flex-row justify-between px-4
           shadow-sm">
            <A
              href={`/dashboard/${auth.profile!.root_workspace_id}`}
              class="py-2 flex flex-col items-center px-2 gap-1 transition rounded-md"
            >
              <IconFolderAccountOutline class="w-13 h-7 bg-gradient-to-r rounded-full from-lavender/30 to-mauve/20 " />
              <span class="text-[0.8rem]">My Workspace</span>
            </A>
            <A
              href="/dashboard/shared"
              class="py-2 flex flex-col items-center px-2 gap-1 transition rounded-md"
            >
              <IconFolderAccountOutline class="w-13 h-7 " />
              <span class="text-[0.8rem]">Shared</span>
            </A>
            <A
              href="/dashboard/favorites"
              class="py-2 flex flex-col items-center px-2 gap-1 transition rounded-md"
            >
              <IconStarOutline class="w-6 h-6" />
              <span class="text-[0.8rem]">Favorites</span>
            </A>
            <A
              href="/dashboard/trash"
              class="py-2 flex flex-col items-center px-2 gap-1 transition rounded-md"
            >
              <IconTrashCanOutline class="w-6 h-6" />
              <span class="text-[0.8rem]">Recycle Bin</span>
            </A>
          </footer>
        </div>
      </Show>
    </>
  );
};

export default Page;
