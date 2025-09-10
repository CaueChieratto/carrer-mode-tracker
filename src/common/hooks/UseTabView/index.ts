import { useState, useRef, useEffect } from "react";
import type { Swiper as SwiperClass } from "swiper";

export const useTabView = (storageKey: string) => {
  const getInitialIndex = () => {
    const savedIndex = sessionStorage.getItem(storageKey);
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  };

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    sessionStorage.setItem(storageKey, activeIndex.toString());
  }, [activeIndex, storageKey]);

  const handleTabClick = (index: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveIndex(index);
    swiperRef.current?.slideTo(index);
  };

  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveIndex(swiper.activeIndex);
  };

  return { activeIndex, swiperRef, handleTabClick, handleSlideChange };
};
