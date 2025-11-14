import PrimaryHeader from "../../ui/PrimaryHeader";
import Styles from "./AddSeasons.module.css";
import Load from "../../components/Load";
import EmptySeason from "../../ui/EmptySeason";
import { Buttons } from "../../common/elements/Buttons";
import { useAddSeasons } from "../../common/hooks/Seasons/UseAddSeasons";
import SeasonList from "../../components/SeasonList";
import { ModalType } from "../../common/types/enums/ModalType";
import BottomMenu from "../../ui/BottomMenu";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";

const AddSeasons = () => {
  const { loading, career, clubColor, darkClubColor, handleAddSeason, goBack } =
    useAddSeasons();

  const { activeModal } = useModalManager();

  if (loading) return <Load />;

  if (!career) {
    alert("Carreira não encontrada!");
    return null;
  }

  const clubData = career.clubData || [];

  return (
    <>
      <div className={Styles.container}>
        <PrimaryHeader text="Selecionar temporadas">
          <Buttons.BackCareerPage
            goBack={goBack}
            darkClubColor={darkClubColor}
            clubColor={clubColor}
          />
        </PrimaryHeader>
        {clubData && clubData.length > 0 ? (
          <SeasonList clubData={clubData} careerId={career!.id} />
        ) : (
          <EmptySeason />
        )}

        <Buttons.AddSeasonButton
          clubColor={clubColor}
          darkClubColor={darkClubColor}
          career={career!}
          onAddSeason={handleAddSeason}
        />
      </div>
      {activeModal === ModalType.NONE && <BottomMenu />}
    </>
  );
};

export default AddSeasons;
