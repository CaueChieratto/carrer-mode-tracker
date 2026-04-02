import { useState } from "react";
import { ClubData } from "../../common/interfaces/club/clubData";
import { ContainerClubContent } from "../ContainerClubContent";
import NoStatsMessage from "../NoStatsMessage";
import { ButtonsSwitch } from "./components/ButtonsSwitch";
import { MatchCard } from "./components/MatchCard";
import { MatchStatus } from "./types/MatchStatus";

type AllMatchesTabProps = {
  season: ClubData;
};

export const AllMatchesTab = ({ season }: AllMatchesTabProps) => {
  const [activeTab, setActiveTab] = useState<MatchStatus | string>("SCHEDULED");

  const allMatches = season.matches;

  const parseDate = (date: string) => {
    const [day, month, year] = date.split("/").map(Number);

    return new Date(2000 + year, month - 1, day).getTime();
  };

  const sortedMatches = allMatches
    ?.slice()
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  const filteredMatches = sortedMatches?.filter(
    (match) => match.status === activeTab,
  );

  return (
    <ContainerClubContent>
      <ButtonsSwitch activeTab={activeTab} setActiveTab={setActiveTab} />

      {!filteredMatches?.length ? (
        <NoStatsMessage
          textOne="Nenhuma partida encontrada"
          textTwo="Primeiro, adicione as partidas do time."
        />
      ) : (
        filteredMatches?.map((match) => (
          <MatchCard
            key={`${match.date}-${match.homeTeam}-${match.awayTeam}`}
            match={match}
            season={season}
          />
        ))
      )}
    </ContainerClubContent>
  );
};
