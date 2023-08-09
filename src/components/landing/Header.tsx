import IconAccount from "~icons/mdi/account";

import { A } from "solid-start";

export default function Header() {
  return (
    <header class="bg-gradient-to-b bg-gradient-from-crust h-64 p-8 flex justify-end gap-x-4">
      <A
        href="https://github.com/catto-labs/drive"
        class="text-crust inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 px-4 py-2 rounded-md h-fit shadow-inner shadow-lg transform duration-150"
      >
        Command-line Client
      </A>
      <A
        href="/dashboard"
        class="text-crust mr-6 inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 px-4 py-2 rounded-md h-fit shadow-inner shadow-lg transform duration-150"
      >
        Dashboard
      </A>
      <A
        href="/"
        class="text-crust inline-flex gap-x-1 bg-text hover:bg-subtext0 border border-subtext0 pl-3 pr-4 py-2 rounded-md h-fit shadow-inner shadow-lg transform duration-150"
      >
        <IconAccount class="text-[16px] my-auto" />
        My Account
      </A>
    </header>
  );
}
