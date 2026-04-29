import Load from "../../components/Load";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";
import { useParams } from "react-router-dom";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";
import { ModalType } from "../../common/types/enums/ModalType";
import BottomMenu from "../../ui/BottomMenu";
import { calculateTotalStats } from "../../components/StatsTab_Club/components/PlayerStatsList/utils/calculateTotalStats";
import SectionView from "../../layout/SectionView";
import { useMemo } from "react";
import { augmentCareerWithMatchStats } from "../../layout/SectionView/helpers/mergeMatchStats";

const Player = () => {
  const { loading, career, season, tabsConfig } = useSeasonView(true, true);
  const { playerId } = useParams<{ playerId: string }>();
  const { activeModal } = useModalManager();

  const augmentedCareer = useMemo(() => {
    if (!career) return null;
    return augmentCareerWithMatchStats(career);
  }, [career]);

  if (loading) return <Load />;
  if (!career || !season) return <NotFoundDisplay />;

  const player = season.players.find((p) => p.id === playerId);

  const seasonsPlayerPlayed = augmentedCareer?.clubData.filter((s) => {
    const playerInSeason = s.players.find((p) => p.id === playerId);

    if (!playerInSeason) return false;

    const totalStats = calculateTotalStats(playerInSeason);

    return (
      (totalStats.minutesPlayed ?? 0) > 0 ||
      totalStats.games > 0 ||
      totalStats.goals > 0 ||
      totalStats.assists > 0 ||
      totalStats.cleanSheets > 0
    );
  }).length;

  const titleText = `${seasonsPlayerPlayed} ${
    seasonsPlayerPlayed === 1 ? "Temporada" : "Temporadas"
  } no clube`;

  return (
    <>
      <SectionView
        isPlayer
        notSeason
        player={player}
        title={titleText}
        career={career}
        season={season}
        tabsConfig={tabsConfig}
      />
      {activeModal === ModalType.NONE && <BottomMenu />}
    </>
  );
};

export default Player;
