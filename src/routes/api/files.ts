import { type APIEvent, json } from "solid-start"
import { supabase, getUser } from "@/supabase/server";

export const GET = async ({ request }: APIEvent): Promise<Response> => {
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

  const { data } = await supabase
    .from("uploads")
    .select()
    .eq("creator", user.id);

  return json({
    success: true,
    data
  });
}

export const PUT = async ({ request }: APIEvent): Promise<Response> => {
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

  const formData = await request.formData();
  const formDataFiles = formData.getAll("files") as File[];

  // TODO: type this shit.
  const newUploadsInDatabase: any[] = [];
  
  for (const file of formDataFiles) {
    const file_extension = file.name.substring(file.name.lastIndexOf(".") + 1);

    const { data } = await supabase
      .from("uploads")
      .insert({
        file_name: file.name,
        creator: user.id,
        private: true
      })
      .select();
    
    const upload_id = data![0].id;
    newUploadsInDatabase.push(data![0]);
    
    await supabase.storage
      .from('uploads')
      .upload(`${user.id}/${upload_id}.${file_extension}`, file, {
        cacheControl: '3600',
        upsert: true
      });
  }

  return json({
    success: true,
    data: { new_uploads: newUploadsInDatabase }
  });
}