import { type APIEvent, json } from "solid-start"
import { supabase, getUser } from "@/supabase/server";

export const GET = async ({ request, params }: APIEvent): Promise<Response> => {
  try {
    const { upload_id } = params;
  
    let token = request.headers.get("Authorization");
    if (!token) return json({
      success: false,
      message: "Missing supabase token."
    }, { status: 403 });
  
    const user = await getUser(token);
    if (!user) return json({
      success: false,
      message: "User doesn't exist."
    }, { status: 403 });
  
    const { data: file_data } = await supabase
      .from("uploads")
      .select()
      .eq("id", upload_id)
      .limit(1)
      .single();
  
    if (!file_data) return json({
      success: false,
      message: "File doesn't exist."
    }, { status: 404 })
  
    const { data: workspace_data } = await supabase
      .from("workspaces")
      .select()
      .eq("id", file_data.workspace_id)
      .limit(1)
      .single();
    
    if (!workspace_data || workspace_data.creator !== user.id) return json({
      success: false,
      message: "Not allowed to get items from this workspace."
    }, { status: 403 });
  
    const file_extension = file_data.name.substring(file_data.name.lastIndexOf(".") + 1);
  
    // Create a download URL, only available for one minute.
    const { data } = await supabase.storage
      .from("uploads")
      .createSignedUrl(`${user.id}/${file_data.id}.${file_extension}`, 60)
  
    return json({
      success: true,
      data: { url: data?.signedUrl }
    });
  }
  catch (error) {
    console.error(error);
    return json({
      success: false,
      message: "An error server-side happened"
    }, { status: 500 });
  }
}