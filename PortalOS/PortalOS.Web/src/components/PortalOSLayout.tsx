import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, Clock } from 'lucide-react';
import logoPortalOs from '../assets/logo-portalos.png';
import logoSidebar from '../assets/logo-sidebar.png';
import { AppLayout, useAuth, AuthService, useBreadcrumbs } from 'd-rts';

export default function PortalOSLayout() {
  const { user: authUser, contract, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await AuthService.logoutFromServer();
    logout();
  };

  const user = {
    name: authUser!.name,
    email: authUser!.email,
    role: contract!.profileName,
    avatarUrl: authUser?.avatarUrl
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', active: isActive('/'), onClick: () => navigate('/') }
  ];

  const menuGroups = [
    {
      label: 'Cadastros',
      collapsible: true,
      defaultExpanded: true,
      items: [
        { key: 'clientes', label: 'Clientes', icon: <Users size={20} />, path: '/cadastros/clientes', active: isActive('/cadastros/clientes'), onClick: () => navigate('/cadastros/clientes') },
        { key: 'projetos', label: 'Projetos', icon: <FolderKanban size={20} />, path: '/cadastros/projetos', active: isActive('/cadastros/projetos'), onClick: () => navigate('/cadastros/projetos') }
      ]
    },
    {
      label: 'Apontamentos',
      collapsible: true,
      defaultExpanded: true,
      items: [
        { key: 'apontamentos', label: 'Apontamento de OS', icon: <Clock size={20} />, path: '/apontamentos', active: isActive('/apontamentos'), onClick: () => navigate('/apontamentos') }
      ]
    }
  ];

  const breadcrumbs = useBreadcrumbs({
    pathname: location.pathname,
    navigate,
    menuItems,
    menuGroups
  });

  return (
    <AppLayout
      title={contract!.applicationName}
      subtitle={contract!.companyName}
      logo={
        <img src={logoPortalOs} alt="PortalOS" className="w-8 h-8 object-contain" />
      }
      user={user}
      onLogout={handleLogout}
      menuItems={menuItems}
      menuGroups={menuGroups}
      initialCollapsed={false}
      breadcrumbs={breadcrumbs}
      companyLogo={logoSidebar}
    >
      <Outlet />
    </AppLayout>
  );
}
