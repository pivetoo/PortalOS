using FluentMigrator;

namespace PortalOS.Infrastructure.Migrations
{
    [Migration(2)]
    public class Migration_002_CreateColaboradorTable : Migration
    {
        public override void Up()
        {
            Create.Sequence("colaborador_id_seq").IncrementBy(1).StartWith(1);

            Create.Table("colaborador")
                .WithColumn("id").AsInt64().PrimaryKey().NotNullable().WithDefaultValue(RawSql.Insert("nextval('public.colaborador_id_seq')"))
                .WithColumn("usuarioidp").AsInt64().NotNullable().Unique()
                .WithColumn("nome").AsString(200).NotNullable()
                .WithColumn("email").AsString(200).Nullable()
                .WithColumn("ativo").AsBoolean().NotNullable().WithDefaultValue(true)
                .WithColumn("criadoem").AsDateTime().Nullable()
                .WithColumn("ultimaalteracao").AsDateTime().Nullable();

            Create.Index("idx_colaborador_usuarioidp").OnTable("colaborador").OnColumn("usuarioidp");
            Create.Index("idx_colaborador_ativo").OnTable("colaborador").OnColumn("ativo");

            Alter.Table("ordemservico")
                .AddColumn("colaboradorid").AsInt64().Nullable();

            Create.ForeignKey("fk_ordemservico_colaborador")
                .FromTable("ordemservico").ForeignColumn("colaboradorid")
                .ToTable("colaborador").PrimaryColumn("id")
                .OnDelete(System.Data.Rule.SetNull);

            Delete.Index("idx_ordemservico_colaborador").OnTable("ordemservico");
            Delete.Column("colaborador").FromTable("ordemservico");
        }

        public override void Down()
        {
            Alter.Table("ordemservico")
                .AddColumn("colaborador").AsString(200).Nullable();

            Create.Index("idx_ordemservico_colaborador").OnTable("ordemservico").OnColumn("colaborador");

            Delete.ForeignKey("fk_ordemservico_colaborador").OnTable("ordemservico");
            Delete.Column("colaboradorid").FromTable("ordemservico");

            Delete.Table("colaborador");
            Delete.Sequence("colaborador_id_seq");
        }
    }
}
