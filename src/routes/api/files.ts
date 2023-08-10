import { type APIEvent, json } from "solid-start"
import { supabase, getUser } from "@/supabase/server";

export const GET = async ({ request }: APIEvent): Promise<Response> => {
  let token = request.headers.get("Authorization");
  const workspace_id = new URL(request.url).searchParams.get("workspace_id");

  if (!token) return json({
    success: false,
    message: "Missing supabase token."
  }, { status: 403 });

  const user = await getUser(token);
  if (!user) return json({
    success: false,
    message: "User doesn't exist."
  }, { status: 403 });

  const { data: workspace_data } = await supabase
    .from("workspaces")
    .select()
    .eq("id", workspace_id)
    .limit(1)
    .single();
  
  if (!workspace_data || workspace_data.creator !== user.id) return json({
    success: false,
    message: "Not allowed to get that workspace."
  }, { status: 403 });

  const { data } = await supabase
    .from("uploads")
    .select()
    .eq("workspace_id", workspace_data.id);

  return json({
    success: true,
    data
  });
}

/**
 * Body should be FormData.
 * 
 * `files: File[]` contains all the files to upload.
 * `workspace_id: string` is the workspace where we should upload the files.
 * `private?: "0" | "1"` is the accessibility of the file, where `0` means `public` and `1` means private.
 */
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

  const workspaceId = formData.get("workspace_id") as string;
  const isPrivate = parseInt((formData.get("private") as string | null) ?? "1");

  // TODO: type this shit.
  const newUploadsInDatabase: any[] = [];
  
  for (const file of formDataFiles) {
    const file_extension = file.name.substring(file.name.lastIndexOf(".") + 1);

    const { data } = await supabase
      .from("uploads")
      .insert({
        creator: user.id,
        private: Boolean(isPrivate),
        shared_with: [],
        workspace_id: workspaceId,
        name: file.name
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
