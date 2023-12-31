import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import type { UploadedFile, UserProfile, WorkspaceMeta } from "../../../src/types/api.ts";
import { supabase, getUserProfile, getPermissionForWorkspace } from "../_shared/supabase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = <T>(data: T, options?: { status: number }) => new Response(
  JSON.stringify(data),
  { headers: { "Content-Type": "application/json", ...corsHeaders }, status: options?.status ?? 200 }
);

/**
 * PUT / - Body should be FormData.
 * 
 * `api_token?: string` to authenticate the user.
 * `files: File[]` contains all the files to upload.
 * `workspace_id: string` is the workspace where we should upload the files.
 * `private?: "0" | "1"` is the accessibility of the file, where `0` means `public` and `1` means private.
 */
serve(async (req: Request) => {
  if (req.method === "PUT") {
    const formData = await req.formData();
    const formDataFiles = formData.getAll("files") as File[];
    const formDataApiToken = formData.get("api_token") as string | undefined;
    
    let user_profile: UserProfile | undefined;
    if (formDataApiToken) (user_profile = await getUserProfile(formDataApiToken));
  
    const workspace_id = (formData.get("workspace_id") as string | undefined) ?? user_profile?.root_workspace_id ?? undefined;
    if (workspace_id) {
      const { data: workspace_data } = await supabase
        .from("workspaces")
        .select()
        .eq("id", workspace_id)
        .limit(1)
        .single<WorkspaceMeta>();

      if (!getPermissionForWorkspace(workspace_data, user_profile)) return json({
        success: false,
        message: "Not allowed to upload in this directory."
      }, { status: 403 });
    }

    const isPrivate = parseInt((formData.get("private") as string | null) ?? "1");
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
          workspace_id: user_profile ? workspace_id : null,
          name: file.name
        })
        .select();
      
      const upload = (data as [UploadedFile])[0];
      newUploadsInDatabase.push(upload);
  
      await supabase.storage
        .from("uploads")
        .upload(`${user_profile?.user_id ?? "anon"}/${upload.id}.${file_extension}`, file, {
          cacheControl: "3600",
          upsert: true
        });
    }
  
    return json({
      success: true,
      data: { uploaded: newUploadsInDatabase }
    });
  }
  
  else if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  return json({
    success: false,
    message: "Unknown method."
  }, { status: 404 });
});
