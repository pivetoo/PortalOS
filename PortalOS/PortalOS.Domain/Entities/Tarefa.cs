using dNET.Domain.Entities;
using dNET.Domain.Utils.Attributes;

namespace PortalOS.Domain.Entities
{
    public class Tarefa : EntidadeBase
    {
        [NotEmpty]
        public string Nome { get; set; }

        public string Descricao { get; set; }

        public Projeto Projeto { get; set; }
    }
}
