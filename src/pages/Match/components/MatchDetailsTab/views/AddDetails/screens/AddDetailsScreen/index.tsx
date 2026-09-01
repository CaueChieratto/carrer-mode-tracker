import Form from "../../../../../../../../components/Form";
import FormSection from "../../../../../../../../components/FormSection";
import Load from "../../../../../../../../components/Load";
import HeaderSeason from "../../../../../../../../components/HeaderSeason";
import Navbar from "../../../../../../../../ui/Navbar";
import Styles from "./AddDetailsScreen.module.css";
import { useAddDetails } from "../../hooks/useAddDetails";
import { Career } from "../../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../../../common/interfaces/Match";

type AddDetailsScreenProps = {
  career: Career;
  season: ClubData;
  match: Match;
  onClose: () => void;
  onSaved?: (match: Partial<Match>) => void;
};

export const AddDetailsScreen = ({
  career,
  season,
  match,
  onClose,
  onSaved,
}: AddDetailsScreenProps) => {
  const {
    isSaving,
    fields,
    formValues,
    handleInputChange,
    handleBooleanChange,
    saveDetails,
  } = useAddDetails({ career, season, match, onClose, onSaved });

  if (isSaving) return <Load />;

  return (
    <>
      <HeaderSeason
        match={match}
        careerId={career.id}
        career={career}
        backSeasons={onClose}
        titleText={`${match.homeTeam} x ${match.awayTeam}`}
      />
      <Navbar
        save={saveDetails}
        options={["", "Salvar", ""]}
        activeOption={1}
        onOptionClick={() => {}}
      />
      <div className={Styles.container}>
        <Form className={Styles.form}>
          {fields.map((section, index) => (
            <FormSection
              isMatch
              key={index}
              title={section.title}
              rows={section.fields}
              formValues={formValues}
              isEditing={true}
              onInputChange={handleInputChange}
              onBooleanChange={handleBooleanChange}
            />
          ))}
        </Form>
      </div>
    </>
  );
};
