import { useMemo } from "react";
import { positionOptionsBySector } from "../../common/constants/SquadFormFields";
import { ModalType } from "../../common/types/enums/ModalType";
import FormField from "../FormField";
import { Field, FormSectionProps } from "../FormSection";
import FormSegmentedControl from "../FormSegmentedControl";
import FormSelect from "../FormSelect";

type RendererProps = FieldRendererProps & {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

const CustomSelectRenderer = ({
  field,
  formValues,
  isSelectDisabled,
  onChange,
}: Omit<RendererProps, "onChange"> & {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  const options = useMemo(() => {
    if (field.id === "position" && formValues?.sector) {
      return (
        positionOptionsBySector[
          formValues.sector as keyof typeof positionOptionsBySector
        ] || []
      );
    }
    return field.options || [];
  }, [field.id, field.options, formValues?.sector]);

  const isDisabled =
    isSelectDisabled || (field.id === "position" && !formValues?.sector);
  const value = formValues?.[field.id] ?? "";

  return (
    <FormSelect
      field={{ ...field, options }}
      value={value}
      isDisabled={isDisabled}
      onChange={onChange}
    />
  );
};

const CheckboxRenderer = ({
  field,
  clubColor,
  onActionClick,
  formValues,
  onBooleanChange,
}: FieldRendererProps) => {
  if ("action" in field && field.action) {
    return (
      <FormSegmentedControl
        name={field.id}
        clubColor={clubColor}
        action={() => onActionClick?.(field.action as ModalType)}
      />
    );
  }

  const isChecked = formValues?.[field.id] === "true";

  return (
    <FormSegmentedControl
      name={field.id}
      value={isChecked}
      clubColor={clubColor}
      onChange={(value) => onBooleanChange?.(field.id, value)}
    />
  );
};

type FieldRendererProps = Pick<
  FormSectionProps,
  "formValues" | "onInputChange" | "onKeyDown" | "onKeyUp" | "onBooleanChange"
> & {
  field: Field;
  clubColor: string;
  isSelectDisabled?: boolean;
  onActionClick?: (modal: ModalType) => void;
};

const FieldRenderer = (props: FieldRendererProps) => {
  const { field, onInputChange, onKeyDown, onKeyUp, formValues } = props;
  const value = formValues?.[field.id] ?? "";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onInputChange?.(e, field);
  };

  if (field.inputType === "custom-select") {
    return <CustomSelectRenderer {...props} onChange={handleInputChange} />;
  }

  if (field.checkbox) {
    return <CheckboxRenderer {...props} />;
  }

  return (
    <FormField
      field={field}
      value={value}
      onChange={handleInputChange}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  );
};

export default FieldRenderer;
