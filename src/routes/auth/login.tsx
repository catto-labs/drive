import { type Component, type JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Title, useNavigate, A } from "solid-start";

import { getProfileWithSession, supabase } from "@/supabase/client";
import { setAuth } from "@/stores/auth";

import Header from "@/components/landing/Header";

import SpinnerRingResize from "~icons/svg-spinners/ring-resize";
import IconExclamation from "~icons/mdi/exclamation";
import IconDiscord from "~icons/fa6-brands/discord";
import IconGoogle from "~icons/fa6-brands/google";
import IconGithub from "~icons/fa6-brands/github";
import { Provider } from "@supabase/supabase-js";

const Page: Component = () => {
  const navigate = useNavigate();

  const [state, setState] = createStore<{
    email: string;
    password: string;
    /** `null` when no errors, else contains error's message string. */
    error: null | string;
    loading: boolean;
  }>({
    email: "",
    password: "",

    error: null,
    loading: false,
  });

  const credentialsLoginHandler: JSX.EventHandler<
    HTMLFormElement,
    SubmitEvent
  > = async (event): Promise<void> => {
    event.preventDefault();
    if (state.loading) return;
    setState({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: state.email,
        password: state.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const user_profile = await getProfileWithSession(data.session);

      setAuth({ session: data.session, profile: user_profile });
      navigate("/dashboard");
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
    <>
      <Title>Login - Drive</Title>
      <main class="relative h-screen w-screen text-sm">
        <Header />
        <div class="absolute bottom-0 left-0 right-0 top-0 m-auto h-fit w-96 border border-surface0 rounded-lg bg-base p-4 text-text shadow-xl">
          <div class="w-full flex gap-x-3">
            <div class="w-full flex flex-col gap-y-4">
              <h1 class="text-xl font-semibold">Welcome back!</h1>
              <form
                onSubmit={credentialsLoginHandler}
                class="w-full flex flex-col gap-y-2"
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
                  class="w-full border border-surface1 rounded-xl bg-surface0 px-4 py-2 text-text outline-none focus-border-surface2 placeholder-text-subtext1"
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

                <Show when={state.error}>
                  <div class="inline-flex gap-x-2">
                    <div class="my-auto h-fit w-fit rounded-full bg-maroon">
                      <IconExclamation class="text-mantle" />
                    </div>
                    {state.error === "Invalid login credentials" ? (
                      <p class="my-auto text-text">
                        Meow! Your credentials are invalid.
                      </p>
                    ) : (
                      <p>There was an error: {state.error}</p>
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
                  Alternatively, you can login with...
                </p>

                <div class="grid grid-cols-3 gap-x-4">
                  <button onClick={async (e: Event) => await signInWithOAuthProvider(e, "discord")} class="group flex justify-center border-2 border-[#5865F2] rounded-lg px-4 py-2 transition hover:bg-[#5865F2]">
                    <IconDiscord class="text-lg text-text group-hover:text-base" />
                  </button>
                  <button onClick={async (e: Event) => await signInWithOAuthProvider(e, "google")} class="group flex justify-center border-2 border-[#4285F4] rounded-lg px-4 py-2 transition hover:bg-[#4285F4]">
                    <IconGoogle class="text-lg text-text group-hover:text-base" />
                  </button>
                  <button onClick={async (e: Event) => await signInWithOAuthProvider(e, "github")} class="group flex justify-center border-2 border-[#333] rounded-lg px-4 py-2 transition hover:bg-[#333]">
                    <IconGithub class="text-lg text-text group-hover:text-base" />
                  </button>
                </div>
              </form>

              <A
                href="/auth/register"
                class="text-center underline decoration-dotted hover:decoration-solid"
              >
                Don't have an account? Create one!
              </A>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
