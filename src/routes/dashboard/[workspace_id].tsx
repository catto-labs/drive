import type { UploadedFile, WorkspaceContent } from "@/types/api";

import {
  type Component,
  Switch,
  createSignal,
  createEffect,
  Show,
  For,
  on,
  Match,
} from "solid-js";

import { A, Title, useNavigate, useParams } from "solid-start";
import { Motion, Presence } from "@motionone/solid";

import IconDotsHorizontalCircleOutline from "~icons/mdi/dots-horizontal-circle-outline";
import IconStarOutline from "~icons/mdi/star-outline";
import IconShareVariantOutline from "~icons/mdi/share-variant-outline";
import IconChevronRight from "~icons/mdi/chevron-right";
import IconCheck from "~icons/mdi/check";
import IconPlus from "~icons/mdi/plus";
import IconFolderAccountOutline from "~icons/mdi/folder-account-outline";
import IconAccountPlusOutline from "~icons/mdi/account-plus-outline";
import IconAccountMultipleOutline from "~icons/mdi/account-multiple-outline";
import IconTrashCanOutline from "~icons/mdi/trash-can-outline";
import IconAccount from "~icons/mdi/account";
import IconMenuDown from "~icons/mdi/menu-down";
import IconDownload from "~icons/mdi/download";
import IconDeleteOutline from "~icons/mdi/delete-outline";
import IconDotsHorizontal from "~icons/mdi/dots-horizontal";
import IconContentCopy from "~icons/mdi/content-copy";
import IconClose from "~icons/mdi/close";
import IconFolderOutline from "~icons/mdi/folder-outline";
import IconArrowULeftTop from "~icons/mdi/arrow-u-left-top";
import IconLogout from "~icons/mdi/logout"
import cattoDriveBox from "@/assets/icon/box.png";
import cattoDriveCatto from "@/assets/icon/catto.png";
import SpinnerRingResize from "~icons/svg-spinners/ring-resize";

import { getFileIcon } from "@/utils/getFileIcons";
import { relativeTime } from "@/utils/relativeTime";

import { DropdownMenu, Switch as KSwitch } from "@kobalte/core";
import { createModal } from "@/primitives/modal";

import {
  createFileImporter,
  downloadUploadedFile,
  getUploadedFileURL,
  makeFileUpload,
  removePermanentlyFile,
} from "@/utils/files";

import { getWorkspace, createWorkspace } from "@/utils/workspaces";

import { workspaces, setWorkspaces } from "@/stores/workspaces";
import { auth, logOutUser } from "@/stores/auth";
import { getUserFrom, saveUploadSharingPreferences } from "@/utils/users";

