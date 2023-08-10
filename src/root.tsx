// @refresh reload
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import "@/styles.css";

import { Suspense, onMount } from "solid-js";
import { supabase } from "@/supabase/client";
import { setAuth } from "./stores/auth";

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

export default function Root() {
  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    setAuth({ loading: false, session: data.session });
  });

  return (
    <Html lang="en">
      <Head>
        <Title>Drive</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="bg-[url(https://source.unsplash.com/collection/175083)] bg-no-repeat bg-cover bg-crust">
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
