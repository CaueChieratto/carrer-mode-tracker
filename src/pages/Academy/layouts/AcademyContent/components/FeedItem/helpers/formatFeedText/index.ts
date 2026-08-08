import { toSingular } from "../toSingular";

export interface FormattedFeedText {
  professional: string;
  social: string;
}

export const formatFeedText = (
  type: string,
  desc: string,
  academyNickname: string,
  academyName: string,
): FormattedFeedText => {
  const singularNickname = toSingular(academyNickname);

  if (desc.includes("recrutado")) {
    return {
      professional: `Atleta recrutado para a categoria de base.`,
      social: `📌 Novo ${singularNickname} na base!`,
    };
  }

  if (desc.includes("Promovido")) {
    return {
      professional: `Atleta promovido ao elenco profissional do clube.`,
      social: `⭐ Promovido ao Profissional! Mais um talento de "${academyName}"! 🚀✨`,
    };
  }

  if (desc.includes("dispensado")) {
    return {
      professional: `Atleta dispensado da categoria de base.`,
      social: `🚪 Dispensado da base.`,
    };
  }

  const match = desc.match(/de ([a-zA-Z0-9-]+) para ([a-zA-Z0-9-]+)/i);
  const oldVal = match ? match[1] : "";
  const newVal = match ? match[2] : "";

  const cleanDesc = desc
    .replace(/age/i, "idade")
    .replace(/height/i, "altura")
    .replace(/weight/i, "peso")
    .replace(/position/i, "posição");

  if (!newVal || !oldVal) {
    return {
      professional: cleanDesc,
      social: `📝 ${cleanDesc}`,
    };
  }

  switch (type.toLowerCase()) {
    case "age":
      return {
        professional: `Idade atualizada para ${newVal} anos.`,
        social: `🎂 Completou ${newVal} anos de idade! 🎉`,
      };

    case "height":
      return {
        professional: `Evolução física: Altura atualizada de ${oldVal}cm para ${newVal}cm.`,
        social: `📏 Espichou! Foi de ${oldVal}cm para ${newVal}cm.`,
      };

    case "weight": {
      const weightDiff = parseInt(newVal, 10) - parseInt(oldVal, 10);
      if (weightDiff > 0) {
        return {
          professional: `Evolução física: Ganho de massa (${oldVal}kg para ${newVal}kg).`,
          social: `💪 Ganhou massa! Subiu de ${oldVal}kg para ${newVal}kg.`,
        };
      }
      return {
        professional: `Evolução física: Redução de peso (${oldVal}kg para ${newVal}kg).`,
        social: `🏃 Perdeu peso! Baixou de ${oldVal}kg para ${newVal}kg.`,
      };
    }

    case "overall":
      return {
        professional: `Desenvolvimento técnico: Overall reavaliado de ${oldVal} para ${newVal}.`,
        social: `📈 Evoluiu! Seu overall subiu de ${oldVal} para ${newVal}! 🔥`,
      };

    case "potential":
      return {
        professional: `Projeção reavaliada: Potencial alterado de ${oldVal} para ${newVal}.`,
        social: `🌟 Promissor! Potencial aumentou de ${oldVal} para ${newVal}! ✨`,
      };

    case "position":
      return {
        professional: `Readequação tática: Posição primária alterada de ${oldVal} para ${newVal}.`,
        social: `🔄 Nova fase! O atleta agora atua como ${newVal} (antes era ${oldVal}). ⚽`,
      };

    default:
      return {
        professional: cleanDesc,
        social: `📌 ${cleanDesc}`,
      };
  }
};
