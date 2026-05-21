import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, Users, Percent, Calculator, Info } from 'lucide-react';
import { formatRupiahFull } from '../utils/format';

interface AHSPItem {
  id: number;
  kode: string;
  nama: string;
  satuan: string;
  bahan: { nama: string; koefisien: number; hargaSatuan: number }[];
  tenaga: { nama: string; koefisien: number; hargaSatuan: number }[];
  alat: { nama: string; koefisien: number; hargaSatuan: number }[];
}

const initialAHSPList: AHSPItem[] = [
  {
    id: 1,
    kode: 'A.3.2.1.2',
    nama: 'Pemasangan Pondasi Batu Belah Campuran 1SP : 5PP',
    satuan: 'm3',
    bahan: [
      { nama: 'Batu Belah 15cm-20cm', koefisien: 1.200, hargaSatuan: 285000 },
      { nama: 'Semen Portland (PC)', koefisien: 136.000, hargaSatuan: 1440 }, // per kg (sak 50kg = 72000 => 1440/kg)
      { nama: 'Pasir Beton/Pasang', koefisien: 0.544, hargaSatuan: 285000 },
    ],
    tenaga: [
      { nama: 'Pekerja Lapangan', koefisien: 1.500, hargaSatuan: 100000 }, // per hari
      { nama: 'Tukang Batu', koefisien: 0.750, hargaSatuan: 135000 },
      { nama: 'Kepala Tukang Batu', koefisien: 0.075, hargaSatuan: 150000 },
      { nama: 'Mandor Lapangan', koefisien: 0.075, hargaSatuan: 160000 },
    ],
    alat: [],
  },
  {
    id: 2,
    kode: 'A.4.1.1.5',
    nama: 'Membuat Beton Struktur K-225 (fc\' 19,3 MPa) Slump (12±2)cm',
    satuan: 'm3',
    bahan: [
      { nama: 'Semen Portland (PC)', koefisien: 371.000, hargaSatuan: 1440 },
      { nama: 'Pasir Beton', koefisien: 0.498, hargaSatuan: 285000 },
      { nama: 'Kerikil Split 2/3', koefisien: 0.597, hargaSatuan: 350000 },
      { nama: 'Air Bersih', koefisien: 215.000, hargaSatuan: 250 },
    ],
    tenaga: [
      { nama: 'Pekerja Lapangan', koefisien: 1.650, hargaSatuan: 100000 },
      { nama: 'Tukang Batu', koefisien: 0.275, hargaSatuan: 135000 },
      { nama: 'Kepala Tukang Batu', koefisien: 0.028, hargaSatuan: 150000 },
      { nama: 'Mandor Lapangan', koefisien: 0.083, hargaSatuan: 160000 },
    ],
    alat: [
      { nama: 'Sewa Concrete Mixer 0.35m3', koefisien: 0.150, hargaSatuan: 120000 },
    ],
  },
  {
    id: 3,
    kode: 'A.4.4.1.9',
    nama: 'Pemasangan Dinding Bata Ringan AAC Tebal 10 cm',
    satuan: 'm2',
    bahan: [
      { nama: 'Bata Ringan AAC 10cm', koefisien: 0.083, hargaSatuan: 12500 }, // per buah (1m3 ~ 83 bh => 0.083 m3)
      { nama: 'Semen Mortar (Instant)', koefisien: 4.000, hargaSatuan: 2500 }, // per kg
      { nama: 'Air Bersih', koefisien: 1.000, hargaSatuan: 250 },
    ],
    tenaga: [
      { nama: 'Pekerja Lapangan', koefisien: 0.150, hargaSatuan: 100000 },
      { nama: 'Tukang Batu', koefisien: 0.100, hargaSatuan: 135000 },
      { nama: 'Kepala Tukang Batu', koefisien: 0.010, hargaSatuan: 150000 },
      { nama: 'Mandor Lapangan', koefisien: 0.015, hargaSatuan: 160000 },
    ],
    alat: [],
  },
  {
    id: 4,
    kode: 'A.4.4.2.1',
    nama: 'Pemasangan Plesteran 1SP : 4PP Tebal 15 mm',
    satuan: 'm2',
    bahan: [
      { nama: 'Semen Portland (PC)', koefisien: 6.240, hargaSatuan: 1440 },
      { nama: 'Pasir Beton/Pasang', koefisien: 0.024, hargaSatuan: 285000 },
    ],
    tenaga: [
      { nama: 'Pekerja Lapangan', koefisien: 0.200, hargaSatuan: 100000 },
      { nama: 'Tukang Plester', koefisien: 0.150, hargaSatuan: 135000 },
      { nama: 'Kepala Tukang Plester', koefisien: 0.015, hargaSatuan: 150000 },
      { nama: 'Mandor Lapangan', koefisien: 0.010, hargaSatuan: 160000 },
    ],
    alat: [],
  },
  {
    id: 5,
    kode: 'A.4.7.1.3',
    nama: 'Memasang Lantai Granit Homogeneous Tile 60cm x 60cm Polish',
    satuan: 'm2',
    bahan: [
      { nama: 'Granit Tile 60x60 Polish', koefisien: 1.050, hargaSatuan: 185000 },
      { nama: 'Semen Portland (PC)', koefisien: 9.800, hargaSatuan: 1440 },
      { nama: 'Pasir Beton/Pasang', koefisien: 0.045, hargaSatuan: 285000 },
      { nama: 'Semen Warna Grout', koefisien: 0.500, hargaSatuan: 15000 },
    ],
    tenaga: [
      { nama: 'Pekerja Lapangan', koefisien: 0.250, hargaSatuan: 100000 },
      { nama: 'Tukang Pasang Ubin', koefisien: 0.150, hargaSatuan: 135000 },
      { nama: 'Kepala Tukang', koefisien: 0.015, hargaSatuan: 150000 },
      { nama: 'Mandor Lapangan', koefisien: 0.013, hargaSatuan: 160000 },
    ],
    alat: [],
  }
];

