import { type APIEvent, json } from "solid-start";
 
import type { UploadedFile, UserProfile } from "@/types/api";
import { supabase, getUserProfile } from "@/supabase/server";
import { file_extension } from "@/utils/files";

export const GET = async ({ request, params }: APIEvent): Promise<Response> => {
  try {
    let { upload_id } = params;
    let token = request.headers.get("authorization");
    
    const { data: file_data } = await supabase
      .from("uploads")
      .select()
      .eq("id", upload_id)
      .limit(1)
      .single<UploadedFile>();
    
    // Respond only a 404.
    if (!file_data) return json({
      success: false,
      message: "Couldn't find any upload with the given ID."
    }, { status: 404 });

    if (file_data.private && !token) return json({
      success: false,
      message: "You need to give an API token to access this file."
    }, { status: 401 });
  
    let user_profile: UserProfile | undefined;
    if (token) (user_profile = await getUserProfile(token));
  
    // When a file is private, we know
    // that `workspace_id` and `creator` will not be `null`.
    // Because only public files can have those!
    if (file_data.private) {
      if (!user_profile) return json({
        success: false,
        message: "You need to give a valid API token to access this file."
      }, { status: 401 });

      const { data: workspace_data } = await supabase
        .from("workspaces")
        .select()
        .eq("id", file_data.workspace_id)
        .limit(1)
        .single();

      let isCreatorOfFile = file_data.creator === user_profile.user_id;
      let isCreatorOfWorkspace = workspace_data.creator === user_profile.user_id;

      // Check if we're the owner of the file.
      if (!isCreatorOfFile && !isCreatorOfWorkspace) return json({
        success: false,
        message: "You're not allowed to access this file."
      }, { status: 403 });
    }
  
    const file_extension = file_data.name.substring(file_data.name.lastIndexOf(".") + 1);

    // Create a download URL, only available for 15s.
    const { data } = await supabase.storage
      .from("uploads")
      .createSignedUrl(`${file_data.creator ?? "anon"}/${file_data.id}.${file_extension}`, 3600);
  
    const headers = new Headers();
    headers.set("access-control-allow-origin", "*");
    headers.set("location", data!.signedUrl);

    const response = new Response(null, {
      status: 307,
      headers
    });

    return response;
  }
  catch (error) {
    console.error(error);
    return json({
      success: false,
      message: "An error server-side happened."
    }, { status: 500 });
  }
};

export const DELETE = async ({ request, params }: APIEvent): Promise<Response> => {
  let { upload_id } = params;
  
  let token = request.headers.get("authorization");
  if (!token) return json({
    success: false,
    message: "You need to provide an API token."
  }, { status: 401 });

  const { data: file_data } = await supabase
    .from("uploads")
    .select()
    .eq("id", upload_id)
    .limit(1)
    .single<UploadedFile>();
  
  // Respond only a 404.
  if (!file_data) return json({
    success: false,
    message: "Couldn't find any upload with the given ID."
  }, { status: 404 });

  const user_profile = await getUserProfile(token)
  let isCreatorOfFile = file_data.creator === user_profile.user_id;

  // Check if we're the owner of the file.
  if (!isCreatorOfFile) return json({
    success: false,
    message: "You're not allowed to delete this file."
  }, { status: 403 });

  const extension = file_extension(file_data.name);

  await supabase
    .from("uploads")
    .delete()
    .eq("id", upload_id);
  
  await supabase.storage
    .from("uploads")
    .remove([`${file_data.creator}/${file_data.id}.${extension}`]);

  return json({ success: true, data: null });
};
