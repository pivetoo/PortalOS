using dNET.Domain.Interfaces;
using dNET.Domain.Repositories;
using dNET.Domain.Services;
using Microsoft.Extensions.Logging;
using PortalOS.Domain.Entities;
using PortalOS.Domain.ViewModels;

namespace PortalOS.Domain.Services
{
    public class OrdemServicoService : ServiceCrud<OrdemServico>
    {
        private readonly ProjetoService _projetoService;

        public OrdemServicoService(IUnitOfWork unitOfWork, ILogger<ServiceCrud<OrdemServico>> log, ProjetoService projetoService, II18nService? i18nService = null) : base(unitOfWork, log, i18nService)
        {
            _projetoService = projetoService;
        }

        public OrdemServico Create(CreateOrdemServicoRequest request)
        {
            var projeto = _projetoService.GetById(request.ProjetoId);
            if (projeto == null)
            {
                ThrowError("Projeto nao encontrado");
            }

            var os = new OrdemServico
            {
                Projeto = projeto,
                DataAgenda = request.DataAgenda,
                HoraInicio = request.HoraInicio,
                InicioIntervalo = request.InicioIntervalo,
                FimIntervalo = request.FimIntervalo,
                HoraFim = request.HoraFim,
                Descricao = request.Descricao
            };

            Insert(os);
            return os;
        }

        public OrdemServico Update(long id, UpdateOrdemServicoRequest request)
        {
            if (id != request.Id)
            {
                ThrowError("ID da URL nao confere com ID do body");
            }

            var os = GetById(id);
            if (os == null)
            {
                ThrowError("Ordem de Servico nao encontrada");
            }

            var projeto = _projetoService.GetById(request.ProjetoId);
            if (projeto == null)
            {
                ThrowError("Projeto nao encontrado");
            }

            os.Projeto = projeto;
            os.DataAgenda = request.DataAgenda;
            os.HoraInicio = request.HoraInicio;
            os.InicioIntervalo = request.InicioIntervalo;
            os.FimIntervalo = request.FimIntervalo;
            os.HoraFim = request.HoraFim;
            os.Descricao = request.Descricao;

            Merge(os);
            return os;
        }

        public IEnumerable<OrdemServico> GetByProjeto(long projetoId)
        {
            return Query(os => os.Projeto.Id == projetoId);
        }

        public IEnumerable<OrdemServico> GetByColaborador(string colaborador)
        {
            return Query(os => os.Colaborador == colaborador);
        }

        public IEnumerable<OrdemServico> GetByPeriodo(DateTime dataInicio, DateTime dataFim)
        {
            return Query(os => os.DataAgenda >= dataInicio && os.DataAgenda <= dataFim);
        }

        public IEnumerable<OrdemServico> GetByMesAno(int mes, int ano)
        {
            return Query(os => os.DataAgenda.Month == mes && os.DataAgenda.Year == ano);
        }

        public decimal GetTotalHorasMes(int mes, int ano)
        {
            var query = Query(os => os.DataAgenda.Month == mes && os.DataAgenda.Year == ano);
            return query.Sum(os => CalcularHorasTrabalhadas(os));
        }

        public decimal GetTotalHorasMesPorColaborador(int mes, int ano, string colaborador)
        {
            var query = Query(os => os.DataAgenda.Month == mes && os.DataAgenda.Year == ano && os.Colaborador == colaborador);
            return query.Sum(os => CalcularHorasTrabalhadas(os));
        }

        private decimal CalcularHorasTrabalhadas(OrdemServico os)
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
