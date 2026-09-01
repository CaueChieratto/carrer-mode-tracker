import type { ReactNode } from "react";
import { SeasonThemeProvider } from "../../../../contexts/SeasonThemeContext";
import { AddMatchStatsPlayerScreen } from "../../components/LineupTab/views/AddMatchStatsPlayer/screens/AddMatchStatsPlayerScreen";
import { AddDetailsScreen } from "../../components/MatchDetailsTab/views/AddDetails/screens/AddDetailsScreen";
import { AddStatsMatchScreen } from "../../components/MatchStatsTab/views/AddStatsMatch/screens/AddStatsMatchScreen";
import type { MatchScreen } from "../../config/screens";
import type { useMatchData } from "../../hooks/useMatchData";

type MatchData = ReturnType<typeof useMatchData>;

interface MatchScreenRouterProps {
  screen: MatchScreen | null | undefined;
  career: NonNullable<MatchData["career"]>;
  season: NonNullable<MatchData["season"]>;
  match: NonNullable<MatchData["match"]>;
  onClose: () => void;
  onSaved: MatchData["updateLocalMatch"];
  children: ReactNode;
}

export const MatchScreenRouter = ({
  screen,
  career,
  season,
  match,
  onClose,
  onSaved,
  children,
}: MatchScreenRouterProps) => {
  if (screen?.key === "addMatchDetails") {
    return (
      <SeasonThemeProvider careerId={career.id} career={career}>
        <AddDetailsScreen
          career={career}
          season={season}
          match={match}
          onClose={onClose}
          onSaved={onSaved}
        />
      </SeasonThemeProvider>
    );
  }

  if (screen?.key === "addMatchStatsPlayer") {
    return (
      <SeasonThemeProvider careerId={career.id} career={career}>
        <AddMatchStatsPlayerScreen
          career={career}
          season={season}
          match={match}
          playerId={screen.playerId}
          onClose={onClose}
          onSaved={onSaved}
        />
      </SeasonThemeProvider>
    );
  }

  if (screen?.key === "addStatsMatch") {
    return (
      <SeasonThemeProvider careerId={career.id} career={career}>
        <AddStatsMatchScreen
          career={career}
          season={season}
          match={match}
          onClose={onClose}
          onSaved={onSaved}
        />
      </SeasonThemeProvider>
    );
  }

  return <>{children}</>;
};
