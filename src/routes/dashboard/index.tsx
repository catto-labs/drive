import { Navigate } from "solid-start";
import { auth } from "@/stores/auth";

export default () => (
  <Navigate href={`/dashboard/${auth.profile!.root_workspace_id}`} />
);
