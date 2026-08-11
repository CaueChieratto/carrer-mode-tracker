export const getModalTitle = (type: string): string => {
  if (type === "match") return "Resumo da Partida";
  if (type === "tournament") return "Fim de Torneio";
  if (type === "status") return "Novo Status";
  if (type === "position") return "Readequação Tática";

  if (["overall", "potential", "age", "height", "weight"].includes(type)) {
    return "Atualização do Atleta";
  }

  return "Detalhes do Evento";
};
