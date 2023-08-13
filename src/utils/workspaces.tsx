import { auth } from "@/stores/auth";
import type { Workspace, WorkspaceContent } from "@/types/api";

export const getContentOfWorkspace = async (workspace_id: string) => {
  const response = await fetch(
    `/api/workspace?workspace_id=${workspace_id}`,
    {
      method: "GET",
      headers: { authorization: auth.profile!.api_token },
    }
  );

  const json = await response.json();
  // Sort workspace contents so workspaces/folders come first
  const sortedWorkspaceContents = json.data.sort((a: WorkspaceContent, b: WorkspaceContent) => {
    if (a.type === "workspace" && b.type !== "workspace") {
      return -1;
    } else if (a.type !== "workspace" && b.type === "workspace") {
      return 1;
    } else {
      return 0;
    }
  });
  return sortedWorkspaceContents as WorkspaceContent[];
};

export const createWorkspace = async (parent_workspace_id: string) => {
  const response = await fetch(
    `/api/workspace/create?parent_workspace_id=${parent_workspace_id}`,
    {
      method: "POST",
      headers: { authorization: auth.profile!.api_token }
    }
  );

  const json = await response.json();
  return json.data as Workspace;
};
