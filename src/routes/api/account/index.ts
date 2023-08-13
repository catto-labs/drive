import { APIEvent, json } from "solid-start";
import { getUserProfile, supabase } from "@/supabase/server";

export const POST = async ({ request }: APIEvent) => {
  const api_token = request.headers.get("authorization");
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
    username?: string
    first_name?: string
    last_name?: string
  };

  const { data: updated_user } = await supabase
    .from("profiles")
    .update(body)
    .eq("id", user_profile.user_id)
    .select();

  return {
    success: true,
    data: updated_user
  };
};