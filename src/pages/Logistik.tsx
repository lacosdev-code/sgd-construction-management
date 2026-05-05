import { useState, useMemo } from 'react';
import { Plus, Package, AlertTriangle, CheckCircle, Trash2, Edit3, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiahFull } from '../utils/format';

interface LogistikProps {
  proyekId: number;
}

const initialMaterialData = [
  { id: 1, nama: 'Baja WF 400x200', satuan: 'ton', stokAwal: 15, masuk: 12, keluar: 10, stokSisa: 5, harga: 37933333, status: 'cukup' },
  { id: 2, nama: 'Semen Portland', satuan: 'sak', stokAwal: 500, masuk: 1000, keluar: 1200, stokSisa: 300, harga: 72000, status: 'cukup' },
  { id: 3, nama: 'Batu Bata Ringan AAC', satuan: 'pcs', stokAwal: 2000, masuk: 5000, keluar: 6500, stokSisa: 500, harga: 12500, status: 'hampir_habis' },
  { id: 4, nama: 'Besi Beton D16', satuan: 'batang', stokAwal: 100, masuk: 300, keluar: 395, stokSisa: 5, harga: 145000, status: 'kritis' },
];

export default function LogistikPage({ proyekId: _proyekId }: LogistikProps) {
  const [data, setData] = useState(initialMaterialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    satuan: '',
    masuk: 0,
    keluar: 0,
    harga: 0,
    status: 'cukup'
  });

  const totalNilai = useMemo(() => data.reduce((s, m) => s + m.stokSisa * m.harga, 0), [data]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ nama: '', satuan: '', masuk: 0, keluar: 0, harga: 0, status: 'cukup' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus data material ini?')) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stokSisa = formData.masuk - formData.keluar;
    const status = stokSisa < 10 ? 'kritis' : stokSisa < 50 ? 'hampir_habis' : 'cukup';
    
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...formData, id: editingItem.id, stokSisa, status } : d));
    } else {
      setData([...data, { ...formData, id: Date.now(), stokSisa, status, stokAwal: 0 }]);
    }
    setIsModalOpen(false);
  };

  const statusBadge = (status: string) => {
    if (status === 'cukup') return { label: 'Stok Aman', class: 'bg-green-500/10 text-green-400 border-green-500/20', icon: <CheckCircle size={12} /> };
    if (status === 'hampir_habis') return { label: 'Stok Rendah', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <AlertTriangle size={12} /> };
    return { label: 'Stok Kritis!', class: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <AlertTriangle size={12} /> };
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight uppercase">Logistik & Material</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Inventaris Proyek & Stok Gudang</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <Plus size={18} /> Catat Material
        </motion.button>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-5">
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Estimasi Nilai Inventaris</p>
          <p className="text-white font-black text-xl tracking-tight">{formatRupiahFull(totalNilai)}</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-5">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Item Perlu Re-Stock</p>
          <p className="text-white font-black text-xl tracking-tight">{data.filter(m => m.status !== 'cukup').length} Material</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 pb-20">
        {data.map(m => {
          const badge = statusBadge(m.status);
          return (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-5 group hover:border-emerald-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700/50 group-hover:bg-emerald-500/10 transition-all">
                    <Package size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg leading-tight">{m.nama}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] px-2 py-0.5 rounded-md border font-black uppercase tracking-widest flex items-center gap-1.5 ${badge.class}`}>
                        {badge.icon} {badge.label}
                      </span>
                      <span className="text-gray-600 font-black text-[9px] uppercase tracking-widest">Harga: {formatRupiahFull(m.harga)} / {m.satuan}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(m)} className="p-2 rounded-xl bg-gray-800 text-gray-500 hover:text-blue-400 transition-all"><Edit3 size={16} /></button>
                  <button onClick={() => handleDelete(m.id)} className="p-2 rounded-xl bg-gray-800 text-gray-500 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-950/50 rounded-2xl p-3 border border-gray-800/50 flex flex-col items-center">
                  <ArrowDownLeft size={14} className="text-emerald-500 mb-1" />
                  <p className="text-white font-black text-sm">{m.masuk}</p>
                  <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">Masuk</p>
                </div>
                <div className="bg-gray-950/50 rounded-2xl p-3 border border-gray-800/50 flex flex-col items-center">
                  <ArrowUpRight size={14} className="text-red-500 mb-1" />
                  <p className="text-white font-black text-sm">{m.keluar}</p>
                  <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">Keluar</p>
                </div>
                <div className="bg-emerald-500/10 rounded-2xl p-3 border border-emerald-500/20 flex flex-col items-center">
                  <p className="text-emerald-400 font-black text-sm">{m.stokSisa} {m.satuan}</p>
                  <p className="text-emerald-900 text-[9px] font-black uppercase tracking-widest">Sisa Stok</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL LOGISTIK */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                <h3 className="text-white font-black uppercase tracking-widest">{editingItem ? 'Edit Data Stok' : 'Catat Material Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Material</label>
                  <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Satuan</label>
                    <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={formData.satuan} onChange={e => setFormData({...formData, satuan: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Harga Beli (Rp)</label>
                    <input type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono" value={formData.harga} onChange={e => setFormData({...formData, harga: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Total Masuk</label>
                    <input type="number" required className="w-full bg-emerald-900/20 border border-emerald-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={formData.masuk} onChange={e => setFormData({...formData, masuk: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Total Keluar</label>
                    <input type="number" required className="w-full bg-red-900/20 border border-red-900/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={formData.keluar} onChange={e => setFormData({...formData, keluar: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/30 hover:shadow-emerald-900/40 transition-all">
                    {editingItem ? 'Simpan Perubahan' : 'Catat Inventaris'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
