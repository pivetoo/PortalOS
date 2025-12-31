import { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useApi
} from 'd-rts';
import { projetoService } from '../../services/projetoService';
import { clienteService } from '../../services/clienteService';
import { StatusProjeto } from '../../types/projeto';
import type { Projeto, CreateProjetoRequest } from '../../types/projeto';
import type { Cliente } from '../../types/cliente';

interface ProjetoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projeto: Projeto | null;
  onSuccess: () => void;
}

const initialFormData: CreateProjetoRequest = {
  clienteId: 0,
  nome: '',
  responsavel: '',
  emailResponsavel: '',
  statusProjeto: StatusProjeto.Ativo,
  qtdTotalHoras: 0,
};

export default function ProjetoFormModal({ open, onOpenChange, projeto, onSuccess }: ProjetoFormModalProps) {
  const isEditing = !!projeto;
  const [formData, setFormData] = useState<CreateProjetoRequest>(initialFormData);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const { execute, loading } = useApi({
    showSuccessMessage: true,
    showErrorMessage: true,
  });

  const { execute: fetchClientes } = useApi({
    showErrorMessage: true,
  });

  useEffect(() => {
    const loadClientes = async () => {
      const result = await fetchClientes(() => clienteService.getAll());
      if (result) {
        setClientes(result.data);
      }
    };
    if (open) {
      loadClientes();
    }
  }, [open]);

  useEffect(() => {
    if (projeto) {
      setFormData({
        clienteId: projeto.clienteId,
        nome: projeto.nome,
        responsavel: projeto.responsavel,
        emailResponsavel: projeto.emailResponsavel,
        statusProjeto: projeto.statusProjeto,
        qtdTotalHoras: projeto.qtdTotalHoras,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [projeto]);

  const handleChange = (field: keyof CreateProjetoRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await execute(() => projetoService.update(projeto.id, { ...formData, id: projeto.id }));
      } else {
        await execute(() => projetoService.create(formData));
      }
      onSuccess();
    } catch {
      // Error handled by useApi
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="3xl">
        <ModalHeader>
          <ModalTitle>{isEditing ? 'Editar Projeto' : 'Novo Projeto'}</ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ gridColumn: 'span 2' }} className="space-y-2">
              <label htmlFor="nome" className="text-sm font-medium">Nome</label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <Select
                value={formData.clienteId.toString()}
                onValueChange={(value) => handleChange('clienteId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.razaoSocial}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="responsavel" className="text-sm font-medium">Responsavel</label>
              <Input
                id="responsavel"
                value={formData.responsavel}
                onChange={(e) => handleChange('responsavel', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="emailResponsavel" className="text-sm font-medium">Email Responsavel</label>
              <Input
                id="emailResponsavel"
                type="email"
                value={formData.emailResponsavel}
                onChange={(e) => handleChange('emailResponsavel', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="qtdTotalHoras" className="text-sm font-medium">Qtd Total Horas</label>
              <Input
                id="qtdTotalHoras"
                type="number"
                value={formData.qtdTotalHoras}
                onChange={(e) => handleChange('qtdTotalHoras', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.statusProjeto.toString()}
                onValueChange={(value) => handleChange('statusProjeto', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Ativo</SelectItem>
                  <SelectItem value="1">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
