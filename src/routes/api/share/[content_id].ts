
import { type APIEvent, json } from "solid-start"
import { supabase, getUserProfile } from "@/supabase/server"
import type { WorkspaceMeta } from "@/types/api";

export const PATCH = async ({ request, params }: APIEvent) => {
  try {
    let { content_id } = params;
  
    let api_token = request.headers.get("authorization");
    if (!api_token) return json({
      success: false,
      message: "You need to provide an API token."
    }, { status: 401 });
  
    const user_profile = await getUserProfile(api_token);
    if (!user_profile) return json({
      success: false,
      message: "API key should be wrong."
    }, { status: 403 });
  
    const body = await new Response(request.body).json() as {
      type: "workspace" | "file",
      is_public: boolean,
      shared_uids: string[]
    };

    const { data: content_data } = await supabase
      .from(body.type === "workspace" ? "workspaces" : "uploads")
      .select()
      .eq("id", content_id)
      .limit(1)
      .single();
  
    let isCreatorOfContent = content_data.creator === user_profile.user_id;
  
    // Check if we're the owner of the file.
    if (!isCreatorOfContent) return json({
      success: false,
      message: "You're not allowed to access this file."
    }, { status: 403 });
  
    let new_content_data: Record<string, unknown> = {
      shared_with: body.shared_uids
    };
  
    if (body.type === "file") {
      new_content_data.private = !body.is_public;
    }
  
    const { data: updated_content } = await supabase
      .from(body.type === "workspace" ? "workspaces" : "uploads")
      .update(new_content_data)
      .eq("id", content_id)
      .select()
  
    return json({
      success: true,
      data: updated_content![0]
    });
  }
  catch (error) {
    console.error(error)
  }
};
