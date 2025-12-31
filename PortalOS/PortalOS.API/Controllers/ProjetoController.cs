using dNET.API.Attributes;
using dNET.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using PortalOS.Domain.Entities;
using PortalOS.Domain.Services;
using PortalOS.Domain.ViewModels;

namespace PortalOS.API.Controllers
{
    public class ProjetoController : ApiControllerQuery<Projeto>
    {
        private readonly ProjetoService _projetoService;

        public ProjetoController(ILogger<ProjetoController> logger, ProjetoService projetoService) : base(projetoService, logger)
        {
            _projetoService = projetoService;
        }

        [GetEndpoint]
        public IActionResult GetAll(ODataQueryOptions<Projeto> queryOptions)
        {
            return OData(queryOptions);
        }

        [GetEndpoint("{id}")]
        public IActionResult GetById(long id)
        {
            var projeto = _projetoService.GetById(id);
            if (projeto == null)
            {
                return Http404("Projeto nao encontrado");
            }
            return Http200(ProjetoResponse.FromEntity(projeto));
        }

        [GetEndpoint("cliente/{clienteId}")]
        public IActionResult GetByCliente(long clienteId)
        {
            var projetos = _projetoService.GetByCliente(clienteId);
            return Http200(projetos.Select(ProjetoResponse.FromEntity));
        }

        [GetEndpoint("ativos")]
        public IActionResult GetAtivos()
        {
            var projetos = _projetoService.GetAtivos();
            return Http200(projetos.Select(ProjetoResponse.FromEntity));
        }

        [PostEndpoint]
        public IActionResult Create([FromBody] CreateProjetoRequest request)
        {
            return TryExecute(request, () =>
            {
                var projeto = _projetoService.Create(request);
                return Http201(ProjetoResponse.FromEntity(projeto));
            });
        }

        [PutEndpoint("{id}")]
        public IActionResult Update(long id, [FromBody] UpdateProjetoRequest request)
        {
            return TryExecute(request, () =>
            {
                var projeto = _projetoService.Update(id, request);
                return Http200(ProjetoResponse.FromEntity(projeto));
            });
        }

        [DeleteEndpoint("{id}")]
        public IActionResult Delete(long id)
        {
            return TryExecute(id, () =>
            {
                var projeto = _projetoService.Delete(id);
                if (projeto == null)
                {
                    return Http404("Projeto nao encontrado");
                }
                return Http200(new { message = "Projeto deletado com sucesso" });
            });
        }
    }
}
