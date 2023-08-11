import { Show } from "solid-js";
import { A } from "solid-start";
import { isAuthenticated } from "@/stores/auth";

import IconAccount from "~icons/mdi/account";

import cattoDriveLogo from "@/assets/icon/logo.png"

export default function Header() {
  return (
    <header class="flex justify-between p-8 bg-gradient-to-b bg-gradient-from-[#2d303d]">
      <A href="/"><img src={cattoDriveLogo} class="w-12 h-12" alt="drive by catto labs logo" /></A>
      <nav class="h-64 flex justify-end">
        <div class="flex gap-x-4 h-fit">
          <A
            href="https://github.com/catto-labs/drive"
            class="text-text inline-flex gap-x-1 bg-surface0 hover:bg-surface1 border border-surface1 px-4 py-2 rounded-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
          >
            Command-line Client
          </A>
          <Show
            when={isAuthenticated()}
            fallback={
              <div class="flex h-fit">
                <A
                  href="/auth/login"
                  class="text-text inline-flex gap-x-1 bg-surface0 hover:bg-surface1 border border-surface1 px-4 py-2 rounded-l-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
                >
                  Login
                </A>
                <A
                  href="/auth/register"
                  class="text-text inline-flex gap-x-1 bg-surface0 hover:bg-surface1 border border-surface1 px-4 py-2 rounded-r-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
                >
                  Register
                </A>
              </div>
            }
          >
            <A
              href="/dashboard"
              class="text-text inline-flex gap-x-1 bg-surface0 hover:bg-surface1 border border-surface1 px-4 py-2 rounded-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
            >
              Dashboard
            </A>
            <A
              href="/"
              class="text-text inline-flex gap-x-1 bg-surface0 hover:bg-surface1 border border-surface1 pl-3 pr-4 py-2 rounded-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
            >
              {/* this can be substituted for the user's profile picture instead */}
              <IconAccount class="text-[16px] my-auto" />
              My Account
            </A>
          </Show>
        </div>
      </nav>
    </header>
  );
}
