using PortalOS.Domain.Entities;

namespace PortalOS.Domain.ViewModels
{
    public class CreateOrdemServicoRequest
    {
        public long ProjetoId { get; set; }
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
        public long ProjetoId { get; set; }
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
        public string Colaborador { get; set; }
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
                ProjetoId = os.Projeto?.Id ?? 0,
                ProjetoNome = os.Projeto?.Nome,
                ClienteId = os.Projeto?.Cliente?.Id ?? 0,
                ClienteNome = os.Projeto?.Cliente?.RazaoSocial,
                DataAgenda = os.DataAgenda,
                HoraInicio = os.HoraInicio,
                InicioIntervalo = os.InicioIntervalo,
                FimIntervalo = os.FimIntervalo,
                HoraFim = os.HoraFim,
                Descricao = os.Descricao,
                Colaborador = os.Colaborador,
                TotalHoras = (decimal)(totalMinutos / 60)
            };
        }
    }
}
