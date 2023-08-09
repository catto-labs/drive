import IconAccount from "~icons/mdi/account";

import { A } from "solid-start";

export default function Header() {
  return (
    <header class="bg-gradient-to-b bg-gradient-from-ctp-crust h-64 p-8 flex justify-end">
      <div class="flex gap-x-4 h-fit">
        <A
          href="https://github.com/catto-labs/drive"
          class="text-ctp-crust inline-flex gap-x-1 bg-ctp-text hover:bg-ctp-subtext0 border border-ctp-subtext0 px-4 py-2 rounded-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
        >
          Command-line Client
        </A>
        <A
          href="/dashboard"
          class="text-ctp-crust mr-6 inline-flex gap-x-1 bg-ctp-text hover:bg-ctp-subtext0 border border-ctp-subtext0 px-4 py-2 rounded-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
        >
          Dashboard
        </A>
        <A
          href="/"
          class="text-ctp-crust inline-flex gap-x-1 bg-ctp-text hover:bg-ctp-subtext0 border border-ctp-subtext0 pl-3 pr-4 py-2 rounded-md h-fit my-auto shadow-inner shadow-lg transform duration-150"
        >
          {/* this can be substituted for the user's profile picture instead */}
          <IconAccount class="text-[16px] my-auto" />
          My Account
        </A>
      </div>
    </header>
  );
}
