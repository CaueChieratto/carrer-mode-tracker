import { useState } from "react";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import Styles from "./PlayerPicker.module.css";
import { POSITION_ORDER } from "./constants/POSITION_ORDER";

type PlayerPickerProps = {
  players: Players[];
  assignedIds: Set<string>;
  onSelect: (player: Players) => void;
};

export const PlayerPicker = ({
  players,
  assignedIds,
  onSelect,
}: PlayerPickerProps) => {
  const [search, setSearch] = useState("");

  const available = players
    .filter(
      (p) =>
        !p.sell &&
        !assignedIds.has(p.id) &&
        p.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const posA = POSITION_ORDER[a.position as string] || 99;
      const posB = POSITION_ORDER[b.position as string] || 99;

      if (posA !== posB) {
        return posA - posB;
      }

      return b.overall - a.overall;
    });

  return (
    <div className={Styles.picker_container}>
      <input
        className={Styles.picker_search}
        placeholder="Buscar jogador..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
      <div className={Styles.picker_list}>
        {available.length === 0 && (
          <p className={Styles.picker_empty}>Nenhum jogador disponível</p>
        )}
        {available.map((player) => (
          <button
            key={player.id}
            className={Styles.picker_item}
            onClick={() => onSelect(player)}
            type="button"
          >
            <span className={Styles.picker_name}>{player.name}</span>
            <div className={Styles.picker_meta}>
              <span className={Styles.picker_pos}>{player.position}</span>
              <span className={Styles.picker_overall}>{player.overall}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
