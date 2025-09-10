import { Career } from "../../interfaces/Career";
import { ServiceCareer } from "../ServiceCareer";

export async function SaveEditClub(
  career: Career,
  primaryColor: string,
  secondaryColor: string,
  fileDataUrl?: string,
  clubName?: string,
  managerName?: string
) {
  const colorsTeams = [primaryColor, secondaryColor];

  await ServiceCareer.editCareer(
    career.id,
    colorsTeams,
    fileDataUrl,
    clubName,
    managerName
  );

  const updatedCareer = {
    ...career,
    colorsTeams,
    teamBadge: fileDataUrl ?? career.teamBadge,
    clubName: clubName ?? career.clubName,
    managerName: managerName ?? career.managerName,
  };

  return updatedCareer;
}
