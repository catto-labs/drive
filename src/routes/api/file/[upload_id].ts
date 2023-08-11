import { type APIEvent, json } from "solid-start";
import { contentType as mime_type } from "mime-types";
 
import { supabase, getUserProfile } from "@/supabase/server";
import { UploadedFile, UserProfile } from "@/types/api";

export const GET = async ({ request, params }: APIEvent): Promise<Response> => {
  try {
    const { upload_id } = params;
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
    const file_content_type = mime_type(file_extension);

    // Create a download URL, only available for 15s.
    const { data } = await supabase.storage
      .from("uploads")
      .createSignedUrl(`${file_data.creator ?? "anon"}/${file_data.id}.${file_extension}`, 3600);
  
    const headers = new Headers();
    headers.set("access-control-allow-origin", "*");
    headers.set("location", data!.signedUrl);
    headers.set("Cache-Control", "300");
    headers.set("Content-Disposition", `attachment; filename="${file_data.name}"`);
    
    if (file_content_type) {
      headers.set("content-type", file_content_type);
    }

    const response = new Response(null, {
      status: 301,
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
}
