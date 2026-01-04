using dNET.API.Attributes;
using dNET.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using PortalOS.Domain.Services;

namespace PortalOS.API.Controllers
{
    public class DashboardController : ApiControllerBase
    {
        private readonly DashboardService _dashboardService;
        private readonly ColaboradorService _colaboradorService;

        public DashboardController(DashboardService dashboardService, ColaboradorService colaboradorService)
        {
            _dashboardService = dashboardService;
            _colaboradorService = colaboradorService;
        }

        [RequirePermission("dashboard.read")]
        [GetEndpoint]
        public IActionResult Get([FromQuery] int? ano)
        {
            var colaborador = _colaboradorService.GetByUsuarioIdp(CurrentUserId!.Value);
            if (colaborador == null)
            {
                return Http404("Colaborador nao encontrado");
            }

            var anoAtual = ano ?? DateTime.Now.Year;
            var dashboard = _dashboardService.GetDashboardData(anoAtual, colaborador.Id);
            return Http200(dashboard);
        }
    }
}
