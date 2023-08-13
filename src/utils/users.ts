import { auth } from "@/stores/auth";
import { UploadedFile, UserProfile, Workspace } from "@/types/api";

export const getUserFrom = async (uid: string) => {
  const response = await fetch(`/api/user/${uid}`, {
    method: "GET",
    headers: { authorization: auth.profile!.api_token }
  });

  const json = await response.json();
  return json.data as (Exclude<UserProfile, "api_token" | "root_workspace_id"> | undefined);
};

export const saveUploadSharingPreferences = async (type: "workspace" | "file", content_id: string, is_public: boolean = false, shared_uids: string[] = []) => {
  const response = await fetch(`/api/share/${content_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      type,
      is_public,
      shared_uids
    }),
    headers: {
      authorization: auth.profile!.api_token,
      "Content-Type": "application/json"
    }
  });

  const json = await response.json() as { success: boolean, data: Workspace | UploadedFile | undefined };
  return json.data;
};
