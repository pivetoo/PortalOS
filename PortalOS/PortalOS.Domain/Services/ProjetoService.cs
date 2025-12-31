using dNET.Domain.Interfaces;
using dNET.Domain.Repositories;
using dNET.Domain.Services;
using Microsoft.Extensions.Logging;
using PortalOS.Domain.Entities;
using PortalOS.Domain.ViewModels;

namespace PortalOS.Domain.Services
{
    public class ProjetoService : ServiceCrud<Projeto>
    {
        private readonly ClienteService _clienteService;

        public ProjetoService(IUnitOfWork unitOfWork, ILogger<ServiceCrud<Projeto>> log, ClienteService clienteService, II18nService? i18nService = null) : base(unitOfWork, log, i18nService)
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
                StatusProjeto = request.StatusProjeto,
                QtdTotalHoras = request.QtdTotalHoras
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
            projeto.QtdTotalHoras = request.QtdTotalHoras;

            Merge(projeto);
            return projeto;
        }

        public IEnumerable<Projeto> GetByCliente(long clienteId)
        {
            return Query(p => p.Cliente.Id == clienteId);
        }

        public IEnumerable<Projeto> GetAtivos()
        {
            return Query(p => p.StatusProjeto == ValueObjects.StatusProjeto.Ativo);
        }
    }
}
