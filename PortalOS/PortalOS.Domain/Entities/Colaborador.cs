using dNET.Domain.Entities;

namespace PortalOS.Domain.Entities
{
    public class Colaborador : EntidadeBase
    {
        public long UsuarioIdp { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public bool Ativo { get; set; }
    }
}
