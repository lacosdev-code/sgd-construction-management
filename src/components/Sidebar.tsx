import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Calculator, FileText, Package,
  TrendingUp, Wallet, CheckSquare, Tag, BookOpen,
  Settings, LogOut, HardHat, Layers,
  Hammer, Home, Zap, PaintBucket, DoorOpen, Sofa,
  ShowerHead, Mountain, Milestone, Wrench, X
} from 'lucide-react';
import Tooltip from './Tooltip';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  activeProyek: string;
  setActiveProyek: (p: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const menuUtama = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'proyek', label: 'Data Proyek', icon: Building2 },
];

const menuAnalisa = [
  { id: 'rekap', label: 'Rekapitulasi', icon: Calculator },
  { id: 'invoice', label: 'Invoice', icon: FileText },
  { id: 'logistik', label: 'Logistik', icon: Package },
  { id: 'kurvas', label: 'Kurva S', icon: TrendingUp },
  { id: 'keuangan', label: 'Keuangan', icon: Wallet },
  { id: 'progress', label: 'Progress', icon: CheckSquare },
];

const menuMaster = [
  { id: 'master-harga', label: 'Master Harga', icon: Tag },
  { id: 'master-analisa', label: 'Master Analisa', icon: BookOpen },
];

const menuKonstruksiGedung = [
  { id: 'persiapan', label: 'Persiapan', icon: Wrench },
  { id: 'pondasi', label: 'Pondasi', icon: Mountain },
  { id: 'beton-struktur', label: 'Beton Struktur', icon: Layers },
  { id: 'kanopi', label: 'Kanopi', icon: Home },
  { id: 'baja-struktural', label: 'Baja Struktural', icon: HardHat },
  { id: 'tangga', label: 'Tangga', icon: Milestone },
  { id: 'pek-atap', label: 'Pek. Atap', icon: Home },
  { id: 'pekerjaan-custom', label: 'Pekerjaan Custom', icon: Hammer },
];

const menuArsitekturMEP = [
  { id: 'pas-dinding', label: 'Pas. Dinding', icon: Layers },
  { id: 'plesteran', label: 'Plesteran', icon: Layers },
  { id: 'acian', label: 'Acian', icon: PaintBucket },
  { id: 'lantai-keramik', label: 'Lantai/Keramik', icon: Layers },
  { id: 'paving', label: 'Paving & Halaman', icon: Milestone },
  { id: 'cat-plafon', label: 'Cat & Plafon', icon: PaintBucket },
  { id: 'kusen-pintu', label: 'Kusen/Pintu', icon: DoorOpen },
  { id: 'interior', label: 'Interior', icon: Sofa },
  { id: 'toilet-sanitair', label: 'Toilet/Sanitair', icon: ShowerHead },
  { id: 'instalasi-mep', label: 'Instalasi MEP', icon: Zap },
];

const menuPengaturan = [
  { id: 'pengaturan', label: 'Pengaturan Usaha', icon: Settings },
];

