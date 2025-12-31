using dNET.API.Attributes;
using dNET.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using PortalOS.Domain.Services;

namespace PortalOS.API.Controllers
{
    public class DashboardController : ApiControllerBase
    {
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [RequirePermission("dashboard.read")]
        [GetEndpoint]
        public IActionResult Get([FromQuery] int? ano)
        {
            var anoAtual = ano ?? DateTime.Now.Year;
            var dashboard = _dashboardService.GetDashboardData(anoAtual);
            return Http200(dashboard);
        }

        [RequirePermission("dashboard.read")]
        [GetEndpoint("colaborador/{colaborador}")]
        public IActionResult GetByColaborador(string colaborador, [FromQuery] int? ano)
        {
            var anoAtual = ano ?? DateTime.Now.Year;
            var dashboard = _dashboardService.GetDashboardDataPorColaborador(anoAtual, colaborador);
            return Http200(dashboard);
        }
    }
}
