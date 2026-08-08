import { useSeasonTheme } from "../../common/hooks/Seasons/UseSeasonTheme";
import Button from "../Button";
import Styles from "./ButtonsSwitch.module.css";
import { MatchStatus } from "../../common/interfaces/MatchStatus";
import CustomSelect from "../CustomSelect";
import { IoCopyOutline } from "react-icons/io5";

type ButtonsSwitchProps = {
  activeTab?: MatchStatus | string;
  setActiveTab?: (tab: MatchStatus | string) => void;
  selectOptions?: string[];
  selectValue?: string;
  onSelectChange?: (value: string) => void;
  seasonOptions?: string[];
  seasonValue?: string;
  onSeasonChange?: (value: string) => void;
  isMatches?: boolean;
  isGeralPage?: boolean;
  isAcademy?: boolean;
  onClickCopy?: () => void;
  customTabs?: { value: string; label: string }[];
  disableThemeHook?: boolean;
};

const ButtonsSwitchBase = ({
  activeTab,
  setActiveTab,
  selectOptions,
  selectValue,
  onSelectChange,
  isMatches,
  isGeralPage,
  isAcademy,
  onClickCopy,
  seasonOptions,
  seasonValue,
  onSeasonChange,
  customTabs,
  clubColor,
}: ButtonsSwitchProps & { clubColor: string }) => {
  const getButtonStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? clubColor : "#f0f0f0",
    color: isActive ? "#fff" : "#555",
    border: isActive ? `1px solid ${clubColor}` : "1px solid #ccc",
  });

  const tabsToRender = customTabs || [
    { value: "SCHEDULED", label: "Calendário" },
    { value: "FINISHED", label: "Resultados" },
  ];

  return (
    <div className={isAcademy ? Styles.container_academy : Styles.container}>
      {isMatches && setActiveTab && !isGeralPage && (
        <>
          {tabsToRender.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <Button
                key={tab.value}
                className={`${isAcademy ? Styles.button_academy : Styles.button} ${isActive ? Styles.active : ""}`}
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

      {selectOptions && onSelectChange && selectValue !== undefined && (
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
      )}

      {!isMatches && onClickCopy && (
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

const ButtonsSwitchThemed = (props: ButtonsSwitchProps) => {
  const { clubColor } = useSeasonTheme();
  return <ButtonsSwitchBase {...props} clubColor={clubColor} />;
};

export const ButtonsSwitch = (props: ButtonsSwitchProps) => {
  if (props.disableThemeHook) {
    return <ButtonsSwitchBase {...props} clubColor="rgba(0, 48, 144, 0.9)" />;
  }
  return <ButtonsSwitchThemed {...props} />;
};
