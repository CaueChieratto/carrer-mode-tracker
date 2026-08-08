export type FieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  fieldType?: "input" | "select" | "searchable-select";
  type?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  pattern?: string;
  defaultValue?: string | number;
  value?: string;
  options?: string[];
  disabled?: boolean;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (event: { target: { name: string; value: string } }) => void;
  hideOnEvolution?: boolean;
};
