import classNames from "classnames";
import Styles from "./CareersPage.module.css";
import Button from "../../components/Button";
import PrimaryHeader from "../../ui/PrimaryHeader";
import EmptyCareers from "../../ui/EmptyCareers";
import ModalManager from "../../common/constants/ModalManager";
import { ModalType } from "../../common/types/enums/ModalType";
import { Career } from "../../common/interfaces/Career";
import { useModalManager } from "../../common/hooks/Modal/UseModalManager";
import { useSaveClick } from "../../common/hooks/UseSaveClick";
import Load from "../../components/Load";
import CareerCard from "../../ui/CareerCard";
import { useCareers } from "../../common/hooks/Career/UseCareer";
import { CareerCardButtons } from "../../common/constants/CareerCardButtons";
import BottomMenu from "../../ui/BottomMenu";

const CareersPage = () => {
  const { careers, loading } = useCareers();

  const {
    activeModal,
    closeModal,
    openModal,
    selectedCareer,
    setSelectedCareer,
  } = useModalManager();

  const { saveClick, setSaveClick } = useSaveClick();

  const onOpenModal = (modalType: ModalType, career?: Career) => {
    setSaveClick(window.scrollY);
    if (career) setSelectedCareer(career);
    openModal(modalType);
  };

  const hidden =
    activeModal !== ModalType.NONE &&
    activeModal !== ModalType.SLIDE_UP_PANEL &&
    Styles.hidden;

  if (loading) return <Load />;

  return (
    <>
      {careers.length > 0 ? (
        <div className={classNames(Styles.container, hidden)}>
          <PrimaryHeader text="Minhas Carreiras">
            <Button
              isActive
              fontSize="large"
              fontWeight="bold"
              onClick={() => onOpenModal(ModalType.NEW_CAREER)}
            >
              Nova Carreira
            </Button>
          </PrimaryHeader>
          <main className={Styles.main}>
            {careers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                onOpenModal={onOpenModal}
                setSelectedCareer={setSelectedCareer}
                buttons={CareerCardButtons}
              />
            ))}
          </main>
        </div>
      ) : (
        <EmptyCareers onOpenModal={onOpenModal} />
      )}

      {activeModal === ModalType.NONE && <BottomMenu />}

      <ModalManager
        saveClick={saveClick}
        setSelectedCareer={setSelectedCareer}
        selectedCareer={selectedCareer}
        activeModal={activeModal}
        onClose={closeModal}
      />
    </>
  );
};

export default CareersPage;
