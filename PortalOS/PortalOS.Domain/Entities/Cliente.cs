using dNET.Domain.Entities;
using dNET.Domain.Utils.Attributes;
using PortalOS.Domain.ValueObjects;

namespace PortalOS.Domain.Entities
{
    public class Cliente : EntidadeBase
    {
        [NotEmpty]
        public string RazaoSocial { get; set; }

        [CpfCnpj]
        public string Cnpj { get; set; }

        public string Responsavel { get; set; }

        [NumberPhone]
        public string Telefone { get; set; }

        public string EmailResponsavel { get; set; }

        public string EmailFinanceiro { get; set; }

        public string Endereco { get; set; }

        public StatusCliente StatusCliente { get; set; }

        public bool ClienteTotvs { get; set; }
    }
}
