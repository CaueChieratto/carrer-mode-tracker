import Styles from "./MatchDetailsTab.module.css";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Career } from "../../../../common/interfaces/Career";
import { MVPCard } from "./components/MVPCard";
import { Timeline } from "./components/Timeline";
import { buildMatchEvents } from "./helpers/buildMatchEvents";
import { Match } from "../../../../components/AllMatchesTab/types/Match";
import { MatchHeaderCard } from "./components/MatchHeaderCard";
import { PenaltyShootoutCard } from "./components/PenaltyShootoutCard";

type MatchDetailsTabProps = {
  match: Match;
  season: ClubData;
  career: Career;
  onRegisterSave?: (fn: () => Promise<void> | void) => void;
};

export const MatchDetailsTab = ({
  match,
  season,
  career,
}: MatchDetailsTabProps) => {
  const isHome = match?.homeTeam === career.clubName;

  const { mvpPlayerName, mvpRating, eventsByPeriod, periods, goalsList } =
    buildMatchEvents(match, season);

  const hasPenalties =
    match?.homePenScore !== undefined && match?.awayPenScore !== undefined;

  return (
    <div className={Styles.container}>
      <MatchHeaderCard match={match} isUserHome={isHome} goals={goalsList} />

      {hasPenalties && <PenaltyShootoutCard match={match} />}

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
