const BASE_URL = '/relatorio';

export const relatorioService = {
  downloadPdfOrdemServico: async (id: number) => {
    const token = localStorage.getItem('@IdentityProvider:accessToken');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    const response = await fetch(`${baseUrl}${BASE_URL}/ordemservico/${id}/pdf`, {
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

    const response = await fetch(`${baseUrl}${BASE_URL}/ordemservico/${ano}/${mes}/pdf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar relatório');
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

  downloadPdfPorPeriodo: async (dataInicio: string, dataFim: string) => {
    const token = localStorage.getItem('@IdentityProvider:accessToken');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    const response = await fetch(
      `${baseUrl}${BASE_URL}/ordemservico/periodo/pdf?dataInicio=${dataInicio}&dataFim=${dataFim}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Nenhuma Ordem de Serviço encontrada no período');
      }
      throw new Error('Erro ao gerar relatório');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const inicio = dataInicio.replace(/-/g, '');
    const fim = dataFim.replace(/-/g, '');
    link.download = `OS_${inicio}_a_${fim}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
