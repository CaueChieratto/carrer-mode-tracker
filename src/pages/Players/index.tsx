import Load from "../../components/Load";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";
import { ModalType } from "../../common/types/enums/ModalType";
import BottomMenu from "../../ui/BottomMenu";
import { calculateTotalStats } from "../../layout/SectionView/features/ClubTabs/StatsTab_Club/components/PlayerStatsList/utils/calculateTotalStats";
import SectionView from "../../layout/SectionView";
import { useMemo } from "react";
import { augmentCareerWithMatchStats } from "../../layout/SectionView/helpers/mergeMatchStats";
import { getSeasonTabsConfig } from "../../layout/SectionView/config/seasonTabsConfig";
import { useCareers } from "../../common/hooks/Career/UseCareer";
import { Career } from "../../common/interfaces/Career";

const Player = () => {
  const { loading, career, season } = useSeasonView(true, true);
  const { careers: allCareers } = useCareers();
  const { playerId, seasonId } = useParams<{
    playerId: string;
    seasonId: string;
  }>();

  const location = useLocation();
  const navigate = useNavigate();
  const { activeModal } = useModalManager();

  const isNotSeason = location.pathname.includes("/Geral") || !seasonId;

  const searchParams = new URLSearchParams(location.search);
  const isFromGroup =
    searchParams.get("fromGroup") === "true" || location.state?.fromGroup;

  const urlGroupId = searchParams.get("groupId");

  const groupCareers = useMemo((): Career[] => {
    if (!career) return [];
    const activeGroupId = career.groupId || urlGroupId;
    if (!activeGroupId || !isFromGroup) return [career];
    const siblings = allCareers.filter((c) => c.groupId === activeGroupId);
    return siblings.length > 0 ? siblings : [career];
  }, [career, allCareers, isFromGroup, urlGroupId]);

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
      if (!player) player = referencePlayer;
    }
  }

  if (!player && season) {
    player = season.players.find((p) => p.id === playerId);
  }

  if (!player && isFromGroup) {
    player = groupCareers
      .flatMap((c) => c.clubData.flatMap((s) => s.players))
      .find((p) => p.id === playerId);
  }

  const spoofedCareer = useMemo(() => {
    let baseCareer = career;

    if (career && !isFromGroup) {
      baseCareer = { ...career, groupId: undefined };
    }

    if (!baseCareer || !player || isNotSeason) return baseCareer;

    const newClubData = [...baseCareer.clubData];
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
    return { ...baseCareer, clubData: newClubData };
  }, [career, player, isNotSeason, playerId, isFromGroup]);

  const playerTabsConfig = useMemo(() => {
    if (!spoofedCareer || !actualSeason) return [];
    return getSeasonTabsConfig(
      spoofedCareer,
      actualSeason.id,
      navigate,
      true,
      isNotSeason,
      player,
    );
  }, [spoofedCareer, actualSeason, navigate, isNotSeason, player]);

  const { totalSeasons, totalClubs } = useMemo(() => {
    if (!player) return { totalSeasons: 0, totalClubs: 0 };
    let seasons = 0;
    let clubs = 0;
    groupCareers.forEach((c) => {
      const augmented = augmentCareerWithMatchStats(c);
      let playedAtThisClub = false;
      augmented.clubData.forEach((s) => {
        const playerInSeason = s.players.find(
          (p) =>
            p.name.trim().toLowerCase() === player.name.trim().toLowerCase() &&
            p.nation.trim().toLowerCase() ===
              player.nation.trim().toLowerCase(),
        );
        if (!playerInSeason) return;
        const totalStats = calculateTotalStats(playerInSeason);
        const hasPlayed =
          (totalStats.minutesPlayed ?? 0) > 0 ||
          totalStats.games > 0 ||
          totalStats.goals > 0 ||
          totalStats.assists > 0 ||
          totalStats.cleanSheets > 0;
        if (hasPlayed) {
          seasons += 1;
          playedAtThisClub = true;
        }
      });
      if (playedAtThisClub) clubs += 1;
    });
    return { totalSeasons: seasons, totalClubs: clubs };
  }, [groupCareers, player]);

  if (loading) return <Load />;
  if (!career || !season || !actualSeason) return <NotFoundDisplay />;

  const seasonLabel = totalSeasons === 1 ? "Temporada" : "Temporadas";
  const titleText =
    totalClubs > 1
      ? `${totalSeasons} ${seasonLabel} e ${totalClubs} Clubes`
      : `${totalSeasons} ${seasonLabel} no clube`;

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
        tabsConfig={playerTabsConfig}
      />
      {activeModal === ModalType.NONE && <BottomMenu />}
    </>
  );
};

export default Player;
