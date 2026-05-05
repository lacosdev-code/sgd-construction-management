import { LayoutDashboard, Building2, Calculator, FileText, LayoutGrid } from 'lucide-react';

interface BottomNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'proyek', label: 'Proyek', icon: Building2 },
  { id: 'rekap', label: 'Rekap RAB', icon: Calculator },
  { id: 'invoice', label: 'Invoice', icon: FileText },
  { id: 'progress', label: 'Pekerjaan', icon: LayoutGrid },
];

export default function BottomNav({ activePage, setActivePage }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-20 lg:hidden">
      <div className="flex">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex-1 flex flex-col items-center py-2 transition-all ${isActive ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Icon size={22} className={isActive ? 'text-amber-400' : ''} />
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-amber-400' : ''}`}>{item.label}</span>
              {isActive && <div className="w-8 h-0.5 bg-amber-400 rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
