import { useNavigate } from "react-router-dom";
import { Buttons } from "../../../../../../common/elements/Buttons";
import Styles from "./AcademyContentHeader.module.css";
import { useAcademyContext } from "../../../contexts/AcademyContext/hooks/useAcademyContext";

type AcademyContentHeaderProps = {
  darkClubColor: string;
  clubColor: string;
};

export const AcademyContentHeader = ({
  clubColor,
  darkClubColor,
}: AcademyContentHeaderProps) => {
  const navigate = useNavigate();
  const { career, seasonId, isFocusedViewActive, back } = useAcademyContext();

  const seasonNumber = career.clubData.find(
    (club) => club.id === seasonId,
  )?.seasonNumber;

  const handleBack = () => {
    localStorage.removeItem(`@academy_viewState_${career.id}`);
    if (isFocusedViewActive) {
      back();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={Styles.header}>
      <div className={Styles.headerTitles}>
        <h1>{career.clubName}</h1>
        <p>
          {career.academy!.name} • T{seasonNumber}
        </p>
      </div>
      <Buttons.BackCareerPage
        goBack={handleBack}
        darkClubColor={darkClubColor}
        clubColor={clubColor}
      />
    </header>
  );
};
