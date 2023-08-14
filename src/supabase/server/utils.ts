import type { WorkspaceMeta, UserProfile } from "@/types/api";
import type { SupabaseClient } from "@supabase/supabase-js";

export const getUserProfile = async (supabase: SupabaseClient, token: string) => {
  const { data: user_profile } = await supabase.from("profiles")
    .select()
    .eq("api_token", token)
    .limit(1)
    .single();

  return user_profile as UserProfile;
};

export const getPermissionForWorkspace = (workspace_data: WorkspaceMeta | undefined | null, user_profile: UserProfile | undefined) => {
  if (!workspace_data || !user_profile) return false;
  const isCreator = workspace_data.creator === user_profile.user_id;
  const isSharedWith = workspace_data.shared_with.includes(user_profile.user_id);
  if (!isCreator && !isSharedWith) return false;
  return true;
};
