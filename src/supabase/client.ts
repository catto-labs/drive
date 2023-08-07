import { createClient } from "@supabase/supabase-js";

// Create a single Supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);
