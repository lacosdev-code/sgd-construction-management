import { Menu, Bell, Download, ChevronDown, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { proyekList } from '../data/mockData';
import Tooltip from './Tooltip';

interface HeaderProps {
  activePage: string;
  onMenuClick: () => void;
  selectedProyekId: number;
  setSelectedProyekId: (id: number) => void;
}

const pageTitle: Record<string, string> = {
  dashboard: 'Dashboard Utama',
  proyek: 'Data Proyek',
  rekap: 'Rekapitulasi RAB',
  invoice: 'Daftar Invoice',
  logistik: 'Logistik & Stok',
  kurvas: 'Kurva S Progress',
  keuangan: 'Alus Kas Keuangan',
  progress: 'Progress Lapangan',
  'master-harga': 'Master Harga Satuan',
  'master-analisa': 'Master Analisa AHSP',
  pengaturan: 'Pengaturan Usaha',
};

export default function Header({ activePage, onMenuClick, selectedProyekId, setSelectedProyekId }: HeaderProps) {
  const currentProyek = proyekList.find(p => p.id === selectedProyekId);
  const title = pageTitle[activePage] || activePage;

  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all border border-transparent hover:border-gray-700"
        >
          <Menu size={22} />
        </motion.button>
        {/* Logo (mobile) */}
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 lg:hidden ring-2 ring-green-600/30 bg-gray-800 p-1"
        >
          <img
            src="https://ik.imagekit.io/Sgd/Logo%20Potrait.png?updatedAt=1771273586419"
            alt="SGD Logo"
            className="w-full h-full object-contain"
          />
        </motion.div>
        <div className="ml-1">
          <motion.h1 
            key={title}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white font-extrabold text-lg leading-tight tracking-tight"
          >
            {title}
          </motion.h1>
          {currentProyek && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-[10px] font-bold truncate max-w-[180px] mt-0.5 uppercase tracking-wider"
            >
              {currentProyek.nama}
            </motion.p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Proyek Selector */}
        <div className="relative hidden sm:block">
          <Tooltip text="Pilih Proyek Aktif" position="bottom">
            <select
              value={selectedProyekId}
              onChange={e => setSelectedProyekId(Number(e.target.value))}
              className="bg-gray-800/80 text-gray-300 text-[11px] font-bold px-4 py-2 rounded-xl appearance-none pr-9 cursor-pointer border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all hover:bg-gray-800 hover:border-gray-600"
            >
              {proyekList.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </Tooltip>
        </div>

        {/* Cloud Download */}
        <Tooltip text="Backup Data Cloud" position="bottom">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 transition-all border border-amber-500/20"
          >
            <Cloud size={20} />
          </motion.button>
        </Tooltip>

        {/* Download */}
        <Tooltip text="Download Laporan PDF" position="bottom">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-gray-950 transition-all shadow-lg shadow-amber-900/20 border border-amber-300/30"
          >
            <Download size={20} />
          </motion.button>
        </Tooltip>

        {/* Notification */}
        <Tooltip text="Pemberitahuan Baru" position="bottom">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all relative border border-transparent hover:border-gray-700"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900 shadow-sm animate-pulse"></span>
          </motion.button>
        </Tooltip>
      </div>
    </header>
  );
}
