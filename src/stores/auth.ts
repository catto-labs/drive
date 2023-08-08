import type { AuthSession as Session } from "@supabase/supabase-js";
import { createStore } from "solid-js/store";

/**
 * On first load, this is the default values for
 * the store. Supabase is still loading the user
 * and we should show some loading process.
 */
export interface AuthStoreLoading {
  loading: true;
  session: null;
}

export interface AuthStoreNonAuthenticated {
  loading: false;
  session: null;
}

export interface AuthStoreAuthenticated {
  loading: false;
  session: Session;
}

export type AuthStore = (
  | AuthStoreLoading
  | AuthStoreNonAuthenticated
  | AuthStoreAuthenticated
)

export const [auth, setAuth] = createStore<AuthStore>({
  loading: true,
  session: null
});

export const isAuthenticated = (): boolean => {
  if (auth.session?.user) return true;
  return false;
};
