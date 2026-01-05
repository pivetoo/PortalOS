import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Callback, ProtectedRoute, useAuth } from 'd-rts';
import PortalOSLayout from '../components/PortalOSLayout';
import Dashboard from '../modules';
import Clientes from '../modules/cadastros/Clientes';
import Projetos from '../modules/cadastros/Projetos';
import Apontamentos from '../modules/apontamentos/Apontamentos';

const AppRoutes = () => {
  const { user } = useAuth();
  const identityProviderUrl = import.meta.env.VITE_IDENTITY_PROVIDER_WEB;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/callback"
          element={
            <Callback
              identityProviderUrl={identityProviderUrl}
              redirectTo="/"
            />
          }
        />

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={!!user}
              redirectTo={identityProviderUrl}
              externalRedirect={true}
            >
              <PortalOSLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Cadastros */}
          <Route path="cadastros/clientes" element={<Clientes />} />
          <Route path="cadastros/projetos" element={<Projetos />} />

          {/* Apontamentos */}
          <Route path="apontamentos" element={<Apontamentos />} />

        </Route>

        <Route path="*" element={<div>Pagina nao encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
