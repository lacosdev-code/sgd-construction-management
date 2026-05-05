import { useState } from 'react';
import { Building2, Phone, Mail, MapPin, Globe, Save, HardHat, Camera, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PengaturanPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <h2 className="text-white font-black text-2xl tracking-tight uppercase">Pengaturan Usaha</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Konfigurasi Identitas & Infrastruktur</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-8 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 opacity-50" />
        
        <div className="relative group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-32 h-32 bg-gray-800 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-gray-800/50 flex items-center justify-center p-2"
          >
            <img 
              src="https://ik.imagekit.io/Sgd/Logo%20Potrait.png?updatedAt=1771273586419" 
              alt="Company Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-green-600 text-white rounded-2xl shadow-xl border-4 border-gray-900 hover:bg-green-500 transition-all">
            <Camera size={18} />
          </button>
        </div>

        <h3 className="text-white font-black text-2xl mt-6 text-center">PT Sunggiarti Corporation</h3>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Leading Construction Group</p>
      </div>

      {/* Info Form */}
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-[2rem] p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <Building2 size={20} className="text-green-500" />
          <h4 className="text-white font-black uppercase tracking-widest text-sm">Informasi Institusi</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Perusahaan</label>
            <input type="text" defaultValue="PT Sunggiarti Corporation" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Group / Holding</label>
            <input type="text" defaultValue="Sunggiarti Group" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Alamat Kantor Pusat</label>
          <textarea rows={3} defaultValue="Jl. Raya Gumelar No. 45, Kebumen, Jawa Tengah" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Phone size={10} /> WhatsApp Marketing</label>
            <input type="text" defaultValue="+62 812-XXXX-XXXX" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Mail size={10} /> Email Korespondensi</label>
            <input type="email" defaultValue="admin@sgd-construction.id" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* Tech Stack Display */}
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-[2rem] p-6">
        <h4 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Infrastruktur Teknologi</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Platform', val: 'React 19 + Vite' },
            { label: 'Styling', val: 'Tailwind CSS' },
            { label: 'Database', val: 'PostgreSQL' },
            { label: 'Server', val: 'Linux Ubuntu' },
            { label: 'Deployment', val: 'Vercel / Cloud' },
            { label: 'Icons', val: 'Lucide React' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-950/50 border border-gray-800/50 rounded-2xl p-4">
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-white font-bold text-xs">{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-30 lg:left-72">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="w-full max-w-md bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-green-900/40 flex items-center justify-center gap-3 relative overflow-hidden"
        >
          {isSaving ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : showSaved ? (
            <div className="flex items-center gap-2">
              <Check size={20} /> Tersimpan!
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save size={20} /> Simpan Perubahan
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
}
