import { useState } from "react";
import { GrUserManager } from "react-icons/gr";
import { MdEditCalendar, MdKeyboardArrowRight } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
import { Inputs } from "../../../../../common/elements/Inputs";
import { formatDateInput } from "../../../../../common/utils/Date";
import Input from "../../../../../components/Input";
import Label from "../../../../../components/Label";
import Styles from "./EditInfoClub.module.css";

type EditInfoClubProps = {
  clubName: string;
  setClubName: React.Dispatch<React.SetStateAction<string>>;
  managerName: string;
  setManagerName: React.Dispatch<React.SetStateAction<string>>;
  createdAt: string;
  setCreatedAt: React.Dispatch<React.SetStateAction<string>>;
};

const EditInfoClub = ({
  clubName,
  setClubName,
  managerName,
  createdAt,
  setCreatedAt,
  setManagerName,
}: EditInfoClubProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);

  return (
    <div className={Styles.container_club_info}>
      <p className={Styles.section_title}>INFORMAÇÕES DO CLUBE</p>
      <div className={Styles.card_container}>
        <Label htmlFor="club" className={Styles.row}>
          <div
            className={`${Styles.icon_wrapper} ${activeInput === "club" ? Styles.icon_green : ""}`}
          >
            <FaShieldAlt size={18} />
          </div>
          <div className={Styles.text_wrapper}>
            <span className={Styles.label_text}>Clube</span>
            <Inputs.EditClubName
              className={Styles.input}
              clubName={clubName}
              setClubName={setClubName}
              onFocus={() => setActiveInput("club")}
              onBlur={() => setActiveInput(null)}
            />
          </div>
          <MdKeyboardArrowRight size={22} className={Styles.chevron} />
        </Label>

        <div className={Styles.divider} />

        <Label htmlFor="manager" className={Styles.row}>
          <div
            className={`${Styles.icon_wrapper} ${activeInput === "manager" ? Styles.icon_green : ""}`}
          >
            <GrUserManager size={18} />
          </div>
          <div className={Styles.text_wrapper}>
            <span className={Styles.label_text}>Técnico</span>
            <Inputs.EditManagerName
              className={Styles.input}
              managerName={managerName}
              setManagerName={setManagerName}
              onFocus={() => setActiveInput("manager")}
              onBlur={() => setActiveInput(null)}
            />
          </div>
          <MdKeyboardArrowRight size={22} className={Styles.chevron} />
        </Label>

        <div className={Styles.divider} />

        <Label htmlFor="createdAt" className={Styles.row}>
          <div
            className={`${Styles.icon_wrapper} ${activeInput === "createdAt" ? Styles.icon_green : ""}`}
          >
            <MdEditCalendar size={18} />
          </div>
          <div className={Styles.text_wrapper}>
            <span className={Styles.label_text}>Data</span>
            <Input
              id="createdAt"
              name="createdAt"
              className={Styles.input}
              type="text"
              value={createdAt || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = formatDateInput(e.target.value);
                setCreatedAt(value);
              }}
              onFocus={() => setActiveInput("createdAt")}
              onBlur={() => setActiveInput(null)}
            />
          </div>
          <MdKeyboardArrowRight size={22} className={Styles.chevron} />
        </Label>
      </div>
    </div>
  );
};

export default EditInfoClub;
