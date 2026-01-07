using FluentMigrator;

namespace PortalOS.Infrastructure.Migrations
{
    [Migration(6)]
    public class Migration_006_MoveHorasFromProjetoToTarefa : Migration
    {
        public override void Up()
        {
            Alter.Table("tarefa")
                .AddColumn("qtdhoras").AsDecimal(18, 2).NotNullable().WithDefaultValue(0);

            Delete.Column("qtdtotalhoras").FromTable("projeto");
        }

        public override void Down()
        {
            Alter.Table("projeto")
                .AddColumn("qtdtotalhoras").AsDecimal(18, 2).NotNullable().WithDefaultValue(0);

            Delete.Column("qtdhoras").FromTable("tarefa");
        }
    }
}
