using dNET.Domain.Entities;
using dNET.Domain.Utils.Attributes;
using PortalOS.Domain.ValueObjects;

namespace PortalOS.Domain.Entities
{
    public class Projeto : EntidadeBase
    {
        [NotEmpty]
        public string Nome { get; set; }

        public string Responsavel { get; set; }

        public string EmailResponsavel { get; set; }

        public StatusProjeto StatusProjeto { get; set; }

        public decimal QtdTotalHoras { get; set; }

        public Cliente Cliente { get; set; }
    }
}
