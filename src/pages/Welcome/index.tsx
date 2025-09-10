import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Styles from "./Welcome.module.css";
import Login from "../../ui/Login";

const slidesContent = [
  {
    title: "Bem-vindo!",
    text: `Perfeitamente criado para os apaixonados pelo modo carreira, esse
           app transforma a forma como você acompanha estatísticas,
           transferências, troféus e muito mais da sua equipe!`,
  },
  {
    title: "Por Onde Começar?",
    text: `Replique sua carreira no EAFC e comece a inserir todos os detalhes
           manualmente para dar vida à sua jornada!`,
  },
  {
    title: "Uma Interface Que Você Vai Adorar!",
    text: `Um design fluido e inteligente que torna o gerenciamento da sua
           carreira algo simples e intuitivo`,
  },
];

const Welcome = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={Styles.container}>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {slidesContent.map(({ title, text }, index) => (
          <SwiperSlide key={index}>
            <div className={Styles.slide}>
              <h1 className={Styles.h1}>{title}</h1>
              <p className={Styles.p}>{text}</p>
            </div>
          </SwiperSlide>
        ))}

        <SwiperSlide>
          <Login />
        </SwiperSlide>
      </Swiper>

      <div className={Styles.dots}>
        {[...Array(slidesContent.length + 1).keys()].map((index) => (
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

export default Welcome;