const Page: Component = () => {
  const [view, setView] = createSignal("name");

  const params = useParams();
  const navigate = useNavigate();

  createEffect(on(() => params.workspace_id, async (workspaceId: string) => {
    const workspace_content = await getWorkspace(workspaceId);
    setWorkspaces(workspaceId, workspace_content);
  }));

  const fileUploadHandler = async (files: FileList) => {
    if (!auth.profile) return;

    try {
      const uploaded = await makeFileUpload(files, {
        workspace_id: params.workspace_id,
        private: true,
      });

      const new_content: WorkspaceContent[] = uploaded.map((file) => ({
        type: "file",
        data: file,
      }));

      setWorkspaces(params.workspace_id, "content", (files) =>
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

          setWorkspaces(params.workspace_id, "content", (prev) =>
            prev
              ? prev.filter(
                (item) =>
                  item.type === "workspace" ||
                  (item.type === "file" && item.data.id !== file!.id)
              )
              : []
          );

          close();
        }}
      >
        <button
          type="submit"
          class="py-2 px-4 border-surface1 bg-base/50 hover:bg-base border transition-all hover:border-lavender my-auto rounded-lg"
        >
          Yes
        </button>
        <CloseButton
          type="button"
          class="py-2 px-4 border-surface1 bg-base/50 hover:bg-base border transition-all hover:border-lavender my-auto rounded-lg"
        >
          No
        </CloseButton>
      </form>
    </>
  ));

  const [openSharingModal] = createModal<WorkspaceContent>(({ data: content, close }) => {
    // We only check for files, since workspaces are always private.
    // The only way to share workspaces is sharing the access to someone.
    const [isPublic, setIsPublic] = createSignal(content.type === "file" ? !content.data.private : false);
    const [uidShared, setUidShared] = createSignal(content.data.shared_with);
    const [uidToAdd, setUidToAdd] = createSignal("");

    return (
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-semibold text-center">
          Sharing
        </h1>
        <div class="flex gap-2 items-center justify-center px-3 py-1 bg-crust rounded-lg w-fit mx-auto mb-2">
          {content.type === "file" ? getFileIcon(content.data) : <IconFolderOutline />}
          <p class="text-text">
            {content.data.name || content.data.id}
          </p>
        </div>

        <Show when={content.type === "file"}>
          <KSwitch.Root
            class="inline-flex items-center cursor-pointer mx-auto"
            checked={isPublic()}
            onChange={setIsPublic}
          >
            <KSwitch.Input />
            <KSwitch.Control class="inline-flex items-center h-[24px] w-[44px] border border-text rounded-xl py-0 px-.5 bg-text ui-checked:(bg-lavender border-lavender) transition">
              <KSwitch.Thumb class="h-[20px] w-[20px] rounded-2.5 bg-base ui-checked:translate-x-[calc(100%-1px)] transition" />
            </KSwitch.Control>
            <KSwitch.Label
              class="ml-2 text-text text-lg select-none font-medium"
            >
              Public to <strong class="font-semibold">everyone who have the link</strong>
            </KSwitch.Label>
          </KSwitch.Root>
        </Show>

        <Show when={content.type === "workspace" || (content.type === "file" && !isPublic())}>
          <div class="flex flex-col">
            <p class="text-text select-none">Give access to this {content.type} to some users</p>
            <p class="text-text text-sm font-medium">Note that those users will <strong class="font-semibold">have full access to the {content.type}</strong>, but won't be able to delete it.</p>
          
            <form
              class="flex w-full mt-2"
              onSubmit={async (event) => {
                event.preventDefault();
                const user_data = await getUserFrom(uidToAdd());
                if (!user_data) {
                  alert("This user doesn't exist!");
                  return;
                }

                if (user_data.user_id === auth.profile!.user_id) {
                  alert("You can't add yourself!");
                  return;
                }

                if (uidShared().includes(user_data.user_id)) {
                  alert("You can't add multiple times the same person!");
                  return;
                }

                setUidShared(prev => [...prev, user_data.user_id]);
                setUidToAdd("");
              }}
            >
              <input
                class="w-full rounded-l bg-base outline-none px-3 py-2"
                type="text"
                placeholder="Enter email or user ID"
                value={uidToAdd()}
                onInput={(event) => setUidToAdd(event.currentTarget.value)}
              />
              <button
                class="rounded-r bg-base shrink-0 outline-none px-2 py-2"
                type="submit"
              >
                <div class="p-1.5 bg-lavender rounded">
                  <IconAccountPlusOutline class="text-base" />
                </div>
              </button>
            </form>

            <For each={uidShared()}>
              {uid => (
                <div class="flex items-center gap-2 text-text ml-2 mt-2">
                  <IconAccount/> 
                  <p class="font-medium">
                    {uid}
                  </p>
                </div>
              )}
            </For>
          </div>
        </Show>

        <div class="flex flex-col gap-2 text-center mt-4">
          <button type="button"
            class="bg-lavender bg-opacity-90 hover:bg-opacity-100 text-base px-2 py-2 rounded-lg transition"
            onClick={async () => {
              const new_data = await saveUploadSharingPreferences(content.type, content.data.id, isPublic(), uidShared())
              if (!new_data) return;

              setWorkspaces(params.workspace_id, "content", item => item.data.id === content.data.id, "data", new_data);
              
              close();
            }}
          >
            Save
          </button>
          <button type="button"
            class="text-text px-2 py-1 hover:bg-text/10 transition rounded-lg"
            onClick={close}
          >
            Forget about it
          </button>
        </div>

      </div>
    )
  })

  return (
    <>
      <Title>Dashboard - Drive</Title>

      <div class="md:backdrop-blur-xl w-screen h-screen relative flex overflow-hidden">
        <div class="text-text bg-surface0/80 min-w-64 w-1/5 shrink-0 md:block hidden">
          <header class="px-4 pt-6 pb-2 shrink-0 sticky top-0 w-full h-14 flex flex-row flex flex-row gap-[10px] items-center w-full">
          
          <div class="relative w-10 h-10">
            <img src={cattoDriveBox} class="absolute inset-0 -bottom-4 mx-auto my-auto z-10" />

            <img
              src={cattoDriveCatto}
              class="absolute transition-all transition-duration-500"
              classList={{
                "-mt-2.5": workspaces[params.workspace_id] !== undefined, // Loaded.
                "-mt-0": !workspaces[params.workspace_id] // Loading.
              }}
            />
          </div>
            <span class="text-lg">
              <span class="font-bold text-2xl">Drive </span>
              <span class="mr-[10px] font-light text-[15px]">
                by catto labs
              </span>
            </span>
          </header>

          <nav class="p-4">
            <button type="button"
              disabled={!auth.profile}
              onClick={() => createFileImporter(fileUploadHandler)}
              class="mb-4 pl-2 pr-4 py-2 flex flex-row gap-1 text-crust bg-lavender hover:bg-[#5f72d9] transition rounded-md"
            >
              <IconPlus class="h-6 w-6" />
              Upload
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
          </nav>
        </div>

        <div class="flex flex-col h-full bg-base border-l border-surface2 w-full md:w-4/5 z-20">
          <header class="sticky z-20 top-0 bg-surface0/30 border-b border-surface1 w-full h-16 md:pl-0 pl-2 flex flex-row justify-between shadow-sm">
            <h1 class="md:flex hidden border-base font-semibold h-full justify-center flex-col ml-4 text-text">
              {params.workspace_id === auth.profile!.root_workspace_id ? "My workspace" : (
                workspaces[params.workspace_id]
                  ? (workspaces[params.workspace_id].meta.name || workspaces[params.workspace_id].meta.id)
                  : "Loading..."
              )}
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
                        navigate("/account");
                      }}
                      class="flex flex-row gap-4 px-4 py-1 hover:bg-lavender text-text hover:text-[rgb(46,48,66)] rounded-md"
                    >
                      <IconAccount class="text-lg" />
                      My Account
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={async () => {
                        await logOutUser();
                        navigate("/");
                      }}
                      class="flex flex-row gap-4 px-4 py-1 hover:bg-lavender text-text hover:text-[rgb(46,48,66)] rounded-md"
                    >
                      <IconLogout class="text-lg" />
                      Sign out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </header>

          <main class="relative overflow-hidden h-full">
            <button type="button"
              disabled={!auth.profile}
              onClick={() => createFileImporter(fileUploadHandler)}
              class="absolute z-30 bottom-4 right-4 p-2 rounded-full flex md:hidden flex-row gap-1 text-crust bg-lavender hover:bg-[#5f72d9] transition"
            >
              <IconPlus class="text-2xl" />
            </button>
            
            <Presence exitBeforeEnter>
              <Show when={workspaces[params.workspace_id]}
                fallback={
                  <Motion.section class="h-full flex flex-col items-center justify-center absolute inset-0 z-20 bg-base"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                      <img src={cattoDriveBox} class="absolute mx-auto my-auto w-48 z-10" />

                      <img
                        src={cattoDriveCatto}
                        class="absolute mx-auto my-auto w-41 -mt-48 transition-all transition-duration-500"
                      />

                      <div class="mt-56 text-center">
                        <div class="inline-flex gap-x-2 mt-1">
                          <SpinnerRingResize class="my-auto text-text" />

                          <h1 class="text-lg font-semibold my-auto text-text">
                            Loading...
                          </h1>
                        </div>
                        <p class="text-subtext0">
                          Our cats are gathering the files for this workspace!
                        </p>
                      </div>
                  </Motion.section>
                }
              >
                <section class="block md:p-4 py-3 overflow-y-auto h-full">
                  <div class="w-full h-auto pl-10 pb-1 px-2 md:flex hidden flex-row justify-between items-center gap-1 text-sm text-subtext0">
                    <div class="flex flex-row">
                      <span class="lg:w-142 w-100">Name</span>
                      <span>Date added</span>
                    </div>
                    <span>Actions</span>
                  </div>
                  <div class="flex flex-col gap-y-3 md:gap-y-0">
                    <For each={workspaces[params.workspace_id].content}>
                      {(content) => (
                        <Switch>
                          <Match when={content.type === "file" && content}>
                            {(file) => (
                              <div class="w-full h-auto p-2 px-4 md:px-2 flex flex-row justify-between items-center gap-1 md:border-b border-surface2 hover:bg-surface0/50">
                                <div class="flex flex-row gap-x-2 truncate text-ellipsis">
                                  <div class="my-auto">
                                    {getFileIcon(file().data)}
                                  </div>
                                  <div class="flex flex-col md:flex-row truncate pr-4">
                                    <div class="flex flex-row gap-2 text-[#0f0f0f] lg:w-142 md:w-100">
                                      <p class="flex gap-2 items-center text-sm mt-0.5 lg:w-122 md:w-80 truncate text-ellipsis">
                                        {file().data.name}
                                        <Show when={!file().data.private}>
                                          <IconAccountMultipleOutline class="text-text" />
                                          {/* <span class="ml-2 bg-lavender text-base rounded px-1.5 py-0.5 font-medium text-xs">Public</span> */}
                                        </Show>
                                      </p>

                                    </div>
                                    <div class="flex-row gap-2 text-text">
                                      <p class="text-sm mt-0.5">
                                        {relativeTime(file().data.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div class="flex flex-row gap-1 w-16">
                                  <button
                                    type="button"
                                    title="Share"
                                    class="p-1 hover:bg-surface1 rounded-md"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.preventDefault();

                                      openSharingModal(file())
                                    }}
                                  >
                                    <IconShareVariantOutline class="text-lg text-text" />
                                  </button>
                                  <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                      <button
                                        type="button"
                                        title="Actions"
                                        class="p-1 hover:bg-surface1 ui-expanded:bg-surface1 rounded-md"
                                      >
                                        <IconDotsHorizontal class="text-lg text-text" />
                                      </button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Portal>
                                      <DropdownMenu.Content class="overview-dropdown-content min-w-[120px] bg-base/50 border border-surface2 p-2 flex flex-col gap-y-1 backdrop-blur-md rounded-lg text-sm">
                                        <DropdownMenu.Item
                                          onClick={() => downloadUploadedFile(file().data)}
                                          class="flex flex-row items-center gap-2 pl-2 pr-4 py-1 hover:bg-lavender/30 text-text hover:text-[rgb(46,48,66)] rounded-md"
                                        >
                                          <IconDownload class="text-lg" />
                                          Download
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item class="flex flex-row items-center gap-2 pl-2 pr-4 px-4 py-1 hover:bg-lavender/30 text-text hover:text-[rgb(46,48,66)] rounded-md">
                                          <IconStarOutline class="text-lg" />
                                          Favorite
                                        </DropdownMenu.Item>
                                        <Show when={!file().data.private}>
                                          <DropdownMenu.Item
                                            class="flex flex-row items-center gap-2 pl-2 pr-4 px-4 py-1 hover:bg-lavender/30 text-text hover:text-[rgb(46,48,66)] rounded-md"
                                            onSelect={async () => {
                                              const url = getUploadedFileURL(file().data);
                                              await navigator.clipboard.writeText(url.href);
                                            }}
                                          >
                                            <IconContentCopy class="text-lg" />
                                            Copy public URL
                                          </DropdownMenu.Item>
                                        </Show>
                                        <DropdownMenu.Item
                                          class="flex flex-row items-center gap-2 pl-2 pr-4 py-1 hover:bg-maroon/20 text-maroon rounded-md"
                                          onSelect={() => openDeleteModal(file().data)}
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
                            when={content.type === "workspace" && content}
                          >
                            {(workspace) => (
                              <A href={`/dashboard/${workspace().data.id}`} class="w-full h-auto p-2 px-4 md:px-2 flex flex-row justify-between items-center gap-1 md:border-b border-surface2 hover:bg-surface0/50">
                                <div class="flex flex-row gap-x-2 truncate text-ellipsis">
                                  <Show
                                    when={workspace().data.name === "../"}
                                    fallback={
                                      <IconFolderOutline class="text-lg min-w-6" />
                                    }
                                  >
                                    <IconArrowULeftTop class="text-lg mb-0.5 min-w-6" />
                                  </Show>
                                  <p class="text-sm mt-0.5 lg:w-122 md:w-80 truncate text-ellipsis text-[#0f0f0f]">
                                    {getWorkspaceName(workspace().data.name)}
                                  </p>
                                </div>

                                <div class="flex flex-row gap-1 w-16">
                                  <button
                                    type="button"
                                    title="Share"
                                    class="p-1 hover:bg-surface1 rounded-md"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.preventDefault();

                                      openSharingModal(workspace())
                                    }}
                                  >
                                    <IconShareVariantOutline class="text-lg text-text" />
                                  </button>
                                  <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                      <button
                                        type="button"
                                        title="Actions"
                                        class="p-1 hover:bg-surface1 ui-expanded:bg-surface1 transition-colors rounded-md"
                                      >
                                        <IconDotsHorizontal class="text-lg text-text" />
                                      </button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Portal>
                                      <DropdownMenu.Content class="overview-dropdown-content min-w-[120px] bg-base/50 border border-surface2 p-2 flex flex-col gap-y-1 backdrop-blur-md rounded-lg text-sm">
                                        <DropdownMenu.Item class="flex flex-row items-center gap-2 pl-2 pr-4 px-4 py-1 hover:bg-lavender/30 text-text hover:text-[rgb(46,48,66)] rounded-md">
                                          <IconStarOutline class="text-lg" />
                                          Favorite
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                          class="flex flex-row items-center gap-2 pl-2 pr-4 px-4 py-1 hover:bg-lavender/30 text-text hover:text-[rgb(46,48,66)] rounded-md"
                                          onSelect={() => navigator.clipboard.writeText(workspace().data.id)}
                                        >
                                          <IconContentCopy class="text-lg" />
                                          Copy workspace ID
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                          class="flex flex-row items-center gap-2 pl-2 pr-4 py-1 hover:bg-maroon/20 text-maroon rounded-md"
                                        >
                                          <IconDeleteOutline class="text-lg" />
                                          Delete permanently
                                        </DropdownMenu.Item>
                                      </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                  </DropdownMenu.Root>
                                </div>
                              </A>
                            )}
                          </Match>
                        </Switch>
                      )}
                    </For>
                  </div>
                </section>
              </Show>
            </Presence>
          </main>

          <footer class="shrink-0 bg-surface0/30 border-t border-surface1 w-full h-16 flex md:hidden flex-row justify-between px-4 shadow-sm">
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
      </div>
    </>
  );
};

export default Page;
