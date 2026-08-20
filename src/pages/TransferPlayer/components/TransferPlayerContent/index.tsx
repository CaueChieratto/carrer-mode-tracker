import { useRef } from "react";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import HeaderSeason from "../../../../components/HeaderSeason";
import Navbar from "../../../../ui/Navbar";
import Form from "../../../../components/Form";
import FormSection from "../../../../components/FormSection";
import Load from "../../../../components/Load";
import Styles from "./TransferPlayerContent.module.css";
import { buildTransferSections } from "../../constants/buildTransfersFormSections";
import { useTransferForm } from "../../hooks/useTransferForm";
import { buildLoanSections } from "../../constants/buildLoadFormSections";

type TransferPlayerContentProps = {
  handleGoBack: () => void;
  career: Career;
  season: ClubData;
  careerId: string;
  player: Players;
  currentPlayers: Players[];
};

const TransferPlayerContent = ({
  handleGoBack,
  career,
  season,
  careerId,
  player,
  currentPlayers,
}: TransferPlayerContentProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    activeTab,
    isLoading,
    formValues,
    booleanValues,
    navText,
    handleSave,
    handleCustomInputChange,
    handleBooleanChangeWrapper,
    filteredTeamOptions,
  } = useTransferForm({
    careerId,
    season,
    career,
    player,
    currentPlayers,
    handleGoBack,
  });

  const sections =
    activeTab === 1
      ? buildTransferSections(booleanValues, filteredTeamOptions)
      : buildLoanSections(booleanValues, player, filteredTeamOptions);
  return (
    <>
      <HeaderSeason
        careerId={careerId}
        career={career}
        backSeasons={handleGoBack}
        titleText={player.name}
      />
      <Navbar
        save={handleSave}
        options={["", navText, ""]}
        activeOption={1}
        onOptionClick={(index) => {
          if (index === 1) handleSave();
        }}
      />

      <div className={Styles.container}>
        <Form className={Styles.form} ref={formRef}>
          {sections.map((section, index) => (
            <FormSection
              key={index}
              title={section.title}
              rows={section.fields}
              formValues={{
                ...formValues,
                ...Object.fromEntries(
                  Object.entries(booleanValues).map(([k, v]) => [k, String(v)]),
                ),
              }}
              onInputChange={handleCustomInputChange}
              onBooleanChange={handleBooleanChangeWrapper}
            />
          ))}
        </Form>
      </div>

      {isLoading && <Load isTransfers />}
    </>
  );
};

export default TransferPlayerContent;
