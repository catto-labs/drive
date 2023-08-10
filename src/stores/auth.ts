import type { AuthSession as Session } from "@supabase/supabase-js";
import { createStore } from "solid-js/store";
import { supabase } from "@/supabase/client";

export interface UserProfile {
  id: string
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  api_token: string;
  root_workspace_id: string;
}

/**
 * On first load, this is the default values for
 * the store. Supabase is still loading the user
 * and we should show some loading process.
 */
export interface AuthStoreLoading {
  loading: true;
  session: null;
  profile: null;
}

export interface AuthStoreNonAuthenticated {
  loading: false;
  session: null;
  profile: null;
}

export interface AuthStoreAuthenticated {
  loading: false;
  session: Session;
  profile: UserProfile
}

export type AuthStore = (
  | AuthStoreLoading
  | AuthStoreNonAuthenticated
  | AuthStoreAuthenticated
)

export const [auth, setAuth] = createStore<AuthStore>({
  loading: true,
  session: null,
  profile: null
});

export const isAuthenticated = (): boolean => {
  if (auth.session?.user) return true;
  return false;
};

/** Utility function to log out user. */
export const logOutUser = async (): Promise<void> => {
  await supabase.auth.signOut();
  setAuth({ loading: false, session: null, profile: null });
};
