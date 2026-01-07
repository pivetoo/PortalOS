import { useState, useEffect, useMemo } from 'react';
import { Clock, Plus, Pencil, Trash2, Printer, FileText, CalendarRange } from 'lucide-react';
import { PageLayout, Card, CardContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, toast, useApi, Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter, Input } from 'd-rts';
import { ordemServicoService } from '../../services/ordemServicoService';
import { relatorioService } from '../../services/relatorioService';
import { clienteService } from '../../services/clienteService';
import { projetoService } from '../../services/projetoService';
import { tarefaService } from '../../services/tarefaService';
import type { OrdemServico, CreateOrdemServicoRequest, UpdateOrdemServicoRequest } from '../../types/ordemServico';
import type { Cliente } from '../../types/cliente';
import type { Projeto } from '../../types/projeto';
import type { Tarefa } from '../../types/tarefa';
import { meses, diasSemana } from '../../utils/constants';
import { formatDateToInput, formatTimeToInput, formatHoras } from '../../utils/formatters';

interface ApontamentoForm {
  id: number | null;
  tarefaId: number | null;
  projetoId: number | null;
  clienteId: number | null;
  dataAgenda: string | null;
  horaInicio: string;
  horaFim: string;
  inicioIntervalo: string;
  fimIntervalo: string;
  descricao: string;
}

function calcularTotalHoras(horaInicio: string, horaFim: string, inicioIntervalo?: string, fimIntervalo?: string): number {
  if (!horaInicio || !horaFim) return 0;

  const diffMinutos = (inicio: string, fim: string): number => {
    const [inicioH, inicioM] = inicio.split(':').map(Number);
    const [fimH, fimM] = fim.split(':').map(Number);
    return (fimH * 60 + fimM) - (inicioH * 60 + inicioM);
  };

  const expediente = diffMinutos(horaInicio, horaFim);
  const intervalo = (inicioIntervalo && fimIntervalo)
    ? diffMinutos(inicioIntervalo, fimIntervalo)
    : 0;

  const total = expediente - intervalo;
  return total > 0 ? total / 60 : 0;
}

function emptyForm(): ApontamentoForm {
  return {
    id: null,
    tarefaId: null,
    projetoId: null,
    clienteId: null,
    dataAgenda: null,
    horaInicio: '',
    horaFim: '',
    inicioIntervalo: '',
    fimIntervalo: '',
    descricao: ''
  };
}

