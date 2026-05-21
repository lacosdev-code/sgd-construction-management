import { useState, useMemo } from 'react';
import { Plus, Search, Edit3, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiahFull } from '../utils/format';

const initialMasterHarga = [
  { id: 1, kode: 'BJ-001', nama: 'Besi Beton D10', satuan: 'kg', harga: 12500, kategori: 'Besi & Baja' },
  { id: 2, kode: 'BJ-002', nama: 'Besi Beton D13', satuan: 'kg', harga: 13000, kategori: 'Besi & Baja' },
  { id: 3, kode: 'BJ-003', nama: 'Besi Beton D16', satuan: 'kg', harga: 13500, kategori: 'Besi & Baja' },
  { id: 4, kode: 'BJ-004', nama: 'Baja WF 200x100', satuan: 'kg', harga: 16500, kategori: 'Besi & Baja' },
  { id: 5, kode: 'BJ-005', nama: 'Baja WF 400x200', satuan: 'kg', harga: 17200, kategori: 'Besi & Baja' },
  { id: 6, kode: 'SM-001', nama: 'Semen Portland Type I', satuan: 'sak', harga: 72000, kategori: 'Semen & Pasir' },
  { id: 7, kode: 'SM-002', nama: 'Pasir Beton', satuan: 'm3', harga: 285000, kategori: 'Semen & Pasir' },
  { id: 8, kode: 'SM-003', nama: 'Batu Split 2/3', satuan: 'm3', harga: 350000, kategori: 'Semen & Pasir' },
  { id: 9, kode: 'BB-001', nama: 'Bata Merah', satuan: 'bh', harga: 1200, kategori: 'Bata & Blok' },
  { id: 10, kode: 'BB-002', nama: 'Bata Ringan AAC 10cm', satuan: 'bh', harga: 12500, kategori: 'Bata & Blok' },
];

const kategoriList = ['Semua', 'Besi & Baja', 'Semen & Pasir', 'Bata & Blok', 'Keramik', 'Cat', 'Upah Kerja'];

export default function MasterHarga() {
  const [data, setData] = useState(initialMasterHarga);
  const [search, setSearch] = useState('');
  const [filterKat, setFilterKat] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    satuan: '',
    harga: 0,
    kategori: 'Besi & Baja'
  });

  const filtered = useMemo(() => {
    return data.filter(m => {
      const matchSearch = m.nama.toLowerCase().includes(search.toLowerCase()) || m.kode.toLowerCase().includes(search.toLowerCase());
      const matchKat = filterKat === 'Semua' || m.kategori === filterKat;
      return matchSearch && matchKat;
    });
  }, [data, search, filterKat]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ kode: '', nama: '', satuan: '', harga: 0, kategori: 'Besi & Baja' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus item harga ini dari master data?')) {
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight uppercase">Master Harga Satuan</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Database Harga Bahan & Upah SNI 2024</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} /> Tambah Data
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-11 pr-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            placeholder="Cari material atau kode..."
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {kategoriList.map(k => (
            <button
              key={k}
              onClick={() => setFilterKat(k)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterKat === k ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-white border border-gray-700/30'}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-gray-900/30 border border-gray-800/50 rounded-3xl overflow-hidden pb-20">
        <div className="grid grid-cols-12 bg-gray-950/50 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800/50">
          <div className="col-span-3 p-4">Kode</div>
          <div className="col-span-6 p-4">Nama Material / Upah</div>
          <div className="col-span-3 p-4 text-right">Harga Satuan</div>
        </div>
        {filtered.map((m) => (
          <motion.div 
            key={m.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-12 border-b border-gray-800/30 hover:bg-gray-800/20 group transition-all"
          >
            <div className="col-span-3 p-4">
              <span className="text-blue-400 font-mono text-xs font-bold">{m.kode}</span>
            </div>
            <div className="col-span-6 p-4">
              <p className="text-gray-200 text-sm font-bold leading-tight">{m.nama}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-600 text-[10px] font-bold uppercase">{m.kategori}</span>
                <span className="text-gray-700">·</span>
                <span className="text-gray-500 text-[10px] font-bold uppercase">{m.satuan}</span>
              </div>
            </div>
            <div className="col-span-3 p-4 text-right">
              <p className="text-white font-black text-sm">{formatRupiahFull(m.harga)}</p>
              <div className="flex gap-2 justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(m)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL MASTER HARGA */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                <h3 className="text-white font-black uppercase tracking-widest">{editingItem ? 'Edit Data Harga' : 'Tambah Harga Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Kode Material</label>
                    <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" value={formData.kode} onChange={e => setFormData({...formData, kode: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Kategori</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                      {kategoriList.filter(k => k !== 'Semua').map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Item</label>
                  <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Satuan</label>
                    <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.satuan} onChange={e => setFormData({...formData, satuan: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Harga (Rp)</label>
                    <input type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" value={formData.harga} onChange={e => setFormData({...formData, harga: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/30 hover:shadow-blue-900/40 transition-all">
                    {editingItem ? 'Simpan Perubahan' : 'Tambahkan Ke Master'}
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
