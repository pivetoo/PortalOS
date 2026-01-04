using FluentMigrator;

namespace PortalOS.Infrastructure.Migrations
{
    [Migration(5)]
    public class Migration_005_AlterOrdemServicoToTarefa : Migration
    {
        public override void Up()
        {
            Alter.Table("ordemservico")
                .AddColumn("tarefaid").AsInt64().Nullable();

            Create.ForeignKey("fk_ordemservico_tarefa")
                .FromTable("ordemservico").ForeignColumn("tarefaid")
                .ToTable("tarefa").PrimaryColumn("id")
                .OnDelete(System.Data.Rule.SetNull);

            Create.Index("idx_ordemservico_tarefa").OnTable("ordemservico").OnColumn("tarefaid");

            Delete.ForeignKey("fk_ordemservico_projeto").OnTable("ordemservico");
            Delete.Index("idx_ordemservico_projeto").OnTable("ordemservico");
            Delete.Column("projetoid").FromTable("ordemservico");
        }

        public override void Down()
        {
            Alter.Table("ordemservico")
                .AddColumn("projetoid").AsInt64().Nullable();

            Create.ForeignKey("fk_ordemservico_projeto")
                .FromTable("ordemservico").ForeignColumn("projetoid")
                .ToTable("projeto").PrimaryColumn("id")
                .OnDelete(System.Data.Rule.Cascade);

            Create.Index("idx_ordemservico_projeto").OnTable("ordemservico").OnColumn("projetoid");

            Delete.ForeignKey("fk_ordemservico_tarefa").OnTable("ordemservico");
            Delete.Index("idx_ordemservico_tarefa").OnTable("ordemservico");
            Delete.Column("tarefaid").FromTable("ordemservico");
        }
    }
}
