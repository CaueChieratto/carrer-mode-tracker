import { useMemo } from "react";
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
import { TabConfig } from "./constants/SeasonTabsConfig";
import {
  augmentCareerWithMatchStats,
  getAggregatedPlayersForCareer,
} from "./helpers/mergeMatchStats";

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
      return aggregatedPlayers.find((p) => p.id === player.id);
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
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </SeasonThemeProvider>
  );
};

export default SectionView;
