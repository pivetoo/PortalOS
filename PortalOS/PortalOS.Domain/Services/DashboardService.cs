using PortalOS.Domain.ViewModels;
using PortalOS.Domain.ValueObjects;

namespace PortalOS.Domain.Services
{
    public class DashboardService
    {
        private readonly OrdemServicoService _ordemServicoService;
        private readonly ProjetoService _projetoService;

        private static readonly string[] MesesAbreviados = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        public DashboardService(OrdemServicoService ordemServicoService, ProjetoService projetoService)
        {
            _ordemServicoService = ordemServicoService;
            _projetoService = projetoService;
        }

        public DashboardResponse GetDashboardData(int ano)
        {
            var mesAtual = DateTime.Now.Month;

            var response = new DashboardResponse
            {
                HorasMesAtual = _ordemServicoService.GetTotalHorasMes(mesAtual, ano),
                ProjetosAtivos = GetProjetosAtivosCount(),
                ProjetosFinalizados = GetProjetosFinalizadosCount(),
                HorasPorMes = GetHorasPorMes(ano),
                HorasPorProjeto = GetHorasPorProjeto(ano)
            };

            return response;
        }

        public DashboardResponse GetDashboardDataPorColaborador(int ano, string colaborador)
        {
            var mesAtual = DateTime.Now.Month;

            var response = new DashboardResponse
            {
                HorasMesAtual = _ordemServicoService.GetTotalHorasMesPorColaborador(mesAtual, ano, colaborador),
                ProjetosAtivos = GetProjetosAtivosCount(),
                ProjetosFinalizados = GetProjetosFinalizadosCount(),
                HorasPorMes = GetHorasPorMesPorColaborador(ano, colaborador),
                HorasPorProjeto = GetHorasPorProjetoPorColaborador(ano, colaborador)
            };

            return response;
        }

        private int GetProjetosAtivosCount()
        {
            return _projetoService.GetAtivos().Count();
        }

        private int GetProjetosFinalizadosCount()
        {
            return _projetoService.Query(p => p.StatusProjeto == StatusProjeto.Inativo).Count();
        }

        private List<HorasPorMesItem> GetHorasPorMes(int ano)
        {
            var resultado = new List<HorasPorMesItem>();

            for (int mes = 1; mes <= 12; mes++)
            {
                var horas = _ordemServicoService.GetTotalHorasMes(mes, ano);
                resultado.Add(new HorasPorMesItem
                {
                    Name = MesesAbreviados[mes - 1],
                    Horas = horas
                });
            }

            return resultado;
        }

        private List<HorasPorMesItem> GetHorasPorMesPorColaborador(int ano, string colaborador)
        {
            var resultado = new List<HorasPorMesItem>();

            for (int mes = 1; mes <= 12; mes++)
            {
                var horas = _ordemServicoService.GetTotalHorasMesPorColaborador(mes, ano, colaborador);
                resultado.Add(new HorasPorMesItem
                {
                    Name = MesesAbreviados[mes - 1],
                    Horas = horas
                });
            }

            return resultado;
        }

        private List<HorasPorProjetoItem> GetHorasPorProjeto(int ano)
        {
            var dataInicio = new DateTime(ano, 1, 1);
            var dataFim = new DateTime(ano, 12, 31);
            var ordens = _ordemServicoService.GetByPeriodo(dataInicio, dataFim);

            var agrupado = ordens
                .GroupBy(os => os.Projeto.Nome)
                .Select(g => new HorasPorProjetoItem
                {
                    Name = g.Key,
                    Value = g.Sum(os => CalcularHorasTrabalhadas(os))
                })
                .OrderByDescending(x => x.Value)
                .Take(10)
                .ToList();

            return agrupado;
        }

        private List<HorasPorProjetoItem> GetHorasPorProjetoPorColaborador(int ano, string colaborador)
        {
            var dataInicio = new DateTime(ano, 1, 1);
            var dataFim = new DateTime(ano, 12, 31);
            var ordens = _ordemServicoService.GetByPeriodo(dataInicio, dataFim)
                .Where(os => os.Colaborador == colaborador);

            var agrupado = ordens
                .GroupBy(os => os.Projeto.Nome)
                .Select(g => new HorasPorProjetoItem
                {
                    Name = g.Key,
                    Value = g.Sum(os => CalcularHorasTrabalhadas(os))
                })
                .OrderByDescending(x => x.Value)
                .Take(10)
                .ToList();

            return agrupado;
        }

        private static decimal CalcularHorasTrabalhadas(Entities.OrdemServico os)
        {
            var totalMinutos = (os.HoraFim - os.HoraInicio).TotalMinutes;

            if (os.InicioIntervalo.HasValue && os.FimIntervalo.HasValue)
            {
                var intervaloMinutos = (os.FimIntervalo.Value - os.InicioIntervalo.Value).TotalMinutes;
                totalMinutos -= intervaloMinutos;
            }

            return (decimal)(totalMinutos / 60);
        }
    }
}
