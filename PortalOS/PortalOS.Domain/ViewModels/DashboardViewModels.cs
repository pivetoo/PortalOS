namespace PortalOS.Domain.ViewModels
{
    public class DashboardResponse
    {
        public decimal HorasMesAtual { get; set; }
        public int ProjetosAtivos { get; set; }
        public int ProjetosFinalizados { get; set; }
        public List<HorasPorMesItem> HorasPorMes { get; set; } = [];
        public List<HorasPorProjetoItem> HorasPorProjeto { get; set; } = [];
    }

    public class HorasPorMesItem
    {
        public int Mes { get; set; }
        public decimal Horas { get; set; }
    }

    public class HorasPorProjetoItem
    {
        public string Name { get; set; }
        public decimal Value { get; set; }
    }
}
