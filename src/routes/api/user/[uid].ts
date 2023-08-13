import { type APIEvent, json } from "solid-start";
 
import type { UploadedFile, UserProfile } from "@/types/api";
import { supabase, getUserProfile } from "@/supabase/server";

export const GET = async ({ request, params }: APIEvent): Promise<Response> => {
  try {
    let { uid } = params;
    
    let token = request.headers.get("authorization");
    const verify_token_user = await getUserProfile(token ?? "");
    if (!verify_token_user) return json({
      success: false,
      message: "Not authenticated correctly."
    }, { status: 401 })

    let is_mail = uid.includes("@");
    let user_id: string | undefined;

    if (is_mail) {
      // We get the user_id from the users table.
      const { data: user_data } = await supabase
        .from("users")
        .select()
        .eq("email", uid)
        .limit(1)
        .single<{ id: string }>();

      if (!user_data) return json({
        success: false,
        message: "Couldn't find any user with the given email."
      }, { status: 404 });

      user_id = user_data?.id;
    } else user_id = uid;

    
    const { data: user_profile } = await supabase
      .from("profiles")
      .select()
      .eq("user_id", user_id)
      .limit(1)
      .single<UserProfile>();
    
    if (!user_profile) return json({
      success: false,
      message: "Couldn't find any user."
    }, { status: 404 });

    return json({
      success: true,
      data: {
        user_id: user_profile.user_id,
        username: user_profile.username,
        first_name: user_profile.first_name,
        last_name: user_profile.last_name
      }
    });
  }
  catch (error) {
    console.error(error);
    return json({
      success: false,
      message: "An error server-side happened."
    }, { status: 500 });
  }
};