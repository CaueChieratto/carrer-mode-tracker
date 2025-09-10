import { Dispatch, SetStateAction } from "react";
import Input from "../../../../components/Input";
import { brasilDatePlaceholder, formatDateInput } from "../../../utils/Date";

type CreatedAtProps = {
  className: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
};

export const CreatedAt = ({
  className,
  inputValue,
  setInputValue,
}: CreatedAtProps) => (
  <Input
    id="createdAt"
    name="createdAt"
    className={className}
    type="text"
    placeholder={brasilDatePlaceholder(new Date())}
    value={inputValue}
    onChange={(e) => setInputValue(formatDateInput(e.target.value))}
  />
);
