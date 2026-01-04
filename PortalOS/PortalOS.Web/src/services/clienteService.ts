import { httpClient, ODataHelper } from 'd-rts';
import type { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../types/cliente';
import type { PaginatedResult, PaginationParams } from 'd-rts';

const BASE_URL = '/cliente';

export const clienteService = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResult<Cliente>> => {
    const oDataParams = params ? ODataHelper.fromPaginationParams(params) : { $count: true };

    if (params?.search) {
      oDataParams.$filter = ODataHelper.createSearchFilter(params.search, ['razaoSocial', 'cnpj', 'responsavel']);
    }

    oDataParams.$select = 'Id,RazaoSocial,Cnpj,Responsavel,Telefone,EmailResponsavel,EmailFinanceiro,Endereco,StatusCliente,ClienteTotvs';

    const query = ODataHelper.buildQuery(oDataParams);
    const response = await httpClient.get<Cliente[]>(`${BASE_URL}/GetAll${query}`);

    return ODataHelper.processResponse<Cliente>(response.data, params);
  },

  getById: (id: number) => httpClient.get<Cliente>(`${BASE_URL}/${id}`),

  getAtivos: () => httpClient.get<Cliente[]>(`${BASE_URL}/ativos`),

  create: (data: CreateClienteRequest) => httpClient.post<Cliente>(`${BASE_URL}/Create`, data),

  update: (id: number, data: UpdateClienteRequest) => httpClient.put<Cliente>(`${BASE_URL}/${id}`, data),

  delete: (id: number) => httpClient.delete(`${BASE_URL}/${id}`),
};
