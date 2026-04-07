import { useState, useRef, useEffect } from "react";
import { UseRatingColor } from "../../../../../../../../common/hooks/Colors/GetOverallColor";
import { LineupSlot } from "../../../../hooks/useLineup";
import Styles from "./SlotButton.module.css";

type SlotButtonProps = {
  slot: LineupSlot;
  isSelecting: boolean;
  onOpen: () => void;
  onRemove: () => void;
  onSwap: (targetId: string) => void;
};

export const SlotButton = ({
  slot,
  isSelecting,
  onOpen,
  onRemove,
  onSwap,
}: SlotButtonProps) => {
  const backgroundColor = UseRatingColor(7.3);

  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const wasDraggedRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    if (
      (e.target as HTMLElement).tagName === "BUTTON" &&
      (e.target as HTMLElement).className.includes("slot_remove")
    )
      return;
    if (e.button !== 0 && e.pointerType === "mouse") return;

    startPosRef.current = { x: e.clientX, y: e.clientY };

    timerRef.current = setTimeout(() => {
      setIsDragging(true);
      setDragPos({ x: e.clientX, y: e.clientY });
      if (navigator.vibrate) navigator.vibrate(50);
      document.body.style.overflow = "hidden";
    }, 300);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging && timerRef.current) {
      const dx = Math.abs(e.clientX - startPosRef.current.x);
      const dy = Math.abs(e.clientY - startPosRef.current.y);
      if (dx > 10 || dy > 10) clearTimer();
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMove = (e: PointerEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY });
    };

    const handleGlobalUp = (e: PointerEvent) => {
      setIsDragging(false);
      wasDraggedRef.current = true;
      document.body.style.overflow = "";

      const elUnder = document.elementFromPoint(e.clientX, e.clientY);
      const targetSlot = elUnder?.closest("[data-slot-id]");

      if (targetSlot) {
        const targetId = targetSlot.getAttribute("data-slot-id");
        if (targetId && targetId !== slot.slotId) {
          onSwap(targetId);
        }
      }

      setTimeout(() => {
        wasDraggedRef.current = false;
      }, 100);
    };

    window.addEventListener("pointermove", handleGlobalMove);
    window.addEventListener("pointerup", handleGlobalUp);
    window.addEventListener("pointercancel", handleGlobalUp);

    return () => {
      window.removeEventListener("pointermove", handleGlobalMove);
      window.removeEventListener("pointerup", handleGlobalUp);
      window.removeEventListener("pointercancel", handleGlobalUp);
    };
  }, [isDragging, slot.slotId, onSwap]);

  const handleClick = (e: React.MouseEvent) => {
    if (wasDraggedRef.current) {
      e.preventDefault();
      return;
    }
    onOpen();
  };

  if (slot.player) {
    return (
      <>
        <div
          data-slot-id={slot.slotId}
          className={`${Styles.slot_filled} swiper-no-swiping`}
          style={{ opacity: isDragging ? 0.3 : 1 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={clearTimer}
          onPointerLeave={clearTimer}
          onClick={handleClick}
        >
          <button
            className={Styles.slot_remove}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            type="button"
          >
            ×
          </button>
          <div className={Styles.slot_label}>
            <span className={Styles.slot_shirt_number}>
              {slot.player.shirtNumber}
            </span>
            <span className={Styles.slot_name}>{slot.player.name}</span>
          </div>
          <div
            className={Styles.wrapper}
            style={{ backgroundColor: backgroundColor }}
          >
            <span className={Styles.rating}>7.3</span>
          </div>
        </div>

        {isDragging && (
          <div
            className={Styles.slot_filled}
            style={{
              position: "fixed",
              left: dragPos.x,
              top: dragPos.y,
              transform: "translate(-50%, -50%) scale(1.1)",
              pointerEvents: "none",
              zIndex: 9999,
              opacity: 0.9,
            }}
          >
            <div className={Styles.slot_label}>
              <span className={Styles.slot_shirt_number}>
                {slot.player.shirtNumber}
              </span>
              <span className={Styles.slot_name}>{slot.player.name}</span>
            </div>
            <div
              className={Styles.wrapper}
              style={{ backgroundColor: backgroundColor }}
            >
              <span className={Styles.rating}>7.3</span>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      data-slot-id={slot.slotId}
      className={`${Styles.slot_empty} ${isSelecting ? Styles.slot_active : ""} swiper-no-swiping`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      onClick={handleClick}
      type="button"
    >
      <span className={Styles.slot_plus}>+</span>
    </button>
  );
};
