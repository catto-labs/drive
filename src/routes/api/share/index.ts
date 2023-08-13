import { APIEvent, json } from "solid-start";
import { getUserProfile, supabase } from "@/supabase/server";

export const GET = async ({ request }: APIEvent) => {
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

  let { data: shared_files } = await supabase
    .from('uploads')
    .select()
    .containedBy('shared_with', user_profile.user_id)

  shared_files = shared_files ?? [];

  let { data: shared_workspaces } = await supabase
    .from('workspaces')
    .select()
    .containedBy('shared_with', user_profile.user_id)

    shared_workspaces = shared_files ?? [];

  return {
    success: true,
    data: {
      shared_workspaces,
      shared_files
    }
  }
}