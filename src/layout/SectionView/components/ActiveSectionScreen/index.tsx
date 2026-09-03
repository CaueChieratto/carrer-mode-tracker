import type { Career } from "../../../../common/interfaces/Career";
import type { ClubData } from "../../../../common/interfaces/club/clubData";
import { SeasonThemeProvider } from "../../../../contexts/SeasonThemeContext";
import type { SectionScreen } from "../../config/screens";
import AddMatchesScreen from "../../features/ClubTabs/AllMatchesTab/views/AddMatches";
import type { OptimisticUpdateData } from "../../helpers/updateSectionCareer";
import AddSquad_PlayerScreen from "../../features/ClubTabs/SquadTab/views/AddSquad_Player/screens/AddSquad_PlayerScreen";
import TransferPlayer from "../../features/ClubTabs/SquadTab/views/TransferPlayer";
import AddSeason_Player from "../../features/ClubTabs/StatsTab_Club/views/AddSeason_Player";
import AddTeamsToTable from "../../features/ClubTabs/TableTab/views/AddTeamsToTable";

interface ActiveSectionScreenProps {
  career: Career;
  season: ClubData;
  screen: SectionScreen;
  onClose: (optimisticData?: OptimisticUpdateData) => void;
}

export function ActiveSectionScreen({
  career,
  season,
  screen,
  onClose,
}: ActiveSectionScreenProps) {
  const renderScreen = () => {
    switch (screen.key) {
      case "addMatches":
        return (
          <AddMatchesScreen
            career={career}
            season={season}
            matchesId={screen.matchesId}
            onClose={onClose}
          />
        );

      case "addTeamsToTable":
        return (
          <AddTeamsToTable
            career={career}
            season={season}
            teamId={screen.teamId}
            teamToEdit={screen.teamToEdit}
            onClose={onClose}
          />
        );

      case "addSquadPlayer":
        return (
          <AddSquad_PlayerScreen
            career={career}
            season={season}
            playerId={screen.playerId}
            onClose={onClose}
          />
        );

      case "transferPlayer":
        return (
          <TransferPlayer
            career={career}
            season={season}
            playerId={screen.playerId}
            mode={screen.mode}
            onClose={onClose}
          />
        );

      case "addSeasonPlayer":
        return (
          <AddSeason_Player
            career={career}
            season={season}
            playerId={screen.playerId}
            onClose={onClose}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SeasonThemeProvider careerId={career.id} career={career}>
      {renderScreen()}
    </SeasonThemeProvider>
  );
}
