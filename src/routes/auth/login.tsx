import { type Component, type JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Title, useNavigate, A } from "solid-start";

import { supabase } from "@/supabase/client";
import { setAuth } from "@/stores/auth";

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

  const credentialsLoginHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (event): Promise<void> => {
    event.preventDefault();
    if (state.loading) return;
    setState({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: state.email,
        password: state.password
      });

      if (error) {
        throw new Error(error.message);
      }

      setAuth("session", data.session);
      navigate("/dashboard");
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
    <>
      <Title>Login - Drive</Title>
      <main>
        <h1>login, catto.</h1>

        <form onSubmit={credentialsLoginHandler}>
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

          <button type="submit"
            disabled={state.loading}
          >
            {state.loading ? "loading..." : "enter catto drive!"}
          </button>

          <A href="/auth/register">
            don't have an account? create one, meow!
          </A>
        </form>
      </main>
    </>
  );
};

export default Page;
