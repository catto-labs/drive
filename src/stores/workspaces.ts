import { WorkspaceContent } from "@/types/api";
import { createStore } from "solid-js/store";

export const [workspaces, setWorkspaces] = createStore<Record<string, Array<WorkspaceContent>>>({});