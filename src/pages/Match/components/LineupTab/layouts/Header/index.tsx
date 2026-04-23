import { Career } from "../../../../../../common/interfaces/Career";
import CustomSelect from "../../../../../../components/CustomSelect";
import { Formation, FORMATION_NAMES } from "../../../../constants/Formations";
import Styles from "./Header.module.css";

type HeaderProps = {
  career: Career;
  selectedFormation: Formation;
  handleFormationChange: (e: string) => void;
  isFromGeral?: boolean;
};

export const Header = ({
  career,
  selectedFormation,
  handleFormationChange,
  isFromGeral,
}: HeaderProps) => {
  return (
    <div
      className={Styles.header}
      style={isFromGeral ? { height: "60px" } : undefined}
    >
      <div className={Styles.club_info}>
        <span className={Styles.club_name}>{career.clubName}</span>
      </div>

      {!isFromGeral && (
        <div className={`${Styles.formation_select} swiper-no-swiping`}>
          <CustomSelect
            name="formation"
            options={FORMATION_NAMES}
            value={selectedFormation.name}
            onChange={(e) => handleFormationChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
