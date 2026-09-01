import { useCallback, useRef, useState } from "react";
import { MatchScreen } from "../../config/screens";

type SaveHandler = () => Promise<void> | void;

interface MatchTabActionConfig {
  action?: () => void;
  screen?: MatchScreen;
}

interface UseMatchTabActionParams {
  activeTab?: MatchTabActionConfig;
  openScreen: (screen: MatchScreen) => void;
}

interface UseMatchTabActionResult {
  isActionLoading: boolean;
  registerSave: (saveHandler: SaveHandler) => void;
  handleActionClick: () => Promise<void>;
}

export const useMatchTabAction = ({
  activeTab,
  openScreen,
}: UseMatchTabActionParams): UseMatchTabActionResult => {
  const saveHandlerRef = useRef<SaveHandler | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const registerSave = useCallback((saveHandler: SaveHandler) => {
    saveHandlerRef.current = saveHandler;
  }, []);

  const handleActionClick = useCallback(async () => {
    if (activeTab?.screen) {
      openScreen(activeTab.screen);
      return;
    }

    if (activeTab?.action) {
      activeTab.action();
      return;
    }

    const saveHandler = saveHandlerRef.current;

    if (!saveHandler) {
      return;
    }

    setIsActionLoading(true);

    try {
      await saveHandler();
    } finally {
      setIsActionLoading(false);
    }
  }, [activeTab, openScreen]);

  return {
    isActionLoading,
    registerSave,
    handleActionClick,
  };
};
