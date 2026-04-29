import { useSeasonTheme } from "../../../../common/hooks/Seasons/UseSeasonTheme";
import Button from "../../../Button";
import Styles from "./ButtonsSwitch.module.css";
import { MatchStatus } from "../../types/MatchStatus";
import CustomSelect from "../../../CustomSelect";

interface ButtonsSwitchProps {
  activeTab: MatchStatus | string;
  setActiveTab: (tab: MatchStatus | string) => void;
  months: string[];
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
}

const TABS = [
  { value: "SCHEDULED", label: "Calendário" },
  { value: "FINISHED", label: "Resultados" },
];

export const ButtonsSwitch = ({
  activeTab,
  months,
  selectedMonth,
  setActiveTab,
  setSelectedMonth,
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
      <div className="swiper-no-swiping" style={{ width: "100%" }}>
        <CustomSelect
          name="monthFilter"
          options={months}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          placeholder="Filtrar por mês"
        />
      </div>
    </div>
  );
};
