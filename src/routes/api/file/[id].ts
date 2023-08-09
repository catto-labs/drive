import { type APIEvent, json } from "solid-start"
import { supabase, getUser } from "@/supabase/server";

export const GET = async ({ request, params }: APIEvent): Promise<Response> => {
  const upload_id = params.id as string;

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

  if (file_data.creator !== user.id) return json({
    success: false,
    message: "Not allowed to see that file."
  }, { status: 403 });

  const file_extension = file_data.file_name.substring(file_data.file_name.lastIndexOf(".") + 1);

  // Create a download URL, only available for one minute.
  const { data } = await supabase.storage
    .from("uploads")
    .createSignedUrl(`${user.id}/${file_data.id}.${file_extension}`, 60)

  return json({
    success: true,
    data: { url: data?.signedUrl }
  });
}