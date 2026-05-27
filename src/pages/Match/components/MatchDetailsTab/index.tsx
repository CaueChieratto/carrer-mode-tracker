import Styles from "./MatchDetailsTab.module.css";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Career } from "../../../../common/interfaces/Career";
import { MVPCard } from "./components/MVPCard";
import { Timeline } from "./components/Timeline";
import { buildMatchEvents } from "./helpers/buildMatchEvents";
import { Match } from "../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { MatchHeaderCard } from "./components/MatchHeaderCard";
import { Teams } from "../../../AddMatches/interface/teams";

type MatchDetailsTabProps = {
  match: Match;
  season: ClubData & { teams?: Teams[] };
  career: Career;
  onRegisterSave?: (fn: () => Promise<void> | void) => void;
};

export const MatchDetailsTab = ({
  match,
  season,
  career,
}: MatchDetailsTabProps) => {
  const teams = season.teams || [];

  const isHome = match?.homeTeam === career.clubName;

  const {
    mvpPlayerName,
    mvpRating,
    eventsByPeriod,
    periods,
    userGoalsList,
    opponentGoalsList,
  } = buildMatchEvents(match, season);

  const hasPenalties =
    match?.homePenScore !== undefined && match?.awayPenScore !== undefined;

  const homeTeamData = teams.find((team) => team.name === match.homeTeam);
  const awayTeamData = teams.find((team) => team.name === match.awayTeam);

  const homeBadge = isHome ? career.teamBadge : homeTeamData?.badge || "";
  const awayBadge = !isHome ? career.teamBadge : awayTeamData?.badge || "";

  return (
    <div className={Styles.container}>
      <MatchHeaderCard
        match={match}
        isUserHome={isHome}
        userGoals={userGoalsList}
        opponentGoals={opponentGoalsList}
        hasPenalties={hasPenalties}
        homeBadge={homeBadge}
        awayBadge={awayBadge}
      />

      {mvpRating && <MVPCard playerName={mvpPlayerName} rating={mvpRating} />}

      {periods.length > 0 && (
        <Timeline
          isHome={isHome}
          eventsByPeriod={eventsByPeriod}
          periods={periods}
        />
      )}
    </div>
  );
};
