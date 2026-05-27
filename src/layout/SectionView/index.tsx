import { useMemo, useState } from "react";
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

const SectionView = ({
  career,
  season,
  tabsConfig,
  onOpenTransfers,
  title,
  notSeason,
  isPlayer,
  player,
}: {
  career: Career;
  season: ClubData;
  tabsConfig: TabConfig[];
  onOpenTransfers?: (type: "arrivals" | "exit") => void;
  title?: string;
  notSeason?: boolean;
  isPlayer?: boolean;
  player?: Players;
}) => {
  const {
    activeModal,
    openModal,
    closeModal,
    selectedSeason,
    selectedCareer,
    setSelectedCareer,
  } = useModalManager();

  const [teamForBadge, setTeamForBadge] = useState<string>("");

  const opemAddBadge = (teamName: string) => {
    setTeamForBadge(teamName);
    openModal(ModalType.ADD_BADGE_CLUB, augmentedCareer, augmentedSeason);
  };

  const augmentedCareer = useMemo(
    () => augmentCareerWithMatchStats(career),
    [career],
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

  const ActionButton = tabsConfig[activeIndex]?.actionButton;
  const handleActionClick = tabsConfig[activeIndex]?.action;

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
              <ActionButton onClick={handleActionClick} />
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
          onClose={closeModal}
          career={augmentedCareer}
          teamName={teamForBadge}
        />
      )}
    </SeasonThemeProvider>
  );
};

export default SectionView;
