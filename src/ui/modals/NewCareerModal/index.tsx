import ContainerForm from "../../../components/ContainerForm";
import Form from "../../../components/Form";
import Load from "../../../components/Load";
import { Buttons } from "../../../common/elements/Buttons";
import { useNewCareerModal } from "./hooks/useNewCareerModal";
import CareerFormFields from "./components/CareerFormFields";

type NewCareerModalProps = {
  closeModal: () => void;
};

const NewCareerModal = ({ closeModal }: NewCareerModalProps) => {
  const { load, inputValue, setInputValue, handleSubmit } =
    useNewCareerModal(closeModal);

  return (
    <Form onSubmit={handleSubmit}>
      <ContainerForm>
        <CareerFormFields
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </ContainerForm>
      <Buttons.AddNewCareer />
      {load && <Load />}
    </Form>
  );
};

export default NewCareerModal;
