import { AuthProvider, ThemeProvider, GlobalLoaderProvider, Toaster, setApiBaseURL } from 'd-rts';
import AppRoutes from './routes';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (apiBaseUrl) {
  setApiBaseURL(apiBaseUrl);
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
