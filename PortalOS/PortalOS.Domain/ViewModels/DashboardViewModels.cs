namespace PortalOS.Domain.ViewModels
{
    public class DashboardResponse
    {
        public decimal HorasMesAtual { get; set; }
        public List<HorasPorMesItem> HorasPorMes { get; set; } = [];
    }

    public class HorasPorMesItem
    {
        public int Mes { get; set; }
        public decimal Horas { get; set; }
    }
}
