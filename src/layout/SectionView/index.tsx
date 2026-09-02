import { useCallback, useEffect, useMemo, useState } from "react";
import { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTabView } from "../../common/hooks/UseTabView";
import { Career } from "../../common/interfaces/Career";
import { ClubData } from "../../common/interfaces/club/clubData";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import Navbar from "../../ui/Navbar";
import Styles from "./SectionView.module.css";
import { Players } from "../../common/interfaces/playersInfo/players";
import ContainerButton from "../../components/ContainerButton";
import HeaderSeason from "../../components/HeaderSeason";
import { TabConfig } from "./config/seasonTabsConfig";
import {
  augmentCareerWithMatchStats,
  getAggregatedPlayersForCareer,
} from "./helpers/mergeMatchStats";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";
import { ModalType } from "../../common/types/enums/ModalType";
import ModalManager from "../../common/constants/ModalManager";
import { useScreenStack } from "./navigation/useScreenStack";
import { SectionScreen } from "./config/screens";
import AddMatchesScreen from "./features/ClubTabs/AllMatchesTab/views/AddMatches";
import AddTeamsToTable from "./features/ClubTabs/TableTab/views/AddTeamsToTable";
import AddSquad_PlayerScreen from "./features/ClubTabs/SquadTab/views/AddSquad_Player/screens/AddSquad_PlayerScreen";
import TransferPlayer from "./features/ClubTabs/SquadTab/views/TransferPlayer";
import AddSeason_Player from "./features/ClubTabs/StatsTab_Club/views/AddSeason_Player";
import { ServicePlayers } from "../../common/services/ServicePlayers";
import { ServiceMatches } from "./features/ClubTabs/AllMatchesTab/views/AddMatches/services/ServiceMatches";

