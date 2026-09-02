import { useCallback, useRef, useState } from "react";

export function useScreenStack<T>() {
  const [stack, setStack] = useState<T[]>([]);
  const scrollPositions = useRef<number[]>([]);

  const scrollAfterRender = (top: number) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top,
          left: 0,
          behavior: "instant",
        });
      });
    });
  };

  const push = useCallback((screen: T) => {
    scrollPositions.current.push(window.scrollY);

    setStack((prev) => [...prev, screen]);

    scrollAfterRender(0);
  }, []);

  const pop = useCallback(() => {
    const lastScroll = scrollPositions.current.pop() ?? 0;

    setStack((prev) => prev.slice(0, -1));

    scrollAfterRender(lastScroll);
  }, []);

  const reset = useCallback(() => {
    setStack([]);
    scrollPositions.current = [];

    scrollAfterRender(0);
  }, []);

  return {
    current: stack[stack.length - 1] ?? null,
    stack,
    push,
    pop,
    reset,
  };
}
