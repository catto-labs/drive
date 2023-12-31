import { Show, batch, createEffect, createSignal } from "solid-js";

import { auth, setAuth } from "@/stores/auth";

import Header from "@/components/landing/Header";
import FullscreenLoader from "@/components/FullscreenLoader";
import toast from "solid-toast";

export default function Account() {
  const [username, setUsername] = createSignal(auth.profile?.username ?? "");
  const [first_name, setFirstName] = createSignal(auth.profile?.first_name ?? "");
  const [last_name, setLastName] = createSignal(auth.profile?.last_name ?? "");

  createEffect(() => {
    batch(() => {
      if (!auth.profile) return;
      setUsername(auth.profile.username);
      setFirstName(auth.profile.first_name);
      setLastName(auth.profile.last_name);
    });
  });

  const submitProfileInformation = async () => {
    if (!auth.profile) return;
    if (!username() || !first_name() || !last_name()) return;

    const response = await fetch("/api/account", {
      method: "POST",
      body: JSON.stringify({
        username: username(),
        first_name: first_name(),
        last_name: last_name()
      }),
      headers: {
        authorization: auth.profile.api_token,
        "Content-Type": "application/json"
      }
    });
  
    const json = await response.json();
    setAuth("profile", json.data);
    toast.success("Updated your account data.");
  };

  return (
    <Show when={auth.profile} fallback={
      <FullscreenLoader
        message="Our cattos are on their way to bring your information to you!"
      />
    }>
      <div
        class="relative h-screen w-screen text-sm">
        <Header />
        <main
          class="absolute bottom-0 left-0 right-0 top-16 m-auto h-fit border-2 border-surface0 rounded-lg bg-base/80 p-4 shadow-xl backdrop-blur-lg transition-all lg:mx-64 md:mx-32"
        >
          <h1 class="mb-1 text-2xl font-semibold text-[#0f0f0f]">My Account <span class="ml-2 text-sm text-lavender">ᓚᘏᗢ</span></h1>
          <p class="text-text">
            Let our cats know who you are by updating your account information! &nbsp; ฅ^•ﻌ•^ฅ
          </p>
          <div class="mt-8 flex flex-col gap-y-2">
            <h2 class="mb-2 text-xl font-semibold text-[#0f0f0f]">Profile</h2>
            <div class="grid grid-cols-2 gap-x-2">
              <div class="flex flex-col gap-y-1 border border-surface0 rounded-lg bg-base p-3 transition hover:border-lavender">
                <p class="text-xs font-light text-subtext1">
                  First name
                </p>
                <input
                  type="text"
                  value={first_name()}
                  onInput={(evt) => setFirstName(evt.currentTarget.value)}
                  placeholder="What's your first name?"
                  class="bg-base text-text outline-none"
                />
              </div>
              <div class="flex flex-col gap-y-1 border border-surface0 rounded-lg bg-base p-3 transition hover:border-lavender">
                <p class="text-xs font-light text-subtext1">
                  Last name
                </p>
                <input
                  type="text"
                  value={last_name()}
                  onInput={(evt) => setLastName(evt.currentTarget.value)}
                  placeholder="What's your last name?"
                  class="bg-base text-text outline-none"
                />
              </div>
            </div>
            <div class="flex flex-col gap-y-1 border border-surface0 rounded-lg bg-base p-3 transition hover:border-lavender">
              <p class="text-xs font-light text-subtext1">
                Username
              </p>
              <input
                type="text"
                value={username()}
                onInput={(evt) => setUsername(evt.currentTarget.value)}
                placeholder="What do you want to be referred as?"
                class="bg-base text-text outline-none"
              />
            </div>
            <div class="mt-2 flex flex-row justify-end gap-4">
              <button
                type="button"
                class="rounded-md bg-lavender px-4 py-2 text-base"
                onClick={submitProfileInformation}
              >
                Save Changes
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-5">
            <div class="mt-8 flex flex-col gap-y-4">
              <h2 class="text-xl font-semibold text-[#0f0f0f]">User Details</h2>
              <div class="flex flex-col gap-y-1">
                <p class="text-xs font-light text-subtext1">
                  Email
                </p>
                <span class="text-text">{auth.session!.user.email}</span>
              </div>
              <div class="flex flex-col gap-y-1">
                <p class="text-xs font-light text-subtext1">
                  User ID
                </p>
                <span class="text-text">{auth.profile?.user_id}</span>
              </div>
            </div>
            <div class="mt-8 flex flex-col gap-y-2">
              <h2 class="text-xl font-semibold text-[#0f0f0f]">Account Token</h2>
              <p class="mb-2 text-maroon">This is your account token. This token provides FULL ACCESS to your account to any application - DO NOT give this token away to strangers.</p>
              <div class="flex flex-col gap-y-1 border border-surface0 rounded-lg bg-base p-3 transition hover:border-lavender">
                <p class="text-xs font-light text-subtext1">
                  Your account's token is:
                </p>

                <span class="text-text">{auth.profile?.api_token}</span>
              </div>
              <div class="mt-2 flex flex-row justify-end gap-4">
                <button class="rounded-md bg-lavender px-4 py-2 text-base" onClick={() => toast.error("Not implemented yet. If your token has been compromised, please contact us at support@cattolabs.com")}>Regenerate</button>
                <button class="rounded-md bg-lavender px-4 py-2 text-base">Copy</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Show>
  );
}