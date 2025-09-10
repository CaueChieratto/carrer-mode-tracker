import Styles from "../modal.module.css";
import { CiCalendar } from "react-icons/ci";
import Label from "../../../components/Label";
import ContainerIcon from "../../../components/ContainerIcon";
import ContainerForm from "../../../components/ContainerForm";
import Form from "../../../components/Form";
import Load from "../../../components/Load";
import { Buttons } from "../../../common/elements/Buttons";
import { useNewCareerModal } from "../../../common/hooks/Career/UseNewCareerModal";
import CareerFormFields from "../../../components/CareerFormFields";
import { Inputs } from "../../../common/elements/Inputs";

type NewCareerModalProps = {
  closeModal: () => void;
};

const NewCareerModal = ({ closeModal }: NewCareerModalProps) => {
  const { load, inputValue, setInputValue, handleSubmit } =
    useNewCareerModal(closeModal);

  return (
    <Form onSubmit={handleSubmit}>
      <ContainerForm>
        <CareerFormFields />
        <Label htmlFor="createdAt">
          <ContainerIcon className={Styles.icon}>
            <CiCalendar size={15} />
          </ContainerIcon>
          <Inputs.CreatedAt
            className={Styles.input}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </Label>
      </ContainerForm>
      <Buttons.AddNewCareer />

      {load && <Load />}
    </Form>
  );
};

export default NewCareerModal;
