import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: { persistSession: false },
  }
);

import { getUserProfile as _getUserProfile } from "./utils";
export const getUserProfile = (token: string) => _getUserProfile(supabase, token);

export { getPermissionForWorkspace } from "./utils";