export default function MasterAnalisa() {
  const [ahspList] = useState<AHSPItem[]>(initialAHSPList);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [overheadPercent, setOverheadPercent] = useState<number>(10); // Slider 5% - 20%

  const activeItem = useMemo(() => {
    return ahspList.find(item => item.id === selectedId) || ahspList[0];
  }, [ahspList, selectedId]);

  // Calculations
  const totalBahan = useMemo(() => {
    return activeItem.bahan.reduce((sum, b) => sum + b.koefisien * b.hargaSatuan, 0);
  }, [activeItem]);

  const totalTenaga = useMemo(() => {
    return activeItem.tenaga.reduce((sum, t) => sum + t.koefisien * t.hargaSatuan, 0);
  }, [activeItem]);

  const totalAlat = useMemo(() => {
    return activeItem.alat.reduce((sum, a) => sum + a.koefisien * a.hargaSatuan, 0);
  }, [activeItem]);

  const jumlahMurni = totalBahan + totalTenaga + totalAlat;
  const nilaiOverhead = jumlahMurni * (overheadPercent / 100);
  const hargaSatuanTotal = jumlahMurni + nilaiOverhead;

  return (
    <div className="p-4 space-y-5 max-w-5xl mx-auto pb-20 select-none">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight uppercase">Analisa Harga Satuan Pekerjaan (AHSP)</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Koefisien Standar Nasional Indonesia (SNI 2024)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Side: Work Selector */}
        <div className="md:col-span-4 space-y-3">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Daftar Analisa SNI</p>
          <div className="flex flex-col gap-2.5">
            {ahspList.map(item => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedId(item.id)}
                className={`w-full p-4 rounded-2xl text-left border transition-all ${
                  selectedId === item.id
                    ? 'bg-gradient-to-r from-green-600/10 to-green-700/20 text-white border-green-500/40 shadow-lg shadow-green-950/20'
                    : 'bg-gray-900/40 border-gray-800/60 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-950 border border-gray-800/80 text-green-400">
                    {item.kode}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">
                    Per {item.satuan}
                  </span>
                </div>
                <h4 className="text-xs font-bold leading-normal uppercase line-clamp-2">{item.nama}</h4>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Side: Calculation Details */}
        <div className="md:col-span-8 space-y-4">
          {/* Active Item Title Card */}
          <div className="bg-gray-900/40 border border-gray-800/60 rounded-[2rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
            <span className="text-green-500 text-[9px] font-black uppercase tracking-[0.25em] mb-2 block">Draf Analisa Aktif</span>
            <h3 className="text-white font-extrabold text-lg leading-snug uppercase tracking-tight mb-2">{activeItem.nama}</h3>
            <div className="flex gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>KODE SNI: <strong className="text-gray-300">{activeItem.kode}</strong></span>
              <span>·</span>
              <span>SATUAN ACUAN: <strong className="text-gray-300">1 {activeItem.satuan}</strong></span>
            </div>
          </div>

          {/* Breakdown Tables */}
          <div className="bg-gray-900/20 border border-gray-800/40 rounded-[2.5rem] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gray-950/40 p-4 border-b border-gray-800/60 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
              <div className="col-span-6">Komponen AHSP</div>
              <div className="col-span-2 text-right">Koefisien</div>
              <div className="col-span-2 text-right">Harga (Rp)</div>
              <div className="col-span-2 text-right">Jumlah (Rp)</div>
            </div>

            {/* BAHAN SECTION */}
            <div className="border-b border-gray-800/40">
              <div className="flex items-center gap-2 p-4 bg-gray-900/10 text-[9px] font-black text-green-500 uppercase tracking-widest border-b border-gray-800/20">
                <Layers size={14} /> A. Kebutuhan Bahan (Material)
              </div>
              {activeItem.bahan.map((b, i) => (
                <div key={i} className="grid grid-cols-12 p-4 hover:bg-gray-800/10 border-b border-gray-800/10 last:border-0 text-xs">
                  <div className="col-span-6 text-gray-300 font-bold">{b.nama}</div>
                  <div className="col-span-2 text-right text-gray-400 font-mono">{b.koefisien.toFixed(3)}</div>
                  <div className="col-span-2 text-right text-gray-400 font-mono">{formatRupiahFull(b.hargaSatuan).replace('Rp', '')}</div>
                  <div className="col-span-2 text-right text-white font-mono font-bold">{formatRupiahFull(b.koefisien * b.hargaSatuan).replace('Rp', '')}</div>
                </div>
              ))}
              <div className="grid grid-cols-12 p-4 bg-gray-950/20 text-xs font-black">
                <div className="col-span-10 text-gray-500 uppercase tracking-widest text-[9px]">Subtotal Kebutuhan Bahan</div>
                <div className="col-span-2 text-right text-green-400 font-mono">{formatRupiahFull(totalBahan)}</div>
              </div>
            </div>

            {/* TENAGA SECTION */}
            <div className="border-b border-gray-800/40">
              <div className="flex items-center gap-2 p-4 bg-gray-900/10 text-[9px] font-black text-amber-500 uppercase tracking-widest border-b border-gray-800/20">
                <Users size={14} /> B. Kebutuhan Tenaga Kerja (Labor)
              </div>
              {activeItem.tenaga.map((t, i) => (
                <div key={i} className="grid grid-cols-12 p-4 hover:bg-gray-800/10 border-b border-gray-800/10 last:border-0 text-xs">
                  <div className="col-span-6 text-gray-300 font-bold">{t.nama}</div>
                  <div className="col-span-2 text-right text-gray-400 font-mono">{t.koefisien.toFixed(3)}</div>
                  <div className="col-span-2 text-right text-gray-400 font-mono">{formatRupiahFull(t.hargaSatuan).replace('Rp', '')}</div>
                  <div className="col-span-2 text-right text-white font-mono font-bold">{formatRupiahFull(t.koefisien * t.hargaSatuan).replace('Rp', '')}</div>
                </div>
              ))}
              <div className="grid grid-cols-12 p-4 bg-gray-950/20 text-xs font-black">
                <div className="col-span-10 text-gray-500 uppercase tracking-widest text-[9px]">Subtotal Tenaga Kerja</div>
                <div className="col-span-2 text-right text-amber-400 font-mono">{formatRupiahFull(totalTenaga)}</div>
              </div>
            </div>

            {/* ALAT SECTION */}
            {activeItem.alat.length > 0 && (
              <div className="border-b border-gray-800/40">
                <div className="flex items-center gap-2 p-4 bg-gray-900/10 text-[9px] font-black text-blue-500 uppercase tracking-widest border-b border-gray-800/20">
                  <Calculator size={14} /> C. Kebutuhan Peralatan (Tools)
                </div>
                {activeItem.alat.map((a, i) => (
                  <div key={i} className="grid grid-cols-12 p-4 hover:bg-gray-800/10 border-b border-gray-800/10 last:border-0 text-xs">
                    <div className="col-span-6 text-gray-300 font-bold">{a.nama}</div>
                    <div className="col-span-2 text-right text-gray-400 font-mono">{a.koefisien.toFixed(3)}</div>
                    <div className="col-span-2 text-right text-gray-400 font-mono">{formatRupiahFull(a.hargaSatuan).replace('Rp', '')}</div>
                    <div className="col-span-2 text-right text-white font-mono font-bold">{formatRupiahFull(a.koefisien * a.hargaSatuan).replace('Rp', '')}</div>
                  </div>
                ))}
                <div className="grid grid-cols-12 p-4 bg-gray-950/20 text-xs font-black">
                  <div className="col-span-10 text-gray-500 uppercase tracking-widest text-[9px]">Subtotal Kebutuhan Alat</div>
                  <div className="col-span-2 text-right text-blue-400 font-mono">{formatRupiahFull(totalAlat)}</div>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC OVERHEAD SLIDER & SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interactive Slider */}
            <div className="bg-gray-900/40 border border-gray-800/60 rounded-3xl p-5 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Percent size={14} className="text-amber-500" /> Jasa Overhead & Profit
                </span>
                <span className="text-white font-black text-lg">{overheadPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                value={overheadPercent}
                onChange={e => setOverheadPercent(Number(e.target.value))}
                className="w-full h-2 bg-gray-850 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase mt-2">
                <span>Standard (5%)</span>
                <span>Max (20%)</span>
              </div>
            </div>

            {/* Final Cost Summary Card */}
            <div className="bg-gradient-to-br from-green-950/20 to-emerald-950/30 border border-green-500/20 rounded-3xl p-5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  <span>Jumlah Biaya Murni (A+B+C)</span>
                  <span className="font-mono text-gray-400">{formatRupiahFull(jumlahMurni)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  <span>Overhead & Profit ({overheadPercent}%)</span>
                  <span className="font-mono text-gray-400">{formatRupiahFull(nilaiOverhead)}</span>
                </div>
                <div className="h-px bg-green-500/10 my-2" />
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-green-500 text-[9px] font-black uppercase tracking-[0.2em]">Harga Satuan Pekerjaan (AHSP)</span>
                    <p className="text-white text-xl font-black tracking-tight mt-0.5">{formatRupiahFull(hargaSatuanTotal)}</p>
                  </div>
                  <span className="text-[9px] font-black text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                    Per {activeItem.satuan}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-950/40 rounded-2xl p-4 border border-gray-800/40 flex gap-3 text-gray-500 leading-relaxed text-xs">
            <Info size={18} className="flex-shrink-0 text-green-500/70" />
            <p>
              Harga satuan di atas dihitung secara dinamis menggabungkan koefisien standar **Kementerian PUPR SNI 2024** dengan referensi tarif bahan & upah kerja yang tersimpan dalam sistem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
