using dNET.API.Attributes;
using dNET.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using PortalOS.Domain.Entities;
using PortalOS.Domain.Services;
using PortalOS.Domain.ViewModels;

namespace PortalOS.API.Controllers
{
    public class OrdemServicoController : ApiControllerQuery<OrdemServico>
    {
        private readonly OrdemServicoService _ordemServicoService;

        public OrdemServicoController(OrdemServicoService ordemServicoService) : base(ordemServicoService)
        {
            _ordemServicoService = ordemServicoService;
        }

        [RequirePermission("ordens-servico.read")]
        [GetEndpoint]
        public IActionResult GetAll(ODataQueryOptions<OrdemServico> queryOptions)
        {
            return OData(queryOptions);
        }

        [RequirePermission("ordens-servico.read")]
        [GetEndpoint("{id}")]
        public IActionResult GetById(long id)
        {
            var os = _ordemServicoService.GetById(id);
            if (os == null)
            {
                return Http404("Ordem de Servico nao encontrada");
            }
            return Http200(OrdemServicoResponse.FromEntity(os));
        }

        [RequirePermission("ordens-servico.read")]
        [GetEndpoint("projeto/{projetoId}")]
        public IActionResult GetByProjeto(long projetoId)
        {
            var ordens = _ordemServicoService.GetByProjeto(projetoId);
            return Http200(ordens.Select(OrdemServicoResponse.FromEntity));
        }

        [RequirePermission("ordens-servico.read")]
        [GetEndpoint("colaborador/{colaborador}")]
        public IActionResult GetByColaborador(string colaborador)
        {
            var ordens = _ordemServicoService.GetByColaborador(colaborador);
            return Http200(ordens.Select(OrdemServicoResponse.FromEntity));
        }

        [RequirePermission("ordens-servico.read")]
        [GetEndpoint("mes/{ano}/{mes}")]
        public IActionResult GetByMesAno(int ano, int mes)
        {
            var ordens = _ordemServicoService.GetByMesAno(mes, ano);
            return Http200(ordens.Select(OrdemServicoResponse.FromEntity));
        }

        [RequirePermission("ordens-servico.read")]
        [GetEndpoint("total-horas/{ano}/{mes}")]
        public IActionResult GetTotalHorasMes(int ano, int mes)
        {
            var totalHoras = _ordemServicoService.GetTotalHorasMes(mes, ano);
            return Http200(new { ano, mes, totalHoras });
        }

        [RequirePermission("ordens-servico.read")]
        [GetEndpoint("total-horas/{ano}/{mes}/{colaborador}")]
        public IActionResult GetTotalHorasMesPorColaborador(int ano, int mes, string colaborador)
        {
            var totalHoras = _ordemServicoService.GetTotalHorasMesPorColaborador(mes, ano, colaborador);
            return Http200(new { ano, mes, colaborador, totalHoras });
        }

        [RequirePermission("ordens-servico.create")]
        [PostEndpoint]
        public IActionResult Create([FromBody] CreateOrdemServicoRequest request)
        {
            return TryExecute(request, () =>
            {
                var os = _ordemServicoService.Create(request);
                return Http201(OrdemServicoResponse.FromEntity(os));
            });
        }

        [RequirePermission("ordens-servico.update")]
        [PutEndpoint("{id}")]
        public IActionResult Update(long id, [FromBody] UpdateOrdemServicoRequest request)
        {
            return TryExecute(request, () =>
            {
                var os = _ordemServicoService.Update(id, request);
                return Http200(OrdemServicoResponse.FromEntity(os));
            });
        }

        [RequirePermission("ordens-servico.delete")]
        [DeleteEndpoint("{id}")]
        public IActionResult Delete(long id)
        {
            return TryExecute(id, () =>
            {
                var os = _ordemServicoService.Delete(id);
                if (os == null)
                {
                    return Http404("Ordem de Servico nao encontrada");
                }
                return Http200(new { message = "Ordem de Servico deletada com sucesso" });
            });
        }
    }
}
