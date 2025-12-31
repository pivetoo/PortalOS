export const StatusCliente = {
  Ativo: 0,
  Inativo: 1
} as const;

export type StatusCliente = typeof StatusCliente[keyof typeof StatusCliente];

export interface Cliente {
  id: number;
  razaoSocial: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  emailResponsavel: string;
  emailFinanceiro: string;
  endereco: string;
  statusCliente: StatusCliente;
  clienteTotvs: boolean;
}

export interface CreateClienteRequest {
  razaoSocial: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  emailResponsavel: string;
  emailFinanceiro: string;
  endereco: string;
  statusCliente: StatusCliente;
  clienteTotvs: boolean;
}

export interface UpdateClienteRequest extends CreateClienteRequest {
  id: number;
}
