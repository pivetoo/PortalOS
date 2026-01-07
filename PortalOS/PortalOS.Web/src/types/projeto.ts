export const StatusProjeto = {
  AguardandoInicio: 0,
  EmAndamento: 1,
  EmHomologacao: 2,
  Entregue: 3
} as const;

export const StatusProjetoLabels: Record<number, string> = {
  0: 'Aguardando Início',
  1: 'Em Andamento',
  2: 'Em Homologação',
  3: 'Entregue'
};

export type StatusProjeto = typeof StatusProjeto[keyof typeof StatusProjeto];

export interface Projeto {
  id: number;
  clienteId: number;
  clienteNome: string;
  nome: string;
  responsavel: string;
  emailResponsavel: string;
  statusProjeto: StatusProjeto;
}

export interface CreateProjetoRequest {
  clienteId: number;
  nome: string;
  responsavel: string;
  emailResponsavel: string;
  statusProjeto: StatusProjeto;
}

export interface UpdateProjetoRequest extends CreateProjetoRequest {
  id: number;
}
