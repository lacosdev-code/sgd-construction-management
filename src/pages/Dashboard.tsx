import React from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  Calculator,
  FileText,
  Package,
  CheckSquare,
  Wallet,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { proyekList } from '../data/mockData';
import { formatRupiahFull } from '../utils/format';
import Tooltip from '../components/Tooltip';

interface DashboardProps {
  selectedProyekId: number;
  setActivePage: (page: string) => void;
}

export default function Dashboard({ selectedProyekId, setActivePage }: DashboardProps) {
  const proyek = proyekList.find(p => p.id === selectedProyekId) || proyekList[0];

  const quickLinks = [
    { id: 'rekap', label: 'RAB', icon: Calculator, color: 'text-amber-500', tooltip: 'Susun Anggaran Biaya' },
    { id: 'invoice', label: 'Invoice', icon: FileText, color: 'text-blue-500', tooltip: 'Manajemen Tagihan' },
    { id: 'logistik', label: 'Stok', icon: Package, color: 'text-green-500', tooltip: 'Pantau Stok Material' },
    { id: 'keuangan', label: 'Kas', icon: Wallet, color: 'text-purple-500', tooltip: 'Arus Kas Keuangan' },
    { id: 'progress', label: 'Progress', icon: CheckSquare, color: 'text-red-500', tooltip: 'Laporan Lapangan' },
  ];

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-white font-black text-2xl tracking-tight uppercase">Dashboard Utama</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Sistem Manajemen Konstruksi Terintegrasi</p>
        </motion.div>
        <div className="flex gap-2">
          <Tooltip text="Refresh Data">
            <button className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-500 hover:text-white transition-all"><Clock size={18} /></button>
          </Tooltip>
        </div>
      </div>

      {/* Main Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Proyek', val: proyekList.length, icon: Building2, color: 'bg-blue-600', sub: 'Aktif & Selesai' },
          { label: 'Progress Fisik', val: `${proyek.progressRealisasi}%`, icon: TrendingUp, color: 'bg-green-600', sub: 'Rata-rata kumulatif' },
          { label: 'Tenaga Kerja', val: '24', icon: Users, color: 'bg-amber-600', sub: 'Personil di lapangan' },
          { label: 'Sisa Waktu', val: '45 Hari', icon: Calendar, color: 'bg-purple-600', sub: 'Target Serah Terima' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900/40 border border-gray-800/50 p-5 rounded-[2rem] hover:border-gray-700 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} bg-opacity-20 text-white shadow-lg`}>
                <stat.icon size={22} className={stat.color.replace('bg-', 'text-')} />
              </div>
              <ArrowUpRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-white font-black text-2xl mt-1 tracking-tight">{stat.val}</h3>
            <p className="text-gray-600 text-[9px] font-bold mt-2 uppercase">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-1 bg-gray-900/40 border border-gray-800/50 p-6 rounded-[2.5rem] flex flex-col justify-center"
        >
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-center">Menu Akses Cepat</p>
          <div className="grid grid-cols-5 gap-2">
            {quickLinks.map(item => (
              <Tooltip key={item.id} text={item.tooltip}>
                <motion.button
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActivePage(item.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700/50 group-hover:bg-gray-700 transition-all ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white">{item.label}</span>
                </motion.button>
              </Tooltip>
            ))}
          </div>
        </motion.div>

        {/* Selected Project Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 bg-gradient-to-br from-gray-900 to-[#0a0a0b] border border-gray-800 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-800" />
              <motion.circle
                initial={{ strokeDashoffset: 364 }}
                animate={{ strokeDashoffset: 364 - (364 * proyek.progressRealisasi) / 100 }}
                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent"
                strokeDasharray="364"
                className="text-green-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-black text-2xl tracking-tighter">{proyek.progressRealisasi}%</span>
              <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest">Progress</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Sedang Berjalan</p>
              <h3 className="text-white font-black text-xl leading-tight uppercase tracking-tight">{proyek.nama}</h3>
              <p className="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={10} /> {proyek.lokasi}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Total Nilai Proyek</p>
                <p className="text-white font-black text-lg">{formatRupiahFull(proyek.totalRAB)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Hari Berjalan</p>
                <p className="text-white font-black text-lg">{proyek.hariBerjalan} Hari</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
