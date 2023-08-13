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

import { autofocus } from "@solid-primitives/autofocus";
// prevents from being tree-shaken by TS
autofocus;

import IconStarOutline from "~icons/mdi/star-outline";
import IconShareVariantOutline from "~icons/mdi/share-variant-outline";
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
import IconLogout from "~icons/mdi/logout";
import IconFolderPlusOutline from "~icons/mdi/folder-plus-outline";
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
  const [newFolderName, setNewFolderName] = createSignal("");

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
    }
    catch (error) {
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

  const [openNewFolderModal] = createModal((Modal) => (
    <>
      <div class="flex justify-between text-text">
        <h1 class="my-auto text-xl font-semibold">
          Create a new folder
        </h1>
        <Modal.CloseButton class="my-auto rounded-lg p-2 hover:bg-maroon/20">
          <IconClose class="text-lg" />
        </Modal.CloseButton>
      </div>
      <form
        class="mt-2 w-full flex flex-col justify-end gap-x-4"
        onSubmit={async (event) => {
          event.preventDefault();
          
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
        <input use:autofocus autofocus placeholder="Enter a name for your folder..." value={newFolderName()} onInput={event => setNewFolderName(event.target.value)} class="mb-2 rounded-md px-1 py-2 text-text" />
        <div class="flex flex-row items-center justify-end gap-2">
          <button
            type="submit"
            class="my-auto border border-surface1 rounded-lg bg-lavender/80 px-4 py-2 transition-all hover:border-lavender hover:bg-lavender"
          >
            Create folder
          </button>
          <Modal.CloseButton
            type="button"
            class="my-auto border border-surface1 rounded-lg bg-base/50 px-4 py-2 transition-all hover:border-lavender hover:bg-base"
          >
            Cancel
          </Modal.CloseButton>
        </div>
      </form>
    </>
  ));

  const [openDeleteModal] = createModal<UploadedFile>((Modal) => (
    <>
      <div class="flex justify-between text-text">
        <h1 class="my-auto text-xl font-semibold">
          Delete file
        </h1>
        <Modal.CloseButton class="my-auto rounded-lg p-2 hover:bg-maroon/20">
          <IconClose class="text-lg" />
        </Modal.CloseButton>
      </div>
      <Modal.Description class="text-subtext0">
        Are you sure you want to
        permanently delete this file? You
        won't be able to restore this from
        the trash bin later on.
      </Modal.Description>
      <form
        class="mt-2 w-full flex justify-end gap-x-4"
        onSubmit={async (event) => {
          event.preventDefault();
          await removePermanentlyFile(Modal.data.id);

          setWorkspaces(params.workspace_id, "content", (prev) =>
            prev
              ? prev.filter(
                (item) =>
                  item.type === "workspace" ||
                  (item.type === "file" && item.data.id !== Modal.data.id)
              )
              : []
          );

          close();
        }}
      >
        <button
          type="submit"
          class="my-auto border border-surface1 rounded-lg bg-flamingo/80 px-4 py-2 transition-all hover:border-lavender hover:bg-flamingo"
        >
          Yes
        </button>
        <Modal.CloseButton
          type="button"
          class="my-auto border border-surface1 rounded-lg bg-base/50 px-4 py-2 transition-all hover:border-lavender hover:bg-base"
        >
          No
        </Modal.CloseButton>
      </form>
    </>
  ));

  const [openSharingModal] = createModal<WorkspaceContent>(Modal => {
    // We only check for files, since workspaces are always private.
    // The only way to share workspaces is sharing the access to someone.
    // eslint-disable-next-line solid/reactivity
    const [isPublic, setIsPublic] = createSignal(Modal.data.type === "file" ? !Modal.data.data.private : false);
    // eslint-disable-next-line solid/reactivity
    const [uidShared, setUidShared] = createSignal(Modal.data.data.shared_with);
    const [uidToAdd, setUidToAdd] = createSignal("");

    return (
      <div class="flex flex-col gap-4">
        <h1 class="text-center text-2xl font-semibold">
          Sharing
        </h1>
        <div class="mx-auto mb-2 w-fit flex items-center justify-center gap-2 rounded-lg bg-crust px-3 py-1">
          {Modal.data.type === "file" ? getFileIcon(Modal.data.data) : <IconFolderOutline />}
          <p class="text-text">
            {Modal.data.data.name || Modal.data.data.id}
          </p>
        </div>

        <Show when={Modal.data.type === "file"}>
          <KSwitch.Root
            class="mx-auto inline-flex cursor-pointer items-center"
            checked={isPublic()}
            onChange={setIsPublic}
          >
            <KSwitch.Input />
            <KSwitch.Control class="h-[24px] w-[44px] inline-flex items-center border border-text rounded-xl bg-text px-.5 py-0 transition ui-checked:(border-lavender bg-lavender)">
              <KSwitch.Thumb class="h-[20px] w-[20px] rounded-2.5 bg-base transition ui-checked:translate-x-[calc(100%-1px)]" />
            </KSwitch.Control>
            <KSwitch.Label
              class="ml-2 select-none text-lg font-medium text-text"
            >
              Public to <strong class="font-semibold">everyone who has the link</strong>
            </KSwitch.Label>
          </KSwitch.Root>
        </Show>

        <Show when={Modal.data.type === "workspace" || (Modal.data.type === "file" && !isPublic())}>
          <div class="flex flex-col">
            <p class="select-none text-text">Give access to this {Modal.data.type} to some users</p>
            <p class="text-sm font-medium text-text">Note that those users will <strong class="font-semibold">have full access to the {Modal.data.type}</strong>, but won't be able to delete it.</p>
          
            <form
              class="mt-2 w-full flex"
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
                class="w-full rounded-l bg-base px-3 py-2 outline-none"
                type="text"
                placeholder="Enter email or user ID"
                value={uidToAdd()}
                onInput={(event) => setUidToAdd(event.currentTarget.value)}
              />
              <button
                class="shrink-0 rounded-r bg-base px-2 py-2 outline-none"
                type="submit"
              >
                <div class="rounded bg-lavender p-1.5">
                  <IconAccountPlusOutline class="text-base" />
                </div>
              </button>
            </form>

            <For each={uidShared()}>
              {uid => (
                <div class="ml-2 mt-2 flex items-center gap-2 text-text">
                  <IconAccount/> 
                  <p class="font-medium">
                    {uid}
                  </p>
                </div>
              )}
            </For>
          </div>
        </Show>

        <div class="mt-4 flex flex-col gap-2 text-center">
          <button type="button"
            class="rounded-lg bg-lavender bg-opacity-90 px-2 py-2 text-base transition hover:bg-opacity-100"
            onClick={async () => {
              const new_data = await saveUploadSharingPreferences(Modal.data.type, Modal.data.data.id, isPublic(), uidShared());
              if (!new_data) return;

              setWorkspaces(params.workspace_id, "content", item => item.data.id === Modal.data.data.id, "data", new_data);
              
              Modal.close();
            }}
          >
            Save
          </button>
          <button type="button"
            class="rounded-lg px-2 py-1 text-text transition hover:bg-text/10"
            onClick={close}
          >
            Forget about it
          </button>
        </div>

      </div>
    );
  });

  return (
    <>
      <Title>Dashboard - Drive</Title>

      <div class="relative h-screen w-screen flex overflow-hidden md:backdrop-blur-xl">
        <div class="hidden min-w-64 w-1/5 shrink-0 bg-surface0/80 text-text md:block">
          <header class="sticky top-0 h-14 w-full w-full flex flex shrink-0 flex-row flex-row items-center gap-[10px] px-4 pb-2 pt-6">

            <div class="relative h-10 w-10">
              <img src={cattoDriveBox} class="absolute inset-0 z-10 mx-auto my-auto -bottom-4" />

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
              <span class="text-2xl font-bold">Drive </span>
              <span class="mr-[10px] text-[15px] font-light">
                by catto labs
              </span>
            </span>
          </header>

          <nav class="p-4">
            <button type="button"
              disabled={!auth.profile}
              onClick={() => createFileImporter(fileUploadHandler)}
              class="mb-4 flex flex-row gap-1 rounded-md bg-lavender py-2 pl-2 pr-4 text-crust transition hover:bg-[#5f72d9]"
            >
              <IconPlus class="h-6 w-6" />
              Upload
            </button>
            <div class="flex flex-col gap-0.5 text-text">
              <A
                href={`/dashboard/${auth.profile!.root_workspace_id}`}
                class="flex flex-row items-center gap-2 rounded-md from-lavender/30 to-mauve/20 bg-gradient-to-r py-2 pl-2 pr-4 transition"
              >
                <IconFolderAccountOutline class="h-6 w-6" />
                <span>My Workspace</span>
              </A>
              <A
                href="/dashboard/trash"
                class="flex flex-row items-center gap-2 rounded-md from-lavender/30 py-2 pl-2 pr-4 transition-all hover:bg-gradient-to-r"
              >
                <IconTrashCanOutline class="h-6 w-6" />
                <span>Recycle Bin</span>
              </A>
            </div>
          </nav>
        </div>

        <div class="z-20 h-full w-full flex flex-col border-l border-surface2 bg-base md:w-4/5">
          <header class="sticky top-0 z-20 h-16 w-full flex flex-row justify-between border-b border-surface1 bg-surface0/30 pl-2 shadow-sm md:pl-0">
            <h1 class="ml-4 hidden h-full flex-col justify-center border-base font-semibold text-text md:flex">
              {params.workspace_id === auth.profile!.root_workspace_id ? "My workspace" : (
                workspaces[params.workspace_id]
                  ? (workspaces[params.workspace_id].meta.name || workspaces[params.workspace_id].meta.id)
                  : "Loading..."
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
                type="search"
                placeholder="Search..."
                name="search"
                autofocus
                class="w-full border-2 border-overlay0 rounded-xl bg-surface1 px-4 py-1 text-text outline-none transition md:w-84 hover:bg-overlay0 placeholder-text-subtext1"
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
                      onClick={async () => {
                        navigate("/account");
                      }}
                      class="flex flex-row gap-4 rounded-md px-4 py-1 text-text transition hover:bg-lavender hover:text-[rgb(46,48,66)]"
                    >
                      <IconAccount class="text-lg" />
                      My Account
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={async () => {
                        await logOutUser();
                        navigate("/");
                      }}
                      class="flex flex-row gap-4 rounded-md px-4 py-1 text-text transition hover:bg-lavender hover:text-[rgb(46,48,66)]"
                    >
                      <IconLogout class="text-lg" />
                      Sign out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </header>

          <main class="relative h-full overflow-hidden">
            <button type="button"
              disabled={!auth.profile}
              onClick={() => createFileImporter(fileUploadHandler)}
              class="absolute bottom-4 right-4 z-30 flex flex-row gap-1 rounded-full bg-lavender p-2 text-crust transition md:hidden hover:bg-[#5f72d9]"
            >
              <IconPlus class="text-2xl" />
            </button>

            <Presence exitBeforeEnter>
              <Show when={workspaces[params.workspace_id]}
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
                        Our cats are gathering the files for this workspace!
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
                    <For each={workspaces[params.workspace_id].content}>
                      {(content) => (
                        <Switch>
                          <Match when={content.type === "file" && content}>
                            {(file) => (
                              <div class="h-auto w-full flex flex-row items-center justify-between gap-1 border-surface2 p-2 px-4 transition md:border-b hover:bg-surface0/50 md:px-2">
                                <div class="flex flex-row gap-x-2 truncate text-ellipsis">
                                  <div class="my-auto">
                                    {getFileIcon(file().data)}
                                  </div>
                                  <div class="flex flex-col truncate pr-4 md:flex-row">
                                    <div class="flex flex-row gap-2 text-[#0f0f0f] lg:w-142 md:w-100">
                                      <p class="mt-0.5 flex items-center gap-2 truncate text-ellipsis text-sm lg:w-122 md:w-80">
                                        {file().data.name}
                                        <Show when={!file().data.private}>
                                          <IconAccountMultipleOutline class="text-text" />
                                          {/* <span class="ml-2 bg-lavender text-base rounded px-1.5 py-0.5 font-medium text-xs">Public</span> */}
                                        </Show>
                                      </p>

                                    </div>
                                    <div class="flex-row gap-2 text-text">
                                      <p class="mt-0.5 text-sm">
                                        {relativeTime(file().data.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div class="w-16 flex flex-row gap-1">
                                  <button
                                    type="button"
                                    title="Share"
                                    class="rounded-md p-1 hover:bg-surface1"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.preventDefault();

                                      openSharingModal(file());
                                    }}
                                  >
                                    <IconShareVariantOutline class="text-lg text-text" />
                                  </button>
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
                                          onClick={() => downloadUploadedFile(file().data)}
                                          class="flex flex-row items-center gap-2 rounded-md py-1 pl-2 pr-4 text-text hover:bg-lavender/30 hover:text-[rgb(46,48,66)]"
                                        >
                                          <IconDownload class="text-lg" />
                                          Download
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item class="flex flex-row items-center gap-2 rounded-md px-4 py-1 pl-2 pr-4 text-text hover:bg-lavender/30 hover:text-[rgb(46,48,66)]">
                                          <IconStarOutline class="text-lg" />
                                          Favorite
                                        </DropdownMenu.Item>
                                        <Show when={!file().data.private}>
                                          <DropdownMenu.Item
                                            class="flex flex-row items-center gap-2 rounded-md px-4 py-1 pl-2 pr-4 text-text hover:bg-lavender/30 hover:text-[rgb(46,48,66)]"
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
                                          class="flex flex-row items-center gap-2 rounded-md py-1 pl-2 pr-4 text-maroon hover:bg-maroon/20"
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
                              <A href={`/dashboard/${workspace().data.id}`} class="h-auto w-full flex flex-row items-center justify-between gap-1 border-surface2 p-2 px-4 md:border-b hover:bg-surface0/50 md:px-2">
                                <div class="flex flex-row gap-x-2 truncate text-ellipsis">
                                  <Show
                                    when={workspace().data.name === "../"}
                                    fallback={
                                      <IconFolderOutline class="min-w-6 text-lg" />
                                    }
                                  >
                                    <IconArrowULeftTop class="mb-0.5 min-w-6 text-lg" />
                                  </Show>
                                  <p class="mt-0.5 truncate text-ellipsis text-sm text-[#0f0f0f] lg:w-122 md:w-80">
                                    {getWorkspaceName(workspace().data.name)}
                                  </p>
                                </div>

                                <div class="w-16 flex flex-row gap-1">
                                  <button
                                    type="button"
                                    title="Share"
                                    class="rounded-md p-1 hover:bg-surface1"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.preventDefault();

                                      openSharingModal(workspace());
                                    }}
                                  >
                                    <IconShareVariantOutline class="text-lg text-text" />
                                  </button>
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
                                          onSelect={() => navigator.clipboard.writeText(workspace().data.id)}
                                        >
                                          <IconContentCopy class="text-lg" />
                                          Copy workspace ID
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                          class="flex flex-row items-center gap-2 rounded-md py-1 pl-2 pr-4 text-maroon hover:bg-maroon/20"
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

          <footer class="h-16 w-full flex shrink-0 flex-row justify-between border-t border-surface1 bg-surface0/30 px-4 shadow-sm md:hidden">
            <A
              href={`/dashboard/${auth.profile!.root_workspace_id}`}
              class="flex flex-col items-center gap-1 rounded-md px-2 py-2 transition"
            >
              <IconFolderAccountOutline class="h-7 w-13 rounded-full from-lavender/30 to-mauve/20 bg-gradient-to-r" />
              <span class="text-[0.8rem]">My Workspace</span>
            </A>
            <A
              href="/dashboard/shared"
              class="flex flex-col items-center gap-1 rounded-md px-2 py-2 transition"
            >
              <IconFolderAccountOutline class="h-7 w-13" />
              <span class="text-[0.8rem]">Shared</span>
            </A>
            <A
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
            </A>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Page;
