export interface UserProfile {
  id: string
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  api_token: string;
  root_workspace_id: string;
}

export interface UploadedFile {
  id: string;
  created_at: string;
  creator: string | null;
  private: boolean;
  shared_with: Array<string>;
  name: string;
  workspace_id: string | null;
}

export interface Workspace {
  id: string;
  created_at: string;
  parent_workspace_id: string | null;
  shared_with: Array<string>;
  name: string;
  creator: string;
}

export type WorkspaceContent = (
  | { type: "file", data: UploadedFile }
  | { type: "workspace", data: Workspace }
);
