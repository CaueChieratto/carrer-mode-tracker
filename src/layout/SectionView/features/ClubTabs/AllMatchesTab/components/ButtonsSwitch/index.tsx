import { useSeasonTheme } from "../../../../../../../common/hooks/Seasons/UseSeasonTheme";
import Button from "../../../../../../../components/Button";
import Styles from "./ButtonsSwitch.module.css";
import { MatchStatus } from "../../types/MatchStatus";
import CustomSelect from "../../../../../../../components/CustomSelect";
import { IoCopyOutline } from "react-icons/io5";

type ButtonsSwitchProps = {
  activeTab?: MatchStatus | string;
  setActiveTab?: (tab: MatchStatus | string) => void;
  selectOptions: string[];
  selectValue: string;
  onSelectChange: (value: string) => void;
  seasonOptions?: string[];
  seasonValue?: string;
  onSeasonChange?: (value: string) => void;
  isMatches?: boolean;
  isGeralPage?: boolean;
  onClickCopy?: () => void;
};

const TABS = [
  { value: "SCHEDULED", label: "Calendário" },
  { value: "FINISHED", label: "Resultados" },
];

export const ButtonsSwitch = ({
  activeTab,
  setActiveTab,
  selectOptions,
  selectValue,
  onSelectChange,
  isMatches,
  isGeralPage,
  onClickCopy,
  seasonOptions,
  seasonValue,
  onSeasonChange,
}: ButtonsSwitchProps) => {
  const { clubColor } = useSeasonTheme();

  const getButtonStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? clubColor : "#f0f0f0",
    color: isActive ? "#fff" : "#555",
    border: isActive ? `1px solid ${clubColor}` : "1px solid #ccc",
  });

  return (
    <div className={Styles.container}>
      {isMatches && setActiveTab && !isGeralPage && (
        <>
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
        </>
      )}

      {isGeralPage && seasonOptions && onSeasonChange && (
        <div
          className="swiper-no-swiping"
          style={{ width: "100%", maxHeight: "48px" }}
        >
          <CustomSelect
            name="seasonFilter"
            options={seasonOptions}
            value={seasonValue || ""}
            onChange={(e) => onSeasonChange(e.target.value)}
          />
        </div>
      )}

      <div
        className="swiper-no-swiping"
        style={{ width: "100%", maxHeight: "48px" }}
      >
        <CustomSelect
          name="monthFilter"
          options={selectOptions}
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value)}
        />
      </div>

      {!isMatches && (
        <Button
          className={Styles.button}
          style={{
            backgroundColor: clubColor,
            color: "#fff",
            border: `1px solid ${clubColor}`,
            minWidth: "70px",
          }}
          onClick={onClickCopy}
        >
          <IoCopyOutline />
        </Button>
      )}
    </div>
  );
};
