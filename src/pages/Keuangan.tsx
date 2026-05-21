import { useState, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, Trash2, Edit3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiahFull, formatDate } from '../utils/format';

interface KeuanganProps {
  proyekId: number;
}

const initialKeuanganData = [
  { id: 1, proyekId: 1, tanggal: '2026-03-01', keterangan: 'Termin 1 Proyek Gedung', tipe: 'masuk', jumlah: 250000000, kategori: 'Termin' },
  { id: 2, proyekId: 1, tanggal: '2026-03-05', keterangan: 'Pembelian Besi Beton', tipe: 'keluar', jumlah: 45000000, kategori: 'Material' },
  { id: 3, proyekId: 1, tanggal: '2026-03-10', keterangan: 'Upah Tukang Minggu 1', tipe: 'keluar', jumlah: 12500000, kategori: 'Upah' },
  { id: 4, proyekId: 1, tanggal: '2026-03-15', keterangan: 'Sewa Alat Berat Exca', tipe: 'keluar', jumlah: 8500000, kategori: 'Alat' },
];

export default function KeuanganPage({ proyekId }: KeuanganProps) {
  const [data, setData] = useState(initialKeuanganData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    proyekId,
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    tipe: 'keluar',
    jumlah: 0,
    kategori: 'Material'
  });

  const filtered = useMemo(() => data.filter(d => d.proyekId === proyekId), [data, proyekId]);
  
  const totalMasuk = useMemo(() => filtered.filter(d => d.tipe === 'masuk').reduce((s, d) => s + d.jumlah, 0), [filtered]);
  const totalKeluar = useMemo(() => filtered.filter(d => d.tipe === 'keluar').reduce((s, d) => s + d.jumlah, 0), [filtered]);
  const saldo = totalMasuk - totalKeluar;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ ...formData, tanggal: new Date().toISOString().split('T')[0], keterangan: '', jumlah: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus catatan transaksi ini?')) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...formData, id: editingItem.id } : d));
    } else {
      setData([...data, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight uppercase">Arus Kas & Keuangan</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Monitoring Cashflow Real-time</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-violet-900/20"
        >
          <Plus size={18} /> Transaksi Baru
        </motion.button>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-violet-500/5 border border-violet-500/20 rounded-3xl p-4 text-center">
          <p className="text-violet-500 text-[9px] font-black uppercase tracking-widest mb-1">Saldo Proyek</p>
          <p className="text-white font-black text-lg tracking-tight">{formatRupiahFull(saldo)}</p>
        </div>
        <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-4 text-center">
          <p className="text-green-500 text-[9px] font-black uppercase tracking-widest mb-1">Pemasukan</p>
          <p className="text-white font-black text-lg tracking-tight">{formatRupiahFull(totalMasuk)}</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-4 text-center">
          <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mb-1">Pengeluaran</p>
          <p className="text-white font-black text-lg tracking-tight">{formatRupiahFull(totalKeluar)}</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3 pb-20">
        {filtered.length === 0 ? (
          <div className="bg-gray-900/30 border border-gray-800/50 rounded-3xl p-12 text-center">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Belum ada riwayat transaksi</p>
          </div>
        ) : (
          filtered.map(item => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-4 group hover:border-violet-500/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.tipe === 'masuk' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                  {item.tipe === 'masuk' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-tight">{item.keterangan}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span className="text-violet-400">{item.kategori}</span>
                    <span>·</span>
                    <span>{formatDate(item.tanggal)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-lg tracking-tight ${item.tipe === 'masuk' ? 'text-green-400' : 'text-white'}`}>
                  {item.tipe === 'masuk' ? '+' : '-'}{formatRupiahFull(item.jumlah)}
                </p>
                <div className="flex gap-2 justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg bg-gray-800 text-gray-500 hover:text-blue-400 transition-all"><Edit3 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-gray-800 text-gray-500 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL KEUANGAN */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                <h3 className="text-white font-black uppercase tracking-widest">{editingItem ? 'Edit Transaksi' : 'Catat Transaksi Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Jenis Arus Kas</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all" value={formData.tipe} onChange={e => setFormData({...formData, tipe: e.target.value as any})}>
                      <option value="keluar">Pengeluaran (-)</option>
                      <option value="masuk">Pemasukan (+)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Kategori</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                      <option value="Material">Material</option>
                      <option value="Upah">Upah Kerja</option>
                      <option value="Alat">Sewa Alat</option>
                      <option value="Termin">Termin Proyek</option>
                      <option value="Operasional">Operasional</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tanggal</label>
                  <input type="date" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Keterangan Transaksi</label>
                  <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nominal (Rp)</label>
                  <input type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all font-mono" value={formData.jumlah} onChange={e => setFormData({...formData, jumlah: Number(e.target.value)})} />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-violet-700 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-violet-900/30 hover:shadow-violet-900/40 transition-all">
                    {editingItem ? 'Simpan Perubahan' : 'Catat Transaksi'}
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
