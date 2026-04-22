import { useRef, useState } from "react";
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
  } = useMatchData();
  const navigate = useNavigate();

  const { activeModal } = useModalManager();
  const [isActionLoading, setIsActionLoading] = useState(false);

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

  if (loading || isActionLoading) return <Load />;
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

  return (
    <SeasonThemeProvider careerId={career.id} career={career}>
      <HeaderSeason
        match={match}
        careerId={career.id}
        career={career}
        backSeasons={goBack}
        titleText={`${match.homeTeam} x ${match.awayTeam}`}
      />
      <Navbar
        options={tabsConfig.map((tab) => tab.title)}
        activeOption={activeIndex}
        onOptionClick={handleTabClick}
      />

      {ActionButton && (
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
                onRegisterSave={(fn) => {
                  saveLineupRef.current = fn;
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {activeModal === ModalType.NONE && <BottomMenu />}
    </SeasonThemeProvider>
  );
};
