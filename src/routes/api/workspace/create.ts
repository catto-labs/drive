
import { type APIEvent, json } from "solid-start";
import { supabase, getUserProfile } from "@/supabase/server";
import type { WorkspaceMeta } from "@/types/api";

/**
 * POST /api/workspace/create
 * Needs `authorization` header.
 */
export const POST = async ({ request }: APIEvent) => {
  const api_token = request.headers.get("authorization");
  if (!api_token) return json({
    success: false,
    message: "You need to provide an API token."
  }, { status: 401 });
  
  const parent_workspace_id = new URL(request.url).searchParams.get("parent_workspace_id");
  if (!parent_workspace_id) return json({
    success: false,
    message: "You need to provide the parent workspace ID."
  }, { status: 400 });

  let workspace_name = new URL(request.url).searchParams.get("workspace_name");
  if (!workspace_name) workspace_name = "New Folder";

  const user_profile = await getUserProfile(api_token);
  if (!user_profile) return json({
    success: false,
    message: "API key should be wrong."
  }, { status: 403 });

  const { data: workspace_data } = await supabase
    .from("workspaces")
    .select()
    .eq("id", parent_workspace_id)
    .limit(1)
    .single();

  const isCreatorOfWorkspace = workspace_data.creator === user_profile.user_id;

  // Check if we're the owner of the file.
  if (!isCreatorOfWorkspace) return json({
    success: false,
    message: "You're not allowed to access this file."
  }, { status: 403 });

  const { data: created_workspace } = await supabase
    .from("workspaces")
    .insert([{
      name: workspace_name,
      parent_workspace_id,
      creator: user_profile.user_id
    }])
    .select();

  return json({
    success: true,
    data: created_workspace![0] as WorkspaceMeta
  });
};
