import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Career } from "../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import { ContainerClubContent } from "../../../../../components/ContainerClubContent";
import Card from "../../../../../ui/Card";
import { ButtonsSwitch } from "../AllMatchesTab/components/ButtonsSwitch";
import { useTableData } from "./hooks/useTableData";
import { useTableMode } from "./hooks/useTableMode";
import { buildTableColumns } from "./helpers/buildTableColumns";
import Styles from "./TableTab.module.css";
import { LegendTable } from "./ui/LegendTable";
import { TableHeader } from "./components/TableHeader";
import { TableBody } from "./components/TableBody";
import { TableRowData } from "../../../../../common/interfaces/Table";
import { Copy } from "../../../../../common/utils/Copy";
import { buildTableCopyText } from "./helpers/buildTableCopyText";
import NoStatsMessage from "../../../../../components/NoStatsMessage";
import CustomSelect from "../../../../../components/CustomSelect";

type TableTabProps = {
  season: ClubData;
  career: Career & { clubData?: ClubData[] };
};

export const TableTab = ({ season, career }: TableTabProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isGeralPage = location.pathname.includes("/Geral");

  const availableSeasons = useMemo(() => {
    if (!career.clubData) return [];
    return [...career.clubData]
      .sort((a, b) => b.seasonNumber - a.seasonNumber)
      .map((s) => ({
        id: String(s.id),
        label: `Temporada ${s.seasonNumber}`,
        seasonData: s,
      }));
  }, [career.clubData]);

  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(() => {
    if (isGeralPage && availableSeasons.length > 0) {
      return availableSeasons[0].id;
    }
    return String(season.id);
  });

  const selectedSeasonData = useMemo(() => {
    const found = availableSeasons.find((s) => s.id === selectedSeasonId);
    return found ? found.seasonData : season;
  }, [availableSeasons, selectedSeasonId, season]);

  const storageKey = `tableActiveTab_${isGeralPage ? "geral" : selectedSeasonData.id}`;
  const { activeMode, setActiveMode } = useTableMode(storageKey);

  const { tableData } = useTableData(career, selectedSeasonData);
  const columns = buildTableColumns(activeMode);

  const rowClick = (row: TableRowData) => {
    if (isGeralPage) return;

    navigate(
      `/Career/${career.id}/Season/${selectedSeasonData.id}/AddTeamsToTable/${row.id}`,
      {
        state: { teamToEdit: row },
      },
    );
  };

  const copyClick = async () => {
    if (!tableData.length) return;

    let text = buildTableCopyText(tableData, activeMode);

    if (isGeralPage && selectedSeasonLabel) {
      text = `${selectedSeasonLabel}\n\n${text}`;
    }

    await Copy(text, "Tabela copiada com sucesso!");
  };

  const handleSeasonChange = (e: {
    target: { name: string; value: string };
  }) => {
    const found = availableSeasons.find((s) => s.label === e.target.value);
    if (found) {
      setSelectedSeasonId(found.id);
    }
  };

  const selectedSeasonLabel =
    availableSeasons.find((s) => s.id === selectedSeasonId)?.label || "";

  return (
    <ContainerClubContent>
      {isGeralPage && availableSeasons.length > 0 && (
        <div className="swiper-no-swiping">
          <CustomSelect
            name="seasonSelect"
            options={availableSeasons.map((s) => s.label)}
            value={selectedSeasonLabel}
            placeholder="Selecione a temporada"
            onChange={handleSeasonChange}
          />
        </div>
      )}

      {tableData.length === 0 ? (
        <NoStatsMessage
          isStats={true}
          textOne="Nenhum dado na tabela"
          textTwo="Adicione times para visualizar a classificação."
        />
      ) : (
        <>
          <div className={Styles.wrapper}>
            <ButtonsSwitch
              isMatches
              activeTab={activeMode}
              setActiveTab={setActiveMode}
              customTabs={[
                { value: "Resumido", label: "Resumido" },
                { value: "Completo", label: "Completo" },
              ]}
            />
            <ButtonsSwitch onClickCopy={copyClick} />
          </div>

          <Card className={Styles.card}>
            <table className={Styles.table}>
              <TableHeader columns={columns} />
              <TableBody
                tableData={tableData}
                columns={columns}
                career={career}
                activeMode={activeMode}
                onRowClick={isGeralPage ? undefined : rowClick}
              />
            </table>
            <LegendTable />
          </Card>
        </>
      )}
    </ContainerClubContent>
  );
};
