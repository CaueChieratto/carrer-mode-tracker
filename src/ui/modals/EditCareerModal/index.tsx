import { Dispatch, SetStateAction } from "react";
import { Career } from "../../../common/interfaces/Career";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Load from "../../../components/Load";
import AddClubColors from "./components/AddClubColors";
import AddClubImg from "./components/AddClubImg";
import EditInfoClub from "./components/EditInfoClub";
import { useEditCareerModal } from "./hooks/useEditCareerModal";
import Styles from "./EditCareerModal.module.css";

type EditCareerModalProps = {
  closeModal: () => void;
  edit: boolean;
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
};

export const EditCareerModal = ({
  closeModal,
  selectedCareer,
  setSelectedCareer,
  edit,
}: EditCareerModalProps) => {
  const {
    isLoading,
    clubName,
    setClubName,
    managerName,
    setManagerName,
    createdAt,
    setCreatedAt,
    badge,
    file,
    pickFile,
    onFileChange,
    inputRef,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    handleSave,
  } = useEditCareerModal({
    selectedCareer,
    setSelectedCareer,
    closeModal,
  });

  return (
    <Form onSubmit={handleSave} className={Styles.form}>
      <div className={Styles.form_container}>
        <AddClubImg
          edit={edit}
          file={file}
          initialPreview={badge || null}
          pickFile={pickFile}
          onFileChange={onFileChange}
          inputRef={inputRef}
        />

        {edit && (
          <EditInfoClub
            clubName={clubName}
            setClubName={setClubName}
            managerName={managerName}
            setManagerName={setManagerName}
            createdAt={createdAt}
            setCreatedAt={setCreatedAt}
          />
        )}

        <AddClubColors
          edit={edit}
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          secondaryColor={secondaryColor}
          setSecondaryColor={setSecondaryColor}
        />

        <Button
          width="big"
          fontWeight="bold"
          fontSize="large"
          isActive
          type="submit"
          style={{ width: "100%" }}
        >
          Salvar
        </Button>

        {isLoading && <Load />}
      </div>
    </Form>
  );
};
