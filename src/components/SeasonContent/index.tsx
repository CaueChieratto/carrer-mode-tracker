import { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { TabConfig } from "../../common/constants/SeasonTabsConfig";
import { useTabView } from "../../common/hooks/UseTabView";
import { Career } from "../../common/interfaces/Career";
import { ClubData } from "../../common/interfaces/club/clubData";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import Navbar from "../../ui/Navbar";
import ContainerButton from "../ContainerButton";
import HeaderSeason from "../HeaderSeason";
import Styles from "./SeasonContent.module.css";

const SeasonContent = ({
  career,
  season,
  tabsConfig,
  onOpenTransfers,
}: {
  career: Career;
  season: ClubData;
  tabsConfig: TabConfig[];
  onOpenTransfers: (type: "arrivals" | "exit") => void;
}) => {
  const storageKey = `season-tab-${career.id}-${season.id}`;
  const { activeIndex, swiperRef, handleTabClick, handleSlideChange } =
    useTabView(storageKey);
  const ActionButton = tabsConfig[activeIndex]?.actionButton;
  const handleActionClick = tabsConfig[activeIndex]?.action;

  console.log(career);

  return (
    <SeasonThemeProvider careerId={career.id} career={career}>
      <HeaderSeason
        career={career}
        careerId={career.id}
        season={season.seasonNumber}
      />
      <Navbar
        options={tabsConfig.map((tab) => tab.title)}
        activeOption={activeIndex}
        onOptionClick={handleTabClick}
      />
      {ActionButton && (
        <ContainerButton className={Styles.container_button}>
          <ActionButton onClick={handleActionClick} />
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
              <TabComponent season={season} onOpenTransfers={onOpenTransfers} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </SeasonThemeProvider>
  );
};

export default SeasonContent;
