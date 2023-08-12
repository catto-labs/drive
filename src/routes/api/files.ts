import { type APIEvent, json, redirect } from "solid-start"
import { supabase, getUserProfile } from "@/supabase/server";
import type { UserProfile } from "@/types/api";

export const PUT = () => {
  const url = new URL(`/functions/v1/upload-file`, import.meta.env.VITE_SUPABASE_PROJECT_URL as string)
  return redirect(url.href, 308);
};
