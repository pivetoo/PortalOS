using PortalOS.Domain.Entities;
using PortalOS.Domain.ValueObjects;

namespace PortalOS.Domain.ViewModels
{
    public class CreateClienteRequest
    {
        public string RazaoSocial { get; set; }
        public string Cnpj { get; set; }
        public string Responsavel { get; set; }
        public string Telefone { get; set; }
        public string EmailResponsavel { get; set; }
        public string EmailFinanceiro { get; set; }
        public string Endereco { get; set; }
        public StatusCliente StatusCliente { get; set; }
        public bool ClienteTotvs { get; set; }
    }

    public class UpdateClienteRequest
    {
        public long Id { get; set; }
        public string RazaoSocial { get; set; }
        public string Cnpj { get; set; }
        public string Responsavel { get; set; }
        public string Telefone { get; set; }
        public string EmailResponsavel { get; set; }
        public string EmailFinanceiro { get; set; }
        public string Endereco { get; set; }
        public StatusCliente StatusCliente { get; set; }
        public bool ClienteTotvs { get; set; }
    }

    public class ClienteResponse
    {
        public long Id { get; set; }
        public string RazaoSocial { get; set; }
        public string Cnpj { get; set; }
        public string Responsavel { get; set; }
        public string Telefone { get; set; }
        public string EmailResponsavel { get; set; }
        public string EmailFinanceiro { get; set; }
        public string Endereco { get; set; }
        public StatusCliente StatusCliente { get; set; }
        public bool ClienteTotvs { get; set; }

        public static ClienteResponse FromEntity(Cliente cliente)
        {
            return new ClienteResponse
            {
                Id = cliente.Id,
                RazaoSocial = cliente.RazaoSocial,
                Cnpj = cliente.Cnpj,
                Responsavel = cliente.Responsavel,
                Telefone = cliente.Telefone,
                EmailResponsavel = cliente.EmailResponsavel,
                EmailFinanceiro = cliente.EmailFinanceiro,
                Endereco = cliente.Endereco,
                StatusCliente = cliente.StatusCliente,
                ClienteTotvs = cliente.ClienteTotvs
            };
        }
    }
}
