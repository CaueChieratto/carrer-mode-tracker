import { useState, useRef, useEffect } from "react";

export const useEntityWorkspace = <T extends { id: string }>(
  entity: T | null,
  keepOpenState?: string,
) => {
  const storageKey = entity ? `@workspace_active_${entity.id}` : null;
  const [activeComponent, setActiveComponent] = useState<string | null>(() => {
    if (storageKey) {
      return localStorage.getItem(storageKey);
    }
    return null;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const activeContentRef = useRef<HTMLDivElement>(null);
  const prevEntityIdRef = useRef<string | null>(entity ? entity.id : null);

  useEffect(() => {
    if (storageKey) {
      if (activeComponent) {
        localStorage.setItem(storageKey, activeComponent);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }, [activeComponent, storageKey]);

  useEffect(() => {
    return () => {
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
    };
  }, [storageKey]);

  useEffect(() => {
    const currentId = entity ? entity.id : null;
    if (entity) {
      if (
        prevEntityIdRef.current !== null &&
        currentId !== prevEntityIdRef.current
      ) {
        setActiveComponent((prevComponent) => {
          if (prevComponent === keepOpenState) return prevComponent;
          return null;
        });
      }
    }
    prevEntityIdRef.current = currentId;
  }, [entity, keepOpenState]);

  useEffect(() => {
    if (activeComponent) {
      setTimeout(() => {
        const element = activeContentRef.current;
        if (element) {
          const offset = 13;
          const top =
            element.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 150);
    } else if (entity) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeComponent, entity]);

  return {
    activeComponent,
    setActiveComponent,
    containerRef,
    activeContentRef,
  };
};
