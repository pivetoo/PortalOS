import { httpClient } from 'd-rts';
import type { Tarefa, CreateTarefaRequest, UpdateTarefaRequest } from '../types/tarefa';

const BASE_URL = '/tarefa';

export const tarefaService = {
  getById: (id: number) => httpClient.get<Tarefa>(`${BASE_URL}/${id}`),

  getByProjeto: (projetoId: number) => httpClient.get<Tarefa[]>(`${BASE_URL}/projeto/${projetoId}`),

  create: (data: CreateTarefaRequest) => httpClient.post<Tarefa>(`${BASE_URL}/Create`, data),

  update: (id: number, data: UpdateTarefaRequest) => httpClient.put<Tarefa>(`${BASE_URL}/${id}`, data),

  delete: (id: number) => httpClient.delete(`${BASE_URL}/${id}`),
};
