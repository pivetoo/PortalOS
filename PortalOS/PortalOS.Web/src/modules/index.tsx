import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, BarChart, PieChart, useApi } from 'd-rts';
import { FolderKanban, Clock, CheckCircle } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { formatMes, formatHoras } from '../utils/formatters';
import type { DashboardResponse } from '../types/dashboard';

export default function Dashboard() {
  const anoAtual = new Date().getFullYear();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const { execute: fetchDashboard, loading } = useApi<DashboardResponse>({
    showErrorMessage: true,
  });

  const loadDashboard = async () => {
    const result = await fetchDashboard(() => dashboardService.get(anoAtual));
    if (result) {
      setDashboard(result);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading || !dashboard) {
    return null;
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo ao Portal OS!
        </h1>
        <p className="text-muted-foreground">Acompanhe suas horas apontadas em {anoAtual}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Horas no Mês Atual
            </CardTitle>
            <Clock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{formatHoras(dashboard.horasMesAtual)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos Ativos
            </CardTitle>
            <FolderKanban className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{dashboard.projetosAtivos}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos Finalizados
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{dashboard.projetosFinalizados}</div>
            <p className="text-xs text-muted-foreground">concluídos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Horas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={dashboard.horasPorMes.map(item => ({ name: formatMes(item.mes), horas: item.horas }))}
              dataKeys={['horas']}
              xAxisKey="name"
              height={300}
              colors={['#2E5EAA']}
              showLegend={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horas por Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={dashboard.horasPorProjeto}
              height={300}
              showLegend={true}
              outerRadius={80}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
