export interface OrdemServico {
  id: number;
  tarefaId: number;
  tarefaNome: string;
  projetoId: number;
  projetoNome: string;
  clienteId: number;
  clienteNome: string;
  dataAgenda: string;
  horaInicio: string;
  inicioIntervalo: string | null;
  fimIntervalo: string | null;
  horaFim: string;
  descricao: string;
  colaboradorId: number | null;
  colaboradorNome: string;
  totalHoras: number;
}

export interface CreateOrdemServicoRequest {
  tarefaId: number;
  horaInicio: string;
  inicioIntervalo?: string | null;
  fimIntervalo?: string | null;
  horaFim: string;
  descricao: string;
}

export interface UpdateOrdemServicoRequest {
  id: number;
  tarefaId: number;
  dataAgenda: string;
  horaInicio: string;
  inicioIntervalo?: string | null;
  fimIntervalo?: string | null;
  horaFim: string;
  descricao: string;
}
