import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DataProyek from './pages/DataProyek';
import RekapRAB from './pages/RekapRAB';
import InvoicePage from './pages/Invoice';
import KeuanganPage from './pages/Keuangan';
import ProgressPage from './pages/Progress';
import LogistikPage from './pages/Logistik';
import MasterHarga from './pages/MasterHarga';
import Pengaturan from './pages/Pengaturan';
import { 
  proyekList as initialProyekList, 
  itemPekerjaanList as initialItemList, 
  invoiceList as initialInvoiceList,
  keuanganList as initialKeuanganList,
  Proyek, ItemPekerjaan, Invoice, Keuangan 
} from './data/mockData';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeProyek, setActiveProyek] = useState('gedung');
  const [selectedProyekId, setSelectedProyekId] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global Data State
  // State dengan Try-Catch untuk mencegah crash jika localStorage korup
  const [proyekData, setProyekData] = useState<Proyek[]>(() => {
    try {
      const saved = localStorage.getItem('proyekData');
      return saved ? JSON.parse(saved) : initialProyekList;
    } catch (e) {
      console.error("Error loading proyekData:", e);
      return initialProyekList;
    }
  });

  const [itemData, setItemData] = useState<ItemPekerjaan[]>(() => {
    try {
      const saved = localStorage.getItem('itemData');
      return saved ? JSON.parse(saved) : initialItemList;
    } catch (e) {
      console.error("Error loading itemData:", e);
      return initialItemList;
    }
  });

  const [invoiceData, setInvoiceData] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('invoiceData');
      return saved ? JSON.parse(saved) : initialInvoiceList;
    } catch (e) {
      console.error("Error loading invoiceData:", e);
      return initialInvoiceList;
    }
  });

  const [keuanganData, setKeuanganData] = useState<Keuangan[]>(() => {
    try {
      const saved = localStorage.getItem('keuanganData');
      return saved ? JSON.parse(saved) : initialKeuanganList;
    } catch (e) {
      console.error("Error loading keuanganData:", e);
      return initialKeuanganList;
    }
  });

  // --- CRUD Functions for Items ---
  const addItem = (item: Omit<ItemPekerjaan, 'id'>) => {
    const newId = Math.max(0, ...itemData.map(i => i.id)) + 1;
    setItemData([...itemData, { ...item, id: newId }]);
  };
  const updateItem = (updatedItem: ItemPekerjaan) => {
    setItemData(itemData.map(i => i.id === updatedItem.id ? updatedItem : i));
  };
  const deleteItem = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      setItemData(itemData.filter(i => i.id !== id));
    }
  };

  // --- CRUD Functions for Projects ---
  const addProyek = (proyek: Omit<Proyek, 'id'>) => {
    const newId = Math.max(0, ...proyekData.map(p => p.id)) + 1;
    setProyekData([...proyekData, { ...proyek, id: newId }]);
  };
  const updateProyek = (updatedProyek: Proyek) => {
    setProyekData(proyekData.map(p => p.id === updatedProyek.id ? updatedProyek : p));
  };
  const deleteProyek = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      setProyekData(proyekData.filter(p => p.id !== id));
      if (selectedProyekId === id) setSelectedProyekId(proyekData[0]?.id || 0);
    }
  };

  // --- CRUD Functions for Invoices ---
  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newId = Math.max(0, ...invoiceData.map(i => i.id)) + 1;
    setInvoiceData([...invoiceData, { ...invoice, id: newId }]);
  };
  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoiceData(invoiceData.map(i => i.id === updatedInvoice.id ? updatedInvoice : i));
  };
  const deleteInvoice = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus invoice ini?')) {
      setInvoiceData(invoiceData.filter(i => i.id !== id));
    }
  };

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('proyekData', JSON.stringify(proyekData));
  }, [proyekData]);

  useEffect(() => {
    localStorage.setItem('itemData', JSON.stringify(itemData));
  }, [itemData]);

  useEffect(() => {
    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
  }, [invoiceData]);

  useEffect(() => {
    localStorage.setItem('keuanganData', JSON.stringify(keuanganData));
  }, [keuanganData]);

  const renderPage = () => {
    // Handle construction categories by showing RekapRAB pre-filtered
    const constructionCategories = [
      'persiapan', 'pondasi', 'beton-struktur', 'kanopi', 'baja-struktural', 
      'tangga', 'pek-atap', 'pekerjaan-custom', 'pas-dinding', 'plesteran', 
      'acian', 'lantai-keramik', 'paving', 'cat-plafon', 'kusen-pintu', 
      'interior', 'toilet-sanitair', 'instalasi-mep'
    ];

    if (constructionCategories.includes(activePage)) {
      return (
        <RekapRAB 
          proyekId={selectedProyekId} 
          itemData={itemData}
          onAdd={addItem}
          onUpdate={updateItem}
          onDelete={deleteItem}
          filterCategory={activePage}
        />
      );
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard selectedProyekId={selectedProyekId} setActivePage={setActivePage} />;
      case 'proyek':
        return (
          <DataProyek 
            proyekData={proyekData}
            onAdd={addProyek}
            onUpdate={updateProyek}
            onDelete={deleteProyek}
            setSelectedProyekId={setSelectedProyekId}
            setActivePage={setActivePage}
          />
        );
      case 'rekap':
        return (
          <RekapRAB 
            proyekId={selectedProyekId} 
            itemData={itemData}
            onAdd={addItem}
            onUpdate={updateItem}
            onDelete={deleteItem}
          />
        );
      case 'invoice':
        return (
          <InvoicePage 
            proyekId={selectedProyekId} 
            invoiceData={invoiceData}
            onAdd={addInvoice}
            onUpdate={updateInvoice}
            onDelete={deleteInvoice}
          />
        );
      case 'logistik':
        return <LogistikPage proyekId={selectedProyekId} />;
      case 'keuangan':
        return <KeuanganPage proyekId={selectedProyekId} />;
      case 'progress':
      case 'kurvas':
        return <ProgressPage proyekId={selectedProyekId} />;
      case 'master-harga':
        return <MasterHarga />;
      case 'master-analisa':
        return <MasterHarga />; // Temporary fallback
      case 'pengaturan':
        return <Pengaturan />;
      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-white text-xl font-bold">Halaman {activePage}</h2>
            <p className="text-gray-400 mt-2">Sedang dalam pengembangan...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-gray-100 overflow-hidden font-sans selection:bg-green-500/30">
      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        activeProyek={activeProyek}
        setActiveProyek={setActiveProyek}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <Header 
          activePage={activePage} 
          onMenuClick={() => setIsSidebarOpen(true)}
          selectedProyekId={selectedProyekId}
          setSelectedProyekId={setSelectedProyekId}
        />
        
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          {/* Glass background effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage + selectedProyekId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative z-10"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
