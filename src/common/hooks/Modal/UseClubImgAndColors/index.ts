import { useState, useEffect } from "react";
import { Career } from "../../../interfaces/Career";
import { useFilePicker } from "../../Images/UseFilePicker";

export const useClubImgAndColor = (selectedCareer: Career) => {
  const { file, fileDataUrl, pickFile, onFileChange, inputRef } =
    useFilePicker();

  const [primaryColor, setPrimaryColor] = useState("#52A383");
  const [secondaryColor, setSecondaryColor] = useState("#52A383");

  useEffect(() => {
    if (selectedCareer?.colorsTeams.length >= 2) {
      setPrimaryColor(selectedCareer.colorsTeams[0]);
      setSecondaryColor(selectedCareer.colorsTeams[1]);
    }
  }, [selectedCareer]);

  return {
    file,
    fileDataUrl,
    pickFile,
    onFileChange,
    inputRef,
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    setSecondaryColor,
  };
};
