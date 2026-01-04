const MESES_ABREVIADOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function formatMes(mes: number): string {
  return MESES_ABREVIADOS[mes - 1] || '';
}

export function formatHoras(horas: number): string {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
