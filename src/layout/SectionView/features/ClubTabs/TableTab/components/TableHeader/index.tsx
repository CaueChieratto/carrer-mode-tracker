import { TableColumn } from "../../helpers/buildTableColumns";
import Styles from "../../TableTab.module.css";

type TableHeaderProps = {
  columns: TableColumn[];
};

export const TableHeader = ({ columns }: TableHeaderProps) => (
  <thead>
    <tr>
      <th className={Styles.align_left} style={{ width: "40px" }}>
        POS
      </th>

      <th className={Styles.align_left}>Time</th>

      {columns.map(
        (column) => column.show && <th key={column.key}>{column.label}</th>,
      )}
    </tr>
  </thead>
);
