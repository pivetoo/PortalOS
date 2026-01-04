using dNET.Domain.Repositories;
using dNET.Domain.Services;
using PortalOS.Domain.Entities;
using PortalOS.Domain.ViewModels;

namespace PortalOS.Domain.Services
{
    public class TarefaService : ServiceCrud<Tarefa>
    {
        private readonly ProjetoService _projetoService;

        public TarefaService(IUnitOfWork unitOfWork, ProjetoService projetoService) : base(unitOfWork)
        {
            _projetoService = projetoService;
        }

        public Tarefa Create(CreateTarefaRequest request)
        {
            var projeto = _projetoService.GetById(request.ProjetoId);
            if (projeto == null)
            {
                ThrowError("Projeto nao encontrado");
            }

            var tarefa = new Tarefa
            {
                Projeto = projeto,
                Nome = request.Nome,
                Descricao = request.Descricao
            };

            Insert(tarefa);
            return tarefa;
        }

        public Tarefa Update(long id, UpdateTarefaRequest request)
        {
            if (id != request.Id)
            {
                ThrowError("ID da URL nao confere com ID do body");
            }

            var tarefa = GetById(id);
            if (tarefa == null)
            {
                ThrowError("Tarefa nao encontrada");
            }

            var projeto = _projetoService.GetById(request.ProjetoId);
            if (projeto == null)
            {
                ThrowError("Projeto nao encontrado");
            }

            tarefa.Projeto = projeto;
            tarefa.Nome = request.Nome;
            tarefa.Descricao = request.Descricao;

            Merge(tarefa);
            return tarefa;
        }

        public IEnumerable<Tarefa> GetByProjeto(long projetoId)
        {
            return Query(t => t.Projeto.Id == projetoId);
        }
    }
}
