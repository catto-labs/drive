import { type UserProfile } from "../../../src/types/api.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

export const supabase = createClient(
  Deno.env.get('SUPABASE_URL') as string,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string,
  {
    auth: { persistSession: false },
  }
);

export const getUserProfile = async (token: string) => {
  const { data: user_profile } = await supabase.from("profiles")
    .select()
    .eq("api_token", token)
    .limit(1)
    .single();

  return user_profile as UserProfile;
};
