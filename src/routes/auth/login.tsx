import { type Component, type JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Title, useNavigate, A } from "solid-start";

import { supabase } from "@/supabase/client";
import { setAuth } from "@/stores/auth";

import Header from "@/components/landing/Header";

import SpinnerRingResize from "~icons/svg-spinners/ring-resize";
import IconExclamation from "~icons/mdi/exclamation";
import IconDiscord from "~icons/fa6-brands/discord";
import IconGoogle from "~icons/fa6-brands/google";
import IconGithub from "~icons/fa6-brands/github";

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

      setAuth("session", data.session);
      navigate("/dashboard");
    } catch (err) {
      const error = err as Error;
      setState("error", error.message);
    } finally {
      setState("loading", false);
    }
  };

  return (
    <>
      <Title>Login - Drive</Title>
      <main class="h-screen w-screen relative text-sm">
        <Header />
        <div class="bg-text border w-96 border-subtext0 rounded-lg shadow-xl h-fit p-4 m-auto absolute left-0 right-0 top-0 bottom-0">
          <div class="flex gap-x-3 w-full">
            <div class="flex flex-col gap-y-4 bg-text w-full">
              <h1 class="text-xl font-semibold text-crust">Welcome back!</h1>
              <form
                onSubmit={credentialsLoginHandler}
                class="flex flex-col bg-text gap-y-2 w-full"
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
                  class="py-2 px-4 rounded-xl w-full bg-subtext1 border border-subtext0 focus-border-subtext1 text-base placeholder-text-surface0"
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

                <Show when={state.error}>
                  <div class="inline-flex gap-x-2">
                    <div class="bg-maroon h-fit rounded-full w-fit my-auto">
                      <IconExclamation class="text-mantle" />
                    </div>
                    {state.error === "Invalid login credentials" ? (
                      <p class="my-auto text-base">
                        Meow! Your credentials are invalid.
                      </p>
                    ) : (
                      <p>There was an error: {state.error}</p>
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
                  Alternatively, you can login with...
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
                href="/auth/register"
                class="text-base underline decoration-dotted hover:decoration-solid mx-12"
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