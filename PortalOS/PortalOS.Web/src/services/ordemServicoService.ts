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

  downloadPdf: async (id: number) => {
    const token = localStorage.getItem('@IdentityProvider:accessToken');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    const response = await fetch(`${baseUrl}${BASE_URL}/${id}/pdf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OS_${id.toString().padStart(9, '0')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  downloadRelatorioMensal: async (ano: number, mes: number) => {
    const token = localStorage.getItem('@IdentityProvider:accessToken');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    const response = await fetch(`${baseUrl}${BASE_URL}/relatorio/${ano}/${mes}/pdf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar relatorio');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    link.download = `Relacao_OS_${meses[mes - 1]}_${ano}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
