import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@sgd.co.id');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication with 1-second timeout for realistic feel
    setTimeout(() => {
      if (email === 'admin@sgd.co.id' && password === 'password123') {
        onLogin();
      } else {
        setError('Email atau password salah! (Gunakan default: admin@sgd.co.id / password123)');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 overflow-hidden font-sans select-none">
      {/* Dynamic Glowing Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.08]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-gray-900/40 border border-gray-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
      >
        {/* SgD Corporate Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl p-2 mb-4 ring-4 ring-green-500/20"
          >
            <img
              src="https://ik.imagekit.io/Sgd/Logo%20Potrait.png?updatedAt=1771273586419"
              alt="SGD Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight leading-tight">
            PT SUNGGIARTI <span className="text-green-500 font-extrabold block text-sm tracking-[0.25em] mt-1">CORPORATION</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.25em] mt-2">Management Construction System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold leading-relaxed"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Karyawan</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950/60 border border-gray-800 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                placeholder="nama@sgd.co.id"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Kata Sandi</label>
              <a href="#lupa" className="text-[9px] font-bold text-gray-500 hover:text-green-400 uppercase tracking-wider transition-colors">Lupa Sandi?</a>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950/60 border border-gray-800 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/30 hover:shadow-green-900/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk Sistem <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Footer info inside Card */}
        <div className="mt-8 pt-6 border-t border-gray-800/60 flex items-center justify-center gap-2 text-gray-600">
          <ShieldCheck size={14} className="text-green-500/60" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Koneksi Enkripsi SSL Terjamin</span>
        </div>
      </motion.div>
    </div>
  );
}
