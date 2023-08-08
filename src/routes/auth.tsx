import { type Component, Show } from "solid-js";
import { Outlet, Navigate } from "solid-start";
import { isAuthenticated } from "@/stores/auth";

const Layout: Component = () => {
  return (
    <Show when={!isAuthenticated()}
      fallback={<Navigate href="/dashboard" />}
    >
      <Outlet />
    </Show>
  );
};

export default Layout;
