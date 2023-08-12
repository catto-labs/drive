// @refresh reload
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "@/styles.css";

import { Suspense, onMount } from "solid-js";

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

import { FullscreenLoaderEntry } from "@/components/FullscreenLoader";
import { getProfileWithSession, supabase } from "@/supabase/client";
import { setAuth } from "@/stores/auth";

export default function Root() {
  onMount(async () => {
    window.sb = supabase;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const user_profile = await getProfileWithSession(data.session);
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

        <Suspense>
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
