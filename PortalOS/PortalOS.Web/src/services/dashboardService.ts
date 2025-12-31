import { httpClient } from 'd-rts';
import type { DashboardResponse } from '../types/dashboard';

const BASE_URL = '/dashboard';

export const dashboardService = {
  get: async (ano?: number): Promise<DashboardResponse> => {
    const query = ano ? `?ano=${ano}` : '';
    const response = await httpClient.get<DashboardResponse>(`${BASE_URL}/Get/${query}`);
    return response.data;
  },

  getByColaborador: async (colaborador: string, ano?: number): Promise<DashboardResponse> => {
    const query = ano ? `?ano=${ano}` : '';
    const response = await httpClient.get<DashboardResponse>(`${BASE_URL}/colaborador/${colaborador}${query}`);
    return response.data;
  }
};
