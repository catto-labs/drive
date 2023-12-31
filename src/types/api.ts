export interface UserProfile {
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

export interface WorkspaceMeta {
  id: string;
  created_at: string;
  parent_workspace_id: string | null;
  shared_with: Array<string>;
  name: string;
  creator: string;
}

export interface Workspace {
  meta: WorkspaceMeta
  content: WorkspaceContent[]
}

export type WorkspaceContent = (
  | { type: "file", data: UploadedFile }
  | { type: "workspace", data: WorkspaceMeta }
);

export interface SharedData {
  shared_files: UploadedFile[]
  shared_workspaces: WorkspaceMeta[]
}
