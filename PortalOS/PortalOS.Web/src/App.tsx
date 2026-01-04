import { AuthProvider, ThemeProvider, GlobalLoaderProvider, Toaster, setApiBaseURL, setIdentityProviderURL } from 'd-rts';
import AppRoutes from './routes';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const identityProviderApiUrl = import.meta.env.VITE_IDENTITY_PROVIDER_API;

if (apiBaseUrl) {
  setApiBaseURL(apiBaseUrl);
}

if (identityProviderApiUrl) {
  setIdentityProviderURL(identityProviderApiUrl);
}

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalLoaderProvider>
          <AppRoutes />
          <Toaster />
        </GlobalLoaderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
