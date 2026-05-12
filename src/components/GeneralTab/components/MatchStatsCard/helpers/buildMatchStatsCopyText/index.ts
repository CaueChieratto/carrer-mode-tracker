type StatCategory = {
  title: string;
  stats: { name: string; value: string | number }[];
};

export const buildMatchStatsCopyText = (content: StatCategory[]): string => {
  let text = "Estatísticas da Equipe\n\n";

  content.forEach((category) => {
    text += `--- ${category.title.toUpperCase()} ---\n`;
    category.stats.forEach((stat) => {
      text += `${stat.name}: ${stat.value}\n`;
    });
    text += "\n";
  });

  return text.trim();
};
