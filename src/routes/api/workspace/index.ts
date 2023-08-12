import { type APIEvent, json } from "solid-start"
import { supabase, getUserProfile } from "@/supabase/server";
import type { UploadedFile, UserProfile, Workspace, WorkspaceContent } from "@/types/api";

export const GET = async ({ request }: APIEvent): Promise<Response> => {
  let api_token = request.headers.get("authorization");

  let user_profile: UserProfile | undefined;
  if (api_token) (user_profile = await getUserProfile(api_token));
  
  if (!user_profile) return json({
    success: false,
    message: "API key should be wrong."
  }, { status: 401 });

  const workspace_id = new URL(request.url).searchParams.get("workspace_id");
  const { data: workspace_data } = await supabase
    .from("workspaces")
    .select()
    .eq("id", workspace_id)
    .limit(1)
    .single<Workspace>();
  
  if (!workspace_data || workspace_data.creator !== user_profile.user_id) return json({
    success: false,
    message: "Not allowed to get that workspace."
  }, { status: 403 });

  const content: WorkspaceContent[] = [];

  // Get files.
  const { data: _files } = await supabase
    .from("uploads")
    .select()
    .eq("workspace_id", workspace_data.id);
  
  (_files as UploadedFile[]).forEach(file => content.push({
    type: "file",
    data: file
  }));

  // Get workspaces.
  const { data: _workspaces } = await supabase
    .from("workspaces")
    .select()
    .eq("parent_workspace_id", workspace_data.id);

  (_workspaces as Workspace[]).forEach(workspace => content.push({
    type: "workspace",
    data: {
      ...workspace,
      name: "./" + (workspace.name || `untitled-${workspace.id}`)
    }
  }));

  // If it's not the root folder, then show a back workspace.
  if (workspace_data.parent_workspace_id) {
    const { data: parent_workspace_data } = await supabase
      .from("workspaces")
      .select()
      .eq("id", workspace_data.parent_workspace_id)
      .limit(1)
      .single<Workspace>();

    content.push({
      type: "workspace",
      data:  {
        ...parent_workspace_data!,
        name: "../"
      }
    })
  }

  return json({
    success: true,
    data: content
  });
}