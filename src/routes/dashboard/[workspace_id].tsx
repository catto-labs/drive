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

import { A, Title, useParams } from "solid-start";
import { Presence } from "@motionone/solid";

import { autofocus } from "@solid-primitives/autofocus";
// prevents from being tree-shaken by TS
autofocus;

import IconStarOutline from "~icons/mdi/star-outline";
import IconShareVariantOutline from "~icons/mdi/share-variant-outline";
import IconPlus from "~icons/mdi/plus";
import IconAccountPlusOutline from "~icons/mdi/account-plus-outline";
import IconAccountMultipleOutline from "~icons/mdi/account-multiple-outline";
import IconAccount from "~icons/mdi/account";
import IconDownload from "~icons/mdi/download";
import IconDeleteOutline from "~icons/mdi/delete-outline";
import IconDotsHorizontal from "~icons/mdi/dots-horizontal";
import IconContentCopy from "~icons/mdi/content-copy";
import IconClose from "~icons/mdi/close";
import IconFolderOutline from "~icons/mdi/folder-outline";
import IconArrowULeftTop from "~icons/mdi/arrow-u-left-top";

import { getFileIcon } from "@/utils/getFileIcons";
import { relativeTime } from "@/utils/relativeTime";

import { DropdownMenu, Switch as KSwitch } from "@kobalte/core";
import { createModal } from "@/primitives/modal";

import {
  createFileImporter,
  downloadUploadedFile,
  getUploadedFileURL,
  removePermanentlyFile,
} from "@/utils/files";

import { getWorkspace } from "@/utils/workspaces";

import { auth } from "@/stores/auth";
import { workspaces, setWorkspaces } from "@/stores/workspaces";
import { getUserFrom, saveUploadSharingPreferences } from "@/utils/users";

import { setLayoutLoading, fileUploadHandler, layoutLoading, LoadingSection } from "../dashboard";

const Page: Component = () => {
  const params = useParams() as { workspace_id: string };

  createEffect(on(() => params.workspace_id, async (workspaceId: string) => {
    setLayoutLoading(true);
    
    const workspace_content = await getWorkspace(workspaceId);
    setWorkspaces(workspaceId, workspace_content);
    setLayoutLoading(false);
  }));

  const getWorkspaceName = (name: string) => {
    if (name === "../") {
      return "Go back to parent folder";
    }

    if (name.startsWith("./")) {
      return name.substring(2);
    }

    return name;
  };

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
                if (layoutLoading() || !uidToAdd()) return;
                setLayoutLoading(true);

                const user_data = await getUserFrom(uidToAdd());
                setLayoutLoading(false);

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
                disabled={layoutLoading()}
                class="w-full rounded-l bg-base px-3 py-2 outline-none"
                type="text"
                placeholder="Enter email or user ID"
                value={uidToAdd()}
                onInput={(event) => setUidToAdd(event.currentTarget.value)}
              />
              <button
                disabled={layoutLoading()}
                class="group shrink-0 rounded-r bg-base px-2 py-2 outline-none"
                type="submit"
              >
                <div class="rounded bg-lavender p-1.5 transition group-disabled:opacity-20">
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
            onClick={() => Modal.close()}
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

      <main class="relative h-full overflow-hidden">
        <button type="button"
          disabled={!auth.profile}
          onClick={() => createFileImporter(files => fileUploadHandler(params.workspace_id, files))}
          class="absolute bottom-4 right-4 z-30 flex flex-row gap-1 rounded-full bg-lavender p-2 text-crust transition md:hidden hover:bg-[#5f72d9]"
        >
          <IconPlus class="text-2xl" />
        </button>

        <Presence exitBeforeEnter>
          <Show when={workspaces[params.workspace_id]}
            fallback={<LoadingSection message="Our cats are gathering the files for this workspace!" />}
          >
            <section class="block h-full overflow-y-auto py-16 md:p-4 md:py-3">
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
                                        onSelect={() => {
                                          const url = getUploadedFileURL(file().data);
                                          navigator.clipboard.writeText(url.href);
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
                                  <IconFolderOutline class="min-w-6 text-lg text-text" />
                                }
                              >
                                <IconArrowULeftTop class="mb-0.5 min-w-6 text-lg text-text" />
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

    </>
  );
};

export default Page;
