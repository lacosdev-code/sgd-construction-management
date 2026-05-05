import { useState } from 'react';
import { Plus, Building2, MapPin, Calendar, DollarSign, Edit3, Trash2, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Proyek } from '../types';
import { formatRupiahFull, formatDate } from '../utils/format';
import Tooltip from '../components/Tooltip';

interface DataProyekProps {
  proyekData: Proyek[];
  onAdd: (proyek: Omit<Proyek, 'id'>) => void;
  onUpdate: (proyek: Proyek) => void;
  onDelete: (id: number) => void;
  setSelectedProyekId: (id: number) => void;
  setActivePage: (page: string) => void;
}

export default function DataProyek({ 
  proyekData, 
  onAdd, 
  onUpdate, 
  onDelete, 
  setSelectedProyekId, 
  setActivePage 
}: DataProyekProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProyek, setEditingProyek] = useState<Proyek | null>(null);

  const [formData, setFormData] = useState<Omit<Proyek, 'id'>>({
    nama: '',
    tipe: 'Gedung',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: '',
    totalRAB: 0,
    progressRealisasi: 0,
    biayaMaterial: 0,
    biayaUpah: 0,
    itemPekerjaan: 0,
    hariBerjalan: 0,
    status: 'aktif',
    lokasi: '',
  });

  const handleOpenAdd = () => {
    setEditingProyek(null);
    setFormData({
      nama: '',
      tipe: 'Gedung',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: '',
      totalRAB: 0,
      progressRealisasi: 0,
      biayaMaterial: 0,
      biayaUpah: 0,
      itemPekerjaan: 0,
      hariBerjalan: 0,
      status: 'aktif',
      lokasi: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proyek: Proyek) => {
    setEditingProyek(proyek);
    setFormData({ ...proyek });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProyek) {
      onUpdate({ ...formData, id: editingProyek.id });
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  const handleSelectProyek = (id: number) => {
    setSelectedProyekId(id);
    setActivePage('rekap');
  };

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-white font-black text-3xl tracking-tight uppercase">Manajemen Proyek</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">Daftar Inventaris Pekerjaan Aktif</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-green-900/20"
        >
          <Plus size={18} /> Proyek Baru
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {proyekData.map((proyek, idx) => (
          <motion.div
            key={proyek.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-6 hover:border-green-500/30 transition-all overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-800 rounded-3xl flex items-center justify-center border border-gray-700/50 group-hover:bg-green-600/10 transition-all shadow-inner">
                  <Building2 className="text-green-500" size={28} />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg leading-tight group-hover:text-green-400 transition-colors">{proyek.nama}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <MapPin size={10} className="text-amber-500" /> {proyek.lokasi}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Tooltip text="Edit Data Proyek">
                  <button onClick={() => handleOpenEdit(proyek)} className="p-2.5 rounded-xl bg-gray-800 text-gray-500 hover:text-blue-400 hover:bg-gray-700 transition-all border border-gray-700/30">
                    <Edit3 size={16} />
                  </button>
                </Tooltip>
                <Tooltip text="Hapus Proyek Ini">
                  <button onClick={() => onDelete(proyek.id)} className="p-2.5 rounded-xl bg-gray-800 text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-all border border-gray-700/30">
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                <span>Progress Realisasi</span>
                <span className="text-white">{proyek.progressRealisasi}%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${proyek.progressRealisasi}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-gray-950/50 p-4 rounded-3xl border border-gray-800/50">
                  <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Total RAB</p>
                  <p className="text-white font-black text-sm">{formatRupiahFull(proyek.totalRAB)}</p>
                </div>
                <div className="bg-gray-950/50 p-4 rounded-3xl border border-gray-800/50">
                  <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Status Proyek</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${proyek.status === 'aktif' ? 'text-green-500' : 'text-amber-500'}`}>{proyek.status}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectProyek(proyek.id)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl border border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-white hover:border-green-500/50 transition-all mt-4"
              >
                Lihat Detail RAB <ChevronRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL PENDAFTARAN PROYEK */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-gray-900 border border-gray-700 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
              <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                <h3 className="text-white font-black uppercase tracking-[0.2em]">{editingProyek ? 'Edit Proyek' : 'Pendaftaran Proyek Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Nama Proyek Konstruksi</label>
                  <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Tipe Pekerjaan</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.tipe} onChange={e => setFormData({...formData, tipe: e.target.value as any})}>
                      <option value="Gedung">🏠 Konstruksi Gedung</option>
                      <option value="Jalan">🌳 Infrastruktur Jalan</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Lokasi Proyek</label>
                    <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Tanggal Mulai</label>
                    <input type="date" required className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.tanggalMulai} onChange={e => setFormData({...formData, tanggalMulai: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Target Selesai</label>
                    <input type="date" required className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.tanggalSelesai} onChange={e => setFormData({...formData, tanggalSelesai: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Total Anggaran / RAB (Rp)</label>
                  <input type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono" value={formData.totalRAB} onChange={e => setFormData({...formData, totalRAB: Number(e.target.value)})} />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-5 rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-green-900/40 hover:shadow-green-900/60 transition-all">
                    {editingProyek ? 'Simpan Perubahan' : 'Daftarkan Proyek'}
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
