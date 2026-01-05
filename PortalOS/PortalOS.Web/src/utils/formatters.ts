const MESES_ABREVIADOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function formatMes(mes: number): string {
  return MESES_ABREVIADOS[mes - 1] || '';
}

export function formatHoras(horas: number): string {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatDateToInput(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export function formatTimeToInput(dateTimeString: string | null): string {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toTimeString().slice(0, 5);
}
