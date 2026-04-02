import { useSeasonTheme } from "../../../../common/hooks/Seasons/UseSeasonTheme";
import Button from "../../../Button";
import Styles from "./ButtonsSwitch.module.css";
import { MatchStatus } from "../../types/MatchStatus";

interface ButtonsSwitchProps {
  activeTab: MatchStatus | string;
  setActiveTab: (tab: MatchStatus | string) => void;
}

const TABS = [
  { value: "SCHEDULED", label: "Calendário" },
  { value: "FINISHED", label: "Resultados" },
];

export const ButtonsSwitch = ({
  activeTab,
  setActiveTab,
}: ButtonsSwitchProps) => {
  const { clubColor } = useSeasonTheme();

  const getButtonStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? clubColor : "#f0f0f0",
    color: isActive ? "#fff" : "#555",
    border: isActive ? `1px solid ${clubColor}` : "1px solid #ccc",
  });

  return (
    <div className={Styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <Button
            key={tab.value}
            className={`${Styles.button} ${isActive ? Styles.active : ""}`}
            onClick={() => setActiveTab(tab.value)}
            style={getButtonStyle(isActive)}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};
