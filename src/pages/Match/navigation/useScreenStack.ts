import { useCallback, useState } from "react";

export function useScreenStack<T>() {
  const [stack, setStack] = useState<T[]>([]);

  const push = useCallback((screen: T) => {
    setStack((prev) => [...prev, screen]);
  }, []);

  const pop = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const reset = useCallback(() => setStack([]), []);

  return { current: stack[stack.length - 1] ?? null, stack, push, pop, reset };
}
