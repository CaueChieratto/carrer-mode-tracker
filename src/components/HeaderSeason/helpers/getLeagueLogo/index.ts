type League = { name?: string; logo?: string };
type ClubData = { leagues?: League[] }[];

export const getLeagueLogo = (
  clubData?: ClubData,
  matchLeague?: string,
): string | undefined => {
  if (!clubData || !matchLeague) return undefined;

  return clubData
    .flatMap((club) => club.leagues)
    .find((league) => league?.name === matchLeague)?.logo;
};
