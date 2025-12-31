using dNET.Domain.Repositories;
using dNET.Domain.Services;
using PortalOS.Domain.Entities;
using PortalOS.Domain.ViewModels;

namespace PortalOS.Domain.Services
{
    public class ClienteService : ServiceCrud<Cliente>
    {
        public ClienteService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public override bool CustomValidate(Cliente entity)
        {
            if (!string.IsNullOrEmpty(entity.Cnpj) && Exists(c => c.Cnpj == entity.Cnpj && c.Id != entity.Id))
            {
                return MessageError("Cliente com este CNPJ ja existe");
            }
            return base.CustomValidate(entity);
        }

        public Cliente Create(CreateClienteRequest request)
        {
            var cliente = new Cliente
            {
                RazaoSocial = request.RazaoSocial,
                Cnpj = request.Cnpj,
                Responsavel = request.Responsavel,
                Telefone = request.Telefone,
                EmailResponsavel = request.EmailResponsavel,
                EmailFinanceiro = request.EmailFinanceiro,
                Endereco = request.Endereco,
                StatusCliente = request.StatusCliente,
                ClienteTotvs = request.ClienteTotvs
            };

            Insert(cliente);
            return cliente;
        }

        public Cliente Update(long id, UpdateClienteRequest request)
        {
            if (id != request.Id)
            {
                ThrowError("ID da URL nao confere com ID do body");
            }

            var cliente = GetById(id);
            if (cliente == null)
            {
                ThrowError("Cliente nao encontrado");
            }

            cliente.RazaoSocial = request.RazaoSocial;
            cliente.Cnpj = request.Cnpj;
            cliente.Responsavel = request.Responsavel;
            cliente.Telefone = request.Telefone;
            cliente.EmailResponsavel = request.EmailResponsavel;
            cliente.EmailFinanceiro = request.EmailFinanceiro;
            cliente.Endereco = request.Endereco;
            cliente.StatusCliente = request.StatusCliente;
            cliente.ClienteTotvs = request.ClienteTotvs;

            Merge(cliente);
            return cliente;
        }

        public IEnumerable<Cliente> GetAtivos()
        {
            return Query(c => c.StatusCliente == ValueObjects.StatusCliente.Ativo);
        }
    }
}
