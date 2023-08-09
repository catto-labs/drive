import { Show } from "solid-js";
import { A } from "solid-start";
import { isAuthenticated } from "@/stores/auth";

import IconAccount from "~icons/mdi/account";

export default function Header() {
  return (
    <header class="bg-gradient-to-b bg-gradient-from-crust h-64 p-8 flex justify-end">
      <div class="flex gap-x-4 h-fit">
        <A
          href="https://github.com/catto-labs/drive"
          class="text-crust inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 px-4 py-2 rounded-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
        >
          Command-line Client
        </A>
        <A
          href="/dashboard"
          class="text-crust mr-6 inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 px-4 py-2 rounded-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
        >
          Dashboard
        </A>

        <Show
          when={isAuthenticated()}
          fallback={
            <div class="flex h-fit">
              <A
                href="/auth/login"
                class="text-crust inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 px-4 py-2 rounded-l-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
              >
                Login
              </A>
              <A
                href="/auth/register"
                class="text-crust inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 px-4 py-2 rounded-r-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
              >
                Register
              </A>
            </div>
          }
        >
          <A
            href="/"
            class="text-crust inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 pl-3 pr-4 py-2 rounded-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
          >
            {/* this can be substituted for the user's profile picture instead */}
            <IconAccount class="text-[16px] my-auto" />
            My Account
          </A>
        </Show>
      </div>
    </header>
  );
}
