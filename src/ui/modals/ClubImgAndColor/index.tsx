import Form from "../../../components/Form";
import AddClubImg from "../../../components/AddClubImg";
import AddClubColors from "../../../components/AddClubColors";
import Button from "../../../components/Button";
import { Career } from "../../../common/interfaces/Career";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useClubImgAndColor } from "../../../common/hooks/Modal/UseClubImgAndColors";
import { SaveEditClub } from "../../../common/services/SaveEditClub";
import EditInfoClub from "../../../components/EditInfoClub";
import Load from "../../../components/Load";

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
    file,
    fileDataUrl,
    pickFile,
    onFileChange,
    inputRef,
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    setSecondaryColor,
  } = useClubImgAndColor(selectedCareer);

  const [load, setLoad] = useState(false);
  const [clubName, setClubName] = useState(selectedCareer.clubName || "");
  const [managerName, setManagerName] = useState(
    selectedCareer.managerName || ""
  );

  useEffect(() => {
    setClubName(selectedCareer.clubName || "");
    setManagerName(selectedCareer.managerName || "");
  }, [selectedCareer]);

  const badge = selectedCareer?.teamBadge;

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoad(true);
    try {
      const updatedCareer = await SaveEditClub(
        selectedCareer,
        primaryColor,
        secondaryColor,
        fileDataUrl ?? undefined,
        clubName,
        managerName
      );
      setSelectedCareer(updatedCareer);
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <Form onSubmit={save}>
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
      <Button width="big" fontWeight="bold" fontSize="large" isActive>
        Salvar
      </Button>
      {load && <Load />}
    </Form>
  );
};

export default ClubImgAndColor;
