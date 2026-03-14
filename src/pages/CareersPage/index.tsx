import classNames from "classnames";
import Styles from "./CareersPage.module.css";
import Button from "../../components/Button";
import PrimaryHeader from "../../layouts/PrimaryHeader";
import EmptyCareers from "./ui/EmptyCareers";
import ModalManager from "../../managers/ModalManager";
import { ModalType } from "../../managers/enum/ModalType";
import { Career } from "./interfaces/Career";
import { useModalManager } from "../../managers/hooks/useModalManager";
import { useSaveClick } from "../../common/hooks/UseSaveClick";
import Load from "../../ui/Load";
import CareerCard from "./components/CareerCard";
import { useCareers } from "./hooks/UseCareer";
import { CareerCardButtons } from "./config/CareerCardButtons";
import BottomMenu from "../../layouts/BottomMenu";

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
