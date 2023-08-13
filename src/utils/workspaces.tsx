import { auth } from "@/stores/auth";
import type { Workspace, WorkspaceMeta } from "@/types/api";

export const getWorkspace = async (workspace_id: string): Promise<Workspace> => {
  const response = await fetch(`/api/workspace?workspace_id=${workspace_id}`, {
      method: "GET",
      headers: { authorization: auth.profile!.api_token }
    }
  );

  const workspace = await response.json() as { data: Workspace };

  /** Sort workspace contents so workspaces/folders come first. */
  const sortedWorkspaceContents = workspace.data.content.sort((a, b) => {
    if (a.type === "workspace" && b.type !== "workspace") {
      return -1;
    } else if (a.type !== "workspace" && b.type === "workspace") {
      return 1;
    } else {
      return 0;
    }
  });
  
  return {
    meta: workspace.data.meta,
    content: sortedWorkspaceContents
  };
};

export const createWorkspace = async (parent_workspace_id: string, workspace_name: string) => {
  const response = await fetch(
    `/api/workspace/create?parent_workspace_id=${parent_workspace_id}&workspace_name=${workspace_name}`,
    {
      method: "POST",
      headers: { authorization: auth.profile!.api_token }
    }
  );

  const json = await response.json();
  return json.data as WorkspaceMeta;
};