export default function Apontamentos() {
  const anoAtual = new Date().getFullYear();
  const mesAtual = (new Date().getMonth() + 1).toString();

  const [apontamentos, setApontamentos] = useState<OrdemServico[]>([]);
  const [ano, setAno] = useState(anoAtual.toString());
  const [mes, setMes] = useState(mesAtual);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPeriodoOpen, setModalPeriodoOpen] = useState(false);
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [form, setForm] = useState<ApontamentoForm>(emptyForm());

  const anos = [anoAtual.toString(), (anoAtual - 1).toString()];

  const { execute: loadOrdens, loading: loadingOrdens } = useApi();
  const { execute: loadClientes } = useApi();
  const { execute: loadProjetos } = useApi();
  const { execute: loadTarefas } = useApi();
  const { execute: saveApontamento, loading: saving } = useApi();
  const { execute: deleteApontamento } = useApi();

  const totalMes = useMemo(() => {
    return apontamentos.reduce((acc, ap) => acc + ap.totalHoras, 0);
  }, [apontamentos]);

  useEffect(() => {
    loadClientes(() => clienteService.getAtivos()).then((data) => {
      if (data) setClientes(data);
    });
    loadProjetos(() => projetoService.getAtivos()).then((data) => {
      if (data) setProjetos(data);
    });
  }, []);

  useEffect(() => {
    loadOrdens(() => ordemServicoService.getByMesAno(parseInt(ano), parseInt(mes))).then((data) => {
      if (data) setApontamentos(data);
    });
  }, [ano, mes]);

  const getProjetosByCliente = (clienteId: number | null) => {
    if (!clienteId) return projetos;
    return projetos.filter((p) => p.clienteId === clienteId);
  };

  const getTarefasByProjeto = (projetoId: number | null) => {
    if (!projetoId) return [];
    return tarefas.filter((t) => t.projetoId === projetoId);
  };

  const getClienteFromProjeto = (projetoId: number | null): number | null => {
    if (!projetoId) return null;
    const projeto = projetos.find((p) => p.id === projetoId);
    return projeto?.clienteId ?? null;
  };

  const loadTarefasByProjeto = async (projetoId: number) => {
    const data = await loadTarefas(() => tarefaService.getByProjeto(projetoId));
    if (data) setTarefas(data);
  };

  const openNewModal = () => {
    const hoje = new Date();
    const dataLocal = `${hoje.getFullYear()}-${(hoje.getMonth() + 1).toString().padStart(2, '0')}-${hoje.getDate().toString().padStart(2, '0')}`;
    setForm({
      ...emptyForm(),
      dataAgenda: dataLocal
    });
    setModalOpen(true);
  };

  const openEditModal = async (ap: OrdemServico) => {
    if (ap.projetoId) {
      await loadTarefasByProjeto(ap.projetoId);
    }
    setForm({
      id: ap.id,
      tarefaId: ap.tarefaId,
      projetoId: ap.projetoId,
      clienteId: ap.clienteId,
      dataAgenda: formatDateToInput(ap.dataAgenda),
      horaInicio: formatTimeToInput(ap.horaInicio),
      horaFim: formatTimeToInput(ap.horaFim),
      inicioIntervalo: formatTimeToInput(ap.inicioIntervalo),
      fimIntervalo: formatTimeToInput(ap.fimIntervalo),
      descricao: ap.descricao || ''
    });
    setModalOpen(true);
  };

  const handleFormChange = (field: keyof ApontamentoForm, value: string | number | null) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === 'projetoId' && value) {
        updated.clienteId = getClienteFromProjeto(value as number);
        updated.tarefaId = null;
        loadTarefasByProjeto(value as number);
      }

      if (field === 'clienteId') {
        const projetosCliente = getProjetosByCliente(value as number);
        if (!projetosCliente.find((p) => p.id === prev.projetoId)) {
          updated.projetoId = null;
          updated.tarefaId = null;
          setTarefas([]);
        }
      }

      return updated;
    });
  };

  const canSave = (): boolean => {
    return !!form.tarefaId && !!form.horaInicio && !!form.horaFim;
  };

  const handleSave = async () => {
    if (!canSave()) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }

    const baseDate = form.dataAgenda || new Date().toISOString().split('T')[0];
    const horaInicio = new Date(baseDate + 'T' + form.horaInicio + ':00').toISOString();
    const horaFim = new Date(baseDate + 'T' + form.horaFim + ':00').toISOString();
    const inicioIntervalo = form.inicioIntervalo
      ? new Date(baseDate + 'T' + form.inicioIntervalo + ':00').toISOString()
      : null;
    const fimIntervalo = form.fimIntervalo
      ? new Date(baseDate + 'T' + form.fimIntervalo + ':00').toISOString()
      : null;

    if (form.id === null) {
      const request: CreateOrdemServicoRequest = {
        tarefaId: form.tarefaId!,
        dataAgenda: new Date(baseDate + 'T00:00:00').toISOString(),
        horaInicio,
        horaFim,
        inicioIntervalo,
        fimIntervalo,
        descricao: form.descricao
      };

      const novaOrdem = await saveApontamento(() => ordemServicoService.create(request));
      if (novaOrdem) {
        setApontamentos((prev) => [...prev, novaOrdem]);
        setModalOpen(false);
        toast({ title: 'Apontamento criado com sucesso', variant: 'success' });
      }
    } else {
      const request: UpdateOrdemServicoRequest = {
        id: form.id,
        tarefaId: form.tarefaId!,
        dataAgenda: new Date(baseDate + 'T00:00:00').toISOString(),
        horaInicio,
        horaFim,
        inicioIntervalo,
        fimIntervalo,
        descricao: form.descricao
      };

      const ordemAtualizada = await saveApontamento(() => ordemServicoService.update(form.id!, request));
      if (ordemAtualizada) {
        setApontamentos((prev) => prev.map((ap) => (ap.id === form.id ? ordemAtualizada : ap)));
        setModalOpen(false);
        toast({ title: 'Apontamento atualizado com sucesso', variant: 'success' });
      }
    }
  };

  const handleDelete = async (ap: OrdemServico) => {
    await deleteApontamento(() => ordemServicoService.delete(ap.id));
    setApontamentos((prev) => prev.filter((a) => a.id !== ap.id));
    toast({ title: 'Apontamento removido com sucesso', variant: 'success' });
  };

  const handlePrint = async (ap: OrdemServico) => {
    try {
      await relatorioService.downloadPdfOrdemServico(ap.id);
      toast({ title: 'PDF gerado com sucesso', variant: 'success' });
    } catch {
      toast({ title: 'Erro ao gerar PDF', variant: 'destructive' });
    }
  };

  const handleRelatorioMensal = async () => {
    try {
      await relatorioService.downloadRelatorioMensal(parseInt(ano), parseInt(mes));
      toast({ title: 'Relatório gerado com sucesso', variant: 'success' });
    } catch {
      toast({ title: 'Erro ao gerar relatório', variant: 'destructive' });
    }
  };

  const openModalPeriodo = () => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    setPeriodoInicio(primeiroDia.toISOString().split('T')[0]);
    setPeriodoFim(hoje.toISOString().split('T')[0]);
    setModalPeriodoOpen(true);
  };

  const handleRelatorioPorPeriodo = async () => {
    if (!periodoInicio || !periodoFim) {
      toast({ title: 'Selecione as datas de início e fim', variant: 'destructive' });
      return;
    }
    try {
      await relatorioService.downloadPdfPorPeriodo(periodoInicio, periodoFim);
      toast({ title: 'Relatório gerado com sucesso', variant: 'success' });
      setModalPeriodoOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao gerar relatório';
      toast({ title: message, variant: 'destructive' });
    }
  };

  const formTotalHoras = calcularTotalHoras(
    form.horaInicio,
    form.horaFim,
    form.inicioIntervalo,
    form.fimIntervalo
  );

  return (
    <PageLayout title="Apontamentos" icon={<Clock size={24} />}>
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Select value={ano} onValueChange={setAno}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {anos.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={mes} onValueChange={setMes}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {meses.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={() => openNewModal()} className="gap-2">
                  <Plus size={16} />
                  Novo Apontamento
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Clock size={20} className="text-muted-foreground" />
                  <span>Total:</span>
                  <span className="text-primary">{formatHoras(totalMes)}</span>
                </div>
                <Button variant="outline" onClick={handleRelatorioMensal} className="gap-2">
                  <FileText size={16} />
                  Relatório Mensal
                </Button>
                <Button variant="outline" onClick={openModalPeriodo} className="gap-2">
                  <CalendarRange size={16} />
                  Relatório por Período
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="border rounded-lg overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border-b border-r px-3 py-2 text-left font-semibold w-[100px]">Data</th>
                  <th className="border-b border-r px-3 py-2 text-left font-semibold w-[60px]">Dia</th>
                  <th className="border-b border-r px-3 py-2 text-left font-semibold min-w-[150px]">Cliente</th>
                  <th className="border-b border-r px-3 py-2 text-left font-semibold min-w-[150px]">Projeto</th>
                  <th className="border-b border-r px-3 py-2 text-left font-semibold min-w-[150px]">Tarefa</th>
                  <th className="border-b border-r px-3 py-2 text-center font-semibold w-[70px]">Entrada</th>
                  <th className="border-b border-r px-3 py-2 text-center font-semibold w-[100px]">Intervalo</th>
                  <th className="border-b border-r px-3 py-2 text-center font-semibold w-[70px]">Saída</th>
                  <th className="border-b border-r px-3 py-2 text-center font-semibold w-[70px]">Total</th>
                  <th className="border-b border-r px-3 py-2 text-left font-semibold min-w-[200px]">Descrição</th>
                  <th className="border-b px-3 py-2 text-center font-semibold w-[80px]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrdens && (
                  <tr>
                    <td colSpan={11} className="px-3 py-8 text-center text-muted-foreground">
                      Carregando apontamentos...
                    </td>
                  </tr>
                )}

                {!loadingOrdens && apontamentos.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-3 py-8 text-center text-muted-foreground">
                      Nenhum apontamento encontrado para este período
                    </td>
                  </tr>
                )}

                {!loadingOrdens &&
                  [...apontamentos]
                    .sort((a, b) => {
                      const dateCompare = formatDateToInput(a.dataAgenda).localeCompare(formatDateToInput(b.dataAgenda));
                      if (dateCompare !== 0) return dateCompare;
                      return (a.horaInicio || '').localeCompare(b.horaInicio || '');
                    })
                    .map((ap, index, arr) => {
                      const dataKey = formatDateToInput(ap.dataAgenda);
                      const date = new Date(ap.dataAgenda);
                      const dayOfWeek = diasSemana[date.getDay()];
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      const isToday = dataKey === new Date().toISOString().split('T')[0];

                      const prevDataKey = index > 0 ? formatDateToInput(arr[index - 1].dataAgenda) : null;
                      const isFirstOfDay = prevDataKey !== dataKey;
                      const isLastOfDay = index === arr.length - 1 || formatDateToInput(arr[index + 1].dataAgenda) !== dataKey;

                      return (
                        <tr
                          key={ap.id}
                          className={`
                            ${isWeekend ? 'bg-muted/30' : 'hover:bg-muted/20'}
                            ${isToday ? 'bg-primary/5' : ''}
                            ${isLastOfDay ? 'border-b-2 border-b-border' : ''}
                          `}
                        >
                          <td className={`border-r px-3 py-2 font-medium ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            <button
                              onClick={() => openNewModal()}
                              className="hover:text-primary transition-colors text-left"
                              title="Adicionar apontamento neste dia"
                            >
                              {date.getDate().toString().padStart(2, '0')}/{(date.getMonth() + 1).toString().padStart(2, '0')}
                            </button>
                          </td>
                          <td className={`border-r px-3 py-2 text-muted-foreground ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            {dayOfWeek}
                          </td>
                          <td className={`border-r px-3 py-2 ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            {ap.clienteNome}
                          </td>
                          <td className={`border-r px-3 py-2 ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            {ap.projetoNome}
                          </td>
                          <td className={`border-r px-3 py-2 ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            {ap.tarefaNome}
                          </td>
                          <td className={`border-r px-3 py-2 text-center font-mono ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            {formatTimeToInput(ap.horaInicio)}
                          </td>
                          <td className={`border-r px-3 py-2 text-center text-muted-foreground font-mono text-xs ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            {ap.inicioIntervalo && ap.fimIntervalo
                              ? `${formatTimeToInput(ap.inicioIntervalo)}-${formatTimeToInput(ap.fimIntervalo)}`
                              : '-'}
                          </td>
                          <td className={`border-r px-3 py-2 text-center font-mono ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            {formatTimeToInput(ap.horaFim)}
                          </td>
                          <td className={`border-r px-3 py-2 text-center font-mono font-semibold text-primary ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            {formatHoras(ap.totalHoras)}
                          </td>
                          <td className={`border-r px-3 py-2 text-muted-foreground truncate max-w-[300px] ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`} title={ap.descricao || ''}>
                            {ap.descricao || '-'}
                          </td>
                          <td className={`px-2 py-1 ${!isFirstOfDay ? 'border-t border-t-muted' : 'border-t'}`}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditModal(ap)}
                                className="p-1.5 rounded hover:bg-muted transition-colors"
                                title="Editar"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handlePrint(ap)}
                                className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                                title="Imprimir PDF"
                              >
                                <Printer size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(ap)}
                                className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                                title="Excluir"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent size="3xl">
          <ModalHeader>
            <ModalTitle>
              {form.id ? 'Editar Apontamento' : 'Novo Apontamento'}
            </ModalTitle>
          </ModalHeader>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} className="py-4">
            <div style={{ gridColumn: 'span 2' }} className="space-y-2">
              <label htmlFor="projeto" className="text-sm font-medium">Projeto</label>
              <Select
                value={form.projetoId?.toString() || ''}
                onValueChange={(value) => handleFormChange('projetoId', value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o projeto" />
                </SelectTrigger>
                <SelectContent>
                  {getProjetosByCliente(form.clienteId).map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div style={{ gridColumn: 'span 2' }} className="space-y-2">
              <label htmlFor="cliente" className="text-sm font-medium">Cliente</label>
              <Select
                value={form.clienteId?.toString() || ''}
                onValueChange={(value) => handleFormChange('clienteId', value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.razaoSocial}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div style={{ gridColumn: 'span 3' }} className="space-y-2">
              <label htmlFor="tarefa" className="text-sm font-medium">Tarefa</label>
              <Select
                value={form.tarefaId?.toString() || ''}
                onValueChange={(value) => handleFormChange('tarefaId', value ? parseInt(value) : null)}
                disabled={!form.projetoId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={form.projetoId ? "Selecione a tarefa" : "Selecione um projeto primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  {getTarefasByProjeto(form.projetoId).map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>{t.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="dataAgenda" className="text-sm font-medium">Data</label>
              <Input
                id="dataAgenda"
                type="date"
                value={form.dataAgenda || ''}
                onChange={(e) => handleFormChange('dataAgenda', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="horaInicio" className="text-sm font-medium">Entrada</label>
              <Input
                id="horaInicio"
                type="time"
                value={form.horaInicio}
                onChange={(e) => handleFormChange('horaInicio', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="inicioIntervalo" className="text-sm font-medium">Início Intervalo</label>
              <Input
                id="inicioIntervalo"
                type="time"
                value={form.inicioIntervalo}
                onChange={(e) => handleFormChange('inicioIntervalo', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="fimIntervalo" className="text-sm font-medium">Fim Intervalo</label>
              <Input
                id="fimIntervalo"
                type="time"
                value={form.fimIntervalo}
                onChange={(e) => handleFormChange('fimIntervalo', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="horaFim" className="text-sm font-medium">Saída</label>
              <Input
                id="horaFim"
                type="time"
                value={form.horaFim}
                onChange={(e) => handleFormChange('horaFim', e.target.value)}
              />
            </div>

            <div style={{ gridColumn: 'span 3' }} className="space-y-2">
              <label htmlFor="descricao" className="text-sm font-medium">Descrição</label>
              <textarea
                id="descricao"
                value={form.descricao}
                onChange={(e) => handleFormChange('descricao', e.target.value)}
                placeholder="Descreva as atividades realizadas..."
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col justify-end">
              <div className="p-3 bg-muted rounded-lg text-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <div className="text-lg font-bold text-primary">
                  {formatHoras(formTotalHoras)}
                </div>
              </div>
            </div>
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !canSave()}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={modalPeriodoOpen} onOpenChange={setModalPeriodoOpen}>
        <ModalContent size="md">
          <ModalHeader>
            <ModalTitle>Relatório por Período</ModalTitle>
          </ModalHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="periodoInicio" className="text-sm font-medium">Data Início</label>
              <Input
                id="periodoInicio"
                type="date"
                value={periodoInicio}
                onChange={(e) => setPeriodoInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="periodoFim" className="text-sm font-medium">Data Fim</label>
              <Input
                id="periodoFim"
                type="date"
                value={periodoFim}
                onChange={(e) => setPeriodoFim(e.target.value)}
              />
            </div>
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setModalPeriodoOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRelatorioPorPeriodo} disabled={!periodoInicio || !periodoFim}>
              Gerar PDF
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
}
