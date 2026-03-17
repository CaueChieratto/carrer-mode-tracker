export async function fetchTeamByClubName(club: string) {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${club}`;

  try {
    const res = await fetch(url);

    if (!res.ok) throw new Error("Erro ao buscar dados do time");

    const json = await res.json();
    return json.teams?.[0];
  } catch (error) {
    console.error("Erro na busca do time:", error);
    return null;
  }
}
