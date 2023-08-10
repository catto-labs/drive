import { type Component, Show } from "solid-js";
import { Outlet, Navigate } from "solid-start";
import { auth, isAuthenticated } from "@/stores/auth";
import FullscreenLoader from "@/components/FullscreenLoader";

const Layout: Component = () => {
  console.log(auth.loading)
  return (
    <Show when={!auth.loading} fallback={
      <FullscreenLoader
        finished={!auth.loading}
        message="Please wait, our cats are getting ready !"
      />
    }>
      <Show when={isAuthenticated()}
        fallback={<Navigate href="/auth/login" />}
      >
        <Outlet />
      </Show>
    </Show>
  );
};

export default Layout;
