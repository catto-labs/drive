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
import { Provider } from "@supabase/supabase-js";

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

      const { error } = await supabase.auth.signUp({
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
    }
    catch (err) {
      const error = err as Error;
      setState("error", error.message);
    }
    finally {
      setState("loading", false);
    }
  };

  const signInWithOAuthProvider = async (event: Event, provider: Provider) => {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) alert(error.message);
  };

  return (
    <Show
      when={!state.check_email}
      fallback={
        <>
          <Title>Check your email - Register - Drive</Title>
          <main class="relative h-screen w-screen text-sm">
            <Header />
            <div class="absolute bottom-0 left-0 right-0 top-0 m-auto h-fit w-96 border border-subtext0 rounded-lg bg-base p-4 text-text shadow-xl">
              <div class="w-full flex gap-x-3">
                <div class="w-full flex flex-col gap-y-4">
                  <h1 class="text-xl font-semibold">
                    Please verify your account.
                  </h1>
                  <div class="flex flex-col gap-y-1">
                    <p>Our cattos have sent you a verification e-mail.</p>
                    <p>If it isn't there, please check your spam folder.</p>
                  </div>

                  <A
                    href="/auth/login"
                    class="w-full text-center text-text underline decoration-dotted hover:decoration-solid"
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
      <main class="relative h-screen w-screen text-sm">
        <Header />
        <div class="absolute bottom-0 left-0 right-0 top-0 m-auto h-fit w-96 border border-surface0 rounded-lg bg-base p-4 text-text shadow-xl">
          <div class="w-full flex gap-x-3">
            <div class="w-full flex flex-col gap-y-4">
              <h1 class="text-xl font-semibold">We're glad to see you.</h1>
              <form
                onSubmit={credentialsRegisterHandler}
                class="flex flex-col gap-y-2"
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
                  class="border border-surface1 rounded-xl bg-surface0 px-4 py-2 text-text outline-none focus-border-surface2 placeholder-text-subtext1"
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
                  class="border border-surface1 rounded-xl bg-surface0 px-4 py-2 text-text outline-none focus-border-surface2 placeholder-text-subtext1"
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
                  class="border border-surface1 rounded-xl bg-surface0 px-4 py-2 text-text outline-none focus-border-surface2 placeholder-text-subtext1"
                />

                <Show when={state.error}>
                  <div class="inline-flex gap-x-2">
                    <div class="my-auto h-fit w-fit rounded-full bg-maroon">
                      <IconExclamation class="text-mantle" />
                    </div>
                    {state.error === "Signup requires a valid password" ? (
                      <p class="my-auto text-text">
                        Meow! You need to enter a password!
                      </p>
                    ) : state.error === "passwords not matching." ? (
                      <p class="my-auto text-text">
                        Your passwords aren't matching!
                      </p>
                    ) : (
                      <p>{state.error}</p>
                    )}
                  </div>
                </Show>

                <div class="transform rounded-xl bg-lavender text-base duration-150 hover:bg-[#596dde] placeholder-text-overlay0">
                  <button
                    type="submit"
                    disabled={state.loading}
                    class="h-9 w-full px-4 text-center"
                  >
                    {state.loading ? (
                      <div class="mt-1 inline-flex gap-x-2">
                        <SpinnerRingResize class="my-auto" />
                        <p class="my-auto">Loading...</p>
                      </div>
                    ) : (
                      <p>Let me in!</p>
                    )}
                  </button>
                </div>

                <div class="mb-3 mt-4 border border-surface1" />

                <p class="text-center text-subtext0">
                  Alternatively, you can register with...
                </p>

                <div class="grid grid-cols-3 gap-x-4">
                  <button
                    onClick={async (e: Event) =>
                      await signInWithOAuthProvider(e, "discord")
                    }
                    class="group flex justify-center border-2 border-[#5865F2] rounded-lg px-4 py-2 transition hover:bg-[#5865F2]"
                  >
                    <IconDiscord class="text-lg text-text group-hover:text-base" />
                  </button>
                  <button
                    onClick={async (e: Event) =>
                      await signInWithOAuthProvider(e, "google")
                    }
                    class="group flex justify-center border-2 border-[#4285F4] rounded-lg px-4 py-2 transition hover:bg-[#4285F4]"
                  >
                    <IconGoogle class="text-lg text-text group-hover:text-base" />
                  </button>
                  <button
                    onClick={async (e: Event) =>
                      await signInWithOAuthProvider(e, "github")
                    }
                    class="group flex justify-center border-2 border-[#333] rounded-lg px-4 py-2 transition hover:bg-[#333]"
                  >
                    <IconGithub class="text-lg text-text group-hover:text-base" />
                  </button>
                </div>
              </form>

              <A
                href="/auth/login"
                class="text-center underline decoration-dotted hover:decoration-solid"
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
