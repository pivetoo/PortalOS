using dNET.API.Attributes;
using dNET.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using PortalOS.Domain.Services;

namespace PortalOS.API.Controllers
{
    public class RelatorioController : ApiControllerBase
    {
        private readonly RelatorioService _relatorioService;

        public RelatorioController(RelatorioService relatorioService, IWebHostEnvironment env)
        {
            _relatorioService = relatorioService;

            var logoPath = Path.Combine(env.WebRootPath, "Empresa", "logo-empresa.png");
            _relatorioService.SetLogoPath(logoPath);
        }

        [RequirePermission("relatorios.read")]
        [GetEndpoint("ordemservico/{id}/pdf")]
        public IActionResult GetPdfOrdemServico(long id)
        {
            try
            {
                var pdfBytes = _relatorioService.GerarPdfOrdemServico(id);
                var numeroOs = id.ToString().PadLeft(9, '0');
                return File(pdfBytes, "application/pdf", $"OS_{numeroOs}.pdf");
            }
            catch (KeyNotFoundException)
            {
                return Http404("Ordem de Servico nao encontrada");
            }
        }

        [RequirePermission("relatorios.read")]
        [GetEndpoint("ordemservico/{ano}/{mes}/pdf")]
        public IActionResult GetRelatorioMensal(int ano, int mes)
        {
            var pdfBytes = _relatorioService.GerarRelatorioMensal(mes, ano);
            var nomeMes = new DateTime(ano, mes, 1).ToString("MMMM", new System.Globalization.CultureInfo("pt-BR"));
            return File(pdfBytes, "application/pdf", $"Relacao_OS_{nomeMes}_{ano}.pdf");
        }

        [RequirePermission("relatorios.read")]
        [GetEndpoint("ordemservico/periodo/pdf")]
        public IActionResult GetPdfPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            try
            {
                var pdfBytes = _relatorioService.GerarPdfPorPeriodo(dataInicio, dataFim);
                return File(pdfBytes, "application/pdf", $"OS_{dataInicio:ddMMyyyy}_a_{dataFim:ddMMyyyy}.pdf");
            }
            catch (KeyNotFoundException)
            {
                return Http404("Nenhuma Ordem de Servico encontrada no periodo");
            }
        }
    }
}
