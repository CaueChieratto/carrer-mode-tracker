import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import Load from "../../components/Load";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import Navbar from "../../ui/Navbar";
import HeaderSeason from "../../components/HeaderSeason";
import ContainerButton from "../../components/ContainerButton";
import BottomMenu from "../../ui/BottomMenu";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";
import { useTabView } from "../../common/hooks/UseTabView";
import { ModalType } from "../../common/types/enums/ModalType";
import { getMatchTabsConfig } from "./constants/MatchTabsConfig";
import { useMatchData } from "./hooks/useMatchData";
import Styles from "./Match.module.css";
import { useNavigate } from "react-router-dom";
import { PlayerMatchModal } from "./components/LineupTab/components/PlayerMatchModal";

export const Match = () => {
  const {
    careerId,
    seasonId,
    matchesId,
    career,
    season,
    match,
    loading,
    goBack,
    isFromGeral,
  } = useMatchData();
  const navigate = useNavigate();

  const { activeModal } = useModalManager();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [modalPlayerId, setModalPlayerId] = useState<string | null>(null);

  const saveLineupRef = useRef<(() => Promise<void> | void) | null>(null);

  const storageKey = `match-tab-${careerId}-${matchesId}`;

  const tabsConfig = getMatchTabsConfig(
    careerId as string,
    seasonId as string,
    matchesId as string,
    navigate,
  );

  const { activeIndex, swiperRef, handleTabClick, handleSlideChange } =
    useTabView(storageKey);

  const registerSave = useCallback((fn: () => Promise<void> | void) => {
    saveLineupRef.current = fn;
  }, []);

  if (loading) return <Load />;
  if (!career || !season || !match) return <NotFoundDisplay />;

  const ActionButton = tabsConfig[activeIndex]?.actionButton;
  const tabAction = tabsConfig[activeIndex]?.action;

  const actionClick = async () => {
    if (tabAction) {
      tabAction();
      return;
    }

    if (saveLineupRef.current) {
      setIsActionLoading(true);
      try {
        await saveLineupRef.current();
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const selectedPlayer = modalPlayerId
    ? season.players.find((p) => p.id === modalPlayerId)
    : null;

  return (
    <>
      {isActionLoading && <Load isTransfers />}
      <SeasonThemeProvider careerId={career.id} career={career}>
        <HeaderSeason
          match={match}
          careerId={career.id}
          career={career}
          backSeasons={goBack}
          titleTextMatch={`${match.homeTeam} x ${match.awayTeam}`}
        />
        <Navbar
          options={tabsConfig.map((tab) => tab.title)}
          activeOption={activeIndex}
          onOptionClick={handleTabClick}
        />

        {modalPlayerId && (
          <PlayerMatchModal
            isOpen={!!modalPlayerId}
            closeModal={() => setModalPlayerId(null)}
            match={match}
            player={selectedPlayer}
          />
        )}

        {ActionButton && !isFromGeral && (
          <ContainerButton className={Styles.container_button}>
            <ActionButton onClick={actionClick} />
          </ContainerButton>
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
              <div className={Styles.container}>
                <TabComponent
                  match={match}
                  season={season}
                  career={career}
                  isFromGeral={isFromGeral}
                  onRegisterSave={registerSave}
                  onOpenPlayerModal={setModalPlayerId}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {activeModal === ModalType.NONE && <BottomMenu noHavePlayers />}
      </SeasonThemeProvider>
    </>
  );
};
