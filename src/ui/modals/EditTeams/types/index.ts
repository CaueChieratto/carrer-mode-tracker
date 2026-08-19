import { Teams } from "../../../../common/interfaces/Teams";

export type EditableTeam = Teams & {
  originalName: string;
  originalBadge: string;
  file?: File;
  previewUrl?: string;
};
