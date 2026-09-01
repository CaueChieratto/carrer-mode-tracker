import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import BottomMenu from "../../ui/BottomMenu";
import Navbar from "../../ui/Navbar";
import ContainerButton from "../../components/ContainerButton";
import HeaderSeason from "../../components/HeaderSeason";
import Load from "../../components/Load";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import { PlayerMatchModal } from "./components/LineupTab/components/PlayerMatchModal";
import { MatchScreenRouter } from "./routes/MatchScreenRouter";
import { useMatchPageController } from "./hooks/useMatchPageController";
import Styles from "./Match.module.css";

export const Match = () => {
  const controller = useMatchPageController();

  const {
    career,
    season,
    match,
    loading,
    goBack,
    isFromGeral,
    updateLocalMatch,
  } = controller.data;

  if (loading) {
    return <Load />;
  }

  if (!career || !season || !match) {
    return <NotFoundDisplay />;
  }

  const ActionButton = controller.action.button;

  return (
    <MatchScreenRouter
      screen={controller.navigation.screen}
      career={career}
      season={season}
      match={match}
      onClose={controller.navigation.close}
      onSaved={updateLocalMatch}
    >
      <>
        {controller.action.isLoading && <Load isTransfers />}

        <SeasonThemeProvider careerId={career.id} career={career}>
          <HeaderSeason
            match={match}
            careerId={career.id}
            career={career}
            backSeasons={goBack}
            titleTextMatch={`${match.homeTeam} x ${match.awayTeam}`}
          />

          <Navbar
            options={controller.tabs.titles}
            activeOption={controller.tabs.activeIndex}
            onOptionClick={controller.tabs.handleTabClick}
          />

          {controller.playerModal.isOpen && (
            <PlayerMatchModal
              isOpen
              closeModal={controller.playerModal.close}
              match={match}
              player={controller.playerModal.player}
            />
          )}

          {ActionButton && !isFromGeral && (
            <ContainerButton className={Styles.container_button}>
              <ActionButton onClick={controller.action.execute} />
            </ContainerButton>
          )}

          <Swiper
            initialSlide={controller.tabs.activeIndex}
            onSwiper={(swiper: SwiperInstance) => {
              controller.tabs.swiperRef.current = swiper;
            }}
            onSlideChange={controller.tabs.handleSlideChange}
          >
            {controller.tabs.config.map(
              ({ title, component: TabComponent }) => (
                <SwiperSlide key={title}>
                  <div className={Styles.container}>
                    <TabComponent
                      match={match}
                      season={season}
                      career={career}
                      isFromGeral={isFromGeral}
                      onRegisterSave={controller.action.registerSave}
                      onOpenPlayerModal={controller.playerModal.open}
                      onOpenScreen={controller.navigation.open}
                      onSaved={updateLocalMatch}
                    />
                  </div>
                </SwiperSlide>
              ),
            )}
          </Swiper>

          {controller.shouldShowBottomMenu && <BottomMenu noHavePlayers />}
        </SeasonThemeProvider>
      </>
    </MatchScreenRouter>
  );
};
