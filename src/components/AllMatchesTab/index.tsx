import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Career } from "../../common/interfaces/Career";
import { ClubData } from "../../common/interfaces/club/clubData";
import { ContainerClubContent } from "../ContainerClubContent";
import NoStatsMessage from "../NoStatsMessage";
import { ButtonsSwitch } from "./components/ButtonsSwitch";
import { MatchCard } from "./components/MatchCard";
import { MatchStatus } from "./types/MatchStatus";
import { MONTH_OPTIONS } from "./constants/MONTH_OPTIONS";
import { getMatchSeason, processMatches } from "./helpers/processMatches";

type AllMatchesTabProps = {
  season: ClubData;
  career: Career;
};

export const AllMatchesTab = ({ season, career }: AllMatchesTabProps) => {
  const [activeTab, setActiveTab] = useState<MatchStatus | string>("SCHEDULED");
  const [selectedMonth, setSelectedMonth] = useState<string>("Tudo");

  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const matches = processMatches({
    season,
    career,
    isGeralPage,
    activeTab,
    selectedMonth,
  });

  return (
    <ContainerClubContent isMatch>
      {!isGeralPage && (
        <ButtonsSwitch
          isMatches
          selectOptions={MONTH_OPTIONS}
          selectValue={selectedMonth}
          onSelectChange={setSelectedMonth}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      {!matches.length ? (
        <NoStatsMessage
          textOne="Nenhuma partida encontrada"
          textTwo="Primeiro, adicione as partidas do time."
        />
      ) : (
        matches.map((match) => {
          const matchSeason = getMatchSeason(
            match.matchesId,
            career,
            season,
            isGeralPage,
          );

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
