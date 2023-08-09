import { type Component, type JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Title, A } from "solid-start";

import { supabase } from "@/supabase/client";

import Header from "@/components/landing/Header";

import SpinnerRingResize from "~icons/svg-spinners/ring-resize";
import IconExclamation from "~icons/mdi/exclamation";
import IconDiscord from "~icons/fa6-brands/discord";
import IconGoogle from "~icons/fa6-brands/google";
import IconGithub from "~icons/fa6-brands/github";

const Page: Component = () => {
  const [state, setState] = createStore<{
    email: string;
    password: string;
    confirm_password: string;
    /** `null` when no errors, else contains error's message string. */
    error: null | string;
    loading: boolean;
    /** Should show a prompt asking for user to check their emails, for confirm email. */
    check_email: boolean;
  }>({
    email: "",
    password: "",
    confirm_password: "",

    error: null,
    loading: false,
    check_email: false,
  });

  const credentialsRegisterHandler: JSX.EventHandler<
    HTMLFormElement,
    SubmitEvent
  > = async (event): Promise<void> => {
    event.preventDefault();
    if (state.loading) return;
    setState({ loading: true, error: null });

    try {
      if (state.password !== state.confirm_password) {
        throw new Error("passwords not matching.");
      }

      const { data, error } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,

        options: {
          // After confirming their emails, users may want to see their dashboard directly.
          emailRedirectTo: new URL("/dashboard", window.location.origin).href,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      setState("check_email", true);
    } catch (err) {
      const error = err as Error;
      setState("error", error.message);
    } finally {
      setState("loading", false);
    }
  };

  return (
    <Show
      when={!state.check_email}
      fallback={
        <>
          <Title>Check your email - Register - Drive</Title>
          <main class="h-screen w-screen relative text-sm">
            <Header />
            <div class="bg-text border border-subtext0 rounded-lg shadow-xl w-fit h-fit p-4 m-auto absolute left-0 right-0 top-0 bottom-0">
              <div class="flex gap-x-3">
                <div class="flex flex-col gap-y-4 bg-text">
                  <h1 class="text-xl font-semibold text-crust">
                    Please verify your account.
                  </h1>
                  <div class="flex flex-col gap-y-1">
                    <p>Our cattos have sent you a verification e-mail.</p>
                    <p>If it isn't there, please check your spam folder.</p>
                  </div>

                  <A
                    href="/auth/login"
                    class="text-base underline decoration-dotted hover:decoration-solid mx-12"
                  >
                    All done? Let's log in!
                  </A>
                </div>
              </div>
            </div>
          </main>
        </>
      }
    >
      <Title>Register - Drive</Title>
      <main class="h-screen w-screen relative text-sm">
        <Header />
        <div class="bg-text border border-subtext0 rounded-lg shadow-xl w-fit h-fit p-4 m-auto absolute left-0 right-0 top-0 bottom-0">
          <div class="flex gap-x-3">
            <div class="flex flex-col gap-y-4 bg-text">
              <h1 class="text-xl font-semibold text-crust">
                We're glad to see you.
              </h1>
              <form
                onSubmit={credentialsRegisterHandler}
                class="flex flex-col bg-text gap-y-2"
              >
                <input
                  type="email"
                  disabled={state.loading}
                  value={state.email}
                  onInput={(event) =>
                    setState("email", event.currentTarget.value)
                  }
                  placeholder="What's your e-mail?"
                  name="email"
                  autofocus
                  class="py-2 px-4 rounded-xl bg-subtext1 border border-subtext0 focus-border-subtext1 text-base placeholder-text-surface0"
                />

                <input
                  type="password"
                  disabled={state.loading}
                  value={state.password}
                  onInput={(event) =>
                    setState("password", event.currentTarget.value)
                  }
                  placeholder="What about your password?"
                  name="password"
                  class="py-2 px-4 rounded-xl bg-subtext1 border border-subtext0 focus-border-subtext1 text-base placeholder-text-surface0"
                />

                <input
                  type="password"
                  disabled={state.loading}
                  value={state.confirm_password}
                  onInput={(event) =>
                    setState("confirm_password", event.currentTarget.value)
                  }
                  placeholder="Confirm your password again."
                  name="confirm_password"
                  class="py-2 px-4 rounded-xl bg-subtext1 border border-subtext0 focus-border-subtext1 text-base placeholder-text-surface0"
                />

                <Show when={state.error}>
                  <div class="inline-flex gap-x-2">
                    <div class="bg-maroon h-fit rounded-full w-fit my-auto">
                      <IconExclamation class="text-mantle" />
                    </div>
                    {state.error === "Signup requires a valid password" ? (
                      <p class="my-auto text-base">
                        Meow! You need to enter a password!
                      </p>
                    ) : state.error === "passwords not matching." ? (
                      <p class="my-auto text-base">
                        Your passwords aren't matching!
                      </p>
                    ) : (
                      <p>{state.error}</p>
                    )}
                  </div>
                </Show>

                <div class="rounded-xl bg-subtext0 hover:bg-subtext1 duration-150 border border-subtext0 transform text-base placeholder-text-overlay0">
                  <button
                    type="submit"
                    disabled={state.loading}
                    class="px-4 h-9 text-center w-full"
                  >
                    {state.loading ? (
                      <div class="inline-flex gap-x-2 mt-1">
                        <SpinnerRingResize class="my-auto" />
                        <p class="my-auto">Loading...</p>
                      </div>
                    ) : (
                      <p>Let me in!</p>
                    )}
                  </button>
                </div>

                <div class="border border-overlay2 mt-4 mb-3"></div>

                <p class="text-center text-base">
                  Alternatively, you can register with...
                </p>

                <div class="grid grid-cols-3 gap-x-4">
                  <button class="px-4 py-2 border-2 rounded-lg border-[#5865F2] group hover:bg-[#5865F2] transition flex justify-center">
                    <IconDiscord class="group-hover:text-text text-lg text-base" />
                  </button>
                  <button class="px-4 py-2 border-2 rounded-lg border-[#4285F4] group hover:bg-[#4285F4] transition flex justify-center">
                    <IconGoogle class="group-hover:text-text text-lg text-base" />
                  </button>
                  <button class="px-4 py-2 border-2 rounded-lg border-[#333] group hover:bg-[#333] transition flex justify-center">
                    <IconGithub class="group-hover:text-text text-lg text-base" />
                  </button>
                </div>
              </form>

              <A
                href="/auth/login"
                class="text-base underline decoration-dotted hover:decoration-solid mx-12"
              >
                Have an account? Log in instead.
              </A>
            </div>
          </div>
        </div>
      </main>
    </Show>
  );
};

export default Page;
