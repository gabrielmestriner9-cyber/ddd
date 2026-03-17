import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import Sidebar, { MenuButton } from './Sidebar';
import { useApp } from '../../store/AppContext';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  patients: 'Pacientes & Alunos',
  appointments: 'Agendamentos',
  services: 'Serviços',
  financial: 'Financeiro',
  reports: 'Relatórios',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentPage } = useApp();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <MenuButton onClick={() => setSidebarOpen(true)} />

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-800">{pageTitles[currentPage]}</h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-56">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
            />
          </div>

          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-semibold">
              KG
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