const SectionView = ({
  career,
  season,
  tabsConfig,
  onOpenTransfers,
  title,
  notSeason,
  isPlayer,
  player,
  onScreenChange,
}: {
  career: Career;
  season: ClubData;
  tabsConfig: TabConfig[];
  onOpenTransfers?: (type: "arrivals" | "exit") => void;
  title?: string;
  notSeason?: boolean;
  isPlayer?: boolean;
  player?: Players;
  onScreenChange?: (hasOpenScreen: boolean) => void;
}) => {
  const {
    activeModal,
    openModal,
    closeModal,
    selectedSeason,
    selectedCareer,
    setSelectedCareer,
  } = useModalManager();

  const {
    current: screen,
    push: openScreen,
    pop: closeScreen,
  } = useScreenStack<SectionScreen>();

  const [localCareer, setLocalCareer] = useState<Career>(career);

  useEffect(() => {
    setLocalCareer(career);
  }, [career]);

  useEffect(() => {
    onScreenChange?.(!!screen);
  }, [screen, onScreenChange]);

  const forceRefreshSeason = useCallback(
    async (targetSeasonId?: string) => {
      const seasonIdToRefresh = targetSeasonId || season.id;

      try {
        const [matches, players] = await Promise.all([
          ServiceMatches.getMatchesBySeason(localCareer.id, seasonIdToRefresh),
          ServicePlayers.getPlayersBySeason(localCareer.id, seasonIdToRefresh),
        ]);
        setLocalCareer((prev) => {
          const newCareer = { ...prev, updatedAt: Date.now() };
          const sIndex = newCareer.clubData.findIndex(
            (s) => s.id === seasonIdToRefresh,
          );
          if (sIndex !== -1) {
            newCareer.clubData[sIndex] = {
              ...newCareer.clubData[sIndex],
              matches,
              players,
            };
          }
          return newCareer;
        });
      } catch (e) {
        console.error("Erro ao sincronizar cache local:", e);
      }
    },
    [localCareer.id, season.id],
  );

  const handleCloseScreen = useCallback(() => {
    const seasonIdToRefresh = screen?.seasonId;

    closeScreen();
    forceRefreshSeason(seasonIdToRefresh);
  }, [closeScreen, forceRefreshSeason, screen]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    forceRefreshSeason();
  }, [closeModal, forceRefreshSeason]);

  const [teamForBadge, setTeamForBadge] = useState<string>("");

  const opemAddBadge = (teamName: string) => {
    setTeamForBadge(teamName);
    openModal(ModalType.ADD_BADGE_CLUB, augmentedCareer, augmentedSeason);
  };

  const augmentedCareer = useMemo(
    () => augmentCareerWithMatchStats(localCareer),
    [localCareer],
  );

  const augmentedSeason = useMemo(
    () => augmentedCareer.clubData.find((s) => s.id === season.id) || season,
    [augmentedCareer, season],
  );

  const augmentedPlayer = useMemo(() => {
    if (!player) return undefined;

    if (notSeason) {
      const aggregatedPlayers = getAggregatedPlayersForCareer(augmentedCareer);

      const normalizedName = player.name.trim().toLowerCase();
      const normalizedNation = player.nation.trim().toLowerCase();

      return aggregatedPlayers.find(
        (p) =>
          p.name.trim().toLowerCase() === normalizedName &&
          p.nation.trim().toLowerCase() === normalizedNation,
      );
    }

    return augmentedSeason.players.find((p) => p.id === player.id);
  }, [player, notSeason, augmentedCareer, augmentedSeason]);

  const storageKey = isPlayer
    ? `player-tab-${augmentedCareer.id}-${augmentedPlayer?.id}`
    : notSeason
      ? `geral-tab-${augmentedCareer.id}`
      : `season-tab-${augmentedCareer.id}-${augmentedSeason.id}`;

  const { activeIndex, swiperRef, handleTabClick, handleSlideChange } =
    useTabView(storageKey);

  const activeTabConfig = tabsConfig[activeIndex];
  const ActionButton = activeTabConfig?.actionButton;

  const handleActionButtonClick = () => {
    if (activeTabConfig?.screen) {
      openScreen(activeTabConfig.screen);
    } else {
      activeTabConfig?.action?.();
    }
  };

  if (screen?.key === "addMatches") {
    const targetSeason = screen.seasonId
      ? (augmentedCareer.clubData.find((s) => s.id === screen.seasonId) ??
        augmentedSeason)
      : augmentedSeason;

    return (
      <SeasonThemeProvider
        careerId={augmentedCareer.id}
        career={augmentedCareer}
      >
        <AddMatchesScreen
          career={augmentedCareer}
          season={targetSeason}
          matchesId={screen.matchesId}
          onClose={handleCloseScreen}
        />
      </SeasonThemeProvider>
    );
  }

  if (screen?.key === "addTeamsToTable") {
    const targetSeason = screen.seasonId
      ? (augmentedCareer.clubData.find((s) => s.id === screen.seasonId) ??
        augmentedSeason)
      : augmentedSeason;

    return (
      <SeasonThemeProvider
        careerId={augmentedCareer.id}
        career={augmentedCareer}
      >
        <AddTeamsToTable
          career={augmentedCareer}
          season={targetSeason}
          teamId={screen.teamId}
          teamToEdit={screen.teamToEdit}
          onClose={handleCloseScreen}
        />
      </SeasonThemeProvider>
    );
  }

  if (screen?.key === "addSquadPlayer") {
    const targetSeason = screen.seasonId
      ? (augmentedCareer.clubData.find((s) => s.id === screen.seasonId) ??
        augmentedSeason)
      : augmentedSeason;

    return (
      <SeasonThemeProvider
        careerId={augmentedCareer.id}
        career={augmentedCareer}
      >
        <AddSquad_PlayerScreen
          career={augmentedCareer}
          season={targetSeason}
          playerId={screen.playerId}
          onClose={handleCloseScreen}
        />
      </SeasonThemeProvider>
    );
  }

  if (screen?.key === "transferPlayer") {
    const targetSeason = screen.seasonId
      ? (augmentedCareer.clubData.find((s) => s.id === screen.seasonId) ??
        augmentedSeason)
      : augmentedSeason;

    return (
      <SeasonThemeProvider
        careerId={augmentedCareer.id}
        career={augmentedCareer}
      >
        <TransferPlayer
          career={augmentedCareer}
          season={targetSeason}
          playerId={screen.playerId}
          mode={screen.mode}
          onClose={handleCloseScreen}
        />
      </SeasonThemeProvider>
    );
  }

  if (screen?.key === "addSeasonPlayer") {
    const targetSeason = screen.seasonId
      ? (augmentedCareer.clubData.find((s) => s.id === screen.seasonId) ??
        augmentedSeason)
      : augmentedSeason;

    return (
      <SeasonThemeProvider
        careerId={augmentedCareer.id}
        career={augmentedCareer}
      >
        <AddSeason_Player
          career={augmentedCareer}
          season={targetSeason}
          playerId={screen.playerId}
          onClose={handleCloseScreen}
        />
      </SeasonThemeProvider>
    );
  }

  return (
    <SeasonThemeProvider careerId={augmentedCareer.id} career={augmentedCareer}>
      <HeaderSeason
        careerId={augmentedCareer.id}
        isPlayer={isPlayer}
        career={augmentedCareer}
        season={!title ? augmentedSeason.seasonNumber : undefined}
        titleText={title}
        player={augmentedPlayer}
      />
      <Navbar
        options={tabsConfig.map((tab) => tab.title)}
        activeOption={activeIndex}
        onOptionClick={handleTabClick}
      />
      {ActionButton && (
        <>
          {!notSeason && (
            <ContainerButton className={Styles.container_button}>
              <ActionButton onClick={handleActionButtonClick} />
            </ContainerButton>
          )}
        </>
      )}
      <Swiper
        initialSlide={activeIndex}
        onSwiper={(swiper: SwiperInstance) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
      >
        {tabsConfig.map(({ title, component: TabComponent }) => (
          <SwiperSlide key={title}>
            <div
              className={
                notSeason ? Styles.containerNotSeason : Styles.container
              }
            >
              <TabComponent
                season={augmentedSeason}
                career={augmentedCareer}
                onOpenTransfers={onOpenTransfers}
                isPlayer={isPlayer}
                player={augmentedPlayer}
                onAddBadge={opemAddBadge}
                notSeason={notSeason}
                onOpenScreen={openScreen}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {activeModal !== ModalType.NONE && (
        <ModalManager
          activeModal={activeModal}
          selectedCareer={selectedCareer || augmentedCareer}
          setSelectedCareer={setSelectedCareer}
          selectedSeason={selectedSeason || augmentedSeason}
          onClose={handleCloseModal}
          career={augmentedCareer}
          teamName={teamForBadge}
        />
      )}
    </SeasonThemeProvider>
  );
};

export default SectionView;
