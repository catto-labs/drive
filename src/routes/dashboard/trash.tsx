import {
  onMount, type Component,
  Switch,
  createSignal,
  Show,
  For,
  Match,
} from "solid-js";

import { A, Title, useNavigate } from "solid-start";
import { Motion, Presence } from "@motionone/solid";

import IconStarOutline from "~icons/mdi/star-outline";
import IconPlus from "~icons/mdi/plus";
import IconFolderAccountOutline from "~icons/mdi/folder-account-outline";
import IconAccountMultipleOutline from "~icons/mdi/account-multiple-outline";
import IconTrashCanOutline from "~icons/mdi/trash-can-outline";
import IconAccount from "~icons/mdi/account";
import IconMenuDown from "~icons/mdi/menu-down";
import IconLogout from "~icons/mdi/logout"
import cattoDriveBox from "@/assets/icon/box.png";
import cattoDriveCatto from "@/assets/icon/catto.png";
import SpinnerRingResize from "~icons/svg-spinners/ring-resize";

import { DropdownMenu } from "@kobalte/core";

import { auth, logOutUser } from "@/stores/auth";

const SharedPage: Component = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    setLoading(false);
  })

  return (
    <>
      <Title>Shared - Drive</Title>

      <div class="md:backdrop-blur-xl w-screen h-screen relative flex overflow-hidden">
        <div class="text-text bg-surface0/80 min-w-64 w-1/5 shrink-0 md:block hidden">
          <header class="px-4 pt-6 pb-2 shrink-0 sticky top-0 w-full h-14 flex flex-row flex flex-row gap-[10px] items-center w-full">

            <div class="relative w-10 h-10">
              <img src={cattoDriveBox} class="absolute inset-0 -bottom-4 mx-auto my-auto z-10" />

              <img
                src={cattoDriveCatto}
                class="absolute transition-all transition-duration-500"
                classList={{
                  "-mt-2.5": !loading(), // Loaded.
                  "-mt-0": loading() // Loading.
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
              class="mb-4 pl-2 pr-4 py-2 flex flex-row gap-1 text-crust bg-lavender/40 hover:bg-[#5f72d9]/40 transition rounded-md"
            >
              <IconPlus class="h-6 w-6" />
              Upload
            </button>
            <div class="flex flex-col gap-0.5 text-text">
              <A
                href={`/dashboard/${auth.profile!.root_workspace_id}`}
                class="py-2 pl-2 pr-4 flex flex-row items-center gap-2 hover:bg-gradient-to-r from-lavender/30 transition-all rounded-md "
              >
                <IconFolderAccountOutline class="w-6 h-6" />
                <span>My Workspace</span>
              </A>
              <A
                href="/dashboard/trash"
                class="py-2 pl-2 pr-4 flex flex-row items-center gap-2 bg-gradient-to-r from-lavender/30 to-mauve/20 transition rounded-md"
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
              Shared
            </h1>
            <div class="flex flex-row gap-x-2 mr-4 w-full md:w-fit items-center">
              <input
                type="search"
                placeholder="Search..."
                name="search"
                autofocus
                class="py-1 px-4 outline-none rounded-xl w-full md:w-84 bg-surface1 transition border-2 border-overlay0 hover:bg-overlay0 text-text placeholder-text-subtext1"
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
                      class="flex flex-row gap-4 px-4 py-1 hover:bg-lavender transition text-text hover:text-[rgb(46,48,66)] rounded-md"
                    >
                      <IconAccount class="text-lg" />
                      My Account
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={async () => {
                        await logOutUser();
                        navigate("/");
                      }}
                      class="flex flex-row gap-4 px-4 py-1 hover:bg-lavender transition  text-text hover:text-[rgb(46,48,66)] rounded-md"
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
            <section class="block md:p-4 py-3 overflow-y-auto h-full">
              <h2>This has not been implemented yet! Deletes are permanent for now, please proceed with caution!</h2>
            </section>
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
}

export default SharedPage;
