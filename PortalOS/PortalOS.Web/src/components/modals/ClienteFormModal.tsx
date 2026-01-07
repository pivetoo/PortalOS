import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox, useApi } from 'd-rts';
import { clienteService } from '../../services/clienteService';
import { StatusCliente } from '../../types/cliente';
import type { Cliente, CreateClienteRequest } from '../../types/cliente';
import { maskCnpj, maskTelefone } from '../../utils/formatters';

interface ClienteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
  onSuccess: () => void;
}

const initialFormData: CreateClienteRequest = {
  razaoSocial: '',
  cnpj: '',
  responsavel: '',
  telefone: '',
  emailResponsavel: '',
  emailFinanceiro: '',
  endereco: '',
  statusCliente: StatusCliente.Ativo,
  clienteTotvs: false,
};

export default function ClienteFormModal({ open, onOpenChange, cliente, onSuccess }: ClienteFormModalProps) {
  const isEditing = !!cliente;
  const [formData, setFormData] = useState<CreateClienteRequest>(initialFormData);

  const { execute, loading } = useApi({
    showSuccessMessage: true,
    showErrorMessage: true,
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        razaoSocial: cliente.razaoSocial,
        cnpj: cliente.cnpj,
        responsavel: cliente.responsavel,
        telefone: cliente.telefone,
        emailResponsavel: cliente.emailResponsavel,
        emailFinanceiro: cliente.emailFinanceiro,
        endereco: cliente.endereco,
        statusCliente: cliente.statusCliente,
        clienteTotvs: cliente.clienteTotvs,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [cliente]);

  const handleChange = (field: keyof CreateClienteRequest, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await execute(() => clienteService.update(cliente.id, { ...formData, id: cliente.id }));
      } else {
        await execute(() => clienteService.create(formData));
      }
      onSuccess();
    } catch {
      // Error handled by useApi
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="4xl">
        <ModalHeader>
          <ModalTitle>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ gridColumn: 'span 2' }} className="space-y-2">
              <label htmlFor="razaoSocial" className="text-sm font-medium">Razão Social</label>
              <Input
                id="razaoSocial"
                value={formData.razaoSocial}
                onChange={(e) => handleChange('razaoSocial', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cnpj" className="text-sm font-medium">CNPJ</label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => handleChange('cnpj', maskCnpj(e.target.value))}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="responsavel" className="text-sm font-medium">Responsável</label>
              <Input
                id="responsavel"
                value={formData.responsavel}
                onChange={(e) => handleChange('responsavel', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="telefone" className="text-sm font-medium">Telefone</label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', maskTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="emailResponsavel" className="text-sm font-medium">Email Responsável</label>
              <Input
                id="emailResponsavel"
                type="email"
                value={formData.emailResponsavel}
                onChange={(e) => handleChange('emailResponsavel', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="emailFinanceiro" className="text-sm font-medium">Email Financeiro</label>
              <Input
                id="emailFinanceiro"
                type="email"
                value={formData.emailFinanceiro}
                onChange={(e) => handleChange('emailFinanceiro', e.target.value)}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }} className="space-y-2">
              <label htmlFor="endereco" className="text-sm font-medium">Endereço</label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.statusCliente.toString()}
                onValueChange={(value) => handleChange('statusCliente', parseInt(value))}
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

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="clienteTotvs"
                checked={formData.clienteTotvs}
                onCheckedChange={(checked) => handleChange('clienteTotvs', !!checked)}
              />
              <label htmlFor="clienteTotvs" className="text-sm font-medium">Cliente TOTVS</label>
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
