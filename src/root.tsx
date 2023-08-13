// @refresh reload
import "@fontsource/quicksand/300.css";
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/500.css";
import "@fontsource/quicksand/600.css";
import "@fontsource/quicksand/700.css";
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
  Link
} from "solid-start";

import FullscreenLoader, { FullscreenLoaderEntry } from "@/components/FullscreenLoader";
import { getProfileWithSession, supabase } from "@/supabase/client";
import { setAuth } from "@/stores/auth";

export default function Root() {
  onMount(async () => {
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
        <Title>Drive by catto labs</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />

        <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <Link rel="manifest" href="/site.webmanifest" />
        <Link rel="mask-icon" href="/safari-pinned-tab.svg" color="#7287fd" />
        <Meta name="msapplication-TileColor" content="#7287fd" />
        <Meta name="theme-color" content="#ffffff" />
      </Head>
      <Body class="h-full min-h-screen bg-crust bg-[url(https://source.unsplash.com/collection/175083)] bg-cover bg-center bg-no-repeat font-sans">
        <FullscreenLoaderEntry />

        <Suspense fallback={
          <FullscreenLoader message="Please wait, our cats are loading your page!" />
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
