import { useMemo } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, Clock } from 'lucide-react';
import { AppLayout, useAuth, AuthService } from 'd-rts';
import type { BreadcrumbItem } from 'd-rts';

const PortalOSLayout = () => {
  const { user: authUser, contract, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await AuthService.logoutFromServer();
    logout();
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const user = useMemo(() => {
    const getAvatar = () => {
      if (authUser?.avatarUrl) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '');
        const avatarUrl = authUser.avatarUrl.startsWith('http')
          ? authUser.avatarUrl
          : `${apiBaseUrl}${authUser.avatarUrl}`;

        return (
          <img
            src={avatarUrl}
            alt={authUser.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        );
      }
      return getInitials(authUser?.name || 'U');
    };

    return {
      name: authUser?.name || '',
      email: authUser?.email || '',
      role: contract?.profileName || '',
      avatar: getAvatar()
    };
  }, [authUser, contract]);

  const isActive = (path: string) => location.pathname === path;

  const dashboardItem = {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    active: isActive('/'),
    onClick: () => navigate('/')
  };

  const cadastrosGroup = {
    label: 'Cadastros',
    collapsible: true,
    defaultExpanded: true,
    items: [
      { key: 'clientes', label: 'Clientes', icon: <Users size={20} />, active: isActive('/cadastros/clientes'), onClick: () => navigate('/cadastros/clientes') },
      { key: 'projetos', label: 'Projetos', icon: <FolderKanban size={20} />, active: isActive('/cadastros/projetos'), onClick: () => navigate('/cadastros/projetos') }
    ]
  };

  const apontamentosGroup = {
    label: 'Apontamentos',
    collapsible: true,
    defaultExpanded: true,
    items: [
      { key: 'apontamentos', label: 'Apontamento de OS', icon: <Clock size={20} />, active: isActive('/apontamentos'), onClick: () => navigate('/apontamentos') }
    ]
  };

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [
      { label: 'Inicio', onClick: () => navigate('/') }
    ];

    const routeLabels: Record<string, string> = {
      '/': 'Dashboard',
      '/cadastros/clientes': 'Clientes',
      '/cadastros/projetos': 'Projetos',
      '/apontamentos': 'Apontamento de OS'
    };

    const currentLabel = routeLabels[location.pathname];
    if (currentLabel && currentLabel !== 'Dashboard') {
      crumbs.push({ label: currentLabel });
    }

    return crumbs;
  }, [location.pathname, navigate]);

  return (
    <AppLayout
      title="PortalOS"
      subtitle={contract?.companyName || ''}
      logo={
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <Clock size={20} className="text-primary-foreground" />
        </div>
      }
      user={user}
      onLogout={handleLogout}
      menuItems={[dashboardItem]}
      menuGroups={[cadastrosGroup, apontamentosGroup]}
      initialCollapsed={false}
      breadcrumbs={breadcrumbs}
    >
      <Outlet />
    </AppLayout>
  );
};

export default PortalOSLayout;
