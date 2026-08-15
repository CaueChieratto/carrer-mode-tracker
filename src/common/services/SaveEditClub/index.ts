import { Career } from "../../interfaces/Career";
import { ServiceCareer } from "../ServiceCareer";

export async function SaveEditClub(
  career: Career,
  primaryColor: string,
  secondaryColor: string,
  imageUrl?: string,
  clubName?: string,
  managerName?: string,
) {
  const colorsTeams = [primaryColor, secondaryColor];

  await ServiceCareer.editCareer(
    career.id,
    colorsTeams,
    imageUrl,
    clubName,
    managerName,
  );

  const updatedCareer = {
    ...career,
    colorsTeams,
    teamBadge: imageUrl ?? career.teamBadge,
    clubName: clubName ?? career.clubName,
    managerName: managerName ?? career.managerName,
  };

  return updatedCareer;
}
