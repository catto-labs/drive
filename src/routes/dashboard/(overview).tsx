import { supabase } from "@/supabase/client";
import { type Component } from "solid-js";
import { Title, useNavigate } from "solid-start";
import { setAuth } from "@/stores/auth";

import IconPower from "~icons/mdi/power";
import IconDotsHorizontalCircleOutline from "~icons/mdi/dots-horizontal-circle-outline";
import IconStarOutline from "~icons/mdi/star-outline";
import IconShareVariantOutline from "~icons/mdi/share-variant-outline";

const Page: Component = () => {
  const navigate = useNavigate();

  return (
    <>
      <Title>Dashboard - Drive</Title>

      <main class="backdrop-blur-xl w-screen h-screen relative">
        <div class="absolute w-screen h-screen bg-text opacity-50">
          <div class="w-1/5 p-4"></div>
        </div>
        <div class="absolute right-0 top-0 h-screen bg-text border-l border-subtext0 w-4/5 z-20">
          <div class="bg-subtext1 border-b border-subtext0 w-full h-1/12 flex flex-row justify-between shadow-sm">
            <h1 class="border-base font-semibold h-full justify-center flex flex-col ml-4">
              My Files
            </h1>
            <div class="flex flex-row gap-x-2 mr-4 items-center">
              <button
                type="button"
                title="Share the selected items items"
                class="hover:text-surface0 text-surface2 hover:text-surface0 transition  hover:bg-subtext0 p-1.5 h-fit rounded-lg"
              >
                <IconShareVariantOutline class="text-xl" />
                {/* this should change to a filled star when a file is starred */}
              </button>
              <button
                type="button"
                title="Toggle favourite"
                class="hover:text-surface0 text-surface2 hover:text-surface0 transition  hover:bg-subtext0 p-1.5 h-fit rounded-lg"
              >
                <IconStarOutline class="text-xl" />
                {/* this should change to a filled star when a file is starred */}
              </button>
              <button
                type="button"
                title="Perform tasks with the selected items"
                class="hover:text-surface0 text-surface2 hover:text-surface0 transition  hover:bg-subtext0 p-1.5 h-fit rounded-lg"
              >
                <IconDotsHorizontalCircleOutline class="text-xl" />
              </button>
              <input
                type="search"
                placeholder="Search..."
                name="search"
                autofocus
                class="py-1 px-4 rounded-xl w-64 mx-4 bg-subtext1 transition border-2 border-overlay2 hover:bg-subtext0 focus-border-subtext1 text-surface0 placeholder-text-surface2"
              />
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setAuth({ loading: false, session: null });
                  navigate("/");
                }}
                title="Logs you out of catto drive"
                class="hover:text-surface0 text-surface2 hover:text-surface0 transition  hover:bg-subtext0 p-1.5 h-fit rounded-lg"
              >
                <IconPower class="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
