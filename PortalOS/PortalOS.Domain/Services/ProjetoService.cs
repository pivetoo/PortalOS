using dNET.Domain.Repositories;
using dNET.Domain.Services;
using PortalOS.Domain.Entities;
using PortalOS.Domain.ViewModels;

namespace PortalOS.Domain.Services
{
    public class ProjetoService : ServiceCrud<Projeto>
    {
        private readonly ClienteService _clienteService;

        public ProjetoService(IUnitOfWork unitOfWork, ClienteService clienteService) : base(unitOfWork)
        {
            _clienteService = clienteService;
        }

        public Projeto Create(CreateProjetoRequest request)
        {
            var cliente = _clienteService.GetById(request.ClienteId);
            if (cliente == null)
            {
                ThrowError("Cliente nao encontrado");
            }

            var projeto = new Projeto
            {
                Cliente = cliente,
                Nome = request.Nome,
                Responsavel = request.Responsavel,
                EmailResponsavel = request.EmailResponsavel,
                StatusProjeto = request.StatusProjeto
            };

            Insert(projeto);
            return projeto;
        }

        public Projeto Update(long id, UpdateProjetoRequest request)
        {
            if (id != request.Id)
            {
                ThrowError("ID da URL nao confere com ID do body");
            }

            var projeto = GetById(id);
            if (projeto == null)
            {
                ThrowError("Projeto nao encontrado");
            }

            var cliente = _clienteService.GetById(request.ClienteId);
            if (cliente == null)
            {
                ThrowError("Cliente nao encontrado");
            }

            projeto.Cliente = cliente;
            projeto.Nome = request.Nome;
            projeto.Responsavel = request.Responsavel;
            projeto.EmailResponsavel = request.EmailResponsavel;
            projeto.StatusProjeto = request.StatusProjeto;

            Merge(projeto);
            return projeto;
        }

        public IEnumerable<Projeto> GetByCliente(long clienteId)
        {
            return Query(p => p.Cliente.Id == clienteId);
        }

        public IEnumerable<Projeto> GetAtivos()
        {
            return Query(p => p.StatusProjeto != ValueObjects.StatusProjeto.Entregue);
        }
    }
}
