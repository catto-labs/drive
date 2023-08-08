import { supabase } from "@/supabase/client";
import { type Component } from "solid-js";
import { Title, useNavigate } from "solid-start";
import { setAuth } from "@/stores/auth";

const Page: Component = () => {
  const navigate = useNavigate();

  return (
    <>
      <Title>Dashboard - Drive</Title>
      
      <main>
        <h1>dashboard.</h1>
        <p>our cattos are welcoming you.</p>

        <button type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            setAuth({ loading: false, session: null });
            navigate("/");
          }}
        >
          log out
        </button>
      </main>
    </>
  );
};

export default Page;
