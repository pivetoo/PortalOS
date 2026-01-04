using dNET.Domain.Repositories;
using dNET.Domain.Services;
using PortalOS.Domain.Entities;
using PortalOS.Domain.ViewModels;

namespace PortalOS.Domain.Services
{
    public class OrdemServicoService : ServiceCrud<OrdemServico>
    {
        private readonly TarefaService _tarefaService;
        private readonly ColaboradorService _colaboradorService;

        public OrdemServicoService(IUnitOfWork unitOfWork, TarefaService tarefaService, ColaboradorService colaboradorService) : base(unitOfWork)
        {
            _tarefaService = tarefaService;
            _colaboradorService = colaboradorService;
        }

        public OrdemServico Create(CreateOrdemServicoRequest request, long colaboradorId)
        {
            var tarefa = _tarefaService.GetById(request.TarefaId);
            if (tarefa == null)
            {
                ThrowError("Tarefa nao encontrada");
            }

            var colaborador = _colaboradorService.GetById(colaboradorId);
            if (colaborador == null)
            {
                ThrowError("Colaborador nao encontrado");
            }

            var os = new OrdemServico
            {
                Tarefa = tarefa,
                Colaborador = colaborador,
                DataAgenda = DateTime.Now,
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

            var tarefa = _tarefaService.GetById(request.TarefaId);
            if (tarefa == null)
            {
                ThrowError("Tarefa nao encontrada");
            }

            os.Tarefa = tarefa;
            os.DataAgenda = request.DataAgenda;
            os.HoraInicio = request.HoraInicio;
            os.InicioIntervalo = request.InicioIntervalo;
            os.FimIntervalo = request.FimIntervalo;
            os.HoraFim = request.HoraFim;
            os.Descricao = request.Descricao;

            Merge(os);
            return os;
        }

        public IEnumerable<OrdemServico> GetByTarefa(long tarefaId)
        {
            return Query(os => os.Tarefa.Id == tarefaId);
        }

        public IEnumerable<OrdemServico> GetByColaborador(long colaboradorId)
        {
            return Query(os => os.Colaborador.Id == colaboradorId);
        }

        public IEnumerable<OrdemServico> GetByPeriodo(DateTime dataInicio, DateTime dataFim)
        {
            return Query(os => os.DataAgenda >= dataInicio && os.DataAgenda <= dataFim);
        }

        public IEnumerable<OrdemServico> GetByMesAno(int mes, int ano)
        {
            var inicio = new DateTime(ano, mes, 1);
            var fim = inicio.AddMonths(1).AddDays(-1);
            return Query(os => os.DataAgenda >= inicio && os.DataAgenda <= fim);
        }

        public decimal GetTotalHorasMes(int mes, int ano)
        {
            var ordens = GetByMesAno(mes, ano);
            return ordens.Sum(os => CalcularHorasTrabalhadas(os));
        }

        public decimal GetTotalHorasMesPorColaborador(int mes, int ano, long colaboradorId)
        {
            var ordens = GetByMesAno(mes, ano).Where(os => os.Colaborador?.Id == colaboradorId);
            return ordens.Sum(os => CalcularHorasTrabalhadas(os));
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
