export interface Tarefa {
  id: number;
  projetoId: number;
  projetoNome: string;
  nome: string;
  descricao: string;
}

export interface CreateTarefaRequest {
  projetoId: number;
  nome: string;
  descricao: string;
}

export interface UpdateTarefaRequest extends CreateTarefaRequest {
  id: number;
}
