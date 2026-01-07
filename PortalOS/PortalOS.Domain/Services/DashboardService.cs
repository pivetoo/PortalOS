using PortalOS.Domain.ViewModels;

namespace PortalOS.Domain.Services
{
    public class DashboardService
    {
        private readonly OrdemServicoService _ordemServicoService;

        public DashboardService(OrdemServicoService ordemServicoService)
        {
            _ordemServicoService = ordemServicoService;
        }

        public DashboardResponse GetDashboardData(int ano, long colaboradorId)
        {
            return new DashboardResponse
            {
                HorasMesAtual = _ordemServicoService.GetTotalHorasMesPorColaborador(DateTime.Now.Month, ano, colaboradorId),
                HorasPorMes = GetHorasPorMes(ano, colaboradorId)
            };
        }

        private List<HorasPorMesItem> GetHorasPorMes(int ano, long colaboradorId)
        {
            return Enumerable.Range(1, 12)
                .Select(mes => new HorasPorMesItem
                {
                    Mes = mes,
                    Horas = _ordemServicoService.GetTotalHorasMesPorColaborador(mes, ano, colaboradorId)
                })
                .ToList();
        }
    }
}
