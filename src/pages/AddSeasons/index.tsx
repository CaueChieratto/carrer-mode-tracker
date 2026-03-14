import PrimaryHeader from "../../layouts/PrimaryHeader";
import Styles from "./AddSeasons.module.css";
import Load from "../../ui/Load";
import EmptySeason from "./components/EmptySeason";
import { Buttons } from "../../common/elements/Buttons";
import { useAddSeasons } from "../../common/hooks/Seasons/UseAddSeasons";
import SeasonList from "./components/SeasonList";
import { ModalType } from "../../managers/enum/ModalType";
import BottomMenu from "../../layouts/BottomMenu";
import { useModalManager } from "../../managers/hooks/useModalManager";

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
