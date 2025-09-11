import { useState, useRef, useEffect } from "react";

export const useModalAnimation = (
  isOpen: boolean,
  onCloseCallback?: () => void
) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [translateY, setTranslateY] = useState(0);

  const lastScrollRef = useRef(0);
  const startY = useRef<number | null>(null);
  const currentTranslateY = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    if (isOpen) {
      lastScrollRef.current = window.scrollY;
      document.body.classList.add("modal-open");

      setVisible(true);
      setTranslateY(0);
      setClosing(false);

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
    }
  }, [isOpen]);

  const close = () => {
    window.scrollTo({ top: lastScrollRef.current });
    document.body.classList.remove("modal-open");

    setClosing(true);

    setTimeout(() => {
      setVisible(false);
      if (onCloseCallback) onCloseCallback();
    }, 300);
  };

  const onDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    dragging.current = true;
    startY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
  };

  const onDragMove = (
    e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent
  ) => {
    if (!dragging.current || startY.current === null) return;

    e.preventDefault();

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startY.current;

    if (deltaY < 0) return;

    setTranslateY(currentTranslateY.current + deltaY);
  };

  const onDragEnd = () => {
    dragging.current = false;
    currentTranslateY.current = translateY;

    if (translateY > 150) {
      close();
    } else {
      setTranslateY(0);
      currentTranslateY.current = 0;
    }
  };

  return {
    visible,
    closing,
    translateY,
    close,
    onDragStart,
    onDragMove,
    onDragEnd,
    dragging,
  };
};
