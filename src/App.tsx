import { AppProvider, useApp } from './store/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Services from './pages/Services';
import Financial from './pages/Financial';
import Reports from './pages/Reports';

function AppContent() {
  const { currentPage } = useApp();

  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    patients: <Patients />,
    appointments: <Appointments />,
    services: <Services />,
    financial: <Financial />,
    reports: <Reports />,
  };

  return (
    <Layout>
      {pages[currentPage] || <Dashboard />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
