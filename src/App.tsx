import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client/react';
import { queryClient } from './lib/queryClient';
import { apolloClient } from './config/api/apolloConfig';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import MainLayout from './shared/components/layout/MainLayout';
import Loading from './shared/components/feedback/Loading';

const LoginForm = lazy(() => import('./features/auth/components/LoginForm'));
const DinardapPage = lazy(() => import('./features/dinardap/components/DinardapPage'));
const CitizensPage = lazy(() => import('./pages/CitizensPage'));
const ValidacionIdentidadPage = lazy(() => import('./pages/ValidacionIdentidadPage'));
const AuditPage = lazy(() => import('./pages/AuditPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<Loading fullScreen />}>
            <Routes>
              <Route path="/login" element={<LoginForm />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DinardapPage />} />
                <Route path="citizens" element={<CitizensPage />} />
                <Route path="validacion" element={<ValidacionIdentidadPage />} />
                <Route path="audit" element={<AuditPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ApolloProvider>
  );
}

export default App;
