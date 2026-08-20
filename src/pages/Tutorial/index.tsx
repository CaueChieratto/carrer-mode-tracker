import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Styles from "./Tutorial.module.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { tutorialSections } from "./constants/TutorialContent";
import { MdOutlineClose, MdArrowBack } from "react-icons/md";
import ContainerIcon from "../../components/ContainerIcon";
import { IoBookOutline } from "react-icons/io5";
import { CardsModal } from "../../ui/modals/SeasonConfigs/components/CardsModal";
import { sectionIcons } from "./constants/SectionIcons";

const Tutorial = () => {
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const closeSection = () => {
    setActiveSectionIndex(null);
    setActiveIndex(0);
  };

  return (
    <div className={Styles.container}>
      <ContainerIcon
        className={Styles.closeButton}
        onClick={activeSectionIndex !== null ? closeSection : handleGoBack}
      >
        {activeSectionIndex !== null ? (
          <MdArrowBack size={22} />
        ) : (
          <MdOutlineClose size={22} />
        )}
      </ContainerIcon>

      {activeSectionIndex === null ? (
        <div className={Styles.grid}>
          {tutorialSections.map((section, index) => (
            <CardsModal
              key={index}
              icon={
                sectionIcons[index] || <IoBookOutline className={Styles.icon} />
              }
              label="Tutorial"
              title={section.sectionTitle}
              onClick={() => setActiveSectionIndex(index)}
              clubColor="#ffffff"
              darkClubColor="#333333"
            />
          ))}
        </div>
      ) : (
        <>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {tutorialSections[activeSectionIndex].slides.map(
              ({ title, text }, index) => (
                <SwiperSlide key={index}>
                  <div className={Styles.slide}>
                    <h1 className={Styles.h1}>{title}</h1>
                    <p className={Styles.p}>{text}</p>
                  </div>
                </SwiperSlide>
              ),
            )}

            <SwiperSlide>
              <div className={Styles.slide}>
                <h1 className={Styles.h1}>Fim da Seção</h1>
                <p className={Styles.p}>
                  Você concluiu os passos sobre{" "}
                  <strong>
                    {tutorialSections[activeSectionIndex].sectionTitle}
                  </strong>
                  .
                </p>
                <Button
                  isActive
                  fontSize="large"
                  fontWeight="bold"
                  onClick={closeSection}
                  style={{ marginTop: "20px" }}
                >
                  Voltar ao Menu
                </Button>
              </div>
            </SwiperSlide>
          </Swiper>

          <div className={Styles.dots}>
            {[
              ...Array(
                tutorialSections[activeSectionIndex].slides.length + 1,
              ).keys(),
            ].map((index) => (
              <div
                key={index}
                className={`${Styles.dot} ${
                  activeIndex === index ? Styles.active : ""
                }`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Tutorial;
