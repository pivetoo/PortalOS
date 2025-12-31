import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { PageLayout, DataTable, Badge, ConfirmModal, useApi, type DataTableColumn, type PaginatedResult } from 'd-rts';
import { clienteService } from '../../services/clienteService';
import { StatusCliente } from '../../types/cliente';
import type { Cliente } from '../../types/cliente';
import ClienteFormModal from '../../components/modals/ClienteFormModal';

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<Cliente[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const { execute: fetchClientes, loading } = useApi<PaginatedResult<Cliente>>({
    showErrorMessage: true,
  });

  const { execute: deleteClientes } = useApi({
    showSuccessMessage: true,
    showErrorMessage: true,
  });

  const loadClientes = async () => {
    const result = await fetchClientes(() => clienteService.getAll());
    if (result) {
      setClientes(result.data);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const handleAdd = () => {
    setEditingCliente(null);
    setIsFormOpen(true);
  };

  const handleEdit = () => {
    if (selectedClientes.length === 1) {
      setEditingCliente(selectedClientes[0]);
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    for (const cliente of selectedClientes) {
      await deleteClientes(() => clienteService.delete(cliente.id));
    }
    setIsConfirmOpen(false);
    setSelectedClientes([]);
    loadClientes();
  };

  const handleRefresh = () => {
    loadClientes();
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCliente(null);
    setSelectedClientes([]);
    loadClientes();
  };

  const columns: DataTableColumn<Cliente>[] = [
    {
      key: 'razaoSocial',
      title: 'Razao Social',
      dataIndex: 'razaoSocial'
    },
    {
      key: 'cnpj',
      title: 'CNPJ',
      dataIndex: 'cnpj'
    },
    {
      key: 'responsavel',
      title: 'Responsavel',
      dataIndex: 'responsavel'
    },
    {
      key: 'telefone',
      title: 'Telefone',
      dataIndex: 'telefone'
    },
    {
      key: 'emailResponsavel',
      title: 'Email Responsável',
      dataIndex: 'emailResponsavel'
    },
    {
      key: 'statusCliente',
      title: 'Status',
      dataIndex: 'statusCliente',
      render: (value: StatusCliente) => (
        <Badge variant={value === StatusCliente.Ativo ? 'success' : 'destructive'}>
          {value === StatusCliente.Ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    }
  ];

  return (
    <PageLayout
      title="Clientes"
      icon={<Users size={24} />}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRefresh={handleRefresh}
      selectedRowsCount={selectedClientes.length}
    >
      <DataTable
        columns={columns}
        data={clientes}
        rowKey="id"
        selectedRows={selectedClientes}
        onSelectionChange={setSelectedClientes}
        emptyText="Nenhum cliente encontrado"
        loading={loading}
      />

      <ConfirmModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Excluir Cliente"
        description={`Tem certeza que deseja excluir ${selectedClientes.length} cliente(s)?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      <ClienteFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        cliente={editingCliente}
        onSuccess={handleFormSuccess}
      />
    </PageLayout>
  );
}
