import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CatalogOverridesProvider } from './context/CatalogOverridesContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <AuthProvider>
      <CatalogOverridesProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CatalogOverridesProvider>
    </AuthProvider>
  </ErrorBoundary>
);
