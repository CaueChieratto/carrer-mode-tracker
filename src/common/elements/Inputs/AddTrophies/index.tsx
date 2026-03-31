import Input from "../../../../components/Input";

type AddTrophiesProps = {
  className: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  season: string;
};

export const AddTrophies = ({
  className,
  onChange,
  season,
}: AddTrophiesProps) => (
  <Input
    id="season"
    name="season"
    value={season}
    onChange={onChange}
    placeholder="Temporada"
    className={className}
    style={{ color: "var(--color-add-player)" }}
  />
);
