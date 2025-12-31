using dNET.Domain.Entities;

namespace PortalOS.Domain.Entities
{
    public class OrdemServico : EntidadeBase
    {
        public Projeto Projeto { get; set; }

        public DateTime DataAgenda { get; set; }

        public DateTime HoraInicio { get; set; }

        public DateTime? InicioIntervalo { get; set; }

        public DateTime? FimIntervalo { get; set; }

        public DateTime HoraFim { get; set; }

        public string Descricao { get; set; }

        public string Colaborador { get; set; }
    }
}
