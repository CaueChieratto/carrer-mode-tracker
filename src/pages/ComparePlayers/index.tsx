import React from "react";
import Styles from "./ComparePlayers.module.css";
import { useComparePlayers } from "./hooks/useComparePlayers";
import { StatRow } from "./components/StatRow";
import { PlayerSelectionCard } from "./components/PlayerSelectionCard";
import SearchableSelect from "../../components/SearchableSelect";
import CustomSelect from "../../components/CustomSelect";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Load from "../../components/Load";
import { getStatsCategories } from "./constants/statsCategories";
import { ButtonsSwitch } from "../../layout/SectionView/features/ClubTabs/AllMatchesTab/components/ButtonsSwitch";

export const ComparePlayers = () => {
  const { state, actions } = useComparePlayers();
  const navigate = useNavigate();

  if (state.isLoading) {
    return <Load />;
  }

  const isGeralPlayerCompare = state.isGeralMode && !!state.playerId;

  const showSeasonSelect = isGeralPlayerCompare
    ? state.compareMode === "season"
    : !!state.playerId;

  const showRestOfPage = isGeralPlayerCompare
    ? state.compareMode === "total" ||
      (state.compareMode === "season" && !!state.selectedSeasonId)
    : true;

  const statsCategories = getStatsCategories(state.compareMode);

  return (
    <div className={Styles.container}>
      <div className={Styles.headerContainer}>
        <button className={Styles.backButton} onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </button>
        <h2 className={Styles.pageTitle}>Comparação de jogadores</h2>
      </div>

      {isGeralPlayerCompare && (
        <div className={Styles.modeToggle}>
          <ButtonsSwitch
            isMatches={true}
            isGeralPage={false}
            disableThemeHook={true}
            activeTab={state.compareMode}
            setActiveTab={(tab) =>
              actions.setCompareMode(tab as "season" | "total")
            }
            customTabs={[
              { value: "season", label: "Temporadas" },
              { value: "total", label: "Total" },
            ]}
          />
        </div>
      )}

      {showSeasonSelect && (
        <div className={Styles.seasonSelectWrapper}>
          <CustomSelect
            name="seasonSelect"
            options={state.seasonOptions}
            value={state.selectedSeasonLabel}
            placeholder="Selecione a temporada"
            onChange={actions.handleSeasonChange}
          />
        </div>
      )}

      {showRestOfPage && (
        <>
          <div className={Styles.selectionCards}>
            <PlayerSelectionCard
              player={state.player1}
              isActive={state.activeSlot === 1}
              isLocked={isGeralPlayerCompare}
              onClick={() => {
                if (!isGeralPlayerCompare) {
                  actions.openSelection(1);
                }
              }}
            />
            <PlayerSelectionCard
              player={state.player2}
              isActive={state.activeSlot === 2}
              onClick={() => actions.openSelection(2)}
            />
          </div>

          {state.activeSlot !== null && (
            <div className={Styles.selectWrapper}>
              <SearchableSelect
                name="playerSelection"
                options={state.filteredOptions}
                value={state.searchValue}
                placeholder={`Pesquise e selecione o jogador`}
                onChange={actions.handleSearchChange}
              />
            </div>
          )}

          <div className={Styles.statsContainer}>
            {statsCategories.map((category) => (
              <React.Fragment key={category.title}>
                <h3 className={Styles.sectionTitle}>{category.title}</h3>
                {category.stats.map((stat) => (
                  <StatRow
                    key={stat.key}
                    label={stat.label}
                    val1={state.p1Stats?.[stat.key]}
                    val2={state.p2Stats?.[stat.key]}
                    isRating={stat.isRating}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
