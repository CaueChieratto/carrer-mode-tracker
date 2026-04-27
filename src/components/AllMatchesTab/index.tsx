import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Career } from "../../common/interfaces/Career";
import { ClubData } from "../../common/interfaces/club/clubData";
import { ContainerClubContent } from "../ContainerClubContent";
import NoStatsMessage from "../NoStatsMessage";
import { ButtonsSwitch } from "./components/ButtonsSwitch";
import { MatchCard } from "./components/MatchCard";
import { MatchStatus } from "./types/MatchStatus";

type AllMatchesTabProps = {
  season: ClubData;
  career: Career;
};

export const AllMatchesTab = ({ season, career }: AllMatchesTabProps) => {
  const [activeTab, setActiveTab] = useState<MatchStatus | string>("SCHEDULED");

  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const allMatches =
    isGeralPage && career.clubData
      ? career.clubData.flatMap((s) => s.matches || [])
      : season.matches || [];

  const parseDate = (date: string) => {
    const [day, month, year] = date.split("/").map(Number);
    return new Date(2000 + year, month - 1, day).getTime();
  };

  const sortedMatches = allMatches
    ?.slice()
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  const filteredMatches = sortedMatches?.filter(
    (match) => match.status === (isGeralPage ? "FINISHED" : activeTab),
  );

  return (
    <ContainerClubContent isMatch>
      {!isGeralPage && (
        <ButtonsSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      {!filteredMatches?.length ? (
        <NoStatsMessage
          textOne="Nenhuma partida encontrada"
          textTwo="Primeiro, adicione as partidas do time."
        />
      ) : (
        filteredMatches?.map((match) => {
          const matchSeason =
            isGeralPage && career.clubData
              ? career.clubData.find((s) =>
                  s.matches?.some((m) => m.matchesId === match.matchesId),
                ) || season
              : season;

          return (
            <MatchCard
              key={`${match.date}-${match.homeTeam}-${match.awayTeam}`}
              match={match}
              season={matchSeason}
              isGeralPage={isGeralPage}
              career={career}
            />
          );
        })
      )}
    </ContainerClubContent>
  );
};
