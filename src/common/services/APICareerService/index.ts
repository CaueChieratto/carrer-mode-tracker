export async function fetchTeamByClubName(club: string) {
  const url = `https://corsproxy.io/?${encodeURIComponent(
    `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${club}`
  )}`;

  const res = await fetch(url);
  const json = await res.json();

  return json.teams?.[0];
}
