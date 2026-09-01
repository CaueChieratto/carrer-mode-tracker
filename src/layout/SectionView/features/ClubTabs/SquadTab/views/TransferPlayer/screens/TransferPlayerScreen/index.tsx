import { useRef } from "react";
import Styles from "./TransferPlayerScreen.module.css";
import { buildTransferSections } from "../../constants/buildTransfersFormSections";
import { buildLoanSections } from "../../constants/buildLoadFormSections";
import { useTransferPlayerContext } from "../../contexts/context";
import { Form } from "react-router-dom";
import FormSection from "../../../../../../../../../components/FormSection";
import HeaderSeason from "../../../../../../../../../components/HeaderSeason";
import Load from "../../../../../../../../../components/Load";
import Navbar from "../../../../../../../../../ui/Navbar";

export const TransferPlayerScreen = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    career,
    player,
    onClose,
    activeTab,
    isLoading,
    formValues,
    booleanValues,
    navText,
    handleSave,
    handleCustomInputChange,
    handleBooleanChangeWrapper,
    filteredTeamOptions,
  } = useTransferPlayerContext();

  const sections =
    activeTab === 1
      ? buildTransferSections(booleanValues, filteredTeamOptions)
      : buildLoanSections(booleanValues, player, filteredTeamOptions);

  const mergedFormValues = {
    ...formValues,
    ...Object.fromEntries(
      Object.entries(booleanValues).map(([k, v]) => [k, String(v)]),
    ),
  };

  return (
    <>
      <HeaderSeason
        careerId={career.id}
        career={career}
        backSeasons={onClose}
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
              formValues={mergedFormValues}
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
