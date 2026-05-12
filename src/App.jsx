import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Landing from './pages/Landing';
import Sentrix from './pages/Sentrix';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Training from './pages/Training';
import Dispatch from './pages/Dispatch';
import Shop from './pages/Shop';
import AuditLogs from './pages/AuditLogs';
import AdminSettings from './pages/AdminSettings';
import DevSecOps from './pages/DevSecOps';
import SOCaaS from './pages/SOCaaS';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-navy-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sentrix" element={<Sentrix />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route element={<AppLayout />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/training" element={<Training />} />
        <Route path="/app/dispatch" element={<Dispatch />} />
        <Route path="/app/shop" element={<Shop />} />
        <Route path="/app/audit" element={<AuditLogs />} />
        <Route path="/app/settings" element={<AdminSettings />} />
        <Route path="/app/devsecops" element={<DevSecOps />} />
        <Route path="/app/socaas" element={<SOCaaS />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App