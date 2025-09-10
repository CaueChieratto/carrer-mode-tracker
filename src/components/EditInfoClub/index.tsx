import { Inputs } from "../../common/elements/Inputs";
import ContainerIcon from "../ContainerIcon";
import Label from "../Label";
import Styles from "./EditInfoClub.module.css";
import { GiCheckedShield } from "react-icons/gi";
import { GrUserManager } from "react-icons/gr";

type EditInfoClubProps = {
  clubName: string;
  setClubName: React.Dispatch<React.SetStateAction<string>>;
  managerName: string;
  setManagerName: React.Dispatch<React.SetStateAction<string>>;
};

const EditInfoClub = ({
  clubName,
  setClubName,
  managerName,
  setManagerName,
}: EditInfoClubProps) => {
  return (
    <div className={Styles.container_club_info}>
      <p className={Styles.p}>Editar Informações do clube</p>
      <div className={Styles.container_infos}>
        <Label htmlFor="club" className={Styles.container_info}>
          <h3 className={Styles.h3}>Nome do Clube</h3>
          <ContainerIcon className={Styles.icon}>
            <GiCheckedShield />
          </ContainerIcon>
          <Inputs.EditClubName
            className={Styles.input}
            clubName={clubName}
            setClubName={setClubName}
          />
        </Label>
        <Label htmlFor="manager" className={Styles.container_info}>
          <h3 className={Styles.h3}>Nome do técnico</h3>
          <ContainerIcon className={Styles.icon}>
            <GrUserManager />
          </ContainerIcon>
          <Inputs.EditManagerName
            className={Styles.input}
            managerName={managerName}
            setManagerName={setManagerName}
          />
        </Label>
      </div>
    </div>
  );
};

export default EditInfoClub;
