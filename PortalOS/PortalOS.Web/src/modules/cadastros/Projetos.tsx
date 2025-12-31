import { useState, useEffect } from 'react';
import { FolderKanban } from 'lucide-react';
import { PageLayout, DataTable, Badge, ConfirmModal, useApi, type DataTableColumn, type PaginatedResult } from 'd-rts';
import { projetoService } from '../../services/projetoService';
import { StatusProjeto } from '../../types/projeto';
import type { Projeto } from '../../types/projeto';
import ProjetoFormModal from '../../components/modals/ProjetoFormModal';

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [selectedProjetos, setSelectedProjetos] = useState<Projeto[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null);

  const { execute: fetchProjetos, loading } = useApi<PaginatedResult<Projeto>>({
    showErrorMessage: true,
  });

  const { execute: deleteProjetos } = useApi({
    showSuccessMessage: true,
    showErrorMessage: true,
  });

  const loadProjetos = async () => {
    const result = await fetchProjetos(() => projetoService.getAll());
    if (result) {
      setProjetos(result.data);
    }
  };

  useEffect(() => {
    loadProjetos();
  }, []);

  const handleAdd = () => {
    setEditingProjeto(null);
    setIsFormOpen(true);
  };

  const handleEdit = () => {
    if (selectedProjetos.length === 1) {
      setEditingProjeto(selectedProjetos[0]);
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    for (const projeto of selectedProjetos) {
      await deleteProjetos(() => projetoService.delete(projeto.id));
    }
    setIsConfirmOpen(false);
    setSelectedProjetos([]);
    loadProjetos();
  };

  const handleRefresh = () => {
    loadProjetos();
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProjeto(null);
    setSelectedProjetos([]);
    loadProjetos();
  };

  const columns: DataTableColumn<Projeto>[] = [
    {
      key: 'nome',
      title: 'Nome',
      dataIndex: 'nome'
    },
    {
      key: 'clienteNome',
      title: 'Cliente',
      dataIndex: 'clienteNome'
    },
    {
      key: 'responsavel',
      title: 'Responsavel',
      dataIndex: 'responsavel'
    },
    {
      key: 'emailResponsavel',
      title: 'Email',
      dataIndex: 'emailResponsavel'
    },
    {
      key: 'qtdTotalHoras',
      title: 'Total Horas',
      dataIndex: 'qtdTotalHoras'
    },
    {
      key: 'statusProjeto',
      title: 'Status',
      dataIndex: 'statusProjeto',
      render: (value: StatusProjeto) => (
        <Badge variant={value === StatusProjeto.Ativo ? 'success' : 'destructive'}>
          {value === StatusProjeto.Ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    }
  ];

  return (
    <PageLayout
      title="Projetos"
      icon={<FolderKanban size={24} />}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRefresh={handleRefresh}
      selectedRowsCount={selectedProjetos.length}
    >
      <DataTable
        columns={columns}
        data={projetos}
        rowKey="id"
        selectedRows={selectedProjetos}
        onSelectionChange={setSelectedProjetos}
        emptyText="Nenhum projeto encontrado"
        loading={loading}
      />

      <ConfirmModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Excluir Projeto"
        description={`Tem certeza que deseja excluir ${selectedProjetos.length} projeto(s)?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      <ProjetoFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        projeto={editingProjeto}
        onSuccess={handleFormSuccess}
      />
    </PageLayout>
  );
}
