import SearchableSelect from "../../../components/SearchableSelect";
import { TeamRow } from "./components/TeamRow";
import { useEditTeams } from "./hooks/useEditTeams";
import { useTeamSearch } from "./hooks/useTeamSearch";
import { isCustomTeam } from "./helpers/isCustomTeam";
import Styles from "./EditTeams.module.css";

export const EditTeams = () => {
  const {
    teams,
    loading,
    savingTeamId,
    handleNameChange,
    handleFileChange,
    handleActionTeam,
  } = useEditTeams();

  const { searchValue, handleSearchChange, rowRefs, searchOptions } =
    useTeamSearch(teams);

  if (loading) {
    return (
      <div className={Styles.loadingState}>
        <div className={`${Styles.spinner} ${Styles.spinnerLarge}`}></div>
        <p>Buscando times no banco de dados...</p>
      </div>
    );
  }

  const customTeams = teams.filter(isCustomTeam);
  const apiTeams = teams.filter((t) => !isCustomTeam(t));

  return (
    <div className={Styles.container}>
      <div className={Styles.searchContainer}>
        <SearchableSelect
          name="searchTeam"
          value={searchValue}
          onChange={handleSearchChange}
          options={searchOptions}
          placeholder="Buscar time para editar..."
          useAlternateStyle
        />
      </div>

      <div className={Styles.section}>
        <div className={Styles.headerGroup}>
          <h3 className={Styles.title}>Times Customizados</h3>
          <span className={Styles.teamCount}>{customTeams.length}</span>
        </div>
        {customTeams.length === 0 ? (
          <p className={Styles.empty}>Nenhum time customizado encontrado.</p>
        ) : (
          <div className={Styles.teamList}>
            {customTeams.map((team) => (
              <TeamRow
                key={team.originalName}
                team={team}
                isEditing={savingTeamId === team.originalName}
                onNameChange={handleNameChange}
                onFileChange={handleFileChange}
                onAction={handleActionTeam}
                rowRef={(el) => (rowRefs.current[team.originalName] = el)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={Styles.section}>
        <div className={Styles.headerGroup}>
          <h3 className={Styles.title}>Times da API</h3>
          <span className={Styles.teamCount}>{apiTeams.length}</span>
        </div>
        {apiTeams.length === 0 ? (
          <p className={Styles.empty}>Nenhum time da API encontrado.</p>
        ) : (
          <div className={Styles.teamList}>
            {apiTeams.map((team) => (
              <TeamRow
                key={team.originalName}
                team={team}
                isEditing={savingTeamId === team.originalName}
                onNameChange={handleNameChange}
                onFileChange={handleFileChange}
                onAction={handleActionTeam}
                rowRef={(el) => (rowRefs.current[team.originalName] = el)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
