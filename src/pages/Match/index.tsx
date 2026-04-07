import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import Load from "../../components/Load";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { useSeasonData } from "../../common/hooks/Seasons/UseSeasonData";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import Navbar from "../../ui/Navbar";
import HeaderSeason from "../../components/HeaderSeason";
import { getMatchTabsConfig } from "./constants/MatchTabsConfig";
import { useTabView } from "../../common/hooks/UseTabView";
import Styles from "./Match.module.css";
import ContainerButton from "../../components/ContainerButton";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";
import { ModalType } from "../../common/types/enums/ModalType";
import BottomMenu from "../../ui/BottomMenu";
import { useRef, useState } from "react";

export const Match = () => {
  const { careerId, seasonId, matchesId } = useParams<{
    careerId: string;
    seasonId: string;
    matchesId: string;
  }>();

  const navigate = useNavigate();
  const { activeModal } = useModalManager();

  const saveLineupRef = useRef<(() => Promise<void> | void) | null>(null);

  const [isActionLoading, setIsActionLoading] = useState(false);

  const { career, season, loading } = useSeasonData(careerId, seasonId);
  const match = season?.matches?.find((m) => m.matchesId === matchesId);

  const storageKey = `match-tab-${careerId}-${matchesId}`;
  const tabsConfig = getMatchTabsConfig();

  const { activeIndex, swiperRef, handleTabClick, handleSlideChange } =
    useTabView(storageKey);

  const back = () => {
    navigate(`/Career/${careerId}/Season/${seasonId}`);
  };

  if (loading || isActionLoading) return <Load />;
  if (!career || !season || !match) return <NotFoundDisplay />;

  const ActionButton = tabsConfig[activeIndex]?.actionButton;

  const actionClick = async () => {
    if (saveLineupRef.current) {
      setIsActionLoading(true);
      try {
        await saveLineupRef.current();
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  console.log(career);

  return (
    <SeasonThemeProvider careerId={career.id} career={career}>
      <HeaderSeason careerId={career.id} career={career} backSeasons={back} />
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
