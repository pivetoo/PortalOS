using PortalOS.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PortalOS.Domain.Services
{
    public class RelatorioService
    {
        private readonly OrdemServicoService _ordemServicoService;
        private string? _logoPath;

        public RelatorioService(OrdemServicoService ordemServicoService)
        {
            _ordemServicoService = ordemServicoService;
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public void SetLogoPath(string logoPath)
        {
            if (File.Exists(logoPath))
            {
                _logoPath = logoPath;
            }
        }

        public byte[] GerarPdfOrdemServico(long id)
        {
            var ordemServico = _ordemServicoService.GetById(id);
            if (ordemServico == null)
                throw new KeyNotFoundException("Ordem de Servico nao encontrada");

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Arial"));

                    page.Header().Element(c => ComposeHeader(c, ordemServico));
                    page.Content().Element(c => ComposeContent(c, ordemServico));
                    page.Footer().Element(c => ComposeFooter(c, ordemServico));
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GerarRelatorioMensal(int mes, int ano)
        {
            var ordens = _ordemServicoService.GetByMesAno(mes, ano)
                .OrderBy(o => o.DataAgenda)
                .ThenBy(o => o.HoraInicio)
                .ToList();

            var nomeMes = new DateTime(ano, mes, 1).ToString("MMMM", new System.Globalization.CultureInfo("pt-BR"));
            var totalHorasMes = ordens.Sum(o => CalcularTotalHorasDecimal(o));

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(20);
                    page.DefaultTextStyle(x => x.FontSize(9).FontFamily("Arial"));

                    page.Header().Element(c => ComposeRelatorioHeader(c, mes, ano, nomeMes));
                    page.Content().Element(c => ComposeRelatorioContent(c, ordens));
                    page.Footer().Element(c => ComposeRelatorioFooter(c, totalHorasMes));
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GerarPdfPorPeriodo(DateTime dataInicio, DateTime dataFim)
        {
            var ordens = _ordemServicoService.GetByPeriodo(dataInicio, dataFim)
                .OrderBy(o => o.DataAgenda)
                .ThenBy(o => o.HoraInicio)
                .ToList();

            if (ordens.Count == 0)
                throw new KeyNotFoundException("Nenhuma Ordem de Servico encontrada no periodo");

            var document = Document.Create(container =>
            {
                foreach (var ordemServico in ordens)
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(30);
                        page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Arial"));

                        page.Header().Element(c => ComposeHeader(c, ordemServico));
                        page.Content().Element(c => ComposeContent(c, ordemServico));
                        page.Footer().Element(c => ComposeFooter(c, ordemServico));
                    });
                }
            });

            return document.GeneratePdf();
        }

        private void ComposeHeader(IContainer container, OrdemServico os)
        {
            var numeroOs = os.Id.ToString().PadLeft(9, '0');
            var cliente = os.Tarefa?.Projeto?.Cliente;
            var projeto = os.Tarefa?.Projeto;
            var tarefa = os.Tarefa;

            container.Column(column =>
            {
                column.Item().Row(row =>
                {
                    row.RelativeItem().Border(1).Padding(10).Column(col =>
                    {
                        col.Item().AlignCenter().Text("ORDEM DE SERVIÇO").Bold().FontSize(16);
                        col.Item().AlignCenter().Text(numeroOs).Bold().FontSize(14);
                    });

                    row.ConstantItem(100).Border(1).Padding(5).AlignCenter().AlignMiddle()
                        .Column(col =>
                        {
                            if (!string.IsNullOrEmpty(_logoPath) && File.Exists(_logoPath))
                            {
                                col.Item().Image(_logoPath).FitArea();
                            }
                            else
                            {
                                col.Item().Text("LOGO").FontSize(8);
                            }
                        });
                });

                column.Item().Height(10);

                column.Item().Border(1).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(3);
                        columns.RelativeColumn(1);
                    });

                    table.Cell().BorderBottom(1).BorderRight(1).Padding(5).Column(col =>
                    {
                        col.Item().Text("CLIENTE").Bold().FontSize(8);
                        col.Item().Text($"{cliente?.Id.ToString().PadLeft(6, '0')} - {cliente?.RazaoSocial ?? "N/A"}");
                    });

                    table.Cell().BorderBottom(1).Padding(5).Column(col =>
                    {
                        col.Item().Text("DATA").Bold().FontSize(8);
                        col.Item().Text(os.DataAgenda.ToString("dd/MM/yy"));
                    });

                    table.Cell().ColumnSpan(2).BorderBottom(1).Padding(5).Column(col =>
                    {
                        col.Item().Text("CONSULTOR").Bold().FontSize(8);
                        col.Item().Text(os.Colaborador?.Nome ?? "N/A");
                    });

                    table.Cell().BorderBottom(1).BorderRight(1).Padding(5).Column(col =>
                    {
                        col.Item().Text("PROJETO").Bold().FontSize(8);
                        col.Item().Text($"{projeto?.Id.ToString().PadLeft(6, '0')}{tarefa?.Id.ToString().PadLeft(3, '0')} - {projeto?.Nome ?? "N/A"}");
                    });

                    table.Cell().BorderBottom(1).Padding(5).Column(col =>
                    {
                        col.Item().Text("TAREFA").Bold().FontSize(8);
                        col.Item().Text(tarefa?.Nome ?? "N/A");
                    });
                });
            });
        }

        private void ComposeContent(IContainer container, OrdemServico os)
        {
            container.PaddingVertical(10).Column(column =>
            {
                column.Item().Border(1).Padding(10).Column(col =>
                {
                    col.Item().Text("DESCRIÇÃO").Bold().FontSize(9);
                    col.Item().Height(5);
                    col.Item().Text(os.Descricao ?? "").FontSize(10);
                    col.Item().Height(150);
                });

                column.Item().Height(20);

                column.Item().Border(1).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });

                    table.Header(header =>
                    {
                        header.Cell().BorderBottom(1).BorderRight(1).Padding(5).AlignCenter()
                            .Text("HORA INICIO").Bold().FontSize(8);
                        header.Cell().BorderBottom(1).BorderRight(1).Padding(5).AlignCenter()
                            .Text("INTERVALO INICIO").Bold().FontSize(8);
                        header.Cell().BorderBottom(1).BorderRight(1).Padding(5).AlignCenter()
                            .Text("INTERVALO FINAL").Bold().FontSize(8);
                        header.Cell().BorderBottom(1).BorderRight(1).Padding(5).AlignCenter()
                            .Text("HORA FINAL").Bold().FontSize(8);
                        header.Cell().BorderBottom(1).Padding(5).AlignCenter()
                            .Text("TOTAL").Bold().FontSize(8);
                    });

                    table.Cell().BorderRight(1).Padding(5).AlignCenter()
                        .Text(os.HoraInicio.ToString("HH:mm"));
                    table.Cell().BorderRight(1).Padding(5).AlignCenter()
                        .Text(os.InicioIntervalo?.ToString("HH:mm") ?? "-");
                    table.Cell().BorderRight(1).Padding(5).AlignCenter()
                        .Text(os.FimIntervalo?.ToString("HH:mm") ?? "-");
                    table.Cell().BorderRight(1).Padding(5).AlignCenter()
                        .Text(os.HoraFim.ToString("HH:mm"));
                    table.Cell().Padding(5).AlignCenter()
                        .Text(FormatarTotalHoras(os)).Bold();
                });
            });
        }

        private void ComposeFooter(IContainer container, OrdemServico os)
        {
            var cliente = os.Tarefa?.Projeto?.Cliente;

            container.Column(column =>
            {
                column.Item().Border(1).Padding(10).Column(col =>
                {
                    col.Item().Text("Este documento tem a finalidade de:").FontSize(9);
                    col.Item().Text("- Descrever os serviços executados;").FontSize(9);
                    col.Item().Text("- Comprovar a quantidade de horas realizadas;").FontSize(9);
                    col.Item().Text("- Autenticar o faturamento dos serviços.").FontSize(9);
                    col.Item().Height(5);
                    col.Item().Text("O prazo para contestação da Ordem de Serviço, seja neste documento, por e-mail ou telefone será de 48 horas")
                        .Bold().FontSize(9);
                });

                column.Item().Height(40);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().LineHorizontal(1);
                        col.Item().Text("Assinatura do Cliente").FontSize(9);
                        col.Item().Text(cliente?.Responsavel ?? "").Bold().FontSize(9);
                    });

                    row.ConstantItem(50);

                    row.RelativeItem().Column(col =>
                    {
                        col.Item().LineHorizontal(1);
                        col.Item().Text("Assinatura do Consultor").FontSize(9);
                        col.Item().Text(os.Colaborador?.Nome ?? "").Bold().FontSize(9);
                    });
                });
            });
        }

        private void ComposeRelatorioHeader(IContainer container, int mes, int ano, string nomeMes)
        {
            container.Column(column =>
            {
                column.Item().Row(row =>
                {
                    row.ConstantItem(80).Column(col =>
                    {
                        if (!string.IsNullOrEmpty(_logoPath) && File.Exists(_logoPath))
                        {
                            col.Item().Height(50).Image(_logoPath).FitArea();
                        }
                    });

                    row.ConstantItem(10);

                    row.RelativeItem().AlignMiddle().Column(col =>
                    {
                        col.Item().Text($"RELAÇÃO DE ORDENS DE SERVIÇO").Bold().FontSize(14);
                        col.Item().Text($"{nomeMes.ToUpper()} / {ano}").FontSize(12);
                    });

                    row.ConstantItem(150).AlignRight().AlignMiddle().Column(col =>
                    {
                        col.Item().Text($"Emitido em: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(8);
                    });
                });

                column.Item().Height(10);
            });
        }

        private void ComposeRelatorioContent(IContainer container, List<OrdemServico> ordens)
        {
            container.Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(60);  // OS
                    columns.ConstantColumn(55);  // Data
                    columns.RelativeColumn(2);   // Cliente
                    columns.RelativeColumn(2);   // Projeto
                    columns.RelativeColumn(1.5f); // Tarefa
                    columns.RelativeColumn(1.5f); // Responsavel
                    columns.ConstantColumn(45);  // Entrada
                    columns.ConstantColumn(45);  // Saida
                    columns.ConstantColumn(45);  // Total
                });

                table.Header(header =>
                {
                    header.Cell().Background("#e0e0e0").Border(1).Padding(4).Text("OS").Bold().FontSize(8);
                    header.Cell().Background("#e0e0e0").Border(1).Padding(4).Text("DATA").Bold().FontSize(8);
                    header.Cell().Background("#e0e0e0").Border(1).Padding(4).Text("CLIENTE").Bold().FontSize(8);
                    header.Cell().Background("#e0e0e0").Border(1).Padding(4).Text("PROJETO").Bold().FontSize(8);
                    header.Cell().Background("#e0e0e0").Border(1).Padding(4).Text("TAREFA").Bold().FontSize(8);
                    header.Cell().Background("#e0e0e0").Border(1).Padding(4).Text("RESPONSÁVEL").Bold().FontSize(8);
                    header.Cell().Background("#e0e0e0").Border(1).Padding(4).AlignCenter().Text("ENTRADA").Bold().FontSize(8);
                    header.Cell().Background("#e0e0e0").Border(1).Padding(4).AlignCenter().Text("SAÍDA").Bold().FontSize(8);
                    header.Cell().Background("#e0e0e0").Border(1).Padding(4).AlignCenter().Text("TOTAL").Bold().FontSize(8);
                });

                foreach (var os in ordens)
                {
                    var cliente = os.Tarefa?.Projeto?.Cliente;
                    var projeto = os.Tarefa?.Projeto;

                    table.Cell().BorderBottom(1).BorderLeft(1).BorderRight(1).Padding(3)
                        .Text(os.Id.ToString().PadLeft(9, '0')).FontSize(7);
                    table.Cell().BorderBottom(1).BorderRight(1).Padding(3)
                        .Text(os.DataAgenda.ToString("dd/MM/yy")).FontSize(8);
                    table.Cell().BorderBottom(1).BorderRight(1).Padding(3)
                        .Text(cliente?.RazaoSocial ?? "-").FontSize(8);
                    table.Cell().BorderBottom(1).BorderRight(1).Padding(3)
                        .Text(projeto?.Nome ?? "-").FontSize(8);
                    table.Cell().BorderBottom(1).BorderRight(1).Padding(3)
                        .Text(os.Tarefa?.Nome ?? "-").FontSize(8);
                    table.Cell().BorderBottom(1).BorderRight(1).Padding(3)
                        .Text(projeto?.Responsavel ?? "-").FontSize(8);
                    table.Cell().BorderBottom(1).BorderRight(1).Padding(3).AlignCenter()
                        .Text(os.HoraInicio.ToString("HH:mm")).FontSize(8);
                    table.Cell().BorderBottom(1).BorderRight(1).Padding(3).AlignCenter()
                        .Text(os.HoraFim.ToString("HH:mm")).FontSize(8);
                    table.Cell().BorderBottom(1).BorderRight(1).Padding(3).AlignCenter()
                        .Text(FormatarTotalHoras(os)).Bold().FontSize(8);
                }
            });
        }

        private void ComposeRelatorioFooter(IContainer container, decimal totalHoras)
        {
            var horas = (int)totalHoras;
            var minutos = (int)((totalHoras - horas) * 60);

            container.Column(column =>
            {
                column.Item().Height(10);
                column.Item().AlignRight().Row(row =>
                {
                    row.ConstantItem(150).Background("#e0e0e0").Border(1).Padding(5).Row(r =>
                    {
                        r.RelativeItem().Text("TOTAL DO MÊS:").Bold().FontSize(10);
                        r.ConstantItem(60).AlignRight().Text($"{horas:00}:{minutos:00}").Bold().FontSize(10);
                    });
                });
            });
        }

        private string FormatarTotalHoras(OrdemServico os)
        {
            var inicio = os.HoraInicio.TimeOfDay;
            var fim = os.HoraFim.TimeOfDay;
            var intervalo = TimeSpan.Zero;

            if (os.InicioIntervalo.HasValue && os.FimIntervalo.HasValue)
            {
                intervalo = os.FimIntervalo.Value.TimeOfDay - os.InicioIntervalo.Value.TimeOfDay;
            }

            var total = fim - inicio - intervalo;
            if (total < TimeSpan.Zero) total = TimeSpan.Zero;

            return $"{(int)total.TotalHours:00}:{total.Minutes:00}";
        }

        private decimal CalcularTotalHorasDecimal(OrdemServico os)
        {
            var inicio = os.HoraInicio.TimeOfDay;
            var fim = os.HoraFim.TimeOfDay;
            var intervalo = TimeSpan.Zero;

            if (os.InicioIntervalo.HasValue && os.FimIntervalo.HasValue)
            {
                intervalo = os.FimIntervalo.Value.TimeOfDay - os.InicioIntervalo.Value.TimeOfDay;
            }

            var total = fim - inicio - intervalo;
            if (total < TimeSpan.Zero) total = TimeSpan.Zero;

            return (decimal)total.TotalHours;
        }

        private string TruncarTexto(string? texto, int maxLength)
        {
            if (string.IsNullOrEmpty(texto)) return "-";
            return texto.Length <= maxLength ? texto : texto.Substring(0, maxLength) + "...";
        }
    }
}
