import { auth } from "@/stores/auth";
import type { UploadedFile } from "@/types/api";
import { createSignal } from "solid-js";
import toast from "solid-toast";

export const createFileImporter = (onFileUploaded: (files: FileList) => unknown) => {
  const input = document.createElement("input");
  input.setAttribute("multiple", "true");
  input.setAttribute("hidden", "true");
  input.setAttribute("type", "file");

  input.onchange = () => {
    const files = input.files;
    if (files !== null) {
      onFileUploaded(files);
    }

    input.remove();
  };

  document.body.appendChild(input);
  input.click();
};

export const file_extension = (str: string) => str.substring(str.lastIndexOf(".") + 1);

/**
 * Upload `files` to the API.
 * 
 * `options.workspace_id` is where the file will be placed.
 * If not given, it'll take root workspace of current logged in user.
 * If not logged in, then it's an anonymous upload and so we don't need any workspace.
 * 
 * `options.private` is whether the upload should be accessible
 * to everyone who have the API link or no.
 * When authenticated, it defaults to `true`.
 * Concerning anonymous uploads, they're ALWAYS public, meaning
 * that modifying this property won't change anything and always default to `false`. 
 */
export const makeFileUpload = async (files: FileList | Array<File>, options?: {
  workspace_id?: string
  private?: boolean
}) => {
  const body = new FormData();
  body.set("workspace_id", options?.workspace_id ?? auth.profile?.root_workspace_id ?? "");
  body.set("private", (options?.private ? "1" : "0") ?? "1");
  // We append the files to the form.
  for (const file of files) {
    body.append("files", file);
  }

  // Only add headers for authenticated users.
  if (auth.profile) {
    body.set("api_token", auth.profile.api_token);
  }

  const response = await fetch("/api/workspace/upload", {
    method: "PUT",
    body
  });

  const json = await response.json() as (
    | { success: false, message: string }
    | { success: true, data: {
      uploaded: UploadedFile[]
    }}
  );

  // Aww... something went wrong :'(
  if (!json.success) {
    throw new Error(json.message);
  }

  // // All's good, we send back the new rows in `uploads` table.
  return json.data.uploaded;
};

export const getUploadedFileURL = (file: UploadedFile) => {
  const url = new URL("/api/file/" + file.id, window.location.origin);
  return url;
};

const [downloadProgress, setDownloadProgress] = createSignal(0);

export const downloadUploadedFile = (file: UploadedFile) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/file/" + file.id, true);
  xhr.setRequestHeader("authorization", auth.profile!.api_token);

  xhr.responseType = "blob";

  toast.custom(() => (
    <div 
      class="relative flex flex-col gap-2 rounded-md bg-base px-6 py-3 pr-12 font-medium text-text shadow-md">
        Downloading... {downloadProgress()}%
      <progress value={downloadProgress()} max={100} class="bg-lavender" />
    </div>
  ), {
    unmountDelay: 0
  });

  xhr.onload = () => {
    if (xhr.status === 200) {
      const blob = xhr.response;
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = file.name;

      // Trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(downloadLink.href);
        document.body.removeChild(downloadLink);
      }, 100);
    }
  };

  xhr.onprogress = (event) => {
    if (event.lengthComputable) {
      console.info(file.name, `${event.loaded}/${event.total} (${event.loaded * 100 / event.total}%)`);
      setDownloadProgress(Math.floor(event.loaded * 100 / event.total));

      if (event.loaded === 1) {
        toast.dismiss();
      } 
    }
  };

  xhr.send();
};

export const removePermanentlyFile = async (upload_id: string) => {
  await fetch("/api/file/" + upload_id, {
    method: "DELETE",
    headers: {
      authorization: auth.profile!.api_token
    }
  });
};
