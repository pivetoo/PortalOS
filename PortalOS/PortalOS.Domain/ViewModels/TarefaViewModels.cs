using PortalOS.Domain.Entities;

namespace PortalOS.Domain.ViewModels
{
    public class CreateTarefaRequest
    {
        public long ProjetoId { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public decimal QtdHoras { get; set; }
    }

    public class UpdateTarefaRequest
    {
        public long Id { get; set; }
        public long ProjetoId { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public decimal QtdHoras { get; set; }
    }

    public class TarefaResponse
    {
        public long Id { get; set; }
        public long ProjetoId { get; set; }
        public string ProjetoNome { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public decimal QtdHoras { get; set; }

        public static TarefaResponse FromEntity(Tarefa tarefa)
        {
            return new TarefaResponse
            {
                Id = tarefa.Id,
                ProjetoId = tarefa.Projeto?.Id ?? 0,
                ProjetoNome = tarefa.Projeto?.Nome,
                Nome = tarefa.Nome,
                Descricao = tarefa.Descricao,
                QtdHoras = tarefa.QtdHoras
            };
        }
    }
}
