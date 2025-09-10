import { ChangeEventHandler, forwardRef } from "react";
import Input from "../../../../components/Input";

type AddClubImgProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  className: string;
};

export const AddClubImg = forwardRef<HTMLInputElement, AddClubImgProps>(
  ({ onChange, className }, ref) => (
    <Input
      ref={ref}
      type="file"
      name="img"
      id="img"
      onChange={onChange}
      className={className}
    />
  )
);

AddClubImg.displayName = "AddClubImg";
