import { createSignal, onMount } from "solid-js";

import { auth } from "@/stores/auth";
import { supabase } from "@/supabase/client";

import Header from "@/components/landing/Header";

export default function Account() {

  const [userEmail, setUserEmail] = createSignal("");

  onMount(async () => {
    const email = (await supabase.auth.getUser()).data.user?.email;
    setUserEmail(email || "");
  })

  return (
    <div
      class="h-screen w-screen relative text-sm">
      <Header />
      <main
        class=" border-2 rounded-lg shadow-xl mx-64 border-surface0 bg-base/80 h-fit p-4 m-auto transition-all absolute left-0 right-0 top-16 bottom-0 backdrop-blur-lg"
      >
        <h1 class="text-2xl font-semibold text-[#0f0f0f] mb-1">My Account <span class="text-lavender ml-2 text-sm">ᓚᘏᗢ</span></h1>
        <p class="text-text">
          Let our cats know who you are by updating your account information! &nbsp; ฅ^•ﻌ•^ฅ
        </p>
        <div class="flex flex-col gap-y-2 mt-8">
          <h2 class="text-xl font-semibold text-[#0f0f0f] mb-2">Profile</h2>
          <div class="grid grid-cols-2 gap-x-2">
            <div class="flex flex-col gap-y-1 bg-base p-3 rounded-lg border-surface0 border hover:border-lavender transition">
              <p class="text-subtext1 font-light text-xs">
                First name
              </p>
              <input
                type="text"
                value={auth.profile?.first_name}
                placeholder="What's your first name?"
                class="bg-base text-text outline-none"
              />
            </div>
            <div class="flex flex-col gap-y-1 bg-base p-3 rounded-lg border-surface0 border hover:border-lavender transition">
              <p class="text-subtext1 font-light text-xs">
                Last name
              </p>
              <input
                type="text"
                value={auth.profile?.last_name}
                placeholder="What's your last name?"
                class="bg-base text-text outline-none"
              />
            </div>
          </div>
          <div class="flex flex-col gap-y-1 bg-base p-3 rounded-lg border-surface0 border hover:border-lavender transition">
            <p class="text-subtext1 font-light text-xs">
              Username
            </p>
            <input
              type="text"
              placeholder="What do you want to be referred as?"
              class="bg-base text-text outline-none"
            />
          </div>
          <div class="flex flex-row gap-4 mt-2 justify-end">
            <button class="px-4 py-2 rounded-md bg-lavender text-base">Save Changes</button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-5">
          <div class="flex flex-col gap-y-4 mt-8">
            <h2 class="text-xl font-semibold text-[#0f0f0f]">User Details</h2>
            <div class="flex flex-col gap-y-1">
              <p class="text-subtext1 font-light text-xs">
                Email
              </p>
              <span class="text-text">{userEmail()}</span>
            </div>
            <div class="flex flex-col gap-y-1 ">
              <p class="text-subtext1 font-light text-xs">
                User ID
              </p>
              <span class="text-text">{auth.profile?.user_id}</span>
            </div>
          </div>
          <div class="flex flex-col gap-y-2 mt-8">
            <h2 class="text-xl font-semibold text-[#0f0f0f]">Account Token</h2>
            <p class="text-maroon mb-2">This is your account token. This token provides FULL ACCESS to your account to any application - DO NOT give this token away to strangers.</p>
            <div class="flex flex-col gap-y-1 bg-base p-3 rounded-lg border-surface0 border hover:border-lavender transition">
              <p class="text-subtext1 font-light text-xs">
                Your account's token is:
              </p>

              <span class="text-text">{auth.profile?.api_token}</span>
            </div>
            <div class="flex flex-row gap-4 mt-2 justify-end">
              <button class="px-4 py-2 rounded-md bg-lavender text-base">Regenerate</button>
              <button class="px-4 py-2 rounded-md bg-lavender text-base">Copy</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/*
<div class="px-10 py-8">
        <h1 class="text-4xl font-bold mb-0.5">My Account <span class="text-lavender text-xl">ᓚᘏᗢ</span></h1>
        <p class="text-subtext0 mb-6">Let our cats know who you are by updating your account information! &nbsp; ฅ^•ﻌ•^ฅ </p>

        <div class="flex flex-col gap-4 mb-4">
          <div>Your Email: &nbsp; <span class="text-[#0e0e0e]">PogPog@pogpog.com</span></div>
          <div>Your User ID: &nbsp; <span class="text-[#0e0e0e]">029385092835235</span></div>
          <div>Your Username: &nbsp;
            <input
              type="text"
              placeholder="What's your first name?"
              class="p-1 rounded-md bg-base border-surface0 text-[#0e0e0e]"
            />
          </div>
          <div class="flex flex-row gap-6">
            <div>Your First Name: &nbsp;
              <input
                type="text"
                value={"John"}
                placeholder="Set a username..."
                class="p-1 rounded-md bg-base border-surface0 text-[#0e0e0e]"
              />
            </div>
            <div>Your Last Name: &nbsp;
              <input
                type="text"
                value={"Doe"}
                placeholder="Set a username..."
                class="p-1 rounded-md bg-base border-surface0 text-[#0e0e0e]"
              />
            </div>
          </div>
        </div>

        <button class="mb-8 px-4 py-2 rounded-md bg-lavender text-crust">Save changes</button>

        <h2 class="text-2xl font-bold">Your API Key</h2>
        <p class="text-subtext0 mb-4">This is the key used to upload things to your account, e.g. for the ShareX integration. Please do not share this with anyone to prevent unwanted uploads to your account!</p>

        <div class="p-1 bg-base border-surface0 rounded-md max-w-sm">081435-235235-235235-23525235</div>
      </div>
      */