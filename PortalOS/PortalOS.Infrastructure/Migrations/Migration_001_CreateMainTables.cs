using FluentMigrator;

namespace PortalOS.Infrastructure.Migrations
{
    [Migration(1)]
    public class Migration_001_CreateMainTables : Migration
    {
        public override void Up()
        {
            // Sequences
            Create.Sequence("cliente_id_seq").IncrementBy(1).StartWith(1);
            Create.Sequence("projeto_id_seq").IncrementBy(1).StartWith(1);
            Create.Sequence("ordemservico_id_seq").IncrementBy(1).StartWith(1);

            // Cliente
            Create.Table("cliente")
                .WithColumn("id").AsInt64().PrimaryKey().NotNullable().WithDefaultValue(RawSql.Insert("nextval('public.cliente_id_seq')"))
                .WithColumn("razaosocial").AsString(500).NotNullable()
                .WithColumn("cnpj").AsString(18).Nullable()
                .WithColumn("responsavel").AsString(200).Nullable()
                .WithColumn("telefone").AsString(20).Nullable()
                .WithColumn("emailresponsavel").AsString(200).Nullable()
                .WithColumn("emailfinanceiro").AsString(200).Nullable()
                .WithColumn("endereco").AsString(500).Nullable()
                .WithColumn("statuscliente").AsInt32().NotNullable().WithDefaultValue(0)
                .WithColumn("clientetotvs").AsBoolean().NotNullable().WithDefaultValue(false)
                .WithColumn("criadoem").AsDateTime().Nullable()
                .WithColumn("ultimaalteracao").AsDateTime().Nullable();

            Create.Index("idx_cliente_cnpj").OnTable("cliente").OnColumn("cnpj");
            Create.Index("idx_cliente_statuscliente").OnTable("cliente").OnColumn("statuscliente");

            // Projeto
            Create.Table("projeto")
                .WithColumn("id").AsInt64().PrimaryKey().NotNullable().WithDefaultValue(RawSql.Insert("nextval('public.projeto_id_seq')"))
                .WithColumn("clienteid").AsInt64().NotNullable()
                .WithColumn("nome").AsString(200).NotNullable()
                .WithColumn("responsavel").AsString(200).Nullable()
                .WithColumn("emailresponsavel").AsString(200).Nullable()
                .WithColumn("statusprojeto").AsInt32().NotNullable().WithDefaultValue(0)
                .WithColumn("qtdtotalhoras").AsDecimal(10, 2).NotNullable().WithDefaultValue(0)
                .WithColumn("criadoem").AsDateTime().Nullable()
                .WithColumn("ultimaalteracao").AsDateTime().Nullable();

            Create.ForeignKey("fk_projeto_cliente")
                .FromTable("projeto").ForeignColumn("clienteid")
                .ToTable("cliente").PrimaryColumn("id")
                .OnDelete(System.Data.Rule.Cascade);

            Create.Index("idx_projeto_cliente").OnTable("projeto").OnColumn("clienteid");
            Create.Index("idx_projeto_statusprojeto").OnTable("projeto").OnColumn("statusprojeto");

            // OrdemServico
            Create.Table("ordemservico")
                .WithColumn("id").AsInt64().PrimaryKey().NotNullable().WithDefaultValue(RawSql.Insert("nextval('public.ordemservico_id_seq')"))
                .WithColumn("projetoid").AsInt64().NotNullable()
                .WithColumn("dataagenda").AsDate().NotNullable()
                .WithColumn("horainicio").AsTime().NotNullable()
                .WithColumn("iniciointervalo").AsTime().Nullable()
                .WithColumn("fimintervalo").AsTime().Nullable()
                .WithColumn("horafim").AsTime().NotNullable()
                .WithColumn("descricao").AsString(5000).Nullable()
                .WithColumn("colaborador").AsString(200).Nullable()
                .WithColumn("criadoem").AsDateTime().Nullable()
                .WithColumn("ultimaalteracao").AsDateTime().Nullable();

            Create.ForeignKey("fk_ordemservico_projeto")
                .FromTable("ordemservico").ForeignColumn("projetoid")
                .ToTable("projeto").PrimaryColumn("id")
                .OnDelete(System.Data.Rule.Cascade);

            Create.Index("idx_ordemservico_projeto").OnTable("ordemservico").OnColumn("projetoid");
            Create.Index("idx_ordemservico_dataagenda").OnTable("ordemservico").OnColumn("dataagenda");
            Create.Index("idx_ordemservico_colaborador").OnTable("ordemservico").OnColumn("colaborador");
        }

        public override void Down()
        {
            Delete.Table("ordemservico");
            Delete.Table("projeto");
            Delete.Table("cliente");

            Delete.Sequence("ordemservico_id_seq");
            Delete.Sequence("projeto_id_seq");
            Delete.Sequence("cliente_id_seq");
        }
    }
}
