import { Career } from "../../../../../../../common/interfaces/Career";
import { TableColumn } from "../../helpers/buildTableColumns";
import { TableRowData } from "../../../../../../../common/interfaces/Table";
import { TableRow } from "../TableRow";

type TableBodyProps = {
  tableData: TableRowData[];
  columns: TableColumn[];
  career: Career;
  activeMode: string;
  onRowClick?: (row: TableRowData) => void;
};

export const TableBody = ({
  tableData,
  columns,
  career,
  activeMode,
  onRowClick,
}: TableBodyProps) => (
  <tbody>
    {tableData.map((row) => (
      <TableRow
        key={row.id}
        row={row}
        columns={columns}
        career={career}
        activeMode={activeMode}
        onClick={() => onRowClick && onRowClick(row)}
      />
    ))}
  </tbody>
);
