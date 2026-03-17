import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  DollarSign,
  BarChart2,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import type { NavPage } from '../../types';

const navItems: { id: NavPage; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'appointments', label: 'Agendamentos', icon: Calendar },
  { id: 'services', label: 'Serviços', icon: Stethoscope },
  { id: 'financial', label: 'Financeiro', icon: DollarSign },
  { id: 'reports', label: 'Relatórios', icon: BarChart2 },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { currentPage, setCurrentPage } = useApp();

  const handleNav = (page: NavPage) => {
    setCurrentPage(page);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-primary-900 text-white z-30 flex flex-col
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-primary-700 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold text-sm">KG</div>
              <div>
                <p className="text-accent-400 text-xs font-semibold uppercase tracking-wider">Clínica</p>
                <p className="text-white font-bold text-sm leading-tight">FisioPilates</p>
              </div>
            </div>
            <p className="text-primary-300 text-xs mt-1">Ketty Marcon Gianotti</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-primary-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors text-left
                  ${active
                    ? 'bg-primary-700 text-white border-r-4 border-accent-400'
                    : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary-700">
          <p className="text-primary-400 text-xs">CREFITO3: 74.249-F</p>
          <p className="text-primary-400 text-xs">Boituva - SP</p>
        </div>
      </aside>
    </>
  );
}

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
    >
      <Menu size={22} />
    </button>
  );
}
