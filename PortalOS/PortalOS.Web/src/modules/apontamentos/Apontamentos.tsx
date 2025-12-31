import { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import {
  PageLayout,
  Card,
  CardContent,
  CardHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Input,
  Button
} from 'd-rts';

interface Apontamento {
  id: number;
  data: string;
  cliente: string;
  projeto: string;
  tarefa: string;
  horaInicio: string;
  horaFim: string;
  totalDia: string;
}

const clientesMock = ['HVTECH Sistemas', 'Tech Solutions', 'Empresa ABC'];
const projetosMock = ['Portal HVTECH', 'App Mobile', 'Sistema Interno', 'Manutencao'];

const apontamentosIniciais: Apontamento[] = [
  { id: 1, data: '02/12/2025', cliente: 'HVTECH Sistemas', projeto: 'Portal HVTECH', tarefa: 'Desenvolvimento', horaInicio: '08:00', horaFim: '17:00', totalDia: '08:00' },
  { id: 2, data: '03/12/2025', cliente: 'HVTECH Sistemas', projeto: 'Portal HVTECH', tarefa: 'Testes', horaInicio: '08:00', horaFim: '16:30', totalDia: '07:30' },
  { id: 3, data: '04/12/2025', cliente: 'Tech Solutions', projeto: 'App Mobile', tarefa: 'Integracao API', horaInicio: '08:00', horaFim: '17:00', totalDia: '08:00' },
  { id: 4, data: '05/12/2025', cliente: 'HVTECH Sistemas', projeto: 'Sistema Interno', tarefa: 'Correcao de bugs', horaInicio: '09:00', horaFim: '16:00', totalDia: '06:00' },
  { id: 5, data: '06/12/2025', cliente: 'Tech Solutions', projeto: 'App Mobile', tarefa: 'Deploy', horaInicio: '08:00', horaFim: '17:30', totalDia: '08:30' },
  { id: 6, data: '', cliente: '', projeto: '', tarefa: '', horaInicio: '', horaFim: '', totalDia: '' },
  { id: 7, data: '', cliente: '', projeto: '', tarefa: '', horaInicio: '', horaFim: '', totalDia: '' },
  { id: 8, data: '', cliente: '', projeto: '', tarefa: '', horaInicio: '', horaFim: '', totalDia: '' },
];

const meses = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Marco' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

export default function Apontamentos() {
  const anoAtual = new Date().getFullYear();
  const mesAtual = (new Date().getMonth() + 1).toString();

  const [apontamentos, setApontamentos] = useState<Apontamento[]>(apontamentosIniciais);
  const [ano, setAno] = useState(anoAtual.toString());
  const [mes, setMes] = useState(mesAtual);

  const anos = Array.from({ length: 5 }, (_, i) => (anoAtual - 2 + i).toString());

  const calcularTotalHoras = () => {
    let totalMinutos = 0;
    apontamentos.forEach(ap => {
      if (ap.totalDia) {
        const [horas, minutos] = ap.totalDia.split(':').map(Number);
        totalMinutos += horas * 60 + minutos;
      }
    });
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  };

  const calcularTotalDia = (horaInicio: string, horaFim: string): string => {
    if (!horaInicio || !horaFim) return '';
    const [inicioH, inicioM] = horaInicio.split(':').map(Number);
    const [fimH, fimM] = horaFim.split(':').map(Number);
    const inicioMinutos = inicioH * 60 + inicioM;
    const fimMinutos = fimH * 60 + fimM;
    const diffMinutos = fimMinutos - inicioMinutos - 60;
    if (diffMinutos <= 0) return '';
    const horas = Math.floor(diffMinutos / 60);
    const minutos = diffMinutos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  };

  const handleCellChange = (id: number, field: keyof Apontamento, value: string) => {
    setApontamentos(prev => prev.map(ap => {
      if (ap.id === id) {
        const updated = { ...ap, [field]: value };
        if (field === 'horaInicio' || field === 'horaFim') {
          updated.totalDia = calcularTotalDia(
            field === 'horaInicio' ? value : ap.horaInicio,
            field === 'horaFim' ? value : ap.horaFim
          );
        }
        return updated;
      }
      return ap;
    }));
  };

  const adicionarLinha = () => {
    const novoId = Math.max(...apontamentos.map(a => a.id)) + 1;
    setApontamentos(prev => [...prev, {
      id: novoId,
      data: '',
      cliente: '',
      projeto: '',
      tarefa: '',
      horaInicio: '',
      horaFim: '',
      totalDia: ''
    }]);
  };

  const removerLinha = (id: number) => {
    setApontamentos(prev => prev.filter(ap => ap.id !== id));
  };

  return (
    <PageLayout
      title="Apontamento de OS"
      icon={<Clock size={24} />}
    >
      <div className="space-y-4">
        <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={ano} onValueChange={setAno}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {anos.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={mes} onValueChange={setMes}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {meses.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock size={20} className="text-muted-foreground" />
              <span>Total de Horas:</span>
              <span className="text-primary">{calcularTotalHoras()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Button
            variant="outline"
            size="icon"
            onClick={adicionarLinha}
            className="rounded-full w-8 h-8"
          >
            <Plus size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Ação</TableHead>
                  <TableHead className="w-[120px]">Data</TableHead>
                  <TableHead className="w-[180px]">Cliente</TableHead>
                  <TableHead className="w-[180px]">Projeto</TableHead>
                  <TableHead>Tarefa</TableHead>
                  <TableHead className="w-[100px]">Inicio</TableHead>
                  <TableHead className="w-[100px]">Fim</TableHead>
                  <TableHead className="w-[100px]">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apontamentos.map((ap) => (
                  <TableRow key={ap.id}>
                    <TableCell className="p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removerLinha(ap.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="date"
                        value={ap.data ? ap.data.split('/').reverse().join('-') : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const formatted = val ? val.split('-').reverse().join('/') : '';
                          handleCellChange(ap.id, 'data', formatted);
                        }}
                        className="h-8 text-sm"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Select
                        value={ap.cliente}
                        onValueChange={(value) => handleCellChange(ap.id, 'cliente', value)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientesMock.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-1">
                      <Select
                        value={ap.projeto}
                        onValueChange={(value) => handleCellChange(ap.id, 'projeto', value)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {projetosMock.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        value={ap.tarefa}
                        onChange={(e) => handleCellChange(ap.id, 'tarefa', e.target.value)}
                        placeholder="Descricao da tarefa"
                        className="h-8 text-sm"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="time"
                        value={ap.horaInicio}
                        onChange={(e) => handleCellChange(ap.id, 'horaInicio', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="time"
                        value={ap.horaFim}
                        onChange={(e) => handleCellChange(ap.id, 'horaFim', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        value={ap.totalDia}
                        readOnly
                        className="h-8 text-sm bg-muted font-medium text-center"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </PageLayout>
  );
}
