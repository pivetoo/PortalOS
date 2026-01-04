using FluentMigrator;

namespace PortalOS.Infrastructure.Migrations
{
    [Migration(4)]
    public class Migration_004_CreateTarefaTable : Migration
    {
        public override void Up()
        {
            Create.Sequence("tarefa_id_seq").IncrementBy(1).StartWith(1);

            Create.Table("tarefa")
                .WithColumn("id").AsInt64().PrimaryKey().NotNullable().WithDefaultValue(RawSql.Insert("nextval('public.tarefa_id_seq')"))
                .WithColumn("projetoid").AsInt64().NotNullable()
                .WithColumn("nome").AsString(200).NotNullable()
                .WithColumn("descricao").AsString(5000).Nullable()
                .WithColumn("criadoem").AsDateTime().Nullable()
                .WithColumn("ultimaalteracao").AsDateTime().Nullable();

            Create.ForeignKey("fk_tarefa_projeto")
                .FromTable("tarefa").ForeignColumn("projetoid")
                .ToTable("projeto").PrimaryColumn("id")
                .OnDelete(System.Data.Rule.Cascade);

            Create.Index("idx_tarefa_projeto").OnTable("tarefa").OnColumn("projetoid");
        }

        public override void Down()
        {
            Delete.ForeignKey("fk_tarefa_projeto").OnTable("tarefa");
            Delete.Index("idx_tarefa_projeto").OnTable("tarefa");
            Delete.Table("tarefa");
            Delete.Sequence("tarefa_id_seq");
        }
    }
}
