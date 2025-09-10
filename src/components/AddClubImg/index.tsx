import { FaPlus } from "react-icons/fa6";
import Label from "../Label";
import Styles from "./AddClubImg.module.css";
import { ChangeEventHandler, RefObject } from "react";
import { Inputs } from "../../common/elements/Inputs";

type AddClubImgProps = {
  edit: boolean;
  file: File | null;
  initialPreview?: string | null;
  inputRef: RefObject<HTMLInputElement>;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  pickFile: () => void;
};

const AddClubImg = ({
  edit,
  file,
  pickFile,
  initialPreview,
  inputRef,
  onFileChange,
}: AddClubImgProps) => {
  const previewUrl = file ? URL.createObjectURL(file) : initialPreview || null;

  return (
    <div className={Styles.container_p__label_img}>
      <p className={Styles.p}>
        {edit ? "Editar imagem do clube" : "Adicionar imagem ao clube"}
      </p>
      <div className={Styles.container_label_img}>
        <Label htmlFor="img" onClick={pickFile} className={Styles.label_img}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className={Styles.previewImage}
            />
          ) : (
            <FaPlus size={13} color="#323232" />
          )}
          <Inputs.AddClubImg
            ref={inputRef}
            onChange={onFileChange}
            className={Styles.hiddenInput}
          />
        </Label>

        <span className={Styles.span}>Toque para adicionar</span>
      </div>
    </div>
  );
};

export default AddClubImg;
