import { type APIEvent, json, redirect } from "solid-start"
import { supabase, getUserProfile } from "@/supabase/server";
import type { UserProfile } from "@/types/api";

export const GET = async ({ request }: APIEvent): Promise<Response> => {
  let api_token = request.headers.get("authorization");

  let user_profile: UserProfile | undefined;
  if (api_token) (user_profile = await getUserProfile(api_token));
  
  if (!user_profile) return json({
    success: false,
    message: "API key should be wrong."
  }, { status: 403 });

  const workspace_id = new URL(request.url).searchParams.get("workspace_id");
  const { data: workspace_data } = await supabase
    .from("workspaces")
    .select()
    .eq("id", workspace_id)
    .limit(1)
    .single();
  
  if (!workspace_data || workspace_data.creator !== user_profile.user_id) return json({
    success: false,
    message: "Not allowed to get that workspace."
  }, { status: 403 });

  const { data } = await supabase
    .from("uploads")
    .select()
    .eq("workspace_id", workspace_data.id);

  return json({
    success: true,
    data
  });
}

export const PUT = () => {
  const url = new URL(`/functions/v1/upload-file`, import.meta.env.VITE_SUPABASE_PROJECT_URL as string)
  return redirect(url.href, 308);
};
