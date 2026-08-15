import { useRef, useCallback } from "react";
import { Career } from "../../../../../../common/interfaces/Career";

type DragStartData = {
  element: EventTarget & HTMLElement;
  clientX: number;
  clientY: number;
  pointerId: number;
};

type UseLongPressDragProps = {
  onDragStart?: (data: DragStartData, career: Career) => void;
  selectedCareer: Career;
};

export const useLongPressDrag = ({
  onDragStart,
  selectedCareer,
}: UseLongPressDragProps) => {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const cancelPress = useCallback(() => {
    startPos.current = null;
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const element = e.currentTarget;
      const clientX = e.clientX;
      const clientY = e.clientY;
      const pointerId = e.pointerId;

      startPos.current = { x: clientX, y: clientY };
      pressTimer.current = setTimeout(() => {
        if (onDragStart) {
          onDragStart({ element, clientX, clientY, pointerId }, selectedCareer);
        }
      }, 300);
    },
    [onDragStart, selectedCareer],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (startPos.current) {
        const dx = Math.abs(e.clientX - startPos.current.x);
        const dy = Math.abs(e.clientY - startPos.current.y);
        if (dx > 10 || dy > 10) cancelPress();
      }
    },
    [cancelPress],
  );

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: cancelPress,
    onPointerLeave: cancelPress,
    onPointerCancel: cancelPress,
    onPointerMove: handlePointerMove,
  };
};
