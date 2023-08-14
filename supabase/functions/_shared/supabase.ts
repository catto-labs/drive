import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string,
  {
    auth: { persistSession: false }
  }
);

import { getUserProfile as _getUserProfile } from "../../../src/supabase/server/utils.ts";
export const getUserProfile = (token: string) => _getUserProfile(supabase, token);

export { getPermissionForWorkspace } from "../../../src/supabase/server/utils.ts";