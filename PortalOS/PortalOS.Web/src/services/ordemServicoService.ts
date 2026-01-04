import { httpClient } from 'd-rts';
import type { OrdemServico, CreateOrdemServicoRequest, UpdateOrdemServicoRequest } from '../types/ordemServico';

const BASE_URL = '/ordemservico';

export const ordemServicoService = {
  getById: (id: number) => httpClient.get<OrdemServico>(`${BASE_URL}/${id}`),

  getByTarefa: (tarefaId: number) => httpClient.get<OrdemServico[]>(`${BASE_URL}/tarefa/${tarefaId}`),

  getByColaborador: (colaboradorId: number) => httpClient.get<OrdemServico[]>(`${BASE_URL}/colaborador/${colaboradorId}`),

  getByMesAno: (ano: number, mes: number) => httpClient.get<OrdemServico[]>(`${BASE_URL}/mes/${ano}/${mes}`),

  getTotalHorasMes: (ano: number, mes: number) =>
    httpClient.get<{ ano: number; mes: number; totalHoras: number }>(`${BASE_URL}/total-horas/${ano}/${mes}`),

  getTotalHorasMesPorColaborador: (ano: number, mes: number, colaboradorId: number) =>
    httpClient.get<{ ano: number; mes: number; colaboradorId: number; totalHoras: number }>(
      `${BASE_URL}/total-horas/${ano}/${mes}/${colaboradorId}`
    ),

  create: (data: CreateOrdemServicoRequest) => httpClient.post<OrdemServico>(`${BASE_URL}/Create`, data),

  update: (id: number, data: UpdateOrdemServicoRequest) => httpClient.put<OrdemServico>(`${BASE_URL}/${id}`, data),

  delete: (id: number) => httpClient.delete(`${BASE_URL}/${id}`),
};
