import Load from "../../components/Load";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";
import { useParams, useLocation } from "react-router-dom";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";
import { ModalType } from "../../common/types/enums/ModalType";
import BottomMenu from "../../ui/BottomMenu";
import { calculateTotalStats } from "../../layout/SectionView/features/ClubTabs/StatsTab_Club/components/PlayerStatsList/utils/calculateTotalStats";
import SectionView from "../../layout/SectionView";
import { useMemo } from "react";
import { augmentCareerWithMatchStats } from "../../layout/SectionView/helpers/mergeMatchStats";

const Player = () => {
  const { loading, career, season, tabsConfig } = useSeasonView(true, true);
  const { playerId, seasonId } = useParams<{
    playerId: string;
    seasonId: string;
  }>();
  const location = useLocation();
  const { activeModal } = useModalManager();
  const isNotSeason = location.pathname.includes("/Geral") || !seasonId;

  const augmentedCareer = useMemo(() => {
    if (!career) return null;
    return augmentCareerWithMatchStats(career);
  }, [career]);

  const actualSeason = isNotSeason
    ? season
    : career?.clubData.find((s) => s.id === seasonId) || season;

  let player = actualSeason?.players.find((p) => p.id === playerId);

  if (!player && career) {
    const referencePlayer = career.clubData
      .flatMap((s) => s.players)
      .find((p) => p.id === playerId);

    if (referencePlayer && actualSeason) {
      player = actualSeason.players.find(
        (p) =>
          p.name.trim().toLowerCase() ===
            referencePlayer.name.trim().toLowerCase() &&
          p.nation.trim().toLowerCase() ===
            referencePlayer.nation.trim().toLowerCase(),
      );
    }
  }

  if (!player && season) {
    player = season.players.find((p) => p.id === playerId);
  }

  const spoofedCareer = useMemo(() => {
    if (!career || !player || isNotSeason) return career;

    const newClubData = [...career.clubData];
    const latestIndex = newClubData.length - 1;
    const latestSeason = { ...newClubData[latestIndex] };

    latestSeason.players = latestSeason.players.map((p) =>
      p.id === playerId ||
      (p.name === player?.name && p.nation === player?.nation)
        ? {
            ...p,
            shirtNumber: player.shirtNumber,
            overall: player.overall,
            age: player.age,
            position: player.position,
          }
        : p,
    );

    newClubData[latestIndex] = latestSeason;
    return { ...career, clubData: newClubData };
  }, [career, player, isNotSeason, playerId]);

  if (loading) return <Load />;
  if (!career || !season || !actualSeason) return <NotFoundDisplay />;

  const seasonsPlayerPlayed = augmentedCareer?.clubData.filter((s) => {
    const playerInSeason = s.players.find(
      (p) =>
        p.name.trim().toLowerCase() === player?.name.trim().toLowerCase() &&
        p.nation.trim().toLowerCase() === player?.nation.trim().toLowerCase(),
    );
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
        title={
          isNotSeason ? titleText : `Temporada ${actualSeason.seasonNumber}`
        }
        career={spoofedCareer!}
        season={actualSeason}
        tabsConfig={tabsConfig}
      />
      {activeModal === ModalType.NONE && <BottomMenu />}
    </>
  );
};

export default Player;
