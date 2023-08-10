// @refresh reload
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import "@/styles.css";

import { Suspense, onMount } from "solid-js";
import { supabase } from "@/supabase/client";
import { UserProfile, setAuth } from "./stores/auth";

import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import FullscreenLoader, { FullscreenLoaderEntry } from "./components/FullscreenLoader";

export default function Root() {
  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { data: _profile } = await supabase.from("profiles")
        .select()
        .eq("user_id", data.session.user.id)
        .limit(1)
        .single();
      
      let user_profile = _profile as UserProfile;
      setAuth({ loading: false, session: data.session, profile: user_profile });
    }
    else {
      setAuth({ loading: false, session: null, profile: null });
    }
  });

  return (
    <Html lang="en">
      <Head>
        <Title>Drive</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="min-h-screen h-full bg-[url(https://source.unsplash.com/collection/175083)] bg-no-repeat bg-cover bg-center bg-crust">
        <FullscreenLoaderEntry />

        <Suspense fallback={
          <FullscreenLoader
            message="Our cats are trying their best to get your page loading quick !"
          />
        }>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
