import { type APIEvent, json } from "solid-start"
import { supabase, getUserProfile } from "@/supabase/server";
import type { UploadedFile, UserProfile } from "@/types/api";

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

/**
 * Body should be FormData.
 * 
 * `files: File[]` contains all the files to upload.
 * `workspace_id: string` is the workspace where we should upload the files.
 * `private?: "0" | "1"` is the accessibility of the file, where `0` means `public` and `1` means private.
 */
export const PUT = async ({ request }: APIEvent): Promise<Response> => {
  let api_token = request.headers.get("authorization");

  let user_profile: UserProfile | undefined;
  if (api_token) (user_profile = await getUserProfile(api_token));

  const formData = await request.formData();
  const formDataFiles = formData.getAll("files") as File[];

  const workspaceId = formData.get("workspace_id") as string | undefined;
  if (user_profile && !workspaceId) return json({
    success: false,
    message: "Authenticated users should always specify a workspace ID."
  });

  const isPrivate = parseInt((formData.get("private") as string | null) ?? "1");

  // TODO: type this shit.
  const newUploadsInDatabase: UploadedFile[] = [];
  
  for (const file of formDataFiles) {
    const file_extension = file.name.substring(file.name.lastIndexOf(".") + 1);

    const { data } = await supabase
      .from("uploads")
      .insert({
        creator: user_profile ? user_profile.user_id : null,
        // Always public for anonymous uploads.
        private: user_profile ? Boolean(isPrivate) : false,
        shared_with: [],
        workspace_id: user_profile ? workspaceId : null,
        name: file.name
      })
      .select();
    
    const upload = (data as [UploadedFile])[0];
    newUploadsInDatabase.push(upload);
    
    await supabase.storage
      .from('uploads')
      .upload(`${user_profile?.user_id ?? "anon"}/${upload.id}.${file_extension}`, file, {
        cacheControl: '3600',
        upsert: true
      });
  }

  return json({
    success: true,
    data: { uploaded: newUploadsInDatabase }
  });
}
