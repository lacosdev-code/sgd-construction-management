import { useState } from 'react';
import { itemPekerjaanList, proyekList } from '../data/mockData';
import { formatRupiahFull } from '../utils/format';
import { CheckCircle, Clock, AlertCircle, TrendingUp, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressProps {
  proyekId: number;
}

export default function ProgressPage({ proyekId }: ProgressProps) {
  const proyek = proyekList.find(p => p.id === proyekId) || proyekList[0];
  const [items, setItems] = useState(itemPekerjaanList.filter(i => i.proyekId === proyekId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [tempProgress, setTempProgress] = useState(0);

  const progressIcon = (p: number) => {
    if (p === 100) return <CheckCircle size={18} className="text-green-400" />;
    if (p >= 50) return <Clock size={18} className="text-amber-400" />;
    return <AlertCircle size={18} className="text-red-400" />;
  };

  const progressColor = (p: number) => {
    if (p === 100) return 'bg-green-500';
    if (p >= 50) return 'bg-amber-500';
    if (p > 0) return 'bg-blue-500';
    return 'bg-gray-600';
  };

  const handleOpenUpdate = (item: any) => {
    setEditingItem(item);
    setTempProgress(item.progress);
    setIsModalOpen(true);
  };

  const handleSaveProgress = () => {
    setItems(items.map(i => i.id === editingItem.id ? { ...i, progress: tempProgress } : i));
    setIsModalOpen(false);
  };

  const totalSelesai = items.filter(i => i.progress === 100).length;
  const totalBerjalan = items.filter(i => i.progress > 0 && i.progress < 100).length;
  const totalBelum = items.filter(i => i.progress === 0).length;

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight uppercase">Monitoring Progress</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Laporan Realisasi Lapangan: {proyek.nama}</p>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Progress Akumulatif</p>
            <h3 className="text-white font-black text-5xl tracking-tighter">{proyek.progressRealisasi}%</h3>
          </div>
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-900/20">
            <TrendingUp size={32} />
          </div>
        </div>

        <div className="w-full bg-gray-800 rounded-2xl h-4 mb-8 overflow-hidden p-1 border border-gray-700/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${proyek.progressRealisasi}%` }}
            className="h-full rounded-xl bg-gradient-to-r from-green-600 via-green-500 to-amber-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-950/50 p-4 rounded-3xl border border-gray-800/50 text-center">
            <p className="text-green-400 font-black text-xl">{totalSelesai}</p>
            <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mt-1">Item Selesai</p>
          </div>
          <div className="bg-gray-950/50 p-4 rounded-3xl border border-gray-800/50 text-center">
            <p className="text-amber-400 font-black text-xl">{totalBerjalan}</p>
            <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mt-1">On-Progress</p>
          </div>
          <div className="bg-gray-950/50 p-4 rounded-3xl border border-gray-800/50 text-center">
            <p className="text-gray-500 font-black text-xl">{totalBelum}</p>
            <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mt-1">Menunggu</p>
          </div>
        </div>
      </div>

      {/* Item List */}
      <div className="space-y-3 pb-20">
        <h4 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] ml-2 mb-4">Daftar Pekerjaan</h4>
        {items.map((item) => (
          <motion.div 
            key={item.id}
            layout
            className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-5 group hover:border-amber-500/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className={`mt-1`}>
                  {progressIcon(item.progress)}
                </div>
                <div>
                  <h5 className="text-gray-200 font-bold text-sm leading-tight mb-1">{item.uraian}</h5>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <span>{item.kategori}</span>
                    <span>·</span>
                    <span className="text-amber-500/80">{formatRupiahFull(item.totalHarga)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white font-black text-lg tracking-tight">{item.progress}%</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-800/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  className={`h-full rounded-full ${progressColor(item.progress)}`}
                />
              </div>
              <button 
                onClick={() => handleOpenUpdate(item)}
                className="bg-gray-800 hover:bg-amber-500 hover:text-gray-950 text-gray-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Update
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL UPDATE PROGRESS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-gray-900 border border-gray-700 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                <h3 className="text-white font-black uppercase tracking-widest text-xs">Update Progress</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-8">
                <div className="text-center">
                  <h4 className="text-white font-bold mb-1">{editingItem?.uraian}</h4>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{editingItem?.kategori}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Realisasi Lapangan</span>
                    <span className="text-amber-500 font-black text-4xl tracking-tighter">{tempProgress}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={tempProgress} 
                    onChange={e => setTempProgress(Number(e.target.value))}
                    className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    <span>0% Belum Mulai</span>
                    <span>100% Selesai</span>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProgress}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-900/30 hover:shadow-amber-900/40 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Simpan Laporan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
