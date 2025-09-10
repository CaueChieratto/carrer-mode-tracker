import { ReactNode, useEffect, useRef } from "react";
import classnames from "classnames";
import Styles from "./Modal.module.css";
import { MdOutlineClose } from "react-icons/md";
import ContainerIcon from "../ContainerIcon";
import { useModalAnimation } from "../../common/hooks/Modal/UseModalAnimation";

type ModalProps = {
  isOpen: boolean;
  text: string;
  goBack?: () => void;
  children: ReactNode;
  animationContainer?: "normal" | "left" | "right" | "grow";
  slideUp?: boolean;
  closeModal: () => void;
  clubColor?: string;
};

const Modal = ({
  isOpen,
  text,
  goBack,
  closeModal,
  animationContainer = "normal",
  children,
  slideUp,
  clubColor,
}: ModalProps) => {
  const {
    visible,
    closing,
    translateY,
    close,
    onDragStart,
    onDragMove,
    onDragEnd,
    dragging,
  } = useModalAnimation(isOpen, closeModal);

  const dragHandleRef = useRef<HTMLDivElement>(null);

  const handleClose = goBack ?? close;

  useEffect(() => {
    const handle = dragHandleRef.current;
    if (!handle) return;
    const handleTouchMove = (e: TouchEvent) => {
      onDragMove(e);
    };
    handle.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      handle.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onDragMove, visible]);

  if (!visible) return null;

  const dragHandlers = slideUp
    ? {
        onMouseDown: onDragStart,
        onTouchStart: onDragStart,
        onMouseUp: onDragEnd,
        onMouseLeave: onDragEnd,
        onTouchEnd: onDragEnd,
        onTouchCancel: onDragEnd,
      }
    : {};

  return (
    <div
      className={classnames(
        !slideUp
          ? [
              Styles.overlay,
              Styles[animationContainer],
              animationContainer === "left" && closing && Styles.closingLeft,
              animationContainer === "right" && closing && Styles.closingRight,
              animationContainer === "grow" && closing && Styles.closingGrow,
            ]
          : Styles.slide_up_overlay
      )}
      onClick={handleClose}
    >
      <div
        className={!slideUp ? Styles.card_modal : Styles.slide_up_card}
        onClick={(e) => e.stopPropagation()}
        style={
          slideUp
            ? {
                transform: `translateY(${translateY}px)`,
                transition: dragging.current ? "none" : "transform 0.3s ease",
              }
            : undefined
        }
      >
        {!slideUp ? (
          <header className={Styles.container_title}>
            <h1
              className={Styles.h1}
              style={clubColor ? { color: clubColor } : undefined}
            >
              {text}
            </h1>
            <ContainerIcon className={Styles.icon} onClick={handleClose}>
              <MdOutlineClose
                size={20}
                style={clubColor ? { color: clubColor } : undefined}
              />
            </ContainerIcon>
          </header>
        ) : (
          <div
            className={Styles.header_slide_up_card}
            {...dragHandlers}
            ref={dragHandleRef}
          >
            <div className={Styles.bar}></div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
