using FluentMigrator;

namespace PortalOS.Infrastructure.Migrations
{
    [Migration(2)]
    public class Migration_002_AlterOrdemServicoHorariosToTimestamp : Migration
    {
        public override void Up()
        {
            Alter.Table("ordemservico")
                .AlterColumn("horainicio").AsDateTime().NotNullable()
                .AlterColumn("iniciointervalo").AsDateTime().Nullable()
                .AlterColumn("fimintervalo").AsDateTime().Nullable()
                .AlterColumn("horafim").AsDateTime().NotNullable();
        }

        public override void Down()
        {
            Alter.Table("ordemservico")
                .AlterColumn("horainicio").AsTime().NotNullable()
                .AlterColumn("iniciointervalo").AsTime().Nullable()
                .AlterColumn("fimintervalo").AsTime().Nullable()
                .AlterColumn("horafim").AsTime().NotNullable();
        }
    }
}
