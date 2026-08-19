import { Career } from "../../../../../common/interfaces/Career";
import { ServiceCareer } from "../../../../../common/services/ServiceCareer";

export async function SaveEditClub(
  career: Career,
  primaryColor: string,
  secondaryColor: string,
  imageUrl?: string,
  clubName?: string,
  managerName?: string,
  createdAt?: Date,
) {
  const colorsTeams = [primaryColor, secondaryColor];

  await ServiceCareer.editCareer(
    career.id,
    colorsTeams,
    imageUrl,
    clubName,
    managerName,
    createdAt,
  );

  const updatedCareer = {
    ...career,
    colorsTeams,
    teamBadge: imageUrl ?? career.teamBadge,
    clubName: clubName ?? career.clubName,
    managerName: managerName ?? career.managerName,
    createdAt: createdAt ?? career.createdAt,
  };

  return updatedCareer;
}
