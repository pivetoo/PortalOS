using PortalOS.Domain.Entities;

namespace PortalOS.Domain.ViewModels
{
    public class CreateOrdemServicoRequest
    {
        public long TarefaId { get; set; }
        public DateTime DataAgenda { get; set; }
        public DateTime HoraInicio { get; set; }
        public DateTime? InicioIntervalo { get; set; }
        public DateTime? FimIntervalo { get; set; }
        public DateTime HoraFim { get; set; }
        public string Descricao { get; set; }
    }

    public class UpdateOrdemServicoRequest
    {
        public long Id { get; set; }
        public long TarefaId { get; set; }
        public DateTime DataAgenda { get; set; }
        public DateTime HoraInicio { get; set; }
        public DateTime? InicioIntervalo { get; set; }
        public DateTime? FimIntervalo { get; set; }
        public DateTime HoraFim { get; set; }
        public string Descricao { get; set; }
    }

    public class OrdemServicoResponse
    {
        public long Id { get; set; }
        public long TarefaId { get; set; }
        public string TarefaNome { get; set; }
        public long ProjetoId { get; set; }
        public string ProjetoNome { get; set; }
        public long ClienteId { get; set; }
        public string ClienteNome { get; set; }
        public DateTime DataAgenda { get; set; }
        public DateTime HoraInicio { get; set; }
        public DateTime? InicioIntervalo { get; set; }
        public DateTime? FimIntervalo { get; set; }
        public DateTime HoraFim { get; set; }
        public string Descricao { get; set; }
        public long? ColaboradorId { get; set; }
        public string ColaboradorNome { get; set; }
        public decimal TotalHoras { get; set; }

        public static OrdemServicoResponse FromEntity(OrdemServico os)
        {
            var totalMinutos = (os.HoraFim - os.HoraInicio).TotalMinutes;
            if (os.InicioIntervalo.HasValue && os.FimIntervalo.HasValue)
            {
                totalMinutos -= (os.FimIntervalo.Value - os.InicioIntervalo.Value).TotalMinutes;
            }

            return new OrdemServicoResponse
            {
                Id = os.Id,
                TarefaId = os.Tarefa?.Id ?? 0,
                TarefaNome = os.Tarefa?.Nome,
                ProjetoId = os.Tarefa?.Projeto?.Id ?? 0,
                ProjetoNome = os.Tarefa?.Projeto?.Nome,
                ClienteId = os.Tarefa?.Projeto?.Cliente?.Id ?? 0,
                ClienteNome = os.Tarefa?.Projeto?.Cliente?.RazaoSocial,
                DataAgenda = os.DataAgenda,
                HoraInicio = os.HoraInicio,
                InicioIntervalo = os.InicioIntervalo,
                FimIntervalo = os.FimIntervalo,
                HoraFim = os.HoraFim,
                Descricao = os.Descricao,
                ColaboradorId = os.Colaborador?.Id,
                ColaboradorNome = os.Colaborador?.Nome,
                TotalHoras = (decimal)(totalMinutos / 60)
            };
        }
    }
}
