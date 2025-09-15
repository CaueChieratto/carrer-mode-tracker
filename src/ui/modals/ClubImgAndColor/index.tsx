import { Dispatch, SetStateAction } from "react";
import { Career } from "../../../common/interfaces/Career";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Load from "../../../components/Load";
import AddClubColors from "./components/AddClubColors";
import AddClubImg from "./components/AddClubImg";
import EditInfoClub from "./components/EditInfoClub";
import { useClubImgAndColorModal } from "./hooks/useClubImgAndColorModal";

type ClubImgAndColorProps = {
  closeModal: () => void;
  edit: boolean;
  selectedCareer: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
};

const ClubImgAndColor = ({
  closeModal,
  selectedCareer,
  setSelectedCareer,
  edit,
}: ClubImgAndColorProps) => {
  const {
    isLoading,
    clubName,
    setClubName,
    managerName,
    setManagerName,
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
  } = useClubImgAndColorModal({
    selectedCareer,
    setSelectedCareer,
    closeModal,
  });

  return (
    <Form onSubmit={handleSave}>
      {edit && (
        <EditInfoClub
          clubName={clubName}
          setClubName={setClubName}
          managerName={managerName}
          setManagerName={setManagerName}
        />
      )}
      <AddClubColors
        edit={edit}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
        secondaryColor={secondaryColor}
        setSecondaryColor={setSecondaryColor}
      />
      <AddClubImg
        edit={edit}
        file={file}
        initialPreview={badge || null}
        pickFile={pickFile}
        onFileChange={onFileChange}
        inputRef={inputRef}
      />
      <Button
        width="big"
        fontWeight="bold"
        fontSize="large"
        isActive
        type="submit"
      >
        Salvar
      </Button>
      {isLoading && <Load />}
    </Form>
  );
};

export default ClubImgAndColor;
