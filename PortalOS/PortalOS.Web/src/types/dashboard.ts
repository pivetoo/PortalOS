export interface HorasPorMesItem {
  mes: number;
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
