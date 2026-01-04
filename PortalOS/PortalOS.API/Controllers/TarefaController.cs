using dNET.API.Attributes;
using dNET.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using PortalOS.Domain.Entities;
using PortalOS.Domain.Services;
using PortalOS.Domain.ViewModels;

namespace PortalOS.API.Controllers
{
    public class TarefaController : ApiControllerQuery<Tarefa>
    {
        private readonly TarefaService _tarefaService;

        public TarefaController(TarefaService tarefaService) : base(tarefaService)
        {
            _tarefaService = tarefaService;
        }

        [RequirePermission("tarefas.read")]
        [GetEndpoint]
        public IActionResult GetAll(ODataQueryOptions<Tarefa> queryOptions)
        {
            return OData(queryOptions);
        }

        [RequirePermission("tarefas.read")]
        [GetEndpoint("{id}")]
        public IActionResult GetById(long id)
        {
            var tarefa = _tarefaService.GetById(id);
            if (tarefa == null)
            {
                return Http404("Tarefa nao encontrada");
            }
            return Http200(TarefaResponse.FromEntity(tarefa));
        }

        [RequirePermission("tarefas.read")]
        [GetEndpoint("projeto/{projetoId}")]
        public IActionResult GetByProjeto(long projetoId)
        {
            var tarefas = _tarefaService.GetByProjeto(projetoId);
            return Http200(tarefas.Select(TarefaResponse.FromEntity));
        }

        [RequirePermission("tarefas.create")]
        [PostEndpoint]
        public IActionResult Create([FromBody] CreateTarefaRequest request)
        {
            return TryExecute(request, () =>
            {
                var tarefa = _tarefaService.Create(request);
                return Http201(TarefaResponse.FromEntity(tarefa));
            });
        }

        [RequirePermission("tarefas.update")]
        [PutEndpoint("{id}")]
        public IActionResult Update(long id, [FromBody] UpdateTarefaRequest request)
        {
            return TryExecute(request, () =>
            {
                var tarefa = _tarefaService.Update(id, request);
                return Http200(TarefaResponse.FromEntity(tarefa));
            });
        }

        [RequirePermission("tarefas.delete")]
        [DeleteEndpoint("{id}")]
        public IActionResult Delete(long id)
        {
            return TryExecute(id, () =>
            {
                var tarefa = _tarefaService.Delete(id);
                if (tarefa == null)
                {
                    return Http404("Tarefa nao encontrada");
                }
                return Http200(new { message = "Tarefa deletada com sucesso" });
            });
        }
    }
}
