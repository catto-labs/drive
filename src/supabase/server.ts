import { type UserProfile } from "@/types/api";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
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
