using PortalOS.Domain.Entities;
using PortalOS.Domain.ValueObjects;
using PortalOS.Domain.ViewModels;

namespace PortalOS.Domain.Services
{
    public class DashboardService
    {
        private readonly OrdemServicoService _ordemServicoService;
        private readonly ProjetoService _projetoService;

        public DashboardService(OrdemServicoService ordemServicoService, ProjetoService projetoService)
        {
            _ordemServicoService = ordemServicoService;
            _projetoService = projetoService;
        }

        public DashboardResponse GetDashboardData(int ano, long colaboradorId)
        {
            var projetosIds = GetProjetosIdsPorColaborador(colaboradorId);

            return new DashboardResponse
            {
                HorasMesAtual = _ordemServicoService.GetTotalHorasMesPorColaborador(DateTime.Now.Month, ano, colaboradorId),
                ProjetosAtivos = _projetoService.Query(p => projetosIds.Contains(p.Id) && p.StatusProjeto == StatusProjeto.Ativo).Count(),
                ProjetosFinalizados = _projetoService.Query(p => projetosIds.Contains(p.Id) && p.StatusProjeto == StatusProjeto.Inativo).Count(),
                HorasPorMes = GetHorasPorMes(ano, colaboradorId),
                HorasPorProjeto = GetHorasPorProjeto(ano, colaboradorId)
            };
        }

        private List<long> GetProjetosIdsPorColaborador(long colaboradorId)
        {
            return _ordemServicoService
                .Query(os => os.Colaborador.Id == colaboradorId)
                .Where(os => os.Tarefa != null && os.Tarefa.Projeto != null)
                .Select(os => os.Tarefa.Projeto.Id)
                .Distinct()
                .ToList();
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

        private List<HorasPorProjetoItem> GetHorasPorProjeto(int ano, long colaboradorId)
        {
            var dataInicio = new DateTime(ano, 1, 1);
            var dataFim = new DateTime(ano, 12, 31);

            return _ordemServicoService
                .GetByPeriodo(dataInicio, dataFim)
                .Where(os => os.Colaborador?.Id == colaboradorId && os.Tarefa?.Projeto != null)
                .GroupBy(os => os.Tarefa.Projeto.Nome)
                .Select(g => new HorasPorProjetoItem
                {
                    Name = g.Key,
                    Value = g.Sum(CalcularHorasTrabalhadas)
                })
                .OrderByDescending(x => x.Value)
                .Take(10)
                .ToList();
        }

        private static decimal CalcularHorasTrabalhadas(OrdemServico os)
        {
            var totalMinutos = (os.HoraFim - os.HoraInicio).TotalMinutes;

            if (os.InicioIntervalo.HasValue && os.FimIntervalo.HasValue)
            {
                totalMinutos -= (os.FimIntervalo.Value - os.InicioIntervalo.Value).TotalMinutes;
            }

            return (decimal)(totalMinutos / 60);
        }
    }
}
