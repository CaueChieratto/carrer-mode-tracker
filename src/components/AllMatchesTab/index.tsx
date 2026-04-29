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

const MONTH_OPTIONS = [
  "Tudo",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
];

const MONTH_TO_NUM: Record<string, number> = {
  Janeiro: 1,
  Fevereiro: 2,
  Março: 3,
  Abril: 4,
  Maio: 5,
  Junho: 6,
  Julho: 7,
  Agosto: 8,
  Setembro: 9,
  Outubro: 10,
  Novembro: 11,
  Dezembro: 12,
};

export const AllMatchesTab = ({ season, career }: AllMatchesTabProps) => {
  const [activeTab, setActiveTab] = useState<MatchStatus | string>("SCHEDULED");
  const [selectedMonth, setSelectedMonth] = useState<string>("Tudo");

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

  const sortedMatches = allMatches?.slice().sort((a, b) => {
    const diff = parseDate(a.date) - parseDate(b.date);

    const isFinished = (isGeralPage ? "FINISHED" : activeTab) === "FINISHED";

    return isFinished ? -diff : diff;
  });

  const filteredMatches = sortedMatches?.filter((match) => {
    const statusMatch = match.status === (isGeralPage ? "FINISHED" : activeTab);

    let monthMatch = true;
    if (selectedMonth !== "Tudo") {
      const matchMonthNum = Number(match.date.split("/")[1]);
      monthMatch = matchMonthNum === MONTH_TO_NUM[selectedMonth];
    }

    return statusMatch && monthMatch;
  });
  return (
    <ContainerClubContent isMatch>
      {!isGeralPage && (
        <ButtonsSwitch
          months={MONTH_OPTIONS}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
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
