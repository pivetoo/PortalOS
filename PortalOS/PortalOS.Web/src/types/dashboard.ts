export interface HorasPorMesItem {
  mes: number;
  horas: number;
}

export interface DashboardResponse {
  horasMesAtual: number;
  horasPorMes: HorasPorMesItem[];
}
