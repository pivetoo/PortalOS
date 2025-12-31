export const StatusProjeto = {
  Ativo: 0,
  Inativo: 1
} as const;

export type StatusProjeto = typeof StatusProjeto[keyof typeof StatusProjeto];

export interface Projeto {
  id: number;
  clienteId: number;
  clienteNome: string;
  nome: string;
  responsavel: string;
  emailResponsavel: string;
  statusProjeto: StatusProjeto;
  qtdTotalHoras: number;
}

export interface CreateProjetoRequest {
  clienteId: number;
  nome: string;
  responsavel: string;
  emailResponsavel: string;
  statusProjeto: StatusProjeto;
  qtdTotalHoras: number;
}

export interface UpdateProjetoRequest extends CreateProjetoRequest {
  id: number;
}
