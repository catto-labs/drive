import { type Component, type JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Title, A } from "solid-start";

import { supabase } from "@/supabase/client";

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
    check_email: false
  });

  const credentialsRegisterHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (event): Promise<void> => {
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
          emailRedirectTo: new URL("/dashboard", window.location.origin).href
        }
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
  }

  return (
    <Show when={!state.check_email}
      fallback={
        <>
          <Title>Check your email - Register - Drive</Title>
          <main>
            <h1>check your email now!</h1>
            <p>we sent you a confirm email, please check and confirm !</p>
          </main>
        </>
      }
    >
      <Title>Register - Drive</Title>
      <main>
        <h1>register, catto.</h1>

        <form onSubmit={credentialsRegisterHandler}>
          <Show when={state.error}>
            <p>error thrown: {state.error}</p>
          </Show>
          <input type="email" disabled={state.loading}
            value={state.email}
            onInput={(event) => setState("email", event.currentTarget.value)}
            placeholder="email"
            name="email"
            autofocus
          />
          <input type="password" disabled={state.loading}
            value={state.password}
            onInput={(event) => setState("password", event.currentTarget.value)}
            placeholder="cut3_PA$$w0rd"
            name="password"
          />
          <input type="password" disabled={state.loading}
            value={state.confirm_password}
            onInput={(event) => setState("confirm_password", event.currentTarget.value)}
            placeholder="cut3_PA$$w0rd"
            name="confirm-password"
          />

          <button type="submit"
            disabled={state.loading}
          >
            {state.loading ? "loading..." : "enter catto drive!"}
          </button>

          <A href="/auth/login">
            have already an account?
          </A>
        </form>
      </main>
    </Show>
  );
};

export default Page;
