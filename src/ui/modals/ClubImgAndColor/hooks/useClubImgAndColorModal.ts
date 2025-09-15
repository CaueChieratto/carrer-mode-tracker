import { useState, useEffect, FormEvent } from "react";
import { Career } from "../../../../common/interfaces/Career";
import { useClubImgAndColor } from "../../../../common/hooks/Modal/UseClubImgAndColors";
import { SaveEditClub } from "../../../../common/services/SaveEditClub";

type UseClubImgAndColorModalProps = {
  selectedCareer: Career;
  setSelectedCareer: React.Dispatch<React.SetStateAction<Career>>;
  closeModal: () => void;
};

export const useClubImgAndColorModal = ({
  selectedCareer,
  setSelectedCareer,
  closeModal,
}: UseClubImgAndColorModalProps) => {
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

  const [isLoading, setIsLoading] = useState(false);
  const [clubName, setClubName] = useState(selectedCareer.clubName || "");
  const [managerName, setManagerName] = useState(
    selectedCareer.managerName || ""
  );

  useEffect(() => {
    setClubName(selectedCareer.clubName || "");
    setManagerName(selectedCareer.managerName || "");
  }, [selectedCareer]);

  const badge = selectedCareer?.teamBadge;

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
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
      console.error("Failed to save club details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
