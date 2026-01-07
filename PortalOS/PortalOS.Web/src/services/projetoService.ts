import { httpClient, ODataHelper } from 'd-rts';
import type { Projeto, CreateProjetoRequest, UpdateProjetoRequest } from '../types/projeto';
import type { PaginatedResult, PaginationParams } from 'd-rts';

const BASE_URL = '/projeto';

export const projetoService = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResult<Projeto>> => {
    const oDataParams = params ? ODataHelper.fromPaginationParams(params) : { $count: true };

    if (params?.search) {
      oDataParams.$filter = ODataHelper.createSearchFilter(params.search, ['nome', 'responsavel']);
    }

    oDataParams.$select = 'Id,Nome,Responsavel,EmailResponsavel,StatusProjeto';
    oDataParams.$expand = 'Cliente($select=Id,RazaoSocial)';

    const query = ODataHelper.buildQuery(oDataParams);
    const response = await httpClient.get<Projeto[]>(`${BASE_URL}/GetAll${query}`);

    return ODataHelper.processResponse<Projeto>(response.data, params, (item) => ({
      ...item,
      clienteId: item.cliente?.id ?? 0,
      clienteNome: item.cliente?.razaoSocial ?? ''
    }));
  },

  getById: (id: number) => httpClient.get<Projeto>(`${BASE_URL}/${id}`),

  getByCliente: (clienteId: number) => httpClient.get<Projeto[]>(`${BASE_URL}/cliente/${clienteId}`),

  getAtivos: () => httpClient.get<Projeto[]>(`${BASE_URL}/ativos`),

  create: (data: CreateProjetoRequest) => httpClient.post<Projeto>(`${BASE_URL}/Create`, data),

  update: (id: number, data: UpdateProjetoRequest) => httpClient.put<Projeto>(`${BASE_URL}/${id}`, data),

  delete: (id: number) => httpClient.delete(`${BASE_URL}/${id}`),
};
