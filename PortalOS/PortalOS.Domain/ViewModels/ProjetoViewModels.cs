using PortalOS.Domain.Entities;
using PortalOS.Domain.ValueObjects;

namespace PortalOS.Domain.ViewModels
{
    public class CreateProjetoRequest
    {
        public long ClienteId { get; set; }
        public string Nome { get; set; }
        public string Responsavel { get; set; }
        public string EmailResponsavel { get; set; }
        public StatusProjeto StatusProjeto { get; set; }
    }

    public class UpdateProjetoRequest
    {
        public long Id { get; set; }
        public long ClienteId { get; set; }
        public string Nome { get; set; }
        public string Responsavel { get; set; }
        public string EmailResponsavel { get; set; }
        public StatusProjeto StatusProjeto { get; set; }
    }

    public class ProjetoResponse
    {
        public long Id { get; set; }
        public long ClienteId { get; set; }
        public string ClienteNome { get; set; }
        public string Nome { get; set; }
        public string Responsavel { get; set; }
        public string EmailResponsavel { get; set; }
        public StatusProjeto StatusProjeto { get; set; }

        public static ProjetoResponse FromEntity(Projeto projeto)
        {
            return new ProjetoResponse
            {
                Id = projeto.Id,
                ClienteId = projeto.Cliente?.Id ?? 0,
                ClienteNome = projeto.Cliente?.RazaoSocial,
                Nome = projeto.Nome,
                Responsavel = projeto.Responsavel,
                EmailResponsavel = projeto.EmailResponsavel,
                StatusProjeto = projeto.StatusProjeto
            };
        }
    }
}
