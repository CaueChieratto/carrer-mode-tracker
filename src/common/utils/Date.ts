export function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "");
  const limited = digits.slice(0, 6);

  if (limited.length <= 2) return limited;
  if (limited.length <= 4) return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4, 6)}`;
}

export function formatDateInputShort(value: string) {
  const digits = value.replace(/\D/g, "");
  const limited = digits.slice(0, 4);

  if (limited.length <= 2) return limited;
  return `${limited.slice(0, 2)}/${limited.slice(2)}`;
}

export function parseFullBrasilDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return null;

  const d = parseInt(day, 10);
  const m = parseInt(month, 10) - 1;
  let y = parseInt(year, 10);

  if (year.length === 2) {
    y = 2000 + y;
  }

  const parsed = new Date(y, m, d);

  if (
    parsed.getFullYear() !== y ||
    parsed.getMonth() !== m ||
    parsed.getDate() !== d
  ) {
    return null;
  }

  return parsed;
}

export function parseBrasilDate(dateStr: string, year: number): Date | null {
  if (!dateStr) return null;

  const [day, month] = dateStr.split("/");
  if (!day || !month) return null;

  const d = parseInt(day, 10);
  const m = parseInt(month, 10) - 1;

  const parsed = new Date(year, m, d);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== m ||
    parsed.getDate() !== d
  ) {
    return null;
  }

  return parsed;
}

export function brasilDatePlaceholder(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function brasilDatePlaceholderShort(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

export function formatDateToLongBrazilian(date: Date): string {
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
}
