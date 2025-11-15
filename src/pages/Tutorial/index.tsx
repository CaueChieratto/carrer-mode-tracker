import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Styles from "./Tutorial.module.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { tutorialContent } from "../../common/constants/TutorialContent";
import { MdOutlineClose } from "react-icons/md";
import ContainerIcon from "../../components/ContainerIcon";

const Tutorial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={Styles.container}>
      <ContainerIcon className={Styles.closeButton} onClick={handleGoBack}>
        <MdOutlineClose size={22} />
      </ContainerIcon>

      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {tutorialContent.map(({ title, text }, index) => (
          <SwiperSlide key={index}>
            <div className={Styles.slide}>
              <h1 className={Styles.h1}>{title}</h1>
              <p className={Styles.p}>{text}</p>
            </div>
          </SwiperSlide>
        ))}

        <SwiperSlide>
          <div className={Styles.slide}>
            <h1 className={Styles.h1}>Fim do Tutorial</h1>
            <p className={Styles.p}>
              Você concluiu o tutorial. Clique no botão abaixo para voltar.
            </p>
            <Button
              isActive
              fontSize="large"
              fontWeight="bold"
              onClick={handleGoBack}
              style={{ marginTop: "20px" }}
            >
              Voltar
            </Button>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className={Styles.dots}>
        {[...Array(tutorialContent.length + 1).keys()].map((index) => (
          <div
            key={index}
            className={`${Styles.dot} ${
              activeIndex === index ? Styles.active : ""
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Tutorial;
