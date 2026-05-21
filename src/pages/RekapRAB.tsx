import { useState, useMemo } from 'react';
import { Download, Printer, Edit3, ChevronDown, ChevronUp, X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { proyekList } from '../data/mockData';
import { ItemPekerjaan } from '../types';
import { formatRupiahFull } from '../utils/format';

interface RekapRABProps {
  proyekId: number;
  itemData: ItemPekerjaan[];
  onAdd: (item: Omit<ItemPekerjaan, 'id'>) => void;
  onUpdate: (item: ItemPekerjaan) => void;
  onDelete: (id: number) => void;
  filterCategory?: string;
}

export default function RekapRAB({ proyekId, itemData, onAdd, onUpdate, onDelete, filterCategory }: RekapRABProps) {
  const proyek = proyekList.find(p => p.id === proyekId) || proyekList[0];
  
  // Filter items by project AND optionally by category (subKategori)
  const items = useMemo(() => {
    let filtered = itemData.filter(i => i.proyekId === proyekId);
    if (filterCategory) {
      // Mapping sidebar IDs to subKategori names (loose match)
      const categoryMap: Record<string, string> = {
        'persiapan': 'Persiapan',
        'pondasi': 'Pondasi',
        'beton-struktur': 'Beton Struktur',
        'baja-struktural': 'Baja Struktur',
        'pas-dinding': 'Pas. Dinding',
        'instalasi-mep': 'MEP',
      };
      const search = categoryMap[filterCategory] || filterCategory;
      filtered = filtered.filter(i => 
        i.subKategori.toLowerCase().includes(search.toLowerCase()) || 
        i.kategori.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  }, [itemData, proyekId, filterCategory]);

  const [expandedKat, setExpandedKat] = useState<string[]>(['STRUKTUR', 'ARSITEKTUR', 'MEP']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemPekerjaan | null>(null);
  
  const [formData, setFormData] = useState<Omit<ItemPekerjaan, 'id'>>({
    proyekId,
    no: 1,
    kategori: 'STRUKTUR',
    subKategori: '',
    uraian: '',
    volume: 0,
    satuan: 'm',
    hargaSatuan: 0,
    totalHarga: 0,
    progress: 0
  });

  const totalRAP = items.reduce((sum, i) => sum + i.totalHarga, 0);

  const grouped: Record<string, typeof items> = {};
  items.forEach(item => {
    if (!grouped[item.kategori]) grouped[item.kategori] = [];
    grouped[item.kategori].push(item);
  });

  const toggleKat = (kat: string) => {
    setExpandedKat(prev =>
      prev.includes(kat) ? prev.filter(k => k !== kat) : [...prev, kat]
    );
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      proyekId,
      no: items.length + 1,
      kategori: 'STRUKTUR',
      subKategori: filterCategory ? (filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)) : '',
      uraian: '',
      volume: 0,
      satuan: 'm',
      hargaSatuan: 0,
      totalHarga: 0,
      progress: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ItemPekerjaan) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = formData.volume * formData.hargaSatuan;
    const finalData = { ...formData, totalHarga: total };
    
    if (editingItem) {
      onUpdate({ ...finalData, id: editingItem.id });
    } else {
      onAdd(finalData);
    }
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    if (items.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    const headers = ["No", "Kategori", "Sub Kategori", "Uraian Pekerjaan", "Volume", "Satuan", "Harga Satuan (Rp)", "Total Harga (Rp)", "Progress (%)"];
    const rows = items.map((item, index) => [
      index + 1,
      item.kategori,
      item.subKategori,
      `"${item.uraian.replace(/"/g, '""')}"`,
      item.volume,
      item.satuan,
      item.hargaSatuan,
      item.totalHarga,
      item.progress
    ]);

    const csvString = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RAB_${proyek.nama.replace(/\s+/g, '_')}_${filterCategory || 'Semua'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex justify-between items-end">
        <div className="text-gray-400 text-sm">
          {filterCategory ? (
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Filter: {filterCategory}</span>
              <span className="text-white font-bold">{proyek.nama}</span>
            </div>
          ) : (
            <>
              Proyek: <span className="font-bold text-white uppercase tracking-tight">{proyek.nama}</span>
            </>
          )}
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">AHSP SNI 2024 · {items.length} ITEM PEKERJAAN</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Total Nilai RAB</p>
          <p className="text-amber-400 font-black text-xl tracking-tight">{formatRupiahFull(totalRAP)}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-2xl border border-gray-800/50">
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            title="Ekspor ke CSV"
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-all border border-gray-700/50"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => window.print()}
            title="Cetak RAB"
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-all border border-gray-700/50"
          >
            <Printer size={18} />
          </button>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-green-900/20"
        >
          <Plus size={18} /> Tambah Item
        </motion.button>
      </div>

      {/* Table Content */}
      <div className="space-y-3 pb-20">
        {items.length === 0 ? (
          <div className="bg-gray-900/30 border border-gray-800/50 rounded-3xl p-12 text-center">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Tidak ada item dalam kategori ini</p>
          </div>
        ) : (
          Object.entries(grouped).map(([kategori, katItems], ki) => (
            <div key={kategori} className="bg-gray-900/30 rounded-3xl border border-gray-800/50 overflow-hidden">
              <button
                onClick={() => toggleKat(kategori)}
                className="w-full flex items-center justify-between p-4 bg-gray-800/20 hover:bg-gray-800/40 transition-all border-b border-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xs">
                    {ki + 1}
                  </span>
                  <span className="text-white font-black text-sm uppercase tracking-widest">{kategori}</span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-gray-400 text-xs font-bold">{formatRupiahFull(katItems.reduce((s, i) => s + i.totalHarga, 0))}</p>
                  {expandedKat.includes(kategori) ? <ChevronUp size={18} className="text-gray-600" /> : <ChevronDown size={18} className="text-gray-600" />}
                </div>
              </button>

              <AnimatePresence>
                {expandedKat.includes(kategori) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {katItems.map((item, ii) => (
                      <div key={item.id} className="p-4 border-b border-gray-800/30 last:border-0 group hover:bg-gray-800/20 transition-all">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-600 text-[10px] font-black">{ii + 1}.</span>
                              <h4 className="text-gray-200 text-sm font-bold leading-tight">{item.uraian}</h4>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              <span>{item.volume} {item.satuan}</span>
                              <span>×</span>
                              <span>{formatRupiahFull(item.hargaSatuan)}</span>
                              <span className="text-gray-700">|</span>
                              <span className="text-amber-500/80">{item.subKategori}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-black text-sm">{formatRupiahFull(item.totalHarga)}</p>
                            <div className="flex gap-2 justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => onDelete(item.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* Mini Progress */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${item.progress}%` }} />
                          </div>
                          <span className="text-[9px] font-black text-gray-600 uppercase">{item.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* CRUD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                <h3 className="text-white font-black uppercase tracking-widest">{editingItem ? 'Edit Item' : 'Tambah Item Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Kategori Utama</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                    <option value="STRUKTUR">STRUKTUR</option>
                    <option value="ARSITEKTUR">ARSITEKTUR</option>
                    <option value="MEP">MEP</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Uraian Pekerjaan</label>
                  <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.uraian} onChange={e => setFormData({...formData, uraian: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Volume</label>
                    <input type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.volume} onChange={e => setFormData({...formData, volume: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Satuan</label>
                    <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.satuan} onChange={e => setFormData({...formData, satuan: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Harga Satuan (Rp)</label>
                  <input type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono" value={formData.hargaSatuan} onChange={e => setFormData({...formData, hargaSatuan: Number(e.target.value)})} />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/30 hover:shadow-green-900/40 transition-all">
                    {editingItem ? 'Simpan Perubahan' : 'Tambah Ke RAB'}
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
