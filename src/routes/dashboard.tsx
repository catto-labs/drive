import { type Component, Show, createSignal } from "solid-js";
import { Outlet, Navigate, useParams, useNavigate, A, useLocation } from "solid-start";
import { auth, isAuthenticated, logOutUser } from "@/stores/auth";

import { Motion } from "@motionone/solid";

import { autofocus } from "@solid-primitives/autofocus";
// prevents from being tree-shaken by TS
autofocus;

import IconStarOutline from "~icons/mdi/star-outline";
import IconPlus from "~icons/mdi/plus";
import IconFolderAccountOutline from "~icons/mdi/folder-account-outline";
import IconAccountMultipleOutline from "~icons/mdi/account-multiple-outline";
import IconTrashCanOutline from "~icons/mdi/trash-can-outline";
import IconAccount from "~icons/mdi/account";
import IconMenuDown from "~icons/mdi/menu-down";
import IconClose from "~icons/mdi/close";
import IconLogout from "~icons/mdi/logout";
import IconFolderPlusOutline from "~icons/mdi/folder-plus-outline";
import cattoDriveBox from "@/assets/icon/box.png";
import cattoDriveCatto from "@/assets/icon/catto.png";
import SpinnerRingResize from "~icons/svg-spinners/ring-resize";

import FullscreenLoader from "@/components/FullscreenLoader";
import { createFileImporter, makeFileUpload } from "@/utils/files";
import { setWorkspaces, workspaces } from "@/stores/workspaces";
import { UploadedFile, WorkspaceContent } from "@/types/api";
import { DropdownMenu } from "@kobalte/core";
import { createModal } from "@/primitives/modal";
import { createWorkspace } from "@/utils/workspaces";
import toast from "solid-toast";

export const [layoutLoading, setLayoutLoading] = createSignal(true);

export const fileUploadHandler = async (workspace_id: string | undefined, files: FileList) => {
  if (!auth.profile) return;
  if (!workspace_id) return;

  try {
    let uploaded: UploadedFile[] | null = null;

    await toast.promise(
      makeFileUpload(files, {
        workspace_id: workspace_id,
        private: true,
      }),
      {
        loading: "Uploading your file...",
        success: (val) => {
          uploaded = val;
          console.log(val);
          return <span>Upload successful!</span>;
        },
        error: <span>Theme could not be saved</span>
      }
    )
    if (!uploaded) return;

    // @ts-ignore
    const new_content: WorkspaceContent[] = uploaded.map((file) => ({
      type: "file",
      data: file,
    }));

    setWorkspaces(workspace_id, "content", (files) =>
      files ? [...files, ...new_content] : new_content
    );
  }
  catch (error) {
    console.error(error);
  }
};

export const LoadingSection: Component<{ message: string }> = (props) => (
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
        {props.message}
      </p>
    </div>
  </Motion.section>
);

