using dNET.Domain.Repositories;
using dNET.Domain.Services;
using PortalOS.Domain.Entities;

namespace PortalOS.Domain.Services
{
    public class ColaboradorService : ServiceCrud<Colaborador>
    {
        public ColaboradorService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public Colaborador GetByUsuarioIdp(long usuarioIdp)
        {
            return Query(c => c.UsuarioIdp == usuarioIdp).FirstOrDefault();
        }

        public Colaborador GetOrCreate(long usuarioIdp, string nome, string email)
        {
            var colaborador = GetByUsuarioIdp(usuarioIdp);

            if (colaborador != null)
            {
                if (colaborador.Nome != nome || colaborador.Email != email)
                {
                    colaborador.Nome = nome;
                    colaborador.Email = email;
                    Merge(colaborador);
                }
                return colaborador;
            }

            colaborador = new Colaborador
            {
                UsuarioIdp = usuarioIdp,
                Nome = nome,
                Email = email,
                Ativo = true
            };

            Insert(colaborador);
            return colaborador;
        }

        public IEnumerable<Colaborador> GetAtivos()
        {
            return Query(c => c.Ativo);
        }
    }
}
