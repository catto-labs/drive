import { redirect } from "solid-start"

export const PUT = () => {
  const url = new URL(`/functions/v1/upload-file`, import.meta.env.VITE_SUPABASE_PROJECT_URL as string)
  return redirect(url.href, 308);
};
