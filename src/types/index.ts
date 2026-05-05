export interface Proyek {
  id: number;
  nama: string;
  tipe: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  totalRAB: number;
  progressRealisasi: number;
  biayaMaterial: number;
  biayaUpah: number;
  itemPekerjaan: number;
  hariBerjalan: number;
  status: 'aktif' | 'selesai' | 'pending';
  lokasi: string;
}

export interface ItemPekerjaan {
  id: number;
  proyekId: number;
  no: number;
  kategori: string;
  subKategori: string;
  uraian: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  totalHarga: number;
  progress: number;
}

export interface Invoice {
  id: number;
  proyekId: number;
  nomorInvoice: string;
  tanggal: string;
  perihal: string;
  jumlah: number;
  status: 'lunas' | 'belum_lunas' | 'sebagian';
  penerima: string;
}

export interface Keuangan {
  id: number;
  proyekId: number;
  tanggal: string;
  keterangan: string;
  jenis: 'pemasukan' | 'pengeluaran';
  kategori: string;
  jumlah: number;
}

export interface User {
  nama: string;
  jabatan: string;
  perusahaan: string;
}
