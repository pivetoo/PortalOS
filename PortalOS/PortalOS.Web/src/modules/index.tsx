import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, BarChart, PieChart, useApi } from 'd-rts';
import { FolderKanban, Clock, CheckCircle } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
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

  const formatHoras = (horas: number) => {
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  if (loading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Portal OS - HVTECH Sistemas
        </h1>
        <p className="text-muted-foreground">Acompanhe suas horas apontadas em {anoAtual}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Horas no Mes Atual
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatHoras(dashboard.horasMesAtual)}</div>
            <p className="text-xs text-muted-foreground">Meta: 160h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos Ativos
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.projetosAtivos}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos Finalizados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.projetosFinalizados}</div>
            <p className="text-xs text-muted-foreground">concluidos</p>
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
              data={dashboard.horasPorMes}
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
