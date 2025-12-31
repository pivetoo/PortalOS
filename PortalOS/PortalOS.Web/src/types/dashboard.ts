export interface HorasPorMesItem {
  name: string;
  horas: number;
}

export interface HorasPorProjetoItem {
  name: string;
  value: number;
}

export interface DashboardResponse {
  horasMesAtual: number;
  projetosAtivos: number;
  projetosFinalizados: number;
  horasPorMes: HorasPorMesItem[];
  horasPorProjeto: HorasPorProjetoItem[];
}
