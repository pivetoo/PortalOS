using FluentMigrator;

namespace PortalOS.Infrastructure.Migrations
{
    [Migration(3)]
    public class Migration_003_AlterDataAgendaToTimestamp : Migration
    {
        public override void Up()
        {
            Execute.Sql("ALTER TABLE ordemservico ALTER COLUMN dataagenda TYPE timestamp USING dataagenda::timestamp");
        }

        public override void Down()
        {
            Execute.Sql("ALTER TABLE ordemservico ALTER COLUMN dataagenda TYPE date USING dataagenda::date");
        }
    }
}
