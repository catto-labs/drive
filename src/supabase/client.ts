import type { UserProfile } from "@/types/api";
import { Session, createClient } from "@supabase/supabase-js";

// Create a single Supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export const getProfileWithSession = async (session: Session) => {
  const { data: _profile } = await supabase.from("profiles")
    .select()
    .eq("user_id", session.user.id)
    .limit(1)
    .single();
      
  let user_profile = _profile as UserProfile;
  return user_profile;
}