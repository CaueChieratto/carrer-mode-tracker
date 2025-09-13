import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Styles from "./Welcome.module.css";
import Login from "../../ui/Login";
import { slidesContent } from "../../common/constants/SlidesContent";

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
