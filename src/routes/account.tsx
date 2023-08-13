import { DropdownMenu } from "@kobalte/core";
import { A, useNavigate } from "solid-start";

import { auth, logOutUser } from "@/stores/auth";

import IconAccount from "~icons/mdi/account"
import IconMenuDown from "~icons/mdi/menu-down"
import IconLogout from "~icons/mdi/logout"

import cattoDriveLogo from "@/assets/icon/logo.png";
import { supabase } from "@/supabase/client";
import { createSignal, onMount } from "solid-js";

export default function Account() {
  const navigate = useNavigate();

  const [ userEmail, setUserEmail ] = createSignal("");

  onMount(async () => {
    const email = (await supabase.auth.getUser()).data.user?.email;
    setUserEmail(email || "");
  })

  return (
    <div class="w-full h-screen bg-surface0/80 backdrop-blur-md text-text">
      <header class="sticky z-20 top-0 bg-base/40 border-b border-surface0 w-full h-16 md:pl-0 pl-2 flex flex-row justify-between shadow-sm">
          <A href="/" class="px-4 flex flex-row flex flex-row gap-[10px] items-center w-full">
            <img src={cattoDriveLogo} class="w-10 h-10 -ml-1 mt-1" />
            <span class="text-lg">
              <span class="font-bold text-2xl">Drive </span>
              <span class="mr-[10px] font-light text-[15px]">
                by catto labs
              </span>
            </span>
          </A>
        <div class="flex flex-row gap-x-2 mr-4 w-full md:w-fit items-center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <button class="flex flex-row hover:text-text text-subtext1 transition hover:bg-surface2 p-1.5 h-fit rounded-lg">
                <IconMenuDown class="text-xl" />
                <IconAccount class="text-lg" />
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
      <div class="px-10 py-8">
        <h1 class="text-4xl font-bold mb-0.5">My Account <span class="text-lavender text-xl">ᓚᘏᗢ</span></h1>
        <p class="text-subtext0 mb-6">Let our cats know who you are by updating your account information! &nbsp; ฅ^•ﻌ•^ฅ </p>

        <div class="flex flex-col gap-4 mb-4">
          <div>Your Email: &nbsp; <span class="text-[#0e0e0e]">{userEmail()}</span></div>
          <div>Your User ID: &nbsp; <span class="text-[#0e0e0e]">{auth.profile?.user_id}</span></div>
          <div>Your Username: &nbsp; 
            <input 
              type="text" 
              value={"pog"} 
              placeholder="Set a username..." 
              class="p-1 rounded-md bg-base border-surface0 text-[#0e0e0e]"
            />
          </div>
          <div class="flex flex-row gap-6">
            <div>Your first name: &nbsp;
              <input
                type="text"
                value={auth.profile?.first_name}
                placeholder="Set a first name..."
                class="p-1 rounded-md bg-base border-surface0 text-[#0e0e0e]"
              />
            </div>
            <div>Your last name: &nbsp;
              <input
                type="text"
                value={auth.profile?.last_name}
                placeholder="Set a last name..."
                class="p-1 rounded-md bg-base border-surface0 text-[#0e0e0e]"
              />
            </div>
          </div>
        </div>

        <button class="mb-8 px-4 py-2 rounded-md bg-lavender text-crust">Save changes</button>

        <h2 class="text-2xl font-bold">Your API Token</h2>
        <p class="text-subtext0 mb-4">This is the key used to upload things to your account, e.g. for the ShareX integration. Please do not share this with anyone to prevent unwanted uploads to your account!</p>

        <div class="p-1 bg-base border-surface0 rounded-md max-w-sm">{auth.profile?.api_token}</div>
        <div class="flex flex-row gap-4 mt-2">
          <button class="px-4 py-2 rounded-md bg-lavender text-crust">Regenerate</button>
          <button class="px-4 py-2 rounded-md bg-lavender text-crust">Copy</button>
        </div>
      </div>
    </div>
  );
}
