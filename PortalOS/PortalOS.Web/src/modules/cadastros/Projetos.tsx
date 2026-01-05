import { useState, useEffect } from 'react';
import { FolderKanban, Plus, Pencil, Trash2 } from 'lucide-react';
import { PageLayout, DataTableWithDetail, Badge, ConfirmModal, useApi, Button, Input, toast, type DataTableWithDetailColumn, type PaginatedResult } from 'd-rts';
import { projetoService } from '../../services/projetoService';
import { tarefaService } from '../../services/tarefaService';
import { StatusProjeto } from '../../types/projeto';
import type { Projeto } from '../../types/projeto';
import type { Tarefa, CreateTarefaRequest, UpdateTarefaRequest } from '../../types/tarefa';
import ProjetoFormModal from '../../components/modals/ProjetoFormModal';

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null);

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);
  const [tarefaForm, setTarefaForm] = useState({ nome: '', descricao: '' });
  const [isAddingTarefa, setIsAddingTarefa] = useState(false);

  const { execute: fetchProjetos } = useApi<PaginatedResult<Projeto>>({
    showErrorMessage: true,
  });

  const { execute: deleteProjetos } = useApi({
    showSuccessMessage: true,
    showErrorMessage: true,
  });

  const { execute: fetchTarefas, loading: loadingTarefas } = useApi<Tarefa[]>();
  const { execute: saveTarefa, loading: savingTarefa } = useApi<Tarefa>();
  const { execute: deleteTarefa } = useApi();

  const loadProjetos = async () => {
    const result = await fetchProjetos(() => projetoService.getAll());
    if (result) {
      setProjetos(result.data);
    }
  };

  const loadTarefas = async (projetoId: number) => {
    const result = await fetchTarefas(() => tarefaService.getByProjeto(projetoId));
    if (result) {
      setTarefas(result);
    }
  };

  useEffect(() => {
    loadProjetos();
  }, []);

  useEffect(() => {
    if (selectedProjeto) {
      loadTarefas(selectedProjeto.id);
    } else {
      setTarefas([]);
    }
    setEditingTarefa(null);
    setIsAddingTarefa(false);
    setTarefaForm({ nome: '', descricao: '' });
  }, [selectedProjeto?.id]);

  const handleAdd = () => {
    setEditingProjeto(null);
    setIsFormOpen(true);
  };

  const handleEdit = () => {
    if (selectedProjeto) {
      setEditingProjeto(selectedProjeto);
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedProjeto) {
      setIsConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedProjeto) {
      await deleteProjetos(() => projetoService.delete(selectedProjeto.id));
    }
    setIsConfirmOpen(false);
    setSelectedProjeto(null);
    loadProjetos();
  };

  const handleRefresh = () => {
    loadProjetos();
    if (selectedProjeto) {
      loadTarefas(selectedProjeto.id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProjeto(null);
    setSelectedProjeto(null);
    loadProjetos();
  };

  const handleAddTarefa = () => {
    setEditingTarefa(null);
    setTarefaForm({ nome: '', descricao: '' });
    setIsAddingTarefa(true);
  };

  const handleEditTarefa = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa);
    setTarefaForm({ nome: tarefa.nome, descricao: tarefa.descricao || '' });
    setIsAddingTarefa(true);
  };

  const handleCancelTarefa = () => {
    setEditingTarefa(null);
    setTarefaForm({ nome: '', descricao: '' });
    setIsAddingTarefa(false);
  };

  const handleSaveTarefa = async () => {
    if (!tarefaForm.nome.trim()) {
      toast({ title: 'Nome da tarefa e obrigatorio', variant: 'destructive' });
      return;
    }

    if (!selectedProjeto) return;

    if (editingTarefa) {
      const request: UpdateTarefaRequest = {
        id: editingTarefa.id,
        projetoId: selectedProjeto.id,
        nome: tarefaForm.nome,
        descricao: tarefaForm.descricao
      };
      const result = await saveTarefa(() => tarefaService.update(editingTarefa.id, request));
      if (result) {
        setTarefas(prev => prev.map(t => t.id === editingTarefa.id ? result : t));
        toast({ title: 'Tarefa atualizada com sucesso', variant: 'success' });
      }
    } else {
      const request: CreateTarefaRequest = {
        projetoId: selectedProjeto.id,
        nome: tarefaForm.nome,
        descricao: tarefaForm.descricao
      };
      const result = await saveTarefa(() => tarefaService.create(request));
      if (result) {
        setTarefas(prev => [...prev, result]);
        toast({ title: 'Tarefa criada com sucesso', variant: 'success' });
      }
    }

    handleCancelTarefa();
  };

  const handleDeleteTarefa = async (tarefa: Tarefa) => {
    await deleteTarefa(() => tarefaService.delete(tarefa.id));
    setTarefas(prev => prev.filter(t => t.id !== tarefa.id));
    toast({ title: 'Tarefa removida com sucesso', variant: 'success' });
  };

  const columns: DataTableWithDetailColumn<Projeto>[] = [
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

  const renderDetail = (projeto: Projeto) => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="text-lg font-bold mb-3">{projeto.nome}</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Cliente</span>
            <p className="font-medium">{projeto.clienteNome}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Horas Previstas</span>
            <p className="font-medium">{projeto.qtdTotalHoras}h</p>
          </div>
          {projeto.responsavel && (
            <div>
              <span className="text-muted-foreground text-xs">Responsável</span>
              <p className="font-medium">{projeto.responsavel}</p>
            </div>
          )}
          {projeto.emailResponsavel && (
            <div>
              <span className="text-muted-foreground text-xs">Email do Responsável</span>
              <p className="font-medium">{projeto.emailResponsavel}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-semibold">Tarefas</h5>
          {!isAddingTarefa && (
            <Button size="sm" variant="secondary" onClick={handleAddTarefa} className="h-8">
              <Plus size={14} className="mr-1" />
              Nova Tarefa
            </Button>
          )}
        </div>

        {isAddingTarefa && (
          <div className="space-y-2 mb-4 p-3 border rounded-lg bg-muted/30">
            <Input
              placeholder="Nome da tarefa"
              value={tarefaForm.nome}
              onChange={(e) => setTarefaForm(prev => ({ ...prev, nome: e.target.value }))}
            />
            <Input
              placeholder="Descricao (opcional)"
              value={tarefaForm.descricao}
              onChange={(e) => setTarefaForm(prev => ({ ...prev, descricao: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleSaveTarefa} disabled={savingTarefa} className="flex-1">
                {savingTarefa ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={handleCancelTarefa}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {loadingTarefas ? (
          <p className="text-sm text-muted-foreground text-center py-8">Carregando tarefas...</p>
        ) : tarefas.length === 0 && !isAddingTarefa ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Nenhuma tarefa cadastrada</p>
            <p className="text-xs mt-1">Clique em "Nova Tarefa" para adicionar</p>
          </div>
        ) : tarefas.length > 0 ? (
          <div className="space-y-2">
            {tarefas.map((tarefa) => (
              <div
                key={tarefa.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 group transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{tarefa.nome}</p>
                  {tarefa.descricao && (
                    <p className="text-sm text-muted-foreground mt-0.5">{tarefa.descricao}</p>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEditTarefa(tarefa)}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTarefa(tarefa)}
                    className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <PageLayout
      title="Projetos"
      icon={<FolderKanban size={24} />}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRefresh={handleRefresh}
      selectedRowsCount={selectedProjeto ? 1 : 0}
    >
      <DataTableWithDetail
        columns={columns}
        data={projetos}
        rowKey="id"
        selectedRow={selectedProjeto}
        onRowSelect={setSelectedProjeto}
        renderDetail={renderDetail}
        emptyDetailMessage="Nenhum projeto selecionado"
        emptyDetailDescription="Clique em um projeto para ver detalhes e tarefas"
        gridRatio={[7, 5]}
      />

      <ConfirmModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Excluir Projeto"
        description="Tem certeza que deseja excluir este projeto?"
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
