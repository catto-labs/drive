import { createClient } from "@supabase/supabase-js";

// Create a single Supabase client for interacting with your database
export const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);