const Layout: Component = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams() as { workspace_id: string | undefined };
  const [newFolderName, setNewFolderName] = createSignal("");

  const [openNewFolderModal] = createModal((Modal) => (
    <>
      <div class="flex justify-between text-text">
        <h1 class="my-auto text-xl font-semibold">
          Create a new folder
        </h1>
        <Modal.CloseButton class="my-auto rounded-lg p-2 hover:bg-text/10 transition">
          <IconClose class="text-lg" />
        </Modal.CloseButton>
      </div>

      <form
        class="mt-2 w-full flex flex-col justify-end gap-x-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!params.workspace_id) return;
          
          const workspace = await createWorkspace(
            params.workspace_id,
            newFolderName()
          );

          const item: WorkspaceContent = {
            type: "workspace",
            data: workspace,
          };

          setWorkspaces(params.workspace_id, "content", (prev) =>
            prev ? [...prev, item] : [item]
          );

          setNewFolderName("");
          Modal.close();
        }}
      >
        <input type="text"
          class="mb-3 rounded-md px-3 py-2 text-text bg-base outline-none placeholder-text-subtext1"
          placeholder="Enter a name for your folder..."
          value={newFolderName()}
          onInput={event => setNewFolderName(event.target.value)}
          required
          use:autofocus autofocus
        />
        
        <div class="flex flex-row items-center justify-end gap-2">
          <Modal.CloseButton
            type="button"
            class="my-auto border border-surface1 rounded-lg bg-base/50 px-4 py-2 transition text-subtext0 hover:bg-base/70"
          >
            Cancel
          </Modal.CloseButton>
          <button
            type="submit"
            class="my-auto border border-surface1 rounded-lg bg-lavender/80 px-4 py-2 transition text-base font-medium hover:border-lavender hover:bg-lavender"
          >
            Create folder
          </button>
        </div>
      </form>
    </>
  ));

  return (
    <Show when={!auth.loading}
      fallback={<FullscreenLoader message="Please wait, our cats are getting ready!" />}
    >
      <Show when={isAuthenticated()}
        fallback={<Navigate href="/auth/login" />}
      >
        <div class="relative h-screen w-screen flex overflow-hidden md:backdrop-blur-xl">
          <div class="hidden min-w-64 w-1/5 shrink-0 bg-surface0/80 text-text md:block">
            <header class="sticky top-0 h-14 w-full w-full flex flex shrink-0 flex-row flex-row items-center gap-[10px] px-4 pb-2 pt-6">

              <div class="relative h-10 w-10">
                <img src={cattoDriveBox} class="absolute inset-0 z-10 mx-auto my-auto -bottom-4" />

                <img
                  src={cattoDriveCatto}
                  class="absolute transition-all transition-duration-500"
                  classList={{
                    "-mt-2.5": !layoutLoading(),
                    "-mt-0": layoutLoading()
                  }}
                />
              </div>
              <span class="text-lg">
                <span class="text-2xl font-bold">Drive </span>
                <span class="mr-[10px] text-[15px] font-light">
                  by catto labs
                </span>
              </span>
            </header>

            <nav class="p-4">
              <button type="button"
                disabled={!auth.profile}
                onClick={() => createFileImporter(files => fileUploadHandler(params.workspace_id, files))}
                class="mb-4 flex flex-row gap-1 rounded-md bg-lavender py-2 pl-2 pr-4 text-crust transition hover:bg-[#5f72d9]"
              >
                <IconPlus class="h-6 w-6" />
                Upload
              </button>
              <div class="flex flex-col gap-0.5 text-text">
                <A
                  href={`/dashboard/${auth.profile!.root_workspace_id}`}
                  class="flex flex-row items-center gap-2 rounded-md from-lavender/30 py-2 pl-2 pr-4 transition"
                  classList={{
                    "bg-gradient-to-r to-mauve/20": typeof params.workspace_id !== "undefined",
                    "hover:bg-gradient-to-r": typeof params.workspace_id === "undefined"
                  }}
                >
                  <IconFolderAccountOutline class="h-6 w-6" />
                  My Workspace
                </A>
                <A
                  href="/dashboard/shared"
                  class="flex flex-row items-center gap-2 rounded-md from-lavender/30 py-2 pl-2 pr-4 transition"
                  classList={{
                    "bg-gradient-to-r to-mauve/20": location.pathname.startsWith("/dashboard/shared"),
                    "hover:bg-gradient-to-r": !location.pathname.startsWith("/dashboard/shared")
                  }}
                >
                  <IconAccountMultipleOutline class="h-6 w-6" />
                  Shared
                </A>
                {/* <A
                  href="/dashboard/trash"
                  class="flex flex-row items-center gap-2 rounded-md from-lavender/30 py-2 pl-2 pr-4 transition-all hover:bg-gradient-to-r"
                >
                  <IconTrashCanOutline class="h-6 w-6" />
                  <span>Recycle Bin</span>
                </A> */}
              </div>
            </nav>
          </div>

          <div class="z-20 h-full w-full flex flex-col border-l border-surface2 bg-base md:w-4/5">
            <header class="fixed top-0 z-20 h-16 w-full flex flex-row justify-between border-b backdrop-blur-md border-surface1 bg-surface0/30 pl-2 shadow-sm md:pl-0">
              <h1 class="ml-4 hidden h-full flex-col justify-center border-base font-semibold text-text md:flex">
                {params.workspace_id === auth.profile!.root_workspace_id ? "My workspace" : (
                  params.workspace_id ? workspaces[params.workspace_id]
                    ? (workspaces[params.workspace_id].meta.name || workspaces[params.workspace_id].meta.id)
                    : "Loading..."
                    : "Drive"
                )}
              </h1>
              <div class="mr-4 w-full flex flex-row items-center gap-x-2 md:w-fit">
                {/*<DropdownMenu.Root>
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

                        setWorkspaces(params.workspace_id, "content", (prev) =>
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
                    </DropdownMenu.Root>*/}
                <button 
                  type="button"
                  title="New folder"
                  onClick={() => openNewFolderModal(setNewFolderName(""))}
                  class="mr-2 hidden h-fit rounded-lg p-1.5 text-subtext1 transition md:block hover:bg-surface2 hover:text-text"
                >
                  <IconFolderPlusOutline class="text-xl text-text" />
                </button>
                <input
                  autofocus
                  type="search"
                  placeholder="Search..."
                  class="w-full border-2 border-overlay0 rounded-xl bg-surface1/40 px-4 py-1 text-text outline-none transition md:w-84 focus:border-lavender hover:bg-overlay0/40 placeholder-text-subtext1"
                />
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <button class="h-fit flex flex-row rounded-lg p-1.5 text-subtext1 transition hover:bg-surface2 hover:text-text">
                      <IconMenuDown class="text-xl" />
                      <IconAccount class="text-xl" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content class="overview-dropdown-content flex flex-col gap-y-1 border border-surface2 rounded-lg bg-surface0 bg-opacity-50 p-2 text-sm backdrop-blur-md">
                      <DropdownMenu.Item
                        class="flex flex-row cursor-pointer gap-2 rounded-md px-4 py-1 text-text transition hover:bg-lavender/70 hover:text-base"
                        onClick={() => navigate("/account")}
                      >
                        <IconAccount class="text-lg" />
                          My Account
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        class="flex flex-row cursor-pointer gap-2 rounded-md px-4 py-1 text-text transition hover:bg-lavender/70 hover:text-base"
                        onClick={() => logOutUser()
                          .then(() => navigate("/"))
                        }
                      >
                        <IconLogout class="text-lg" />
                          Sign out
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </header>
            <Outlet />
            <footer class="h-16 w-full flex shrink-0 flex-row gap-x-24 justify-center border-t border-surface1 bg-surface0/30 px-4 shadow-sm md:hidden">
              <A
                href={`/dashboard/${auth.profile!.root_workspace_id}`}
                class="flex flex-col items-center gap-1 rounded-md px-2 py-2 transition"
              >
                <IconFolderAccountOutline class="h-7 w-13 rounded-full "
                  classList={{
                    "from-lavender/30 to-mauve/20 bg-gradient-to-r": typeof params.workspace_id !== "undefined",
                    "hover:bg-gradient-to-r from-lavender/30": typeof params.workspace_id === "undefined"
                  }} />
                <span class="text-[0.8rem]">My Workspace</span>
              </A>
              <A
                href="/dashboard/shared"
                class="flex flex-col items-center gap-1 rounded-md px-2 py-2 transition"
              >
                  <IconAccountMultipleOutline class="h-7 w-13 rounded-full"
                  classList={{
                    "from-lavender/30 to-mauve/20 bg-gradient-to-r": location.pathname.startsWith("/dashboard/shared"),
                    "hover:bg-gradient-to-r from-lavender/30": !location.pathname.startsWith("/dashboard/shared")
                  }} />
                <span class="text-[0.8rem]">Shared</span>
              </A>
              {/* <A
                href="/dashboard/favorites"
                class="flex flex-col items-center gap-1 rounded-md px-2 py-2 transition"
              >
                <IconStarOutline class="h-6 w-6" />
                <span class="text-[0.8rem]">Favorites</span>
              </A>
              <A
                href="/dashboard/trash"
                class="flex flex-col items-center gap-1 rounded-md px-2 py-2 transition"
              >
                <IconTrashCanOutline class="h-6 w-6" />
                <span class="text-[0.8rem]">Recycle Bin</span>
              </A> */}
            </footer>
          </div>
        </div>
      </Show>
    </Show>
  );
};

export default Layout;
