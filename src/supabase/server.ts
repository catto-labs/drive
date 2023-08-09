import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: { persistSession: false },
  }
);

// Create a single Supabase client for interacting with your database
export const retrieveSupabaseClient = (token: string) => createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  {
    auth: { persistSession: false },
    global: {
      headers: { "Authorization": token }
    }
  }
);

export const getUser = async (token: string) => {
  const client = retrieveSupabaseClient(token);
  const { data: { user } } = await client.auth.getUser();
  return user;
};
