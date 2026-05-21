import { useState } from 'react';
import { Plus, Eye, Download, CheckCircle, XCircle, Clock, Trash2, Edit3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { proyekList } from '../data/mockData';
import { Invoice } from '../types';
import { formatRupiahFull, formatDate } from '../utils/format';

interface InvoiceProps {
  proyekId: number;
  invoiceData: Invoice[];
  onAdd: (invoice: Omit<Invoice, 'id'>) => void;
  onUpdate: (invoice: Invoice) => void;
  onDelete: (id: number) => void;
}

export default function InvoicePage({ proyekId, invoiceData, onAdd, onUpdate, onDelete }: InvoiceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedPreviewInvoice, setSelectedPreviewInvoice] = useState<Invoice | null>(null);
  
  const proyek = proyekList.find(p => p.id === proyekId) || proyekList[0];
  const invoices = invoiceData.filter(i => i.proyekId === proyekId);

  const [formData, setFormData] = useState<Omit<Invoice, 'id'>>({
    proyekId,
    nomorInvoice: '',
    tanggal: new Date().toISOString().split('T')[0],
    perihal: '',
    jumlah: 0,
    status: 'belum_lunas',
    penerima: ''
  });

  const totalLunas = invoices.filter(i => i.status === 'lunas').reduce((s, i) => s + i.jumlah, 0);
  const totalBelum = invoices.filter(i => i.status !== 'lunas').reduce((s, i) => s + i.jumlah, 0);

  const handleOpenAdd = () => {
    setEditingInvoice(null);
    setFormData({
      proyekId,
      nomorInvoice: `INV/SGD/${new Date().getFullYear()}/00${invoices.length + 1}`,
      tanggal: new Date().toISOString().split('T')[0],
      perihal: '',
      jumlah: 0,
      status: 'belum_lunas',
      penerima: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inv: Invoice) => {
    setEditingInvoice(inv);
    setFormData({ ...inv });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvoice) {
      onUpdate({ ...formData, id: editingInvoice.id });
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  const statusIcon = (s: string) => {
    if (s === 'lunas') return <CheckCircle size={14} />;
    if (s === 'belum_lunas') return <XCircle size={14} />;
    return <Clock size={14} />;
  };

  const handleExportSingleInvoice = (inv: Invoice) => {
    const subtotal = inv.jumlah / 1.11;
    const ppn = inv.jumlah - subtotal;
    
    const headers = ["Deskripsi", "Nilai (Rp)"];
    const rows = [
      ["Nomor Invoice", inv.nomorInvoice],
      ["Tanggal", formatDate(inv.tanggal)],
      ["Proyek", proyek.nama],
      ["Penerima", inv.penerima],
      ["Perihal / Uraian", inv.perihal],
      ["Status", inv.status.toUpperCase()],
      ["Subtotal (DPP)", Math.round(subtotal)],
      ["PPN 11%", Math.round(ppn)],
      ["Total Pembayaran", inv.jumlah]
    ];

    const csvString = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Invoice_${inv.nomorInvoice.replace(/\//g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight uppercase">Tagihan & Invoice</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">PROYEK: {proyek.nama}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-amber-900/20"
        >
          <Plus size={18} /> Buat Invoice
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-5">
          <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Terbayar (Lunas)</p>
          <p className="text-white font-black text-xl tracking-tight">{formatRupiahFull(totalLunas)}</p>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
            <span className="w-2 h-2 rounded-full bg-green-500" /> {invoices.filter(i => i.status === 'lunas').length} Dokumen
          </div>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-5">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Piutang (Belum Lunas)</p>
          <p className="text-white font-black text-xl tracking-tight">{formatRupiahFull(totalBelum)}</p>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500" /> {invoices.filter(i => i.status !== 'lunas').length} Dokumen
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="space-y-3 pb-20">
        {invoices.length === 0 ? (
          <div className="bg-gray-900/30 border border-gray-800/50 rounded-3xl p-12 text-center">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Belum ada data invoice</p>
          </div>
        ) : (
          invoices.map(inv => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-5 group hover:border-amber-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-amber-500 font-black text-sm tracking-widest">{inv.nomorInvoice}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-md border font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      inv.status === 'lunas' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      inv.status === 'belum_lunas' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {statusIcon(inv.status)} {inv.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{formatDate(inv.tanggal)}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(inv)} className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-blue-400 transition-all"><Edit3 size={16} /></button>
                  <button onClick={() => onDelete(inv.id)} className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="space-y-1 mb-4">
                <p className="text-gray-200 text-sm font-bold leading-tight">{inv.perihal}</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Kepada: {inv.penerima}</p>
              </div>

              <div className="flex justify-between items-center bg-gray-950/50 p-3 rounded-2xl border border-gray-800/50">
                <p className="text-white font-black text-lg tracking-tight">{formatRupiahFull(inv.jumlah)}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedPreviewInvoice(inv)}
                    title="Pratinjau Invoice"
                    className="p-2 rounded-lg bg-gray-800 text-gray-500 hover:text-white transition-all"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleExportSingleInvoice(inv)}
                    title="Unduh CSV"
                    className="p-2 rounded-lg bg-gray-800 text-gray-500 hover:text-white transition-all"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL INVOICE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                <h3 className="text-white font-black uppercase tracking-widest">{editingInvoice ? 'Edit Invoice' : 'Buat Invoice Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nomor Invoice</label>
                  <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono" value={formData.nomorInvoice} onChange={e => setFormData({...formData, nomorInvoice: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tanggal</label>
                    <input type="date" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Status</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                      <option value="belum_lunas">Belum Lunas</option>
                      <option value="sebagian">Sebagian</option>
                      <option value="lunas">Lunas</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Perihal / Termin</label>
                  <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all" value={formData.perihal} onChange={e => setFormData({...formData, perihal: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Penerima / Vendor</label>
                  <input type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all" value={formData.penerima} onChange={e => setFormData({...formData, penerima: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Jumlah Tagihan (Rp)</label>
                  <input type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono" value={formData.jumlah} onChange={e => setFormData({...formData, jumlah: Number(e.target.value)})} />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-900/30 hover:shadow-amber-900/40 transition-all">
                    {editingInvoice ? 'Simpan Perubahan' : 'Terbitkan Invoice'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREVIEW INVOICE MODAL */}
      <AnimatePresence>
        {selectedPreviewInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/85 backdrop-blur-md" 
              onClick={() => setSelectedPreviewInvoice(null)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="bg-white text-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 p-8 md:p-10 font-sans"
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedPreviewInvoice(null)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors p-1"
              >
                <X size={24} />
              </button>

              {/* Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-gray-100 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-950 p-1 flex-shrink-0 flex items-center justify-center">
                    <img
                      src="https://ik.imagekit.io/Sgd/Logo%20Potrait.png?updatedAt=1771273586419"
                      alt="SGD Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="font-black text-sm md:text-base tracking-tight leading-tight text-gray-950 uppercase">
                      PT SUNGGIARTI CORPORATION
                    </h2>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Management Construction System</p>
                    <p className="text-[9px] text-gray-400 font-medium mt-1">Jl. Bypass Ngurah Rai No. 123, Denpasar, Bali</p>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-gray-950 font-black text-xl md:text-2xl tracking-widest uppercase">INVOICE</h1>
                  <p className="text-gray-500 font-mono text-xs tracking-wider mt-1">{selectedPreviewInvoice.nomorInvoice}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Ditagihkan Kepada:</p>
                  <p className="font-extrabold text-gray-900 uppercase text-sm">{selectedPreviewInvoice.penerima}</p>
                  <p className="text-gray-500 font-semibold mt-1">Mitra Proyek: {proyek.nama}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Detail Pengiriman:</p>
                  <p className="text-gray-700"><span className="font-bold text-gray-900">Tanggal Terbit:</span> {formatDate(selectedPreviewInvoice.tanggal)}</p>
                  <p className="text-gray-700 mt-1"><span className="font-bold text-gray-900">Mata Uang:</span> IDR (Rupiah)</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-150 rounded-2xl overflow-hidden mb-8 text-xs">
                <div className="grid grid-cols-12 bg-gray-50 p-4 font-black text-gray-500 uppercase tracking-widest text-[9px] border-b border-gray-150">
                  <div className="col-span-8">Deskripsi Tagihan / Termin</div>
                  <div className="col-span-4 text-right">Jumlah (Rp)</div>
                </div>
                <div className="grid grid-cols-12 p-4 border-b border-gray-100 items-center">
                  <div className="col-span-8 font-bold text-gray-800 leading-normal">{selectedPreviewInvoice.perihal}</div>
                  <div className="col-span-4 text-right font-mono font-bold text-gray-900">{formatRupiahFull(selectedPreviewInvoice.jumlah / 1.11).replace('Rp', '')}</div>
                </div>
                
                {/* Calculation details */}
                <div className="bg-gray-50/50 p-4 space-y-2 border-t border-gray-100 font-semibold text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal (DPP)</span>
                    <span className="font-mono">{formatRupiahFull(selectedPreviewInvoice.jumlah / 1.11).replace('Rp', '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PPN (11%)</span>
                    <span className="font-mono">{formatRupiahFull(selectedPreviewInvoice.jumlah - (selectedPreviewInvoice.jumlah / 1.11)).replace('Rp', '')}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Tagihan Bersih</span>
                      <p className="text-gray-950 text-xl font-black tracking-tight mt-0.5">{formatRupiahFull(selectedPreviewInvoice.jumlah)}</p>
                    </div>
                    <div className="relative">
                      {/* Glassmorphic Stamp */}
                      {selectedPreviewInvoice.status === 'lunas' ? (
                        <div className="border-4 border-green-500 text-green-500 font-black rounded-xl px-4 py-2 uppercase tracking-[0.25em] text-[10px] transform -rotate-12 select-none shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                          LUNAS / PAID
                        </div>
                      ) : selectedPreviewInvoice.status === 'sebagian' ? (
                        <div className="border-4 border-amber-500 text-amber-500 font-black rounded-xl px-4 py-2 uppercase tracking-[0.25em] text-[10px] transform -rotate-12 select-none">
                          SEBAGIAN
                        </div>
                      ) : (
                        <div className="border-4 border-red-500 text-red-500 font-black rounded-xl px-4 py-2 uppercase tracking-[0.25em] text-[10px] transform -rotate-12 select-none">
                          PENDING
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Area */}
              <div className="flex justify-between items-end mt-12 text-xs">
                <div className="text-gray-500 max-w-xs leading-relaxed">
                  <span className="font-bold text-gray-700 block mb-1">Catatan Pembayaran:</span>
                  Transfer ke Bank Mandiri Cab. Denpasar<br />
                  No. Rekening: <span className="font-bold text-gray-800">145-0012-345-678</span><br />
                  a/n <span className="font-bold text-gray-800">PT SUNGGIARTI CORPORATION</span>
                </div>
                <div className="text-center font-bold relative pb-2 pr-6">
                  <p className="text-gray-500 mb-16">Hormat Kami,</p>
                  <p className="text-gray-950 uppercase border-b border-gray-300 pb-1">Ni Wayan Sunggiarti</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Direktur Utama</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
