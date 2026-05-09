import { ReactNode } from "react";

export interface SpecSection {
  title: string;
  content: string | ReactNode;
}

export interface PrototypeProject {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: SpecSection[];
  previewUrl: string | null;
  redmineUrl?: string;
  subItems?: { id: string; name: string }[];
}

export interface AppState {
  selectedProjectId: string | null;
  selectedSubId: string | null;
}