export default function Sidebar({ activePage, setActivePage, activeProyek, setActiveProyek, isOpen, onClose, onLogout }: SidebarProps) {
  const handleNav = (id: string) => {
    setActivePage(id);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-gray-900 z-40 transform transition-transform duration-300 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex shadow-2xl`}>

        {/* Logo */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-4 border-b border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-green-600/40 flex-shrink-0 bg-gray-800"
            >
              <img
                src="https://ik.imagekit.io/Sgd/Logo%20Potrait.png?updatedAt=1771273586419"
                alt="SGD Logo"
                className="w-full h-full object-contain p-1"
              />
            </motion.div>
            <div>
              <div className="text-white font-extrabold text-xs leading-tight tracking-tight uppercase">
                PT Sunggiarti <span className="text-amber-400 block">Corporation</span>
              </div>
              <div className="text-gray-500 text-[8px] font-black tracking-[0.2em] uppercase mt-1">Construction Management</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </motion.div>

        {/* Toggle Gedung / Jalan */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex rounded-xl overflow-hidden border border-gray-800 bg-gray-800/50 p-1">
            <Tooltip text="Fokus Proyek Gedung" position="bottom">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveProyek('gedung')}
                className={`w-full py-2 text-[11px] font-bold rounded-lg transition-all ${activeProyek === 'gedung' ? 'bg-amber-500 text-gray-950 shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                🏠 Gedung
              </motion.button>
            </Tooltip>
            <Tooltip text="Fokus Proyek Infrastruktur" position="bottom">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveProyek('jalan')}
                className={`w-full py-2 text-[11px] font-bold rounded-lg transition-all ${activeProyek === 'jalan' ? 'bg-amber-500 text-gray-950 shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                🌳 Jalan
              </motion.button>
            </Tooltip>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-800">

          {/* UTAMA */}
          <div className="pt-3 pb-1 px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Utama</div>
          {menuUtama.map(item => (
            <NavItem key={item.id} item={item} active={activePage === item.id} onClick={() => handleNav(item.id)} />
          ))}

          {/* ANALISA & LAPORAN */}
          <div className="pt-4 pb-1 px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Analisa & Laporan</div>
          {menuAnalisa.map(item => (
            <NavItem key={item.id} item={item} active={activePage === item.id} onClick={() => handleNav(item.id)} />
          ))}

          {/* MASTER DATA */}
          <div className="pt-4 pb-1 px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Master Data</div>
          {menuMaster.map(item => (
            <NavItem key={item.id} item={item} active={activePage === item.id} onClick={() => handleNav(item.id)} />
          ))}

          {/* PEKERJAAN KONSTRUKSI */}
          <div className="pt-4 pb-1 px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Pekerjaan Konstruksi</div>
          {menuKonstruksiGedung.map(item => (
            <NavItem key={item.id} item={item} active={activePage === item.id} onClick={() => handleNav(item.id)} />
          ))}

          {/* ARSITEKTUR & MEP */}
          <div className="pt-4 pb-1 px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Arsitektur & MEP</div>
          {menuArsitekturMEP.map(item => (
            <NavItem key={item.id} item={item} active={activePage === item.id} onClick={() => handleNav(item.id)} />
          ))}

          {/* PENGATURAN */}
          <div className="pt-4 pb-1 px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Pengaturan</div>
          {menuPengaturan.map(item => (
            <NavItem key={item.id} item={item} active={activePage === item.id} onClick={() => handleNav(item.id)} />
          ))}

          {/* Logout */}
          <Tooltip text="Keluar dari Sesi Ini" position="right">
            <motion.button 
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 transition-all mt-6 border border-transparent hover:border-red-900/30"
            >
              <LogOut size={18} />
              <span className="text-sm font-semibold">Keluar Aplikasi</span>
            </motion.button>
          </Tooltip>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-800/50">
          <p className="text-gray-600 text-[8px] font-bold uppercase tracking-[0.2em] text-center">© 2026 PT Sunggiarti Corp</p>
        </div>
      </div>
    </>
  );
}

function NavItem({ item, active, onClick }: { item: { id: string; label: string; icon: React.ElementType }; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <motion.button
      whileHover={{ x: 4, backgroundColor: active ? '' : 'rgba(31, 41, 55, 0.5)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left relative overflow-hidden group ${
        active
          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white font-bold shadow-lg shadow-green-900/40'
          : 'text-gray-400'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="activeGlow"
          className="absolute inset-0 bg-white/10 blur-xl rounded-full"
        />
      )}
      <Icon size={18} className={`${active ? 'text-amber-400' : 'text-gray-500 group-hover:text-white'} transition-colors`} />
      <span className="text-sm relative z-10">{item.label}</span>
      {active && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"
        />
      )}
    </motion.button>
  );
}
